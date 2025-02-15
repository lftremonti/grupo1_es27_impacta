const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getAllDonationPoint, getDonationPointByBookId } = require('../controllers/donationPointController');

// Buscar todos os pontos de doação de livros
router.get('/', authMiddleware, getAllDonationPoint);

// Buscar os pontos de doação pelo id do livro
router.get('/getDonationPointByIdBook/:id', authMiddleware, getDonationPointByBookId);

module.exports = router;