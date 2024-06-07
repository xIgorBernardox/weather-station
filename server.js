// Importa os módulos necessários
const express = require("express"); // Framework para criação de servidores web
const bodyParser = require("body-parser"); // Middleware para analisar corpos de requisições
const path = require("path"); // Módulo para trabalhar com caminhos de arquivos
// Cria uma instância do aplicativo Express
const app = express();

// Variável para armazenar os dados recebidos do Raspberry Pi
let dadosRecebidos = "";

/*
Configura o body-parser para analisar dados URL-encoded e JSON
*/
// Permite analisar corpos URL-encoded (GET):
app.use(bodyParser.urlencoded({ extended: true }));
// Permite analisar corpos JSON (POST):
app.use(bodyParser.json());

// Rota para receber os dados enviados pelo Raspberry Pi via POST:
app.post("/dados", (req, res) => {
  // Armazena os dados recebidos na variável dadosRecebidos
  dadosRecebidos = req.body.dados;
  // Exibe os dados recebidos no console do servidor
  console.log("Dados recebidos:", dadosRecebidos);
  // Envia uma resposta de sucesso ao cliente
  res.status(200).send("Dados recebidos com sucesso!");
});

// Serve arquivos estáticos (CSS, imagens, etc.) do diretório 'public'
app.use(express.static(path.join(__dirname, "public")));

// Rota para servir o arquivo index.html
app.get("/", (req, res) => {
  // Envia o arquivo index.html como resposta à solicitação GET
  res.sendFile(__dirname + "/index.html");
});

// Rota para servir o arquivo script.js
app.get("/script.js", (req, res) => {
  res.sendFile(path.join(__dirname, "script.js"));
});

// Rota para fornecer os dados recebidos à página web
app.get("/dados", (req, res) => {
  // Envia os dados armazenados como um objeto JSON
  res.json({ dados: dadosRecebidos });
});

// Configura o servidor para ouvir na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
  // Exibe uma mensagem no console indicando que o servidor está rodando
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
