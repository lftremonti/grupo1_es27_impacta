const express = require('express');
const router = express.Router();
const { createBook, updateBook, getBookById, getBookByIsbn, getAllBooks, 
    getFeaturedBooks, getTopRatedBooks, getRecommendedBooks, getNewArrivals, findFavoriteBooks,
    getBookByIsbnCreate } = require('../controllers/bookController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Criar um novo livro
router.post('/create', authMiddleware, createBook);

// Atualizar um livro existente
router.put('/update/:id', authMiddleware, updateBook);

// Rota para buscar informações de um livro pelo ISBN
router.get('/isbn/:isbn', authMiddleware, getBookByIsbn);

// Rota para buscar informações de um livro pelo ISBN nas apis externas
router.get('/isbnCreate/:isbn', authMiddleware, getBookByIsbnCreate);

// Livros em Destaques
router.get('/featured', getFeaturedBooks);

// Livros mais bem avaliados
router.get('/top-rated', authMiddleware, getTopRatedBooks);

// Livros Recomendado para você
router.get('/recommended/:id', authMiddleware, getRecommendedBooks);

// Livros descobertas da semana
router.get('/new-arrivals', authMiddleware, getNewArrivals);

// Buscar todos os livros
router.get('/', authMiddleware, getAllBooks);

// Buscar um livro pelo ID
router.get('/:id', authMiddleware, getBookById);

// Buscar os livros favoritos do usuario pelo ID
router.get('/favoriteBooks/:id', authMiddleware, findFavoriteBooks);

module.exports = router;