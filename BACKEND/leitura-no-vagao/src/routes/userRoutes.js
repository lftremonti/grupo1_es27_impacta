const express = require('express');
const router = express.Router();
const { create, updateGoogleId, getUserById, getUserByEmail, checkUserByEmail } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

//Cadastrar usuarios
router.post('/create', create);
//Cadastrar o id do google para um usuario já cadastrado na base
router.put('/updateGoogleId', authMiddleware, updateGoogleId);
//Buscar o usuario pelo ID
router.get('/:id', authMiddleware, getUserById);
//Buscar o usuario pelo Email
router.get('/email/:email', authMiddleware, getUserByEmail);
//Checar se o usario existe pelo Email
router.get('/checkemail/:email', authMiddleware, checkUserByEmail);

module.exports = router;
