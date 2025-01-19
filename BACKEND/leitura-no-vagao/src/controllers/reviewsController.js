const reviewsBookModel = require('../models/reviewsModel');
const { validarCamposObrigatorios } = require('../utils/validationUtils');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

const createReviewsBook = async (req, res, next) => {
    try {
        const { livroId, usuarioId, pontuacao, comentario, data_avaliacao } = req.body;

        // Verificar campos obrigatórios
        const erroCampos = validarCamposObrigatorios(req.body, ["livroId", "usuarioId", "comentario"]);
        if (erroCampos) {
            return next(new ApiError(400, erroCampos));
        }

        // Criação de avaliação de livro
        const newReviews = await reviewsBookModel.createReviewsBook({ livroId, usuarioId, pontuacao, comentario, data_avaliacao 
        });

        return successResponse(res, 201, 'Avaliação criada com sucesso!', { reviews: newReviews });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao criar a avaliação', error.message));
    }
};


const getAllReviews = async (req, res, next) => {
    try {
        //Busca todas as avaliações
        const reviews = await reviewsBookModel.findAllReviews();

        //Caso não encontre devolve a resposta de erro
        if (!reviews) return res.status(404).json({ error: 'Avaliações não existem' });

        return successResponse(res, 200, 'Avaliações Encontradas!', { reviews: reviews });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Server error', error.message));
    }
};

// Busca avaliação pelo ID
const getReviewsById = async (req, res, next) => {
    const { id } = req.params;
    try {
        //Busca avaliações pelo ID
        const reviews = await reviewsBookModel.findReviewsById(id);

        //Caso não encontre devolve a resposta do erro
        if (!reviews) return res.status(404).json({ error: 'Avaliação não existe' });

        return successResponse(res, 200, 'Avaliação Encontrada!', { reviews: reviews });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Server error', error.message));
    }
};

// Busca todas as avaliações pelo ID do livro selecionado
const getReviewsByBookId = async (req, res, next) => {
    const { id } = req.params;
    try {
        //Busca as avaliações pelo Id do livro selecionado
        const reviews = await reviewsBookModel.findReviewsByIdBook(id);

        //Caso não encontre devolve a resposta do erro
        if (!reviews) return res.status(404).json({ error: 'Avaliações não encontradas' });

        return successResponse(res, 200, 'Avaliações Encontradas!', { reviews: reviews });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Server error', error.message));
    }
};

module.exports = { createReviewsBook, getAllReviews, getReviewsById, getReviewsByBookId };