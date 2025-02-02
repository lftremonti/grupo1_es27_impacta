const donationPointModel = require('../models/donationPointModel');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

/**Busca todos os pontos de doação de livros */
const getAllDonationPoint = async (req, res, next) => {
    const { limit = 8, offset = 0} = req.query;
    try {
        const donationPoint = await donationPointModel.findAllDonationPoint(parseInt(limit), parseInt(offset));
        return successResponse(res, 200, 'Pontos de doação de livros encontrados!', { donationPoint });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Erro ao buscar os pontos de doação de livros', error.message));
    }
};

module.exports = { getAllDonationPoint };