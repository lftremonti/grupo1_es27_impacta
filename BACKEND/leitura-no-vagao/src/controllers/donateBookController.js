const donateBookModel = require('../models/donateBookModel');
const stockBooksModel = require('../models/stockBooksModel');
const { validarCamposObrigatorios } = require('../utils/validationUtils');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

const donateBook = async (req, res, next) => {
    try {
        const { isbn, pontoDeDoacaoId, usuarioId, livroId } = req.body;

        // Verificar campos obrigatórios
        const erroCampos = validarCamposObrigatorios(req.body, ["isbn", "pontoDeDoacaoId", "usuarioId", "livroId"]);
        if (erroCampos) {
            return next(new ApiError(400, erroCampos));
        }

        // Criar registro da doação
        const doacao = await donateBookModel.createDonation({ pontoDeDoacaoId, usuarioId, quantidade: 1, livroId });

        // Atualizar estoque
        await stockBooksModel.updateStock({ livroId, isbn, pontoDeDoacaoId, quantidade: 1 });

        return successResponse(res, 201, 'Doação registrada com sucesso!', { doacao });
    } catch (error) {
        next(new ApiError(500, 'Erro ao registrar doação', error.message));
        console.error(`Error: ${error}`);
    }
};


module.exports = { donateBook };