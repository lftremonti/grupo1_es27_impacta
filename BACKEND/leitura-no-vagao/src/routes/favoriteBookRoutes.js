const express = require('express');
const router = express.Router();
const { createFavoriteBook } = require('../controllers/favoriteBookController');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**Adicionar os livros nos favoritos */
router.post('/create', authMiddleware, createFavoriteBook);

module.exports = router;