const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { donateBook } = require('../controllers/donateBookController');

// vincular um livro com o ponto de doação
router.post('/donateBook', authMiddleware, donateBook);

module.exports = router;