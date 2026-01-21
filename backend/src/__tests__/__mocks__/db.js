const { getConnection } = require("../../db");

// Mock do módulo de banco de dados para testes
const db = {
  query: jest.fn(),
  getConnection: jest.fn(),
  pool: {
    query: jest.fn(),
    getConnection: jest.fn(),
  }
};

module.exports = db;