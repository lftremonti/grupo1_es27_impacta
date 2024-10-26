const express = require('express');
const router = express.Router();
const { createBook, updateBook, getBookById, getBookByIsbn, getAllBooks, deleteBookById } = require('../controllers/bookController');
const { authMiddleware } = require('../middlewares/authMiddleware');


// Criar um novo livro
router.post('/create', authMiddleware, createBook);

// Atualizar um livro existente
router.put('/update/:id', authMiddleware, updateBook);

// Buscar um livro pelo ID
router.get('/:id', authMiddleware, getBookById);

// Buscar todos os livros
router.get('/', authMiddleware, getAllBooks);

// Rota para buscar informações de um livro pelo ISBN
router.get('/isbn/:isbn', authMiddleware, getBookByIsbn);

module.exports = router;