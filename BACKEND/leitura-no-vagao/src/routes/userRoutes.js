const express = require('express');
const router = express.Router();
const {  create, getUserById, getUserByEmail, checkUserByEmail } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

//Cadastrar ususario
router.post('/create', create);
//Buscar o usuario pelo ID
router.get('/:id', authMiddleware, getUserById);
//Buscar o usuario pelo Email
router.get('/email/:email', authMiddleware, getUserByEmail);
//Checar se o usario existe pelo Email
router.get('/checkemail/:email', authMiddleware, checkUserByEmail);

module.exports = router;
