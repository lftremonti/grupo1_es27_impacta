const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createReviewsBook, getAllReviews, getReviewsById, getReviewsByBookId } = require('../controllers/reviewsController');

// Criar uma  nova avaliação para livros
router.post('/', authMiddleware, createReviewsBook);

// Busca todas as avaliações pelo ID do livro selecionado
router.get('/book/:id', authMiddleware, getReviewsByBookId);

// Busca todas as avaliações
router.get('/', authMiddleware, getAllReviews);

// Busca avaliações por ID
router.get('/:id', authMiddleware, getReviewsById);

module.exports = router;