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

const findDonationPointBookId = async (id) => {
    try {
        const query = `
            SELECT P.*, E.rua, E.cidade, E.estado, E.cep
            FROM ${process.env.DB_SCHEMA}.pontosdedoacao P
            INNER JOIN ${process.env.DB_SCHEMA}.doacoes d on p.ad_pontodoacao_id = d.pontodedoacaoid
            INNER JOIN ${process.env.DB_SCHEMA}.livros l on l.ad_livros_id = d.livro_id
            LEFT JOIN ${process.env.DB_SCHEMA}.enderecos E ON E.ad_endereco_id = P.enderecoid
            where l.ad_livros_id = $1;
        `;

        const params = [id];
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Error fetching donation point books: ', error);
        throw error;
    }
};

module.exports = { findAllDonationPoint, findDonationPointBookId };