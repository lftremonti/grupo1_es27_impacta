// models/userModel.js
const pool = require('../config/db');

// Função para criar um novo codigo temporario
const createTemporaryCode = async (userId, code, expiresAt, type) => {
    try{
        const result = await pool.query(
            `INSERT INTO ${process.env.DB_SCHEMA}.codigotemporario (usuarioid, codigo, expira_em, tipo) VALUES ($1, $2, $3, $4)`,
            [userId, code, expiresAt, type]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching code:', error);
        throw error;
    }
};

// Função para criar um novo codigo temporario
const findByUserIdAndCode = async (userId, code) => {
    try {
        const query = `SELECT * FROM ${process.env.DB_SCHEMA}.codigotemporario WHERE usuarioid = $1 AND codigo = $2 AND expira_em > NOW() AND ativo = 'Y'`;
        const result = await pool.query(query, [userId, code]);
        return result
    } catch (error) {
        console.error('Error fetching code:', error);
        throw error;
    }
};

// Função para criar um novo codigo temporario
const inativeCode = async (userId, code) => {
    try {
        const query = `UPDATE ${process.env.DB_SCHEMA}.codigotemporario SET ativo = 'N' WHERE usuarioid = $1 AND codigo = $2`;
        const result = await pool.query(query, [userId, code]);
        return result
    } catch (error) {
        console.error('Error fetching code:', error);
        throw error;
    }
};


module.exports = { createTemporaryCode, findByUserIdAndCode, inativeCode };