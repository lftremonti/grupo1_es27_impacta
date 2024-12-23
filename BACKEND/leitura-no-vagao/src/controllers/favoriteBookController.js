const favoriteBookModel = require('../models/favoriteBookModel');
const { validarCamposObrigatorios } = require('../utils/validationUtils');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

/**Adicionar os livros nos favoritos */
const createFavoriteBook = async (req, res, next) => {
    try {
        const { usuarioId, livroId } = req.body;

        // Verificar campos obrigatórios
        const erroCampos = validarCamposObrigatorios(req.body, ["livroid", "usuarioid"]);
        if (erroCampos) {
            return next(new ApiError(400, erroCampos));
        }

        // Verificar se o livro já foi favoritado
        const isFavorited = await favoriteBookModel.isBookFavorited(usuarioId, livroId);

        if (isFavorited) {
            return successResponse(res, 200, 'Este livro já está na sua lista de favoritos.');
        }

        // Criar o registro de livro na lista de favoritos
        const favoriteBook = await favoriteBookModel.createFavoriteBook({ usuarioId, livroId });

        return successResponse(res, 201, 'Livro adicionado aos favoritos com sucesso!', { favoriteBook });
    } catch (err) {
        next(new ApiError(500, 'Erro ao adicionar o livro aos favoritos', err.message));
    }
};

module.exports = { createFavoriteBook };