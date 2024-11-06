const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createCategoryBook, getAllCategory, getCategoryById, getActiveCategoriesWithBooks } = require('../controllers/categoryBooksController');

// Criar uma nova categoria
router.post('/create', authMiddleware, createCategoryBook);

// Buscar todas as categoria
router.get('/', authMiddleware, getAllCategory);

// Buscar todas as categoria que contem livros
router.get('/getActiveCategoriesWithBooks', authMiddleware, getActiveCategoriesWithBooks);

// Buscar uma categoria pelo ID
router.get('/:id', authMiddleware, getCategoryById);

module.exports = router;