const donateBookModel = require('../models/donateBookModel');
const stockBooksModel = require('../models/stockBooksModel');
const { validarCamposObrigatorios } = require('../utils/validationUtils');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

const donateBook = async (req, res, next) => {
    try {
        const { isbn, pontoDeDoacaoId, usuarioId } = req.body;

        // Verificar campos obrigatórios
        const erroCampos = validarCamposObrigatorios(req.body, ["isbn", "pontoDeDoacaoId", "usuarioId", "quantidade"]);
        if (erroCampos) {
            return next(new ApiError(400, erroCampos));
        }

        // Criar registro da doação
        const doacao = await donateBookModel.createDonation({ isbn, pontoDeDoacaoId, usuarioId, quantidade });

        // Atualizar estoque (adicionando 1 unidade no novo ponto)
        await stockBooksModel.updateStock({ isbn, pontoDeDoacaoId, quantidade: 1 });

        return successResponse(res, 201, 'Doação registrada com sucesso!', { doacao });
    } catch (error) {
        next(new ApiError(500, 'Erro ao registrar doação', error.message));
        console.error(`Error: ${error}`);
    }
};


module.exports = { donateBook };