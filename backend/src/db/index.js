const mysql = require('mysql2/promise');
require('dotenv').config();

// CONFIGURAÇÃO: Pool de conexões MySQL para melhor performance
// Pool reutiliza conexões em vez de abrir uma nova a cada requisição
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // waitForConnections: Aguarda conexão disponível se todas estão em uso
  waitForConnections: true,
  // connectionLimit: Máximo de conexões simultâneas (10 é bom para app pequeno/médio)
  connectionLimit: 10,
  // queueLimit: Máximo de requisições aguardando conexão (0 = ilimitado)
  queueLimit: 0,
});

module.exports = {
  // MÉTODO: query() — executa SQL sem gerenciar manualmente a conexão
  query: (sql, params) => pool.query(sql, params),

  // MÉTODO: getConnection() — retorna conexão do pool para usar transações
  getConnection: () => pool.getConnection(),
  
  // EXPORT: pool — acesso direto ao pool se necessário
  pool,
};