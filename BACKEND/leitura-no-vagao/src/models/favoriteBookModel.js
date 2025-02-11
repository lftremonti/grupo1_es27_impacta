const pool = require('../config/db');

// Verificar se o usuário já salvou o livro na lista de favoritos
const isBookFavorited = async (usuarioid, livroid) => {
    try {
        const query = `
            SELECT EXISTS (
                SELECT 1 
                FROM ${process.env.DB_SCHEMA}.livrossalvos 
                WHERE usuarioid = $1 AND livroid = $2
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
const createFavoriteBook = async (usuarioid, livroid) => {
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

// Inativa os livros salvos na lista de favoritos
const inactiveBookFavorited = async (usuarioid, livroid) => {
    try {
        const queryUpdate = `
            UPDATE ${process.env.DB_SCHEMA}.livrossalvos
            SET ativo = 'N'
            WHERE usuarioid = $1 AND livroid = $2
        `;
        await pool.query(queryUpdate, [usuarioid, livroid]);
        console.log('Livro inativado com sucesso.');
    } catch (error) {
        console.error('Erro ao inativar o livro salvo na lista de favoritos:', error);
        throw error;
    }
};

// Ativar os livros salvos na lista de favoritos
const activeBookFavorited = async (usuarioid, livroid) => {
    try {
        const queryUpdate = `
            UPDATE ${process.env.DB_SCHEMA}.livrossalvos
            SET ativo = 'Y'
            WHERE usuarioid = $1 AND livroid = $2
        `;
        await pool.query(queryUpdate, [usuarioid, livroid]);
    } catch (error) {
        console.error('Erro ao ativar o livro salvo na lista de favoritos:', error);
        throw error;
    }
};

// Verificar se o usuário já salvou o livro na lista de favoritos
const getFavoritedStatus = async (usuarioid, livroid) => {
    try {
        const query = `
            SELECT * FROM ${process.env.DB_SCHEMA}.livrossalvos ss
            WHERE ss.usuarioid = $1 AND ss.livroid = $2
        `;
        const result = await pool.query(query, [usuarioid, livroid]);
        return result.rows[0];
    } catch (error) {
        console.error('Error checking if book is favorited:', error);
        throw error;
    }
};

module.exports = { createFavoriteBook, isBookFavorited, inactiveBookFavorited, 
    activeBookFavorited, getFavoritedStatus 
};