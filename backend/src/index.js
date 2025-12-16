const app = require('./app');
const PORT = process.env.PORT;

// INICIALIZAÇÃO: Inicia servidor Express ouvindo na porta definida em .env ou 4000
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});