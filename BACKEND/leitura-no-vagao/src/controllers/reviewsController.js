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
    } catch (err) {
        next(new ApiError(500, 'Erro ao criar a avaliação', err.message));
    }
};

module.exports = { createReviewsBook };