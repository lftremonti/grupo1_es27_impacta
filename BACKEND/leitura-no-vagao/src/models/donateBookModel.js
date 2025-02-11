const pool = require('../config/db');

const createDonation = async ({ isbn, pontoDeDoacaoId, usuarioId, quantidade }) => {
    const query = `
        INSERT INTO ${process.env.DB_SCHEMA}.Doacoes (isbn, pontoDeDoacaoID, usuarioID, quantidade)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [isbn, pontoDeDoacaoId, usuarioId, quantidade];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

module.exports = { createDonation };