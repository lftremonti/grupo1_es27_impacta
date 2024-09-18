// models/userModel.js
const pool = require('../config/db');

// Função para buscar um usuário pelo email
const getUserByEmail = async (email) => {
    try {
        const query = `SELECT * FROM ${process.env.DB_SCHEMA}.usuarios WHERE email = $1`;
        const result = await pool.query(query, [email]);
        return result; // Deve retornar um objeto com uma propriedade `rows`
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Função para buscar um usuário pelo email
const getUserByPhone = async (telefone) => {
    try {
        const query = `SELECT * FROM ${process.env.DB_SCHEMA}.usuarios WHERE telefone = $1`;
        const result = await pool.query(query, [telefone]);
        return result; // Deve retornar um objeto com uma propriedade `rows`
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Função para buscar um usuário pelo id
const findById = async (id) => {
    try{
        const result = await pool.query(`SELECT * FROM ${process.env.DB_SCHEMA}.usuarios WHERE ad_usuario_id = $1`, [id]);
        return result.rows[0];
    } catch {
        console.error('Error create user: ', error);
        throw error;
    }
};

// Função para criar um novo usuário
const createUser = async (user) => {
    try {
        const result = await pool.query(
            `INSERT INTO ${process.env.DB_SCHEMA}.usuarios(nome, email, telefone, senha) VALUES ($1, $2, $3, $4) RETURNING *`,
            [user.nome, user.email, user.telefone, user.senha]
        );
        return result.rows[0];
    } catch {
        console.error('Error create user: ', error);
        throw error;
    }
};

module.exports = { getUserByEmail, createUser, findById, getUserByPhone};