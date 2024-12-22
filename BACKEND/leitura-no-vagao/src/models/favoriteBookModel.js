const pool = require('../config/db');

// Verificar se o usuário já salvou o livro na lista de favoritos
const isBookFavorited = async (usuarioid, livroid) => {
    try {
        const query = `
            SELECT EXISTS (
                SELECT 1 
                FROM ${process.env.DB_SCHEMA}.livrossalvos 
                WHERE usuarioid = $1 AND livroid = $2 AND ativo = 'Y'
            ) AS favorited
        `;
        const result = await pool.query(query, [usuarioid, livroid]);
        return result.rows[0].favorited;
    } catch (error) {
        console.error('Error checking if book is favorited:', error);
        throw error;
    }
};


// Criar um registro de livro favoritado
const createFavoriteBook = async ({ usuarioid, livroid }) => {
    try {
        const query = `
            INSERT INTO ${process.env.DB_SCHEMA}.livrossalvos (usuarioid, livroid) 
            VALUES ($1, $2)
            RETURNING *;
        `;
        const result = await pool.query(query, [usuarioid, livroid]);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating favorite book:', error);
        throw error;
    }
};

module.exports = { createFavoriteBook, isBookFavorited};