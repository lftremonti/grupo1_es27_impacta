const express = require('express');
const router = express.Router();
const {  create, getUserById, getUserByEmail } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

//Cadastrar ususario
router.post('/create', create);
//Buscar o usuario pelo ID
router.get('/:id', authMiddleware, getUserById);
//Buscar o usuario pelo Email
router.get('/email/:email', authMiddleware, getUserByEmail);

module.exports = router;
