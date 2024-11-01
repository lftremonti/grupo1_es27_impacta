const pool = require('../config/db');

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
            avaliacoes a
        LEFT join
            usuarios u on u.ad_usuario_id = a.usuarioid
        WHERE 
            a.LivroID = $1 AND a.ativo = 'Y';
        `;
        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching book:', error);
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
                avaliacoes a
            WHERE 
                a.LivroID = $1 AND a.ativo = 'Y';
        `;
        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching book:', error);
        throw error;
    }
};

module.exports = { findReviewsByIdBook, findReviewsAverageByIdBook };