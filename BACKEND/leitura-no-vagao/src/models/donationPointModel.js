const pool = require('../config/db');

// Buscar todos os livros
const findAllDonationPoint = async () => {
    try {
        const query = `
            SELECT P.*, E.rua, E.cidade, E.estado, E.cep
            FROM ${process.env.DB_SCHEMA}.pontosdedoacao P
            LEFT JOIN ${process.env.DB_SCHEMA}.enderecos E ON E.ad_endereco_id = P.enderecoid
            WHERE P.ativo = 'Y';
        `;

        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching donation point books: ', error);
        throw error;
    }
};

module.exports = { findAllDonationPoint };