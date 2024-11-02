const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createReviewsBook } = require('../controllers/reviewsController');

// Criar uma  nova avaliação para livros
router.post('/', authMiddleware, createReviewsBook);

module.exports = router;