// routes/authRoutes.js
const express = require('express');
const { login, sendResetCode, verifyResetCode, resetPassword, loginWithGoogleId} = require('../controllers/authController');

const router = express.Router();

//Rota para realizar o Login
router.post('/login', login);

//Realizar o login com o ggole
router.get('/google', loginWithGoogleId);

//Resetar senha
router.post('/send-reset-code', sendResetCode);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);

module.exports = router;