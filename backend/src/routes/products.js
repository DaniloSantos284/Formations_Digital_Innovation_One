const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Desestruturação dos controladores de produtos
const {
  createProduct,
  listProducts,
  getProductById,
  addStock,
  removeStock,
  getHistory
} = require('../controllers/productsControllers'); 

// CONFIGURAÇÃO: Armazenamento de multer com nome único (timestamp) para evitar conflitos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Pasta de destino
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`); // Nome único
  }
});

// VALIDAÇÃO: Apenas imagens
const fileFilter = (req, file, cb) => {

  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens (JPEG, PNG, GIF, WebP) são permitidas'), false);
  }
};

const upload = multer({ storage, fileFilter });

// ROTAS: Endpoints para operações CRUD de produtos
router.post('/', upload.single('image'), createProduct);
router.get('/', listProducts);
router.get('/:id', getProductById);
router.post('/:id/in', addStock);
router.post('/:id/out', removeStock);
router.get('/:id/history', getHistory);

// Tratamento de erros do multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Apenas imagens')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
})

module.exports = router;