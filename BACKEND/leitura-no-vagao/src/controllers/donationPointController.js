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

/**Busca todos os pontos de doação pelo id do livro */
const getDonationPointByBookId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const donationPoint = await donationPointModel.findDonationPointBookId(id);
        return successResponse(res, 200, 'Pontos de doação de livros encontrados!', { donationPoint });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao buscar os pontos de doação de livros', error.message));
    }
};

module.exports = { getAllDonationPoint, getDonationPointByBookId };