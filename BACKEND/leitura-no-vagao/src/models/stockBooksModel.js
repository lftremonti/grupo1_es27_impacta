const db = require('../config/db');

const getStock = async ({ isbn, pontoDeDoacaoId }) => {
    const query = `SELECT quantidade_total FROM EstoqueLivros WHERE isbn = $1 AND pontoDeDoacaoID = $2;`;
    const values = [isbn, pontoDeDoacaoId];
    const { rows } = await db.query(query, values);
    return rows[0];
};

const updateStock = async ({ isbn, pontoDeDoacaoId, quantidade }) => {
    const query = `
        INSERT INTO EstoqueLivros (isbn, pontoDeDoacaoID, quantidade_total)
        VALUES ($1, $2, $3)
        ON CONFLICT (isbn, pontoDeDoacaoID)
        DO UPDATE SET quantidade_total = EstoqueLivros.quantidade_total + EXCLUDED.quantidade_total
        RETURNING *;
    `;

    const values = [isbn, pontoDeDoacaoId, quantidade];
    const { rows } = await db.query(query, values);
    return rows[0];
};

module.exports = {
    getStock,
    updateStock
};