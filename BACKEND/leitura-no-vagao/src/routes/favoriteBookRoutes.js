const express = require('express');
const router = express.Router();
const { createFavoriteBook, removeFavoriteBook } = require('../controllers/favoriteBookController');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**Adicionar os livros nos favoritos */
router.post('/', authMiddleware, createFavoriteBook);

// Adicionar endpoint para remover livro dos favoritos
router.delete('/', authMiddleware, removeFavoriteBook);

module.exports = router;