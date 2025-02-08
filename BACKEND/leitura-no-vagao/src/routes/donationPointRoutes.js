const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getAllDonationPoint, linkBookWithDonationPoint } = require('../controllers/donationPointController');

// vincular um livro com o ponto de doação
router.post('/linkBookWithDonationPoint', authMiddleware, linkBookWithDonationPoint);

// Buscar todos os pontos de doação de livros
router.get('/', authMiddleware, getAllDonationPoint);

module.exports = router;