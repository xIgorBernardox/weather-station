# ----- BIBLIOTECAS -----
import machine
import time
import dht
import network
import urequests
import json

# ----- SENSOR -----

dht_sensor = dht.DHT22(machine.Pin(2))

led_pin = machine.Pin('LED', machine.Pin.OUT)

ip_servidor = "IP-Servidor"  
url = f"http://{ip_servidor}:3000/dados" #Porta

def conectar_wifi(rede, senha):
  # Instância do objeto WLAN como 'Cliente':
  wifi = network.WLAN(network.STA_IF)
  wifi.active(True)
  if not wifi.isconnected():
    print("Conectando à rede WiFi...")
    wifi.connect(rede, senha)
    while not wifi.isconnected(): pass
  print("Conectado! Endereço IP:", wifi.ifconfig()[0]) 


def ler_sensor_dht():
  while True:
    try:
      dht_sensor.measure()
      cel_temp = dht_sensor.temperature()
      perc_humidity = dht_sensor.humidity()
      fahrenheit_temp = (cel_temp * (9/5) + 32)

      print("Temperatura:", (cel_temp))
      print(f"Fahrenheit: {fahrenheit_temp} °F")
      print("Umidade: {:.2f} %".format(perc_humidity))
              
      #Estilizar os dados em JSON no python
      dados = {
        "Temperatura_Celsius": cel_temp,
        "Temperatura_Fahrenheit": fahrenheit_temp,
        "Umidade": perc_humidity
      }

      # Converter para JSON para enviar como JSON
      json_dados = json.dumps(dados)     
      return json_dados

      sensor_reading = True
      if sensor_reading:
        led_pin.value(1)
      else:
        led_pin.value(0)
        
    except Exception as e:
      print("Erro ao ler DHT22:", str(e))
    time.sleep(2)

def enviar_dados_servidor(dados_sensores):
  try:
    resposta = urequests.post(url, json={"dados": dados_sensores})
    if resposta.status_code == 200:
      print("Dados enviados com sucesso!")
    else:
      print("Erro ao enviar dados:", resposta.text)
    # Fechar a conexão para não sobrecarregar a memória do RP:
    resposta.close()  
  except Exception as erro:
    print("Erro ao enviar dados:", erro)


def main():
conectar_wifi("Nome-Da-Rede", "Senha-Da-Rede")
  while True:
    texto = ler_sensor_dht()
    if texto:
      enviar_dados_servidor(texto)   
    time.sleep(60)  # Enviar a cada 60 segundos

main()
