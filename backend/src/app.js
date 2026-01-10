const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/products');
require('dotenv').config();

const app = express();

// CORS: (mobile-friendly) Permite requisições de qualquer origem
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// MIDDLEWARE: Parse automático de JSON no body de requisições
app.use(express.json());

// Permite que imagens salvas sejam acessadas via URL (ex: /uploads/1702000001.jpg)
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// ROTAS: Todas operações de produtos estão sob /products
app.use('/api/products', productRoutes);

// HEALTHCHECK: Endpoint simples para verificar se a API está online
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// MIDDLEWARE: Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro global', err);

  if (err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      error: 'JSON inválido no corpo da requisição'
    });
  }

  return res.status(500).json({
    success: false,
    error: 'Erro interno no servidor'
  });
});

module.exports = app;