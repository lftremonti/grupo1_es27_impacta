const db = require('../config/db');

const getStock = async ({ isbn, pontoDeDoacaoId }) => {
    const query = `SELECT quantidade_total FROM ${process.env.DB_SCHEMA}.EstoqueLivros WHERE isbn = $1 AND pontoDeDoacaoID = $2;`;
    const values = [isbn, pontoDeDoacaoId];
    const { rows } = await db.query(query, values);
    return rows[0];
};

const updateStock = async ({ livroId, isbn, pontoDeDoacaoId, quantidade }) => {
    const query = `
        INSERT INTO ${process.env.DB_SCHEMA}.EstoqueLivros (livro_id, isbn, pontoDeDoacaoID, quantidade_total)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [livroId, isbn, pontoDeDoacaoId, quantidade];
    const { rows } = await db.query(query, values);
    return rows[0];
};

module.exports = {
    getStock,
    updateStock
};