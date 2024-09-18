// routes/authRoutes.js
const express = require('express');
const { login} = require('../controllers/authController');

const router = express.Router();

//Rota para realizar o Login
router.post('/login', login);

module.exports = router;