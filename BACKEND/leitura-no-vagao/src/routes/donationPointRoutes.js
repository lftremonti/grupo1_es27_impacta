const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getAllDonationPoint } = require('../controllers/donationPointController');

// Buscar todos os pontos de doação de livros
router.get('/', authMiddleware, getAllDonationPoint);

module.exports = router;