const pool = require('../config/db');

// Criar avaliação para um livro
const createReviewsBook = async (reviews) => {
    try {
        const query = `INSERT INTO ${process.env.DB_SCHEMA}.Avaliacoes (LivroID, UsuarioID, pontuacao, comentario, data_avaliacao) 
                        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [reviews.livroId, reviews.usuarioId, reviews.pontuacao, reviews.comentario, reviews.data_avaliacao];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error ao criar avaliação: ', error);
        throw error;
    }
};

// Buscar todas as avaliações
const findAllReviews = async () => {
    try {
        const query = `SELECT * FROM ${process.env.DB_SCHEMA}.Avaliacoes WHERE ativo = 'Y'`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error ao listar todas as avaliações: ', error);
        throw error;
    }
};

// Busca avaliação pelo ID
const findReviewsById = async (id) => {
    try {
        const query = `SELECT * FROM ${process.env.DB_SCHEMA}.Avaliacoes WHERE ad_avaliacoes_id = $1 AND ativo = 'Y'`;
        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (error) {
        console.error('Error ao buscar avaliação por id: ', error);
        throw error;
    }
};

// Buscar as avaliações de um livro pelo ID
const findReviewsByIdBook = async (id) => {
    try {
        const query = `
            SELECT 
            a.ad_avaliacoes_id,
            a.LivroID,
            a.UsuarioID,
            u.nome,
            a.pontuacao,
            a.comentario,
            a.data_avaliacao
        FROM 
            ${process.env.DB_SCHEMA}.Avaliacoes a
        LEFT join
            ${process.env.DB_SCHEMA}.Usuarios u on u.ad_usuario_id = a.usuarioid
        WHERE 
            a.LivroID = $1 AND a.ativo = 'Y';
        `;
        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (error) {
        console.error('Error ao buscar as avaliações do livro:', error);
        throw error;
    }
};

// Buscar a media das avaliações
const findReviewsAverageByIdBook = async (id) => {
    try {
        const query = `
            SELECT 
                AVG(a.pontuacao) AS media_avaliacao,
                COUNT(a.ad_avaliacoes_id) AS total_avaliacoes
            FROM 
                ${process.env.DB_SCHEMA}.Avaliacoes a
            WHERE 
                a.LivroID = $1 AND a.ativo = 'Y';
        `;
        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (error) {
        console.error('Error ao buscar a media das avaliações do livro:', error);
        throw error;
    }
};

module.exports = { findReviewsByIdBook, findReviewsAverageByIdBook, createReviewsBook, findAllReviews, findReviewsById };