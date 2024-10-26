const bookModel = require('../models/bookModel'); // Modelo para consultar o banco de dados
const { validarCamposObrigatorios } = require('../utils/validationUtils');
const { getAllBooksoogleApiBook } = require('../models/externalApi'); // Modelo para a API externa
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

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
    } catch (err) {
        next(new ApiError(500, 'Erro ao atualizar o livro', err.message));
    }
};

const getBookById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const book = await bookModel.findById(id);
        if (!book) {
            return next(new ApiError(404, 'Livro não encontrado'));
        }

        return successResponse(res, 200, 'Livro encontrado!', { book });
    } catch (err) {
        next(new ApiError(500, 'Erro ao buscar o livro', err.message));
    }
};

const getAllBooks = async (req, res, next) => {
    try {
        const books = await bookModel.findAllBooks();
        return successResponse(res, 200, 'Livros encontrados!', { books });
    } catch (err) {
        next(new ApiError(500, 'Erro ao buscar os livros', err.message));
    }
};

const deleteBookById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const book = await bookModel.findById(id);
        if (!book) {
            return next(new ApiError(404, 'Livro não encontrado'));
        }

        await bookModel.deleteBookById(id);
        return successResponse(res, 200, 'Livro deletado com sucesso!');
    } catch (err) {
        next(new ApiError(500, 'Erro ao deletar o livro', err.message));
    }
};

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
        next(new ApiError(500, 'Erro ao buscar informações do livro.', error.message));
    }
};

module.exports = { createBook, updateBook, getBookById, getBookByIsbn, getAllBooks, deleteBookById };