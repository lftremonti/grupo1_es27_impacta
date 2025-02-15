const pool = require('../config/db');

const createDonation = async ({ pontoDeDoacaoId, usuarioId, quantidade, livroId }) => {
    const query = `
        INSERT INTO ${process.env.DB_SCHEMA}.Doacoes (pontoDeDoacaoID, usuarioID, quantidade, livro_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [pontoDeDoacaoId, usuarioId, quantidade, livroId];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

module.exports = { createDonation };