const donationPointModel = require('../models/donationPointModel');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

/**Busca todos os pontos de doação de livros */
const getAllDonationPoint = async (req, res, next) => {
    try {
        const donationPoint = await donationPointModel.findAllDonationPoint();
        return successResponse(res, 200, 'Pontos de doação de livros encontrados!', { donationPoint });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao buscar os pontos de doação de livros', error.message));
    }
};

const linkBookWithDonationPoint = async (req, res, next) => {
    try {
        const { livroId, categoryId } = req.body;

        // Verificar campos obrigatórios
        const erroCampos = validarCamposObrigatorios(req.body, ["livroId", "categoryId"]);
        if (erroCampos) {
            return next(new ApiError(400, erroCampos));
        }

        // Criação do livro no banco de dados
        const newCategory = await categoryBookModel.linkBookWithDonationPoint({ livroId, categoryId });

        return successResponse(res, 201, 'Vinculado a categoria criada com sucesso!', { category: newCategory });
    } catch (error) {
        next(new ApiError(500, 'Erro ao vincular uma categoria ao livro', error.message));
        console.error(`Error: ${error}`);
    }
}

module.exports = { getAllDonationPoint, linkBookWithDonationPoint };