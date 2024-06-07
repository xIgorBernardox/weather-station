// Função para atualizar os dados na página
function atualizarDados(dados) {
  console.log("Dados recebidos na função atualizarDados:", dados);
  // Convertendo a string JSON para objeto JSON
  var dadosObj = JSON.parse(dados.dados);
  //Fazendo o mesmo no getElement do JS
  document.getElementById('tempCelsius').innerText = dadosObj.Temperatura_Celsius;
  document.getElementById('tempFahrenheit').innerText = dadosObj.Temperatura_Fahrenheit;
  document.getElementById('umidade').innerText = dadosObj.Umidade;
}

// Função para fazer uma solicitação GET para /dados e atualizar os dados na página
function receberDados() {
  // Feito uma requisição diretamente do ip_servidor:3000/dados
  fetch('/dados')
  //Após a requisição ele converte o JSON do servidor em objeto JS
  .then(response => response.json())
  //Depois de converter ele chama a função de atualizar dados
  .then(data => {
    atualizarDados(data);
  })
  //Caso tenha um erro na busca de dados ele retorna o erro (como except no python)
  .catch(error => {
    console.error('Ocorreu um erro ao buscar os dados:', error);
  });
}
// Quando recarregar a página ele chama a função de receber dados acima
window.onload = receberDados;