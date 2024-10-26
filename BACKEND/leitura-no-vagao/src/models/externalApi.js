const axios = require('axios');

const EXTERNAL_API_GOOGLE_API_BOOK_URL = 'https://api2.exemplo.com/books'; // URL da segunda API externa

//Adicionar a primeira api do google e uma segunda tambem e talves adicionar na do google uma chave da api e se reber o codigo 429 das cotas tentar usar uma outra chave de aoi de uma outra cina ou projeto para bular no começo
const getBookByISBN = async (isbn) => {
    try {
        const response = await axios.get(`${EXTERNAL_API_1_URL}/${isbn}`);
        return response.data; // Supondo que a resposta seja um objeto JSON com os detalhes do livro
    } catch (error) {
        console.error('Erro ao buscar livro na primeira API:', error);
        throw error; // Lança erro para ser capturado no controller
    }
};

module.exports = { getBookByISBN };