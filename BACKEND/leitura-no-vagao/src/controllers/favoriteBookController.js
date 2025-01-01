const favoriteBookModel = require('../models/favoriteBookModel');
const { validarCamposObrigatorios } = require('../utils/validationUtils');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

/**Adicionar os livros nos favoritos */
const createFavoriteBook = async (req, res, next) => {
    try {
        const { usuarioid, livroid } = req.body;

        // Verificar campos obrigatórios
        const erroCampos = validarCamposObrigatorios(req.body, ["livroid", "usuarioid"]);
        if (erroCampos) {
            return next(new ApiError(400, erroCampos));
        }

        // Verificar se o livro já foi favoritado
        const isFavorited = await favoriteBookModel.isBookFavorited(usuarioid, livroid);

        if (isFavorited) {
            return successResponse(res, 200, 'Este livro já está na sua lista de favoritos.');
        }

        // Criar o registro de livro na lista de favoritos
        const favoriteBook = await favoriteBookModel.createFavoriteBook({ usuarioid, livroid });

        return successResponse(res, 201, 'Livro adicionado aos favoritos com sucesso!', { favoriteBook });
    } catch (err) {
        next(new ApiError(500, 'Erro ao adicionar o livro aos favoritos', err.message));
    }
};

const removeFavoriteBook = async (req, res) => {
    try {
        const { usuarioid, livroid } = req.body;

        // Verificar campos obrigatórios
        const erroCampos = validarCamposObrigatorios(req.body, ["livroid", "usuarioid"]);

        if (erroCampos) {
            return next(new ApiError(400, erroCampos));
        }

        // Verificar se o livro já foi favoritado
        const result = await favoriteBookModel.isBookFavorited(usuarioid, livroid);

        if (!result) {
            return res.status(404).json({ message: 'Livro não encontrado na lista de favoritos' });
        }

        res.status(200).json({ message: 'Livro removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover livro dos favoritos:', error);
        res.status(500).json({ message: 'Erro ao remover livro dos favoritos' });
    }
};

module.exports = { createFavoriteBook, removeFavoriteBook };