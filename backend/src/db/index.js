const mysql = require("mysql2/promise");
require("dotenv").config();

/**
 * CONFIGURAÇÃO: Pool de conexões MySQL
 * O uso de variáveis de ambiente garante que segredos não vazem para o GitHub.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.PORT_DB) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 30,
});

// Adicionando listeners para monitorar o pool de conexões
pool.on("enqueue", () =>
  console.log("Pool de banco de dados cheio. Requisição aguardando..."),
);
pool.on("acquire", (connection) =>
  console.debug("Conexão %d adquirida", connection.threadId),
);

/**
 * TESTE DE CONEXÃO:
 * Esse trecho tem o objetivo de verificar se o banco de dados está acessível logo
 * no início da aplicação. Serve para indentificar problemas de configuração ou rede.
 */
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(
      "✅ Banco de Dados: Conexão estabelecida com sucesso (Pool iniciado).",
    );
    connection.release();
  } catch (error) {
    console.error("Banco de Dados: Erro crítico ao conectar!");
    console.error(`Mensagem: ${error.message}`);
    process.exit(1);
  }
})();

// Fecha o pool de conexões ao encerrar a aplicação
process.on("SIGINT", async () => {
  await pool.end();
  console.log("Pool de conexões MySQL encerrado.");
  process.exit(0);
});

module.exports = {
  query: (sql, params) => pool.query(sql, params),

  getConnection: () => pool.getConnection(),

  pool,
};
