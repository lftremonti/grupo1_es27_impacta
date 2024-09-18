const express = require('express');
const router = express.Router();
const {  create, getUserById } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

//Cadastrar ususario
router.post('/create', create);
//Buscar o usuario pelo ID
router.get('/:id', authMiddleware, getUserById);

module.exports = router;
