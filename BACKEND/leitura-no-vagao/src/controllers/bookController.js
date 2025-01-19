const bookModel = require('../models/bookModel');
const reviewsModel = require('../models/reviewsModel');
const { validarCamposObrigatorios } = require('../utils/validationUtils');
const { getAllBooksoogleApiBook } = require('../models/externalApi');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

/**Cria Livros */
const createBook = async (req, res, next) => {
    try {
        const { titulo, autor, editora, ano_publicacao, descricao, ISBN10, ISBN13 } = req.body;

        // Verificar campos obrigatórios
        const erroCampos = validarCamposObrigatorios(req.body, ["titulo", "ISBN10", "ISBN13"]);
        if (erroCampos) {
            return next(new ApiError(400, erroCampos));
        }

        // Criação do livro no banco de dados
        const newBook = await bookModel.createBook({ titulo, autor, editora, ano_publicacao, descricao, ISBN10, ISBN13 });

        return successResponse(res, 201, 'Livro criado com sucesso!', { book: newBook });
    } catch (err) {
        next(new ApiError(500, 'Erro ao criar o livro', err.message));
    }
};

/**Atualiza o Livro pelo id */
const updateBook = async (req, res, next) => {
    const { id } = req.params;
    const { title, author, publishedDate, genre } = req.body;
    try {
        // Verificar se o livro existe
        const book = await bookModel.findById(id);
        if (!book) {
            return next(new ApiError(404, 'Livro não encontrado'));
        }

        // Atualizar o livro
        const updatedBook = await bookModel.updateBook(id, { title, author, publishedDate, genre });

        return successResponse(res, 200, 'Livro atualizado com sucesso!', { book: updatedBook });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao atualizar o livro', error.message));
    }
};

/** Busca o livro pelo ID */
const getBookById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const book = await bookModel.findById(id);
        if (!book) {
            return next(new ApiError(404, 'Livro não encontrado'));
        }

        const bookImage = await bookModel.findBookImageById(id);

        const reviewsBook = await reviewsModel.findReviewsByIdBook(id);

        const averageBook = await reviewsModel.findReviewsAverageByIdBook(id);
        
        return successResponse(res, 200, 'Livro encontrado!', { book, bookImage, reviewsBook, averageBook });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao buscar o livro', error.message));
    }
};

/**Busca por todos os livros */
const getAllBooks = async (req, res, next) => {
    const { limit = 8, offset = 0, categoryId} = req.query;
    try {
        const books = await bookModel.findAllBooks(parseInt(limit), parseInt(offset), parseInt(categoryId));
        return successResponse(res, 200, 'Livros encontrados!', { books });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao buscar os livros', error.message));
    }
};

/** Deleta o livro pelo id*/
const deleteBookById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const book = await bookModel.findById(id);
        if (!book) {
            return next(new ApiError(404, 'Livro não encontrado'));
        }

        await bookModel.deleteBookById(id);
        return successResponse(res, 200, 'Livro deletado com sucesso!');
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao deletar o livro', error.message));
    }
};

/**Busca o livro pelo ISBN */
const getBookByIsbn = async (req, res, next) => {
    const { isbn } = req.params;
    try {
        const bookFromDb = await bookModel.getBookByISBN(isbn);
        
        if (bookFromDb) {
            return successResponse(res, 200, 'Livro encontrado no banco de dados!', { book: bookFromDb });
        }

        // Se não encontrar em nenhum lugar
        return next(new ApiError(404, 'Livro não encontrado em nenhum lugar.'));
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao buscar informações do livro.', error.message));
    }
};

const getBookByIsbnCreate = async (req, res, next) => {
    const { isbn } = req.params;

    try {
        // 1. Verifica no banco de dados
        const bookFromDb = await bookModel.getBookByISBN(isbn);
        
        if (bookFromDb) {
            return successResponse(res, 200, 'Livro encontrado no banco de dados!', { book: bookFromDb });
        }

        // 2. Se não encontrado, tenta na primeira API externa
        try {
            const bookFromApi1 = await externalApi1.getBookByISBN(isbn);
            return successResponse(res, 200, 'Livro encontrado na primeira API!', { book: bookFromApi1 });
        } catch (error) {
            console.error('Erro ao buscar na primeira API:', error.message);
        }

        // 3. Se a primeira API falhar, tenta na segunda API externa
        try {
            const bookFromApi2 = await externalApi2.getBookByISBN(isbn);
            return successResponse(res, 200, 'Livro encontrado na segunda API!', { book: bookFromApi2 });
        } catch (error) {
            console.error('Erro ao buscar na segunda API:', error.message);
        }

        // Se não encontrar em nenhum lugar
        return next(new ApiError(404, 'Livro não encontrado em nenhum lugar.'));
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao buscar informações do livro.', error.message));
    }
};

// Livros em Destaques
const getFeaturedBooks = async (req, res, next) => { 
    const { limit = 8, offset = 0, categoryId } = req.query;
    try {
        const books = await bookModel.getFeaturedBooks(parseInt(limit), parseInt(offset), parseInt(categoryId));
        return successResponse(res, 200, 'Livros encontrados!', { books });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao buscar os livros', error.message));
    }
};

// Livros mais bem avaliados
const getTopRatedBooks = async (req, res, next) => {
    const { limit = 8, offset = 0, categoryId } = req.query;
    try {
        const books = await bookModel.getTopRatedBooks(parseInt(limit), parseInt(offset), parseInt(categoryId));
        return successResponse(res, 200, 'Livros encontrados!', { books });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao buscar os livros', error.message));
    }
};

// Livros Recomendado para você
const getRecommendedBooks  = async (req, res, next) => {
    const { id } = req.params;
    const { limit = 8, offset = 0, categoryId } = req.query;
    try {
        const books = await bookModel.getRecommendedBooks(id, parseInt(limit), parseInt(offset), parseInt(categoryId));
        if (!books) {
            return next(new ApiError(404, 'Livro não encontrado'));
        }

        return successResponse(res, 200, 'Livro encontrado!', { books });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao buscar o livro', error.message));
    }
};

// Livros descobertas da semana
const getNewArrivals = async (req, res, next) => {
    const { limit = 8, offset = 0, categoryId } = req.query;
    try {
        const books = await bookModel.getNewArrivals(parseInt(limit), parseInt(offset), parseInt(categoryId));
        return successResponse(res, 200, 'Livros encontrados!', { books });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao buscar os livros', error.message));
    }
};

// Livros favoritos usuario logado
const findFavoriteBooks = async (req, res, next) => {
    const { id } = req.params;
    const { limit = 8, offset = 0} = req.query;
    try {
        const books = await bookModel.findFavoriteBooks(parseInt(limit), parseInt(offset), parseInt(id));
        return successResponse(res, 200, 'Livros encontrados!', { books });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao buscar os livros', error.message));
    }
};

module.exports = { createBook, updateBook, getBookById, getBookByIsbn, 
    getAllBooks, deleteBookById, getFeaturedBooks, getTopRatedBooks, 
    getRecommendedBooks, getNewArrivals, findFavoriteBooks };