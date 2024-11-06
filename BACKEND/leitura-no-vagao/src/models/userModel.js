// models/userModel.js
const pool = require('../config/db');

// Função para buscar um usuário pelo email
const getUserByEmail = async (email) => {
    try {
        const query = `SELECT * FROM ${process.env.DB_SCHEMA}.usuarios WHERE LOWER(email) = LOWER($1) AND ativo = 'Y'`;
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
        const query = `SELECT * FROM ${process.env.DB_SCHEMA}.usuarios WHERE telefone = $1 `;
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
        const result = await pool.query(`SELECT * FROM ${process.env.DB_SCHEMA}.usuarios WHERE ad_usuario_id = $1 AND ativo = 'Y'`, [id]);
        return result.rows[0];
    } catch {
        console.error('Error create user: ', error);
        throw error;
    }
};

// Função para criar um novo usuário
const createUser = async (user) => {
    console.log(`Entrou na model para cadastrar o usuario`)
    try {
        const result = await pool.query(
            `INSERT INTO ${process.env.DB_SCHEMA}.usuarios(nome, email, telefone, senha, idauthgoogle) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user.nome, user.email, user.telefone, user.senha, user.idAuthGoogle]
        );
        return result.rows[0];
    } catch {
        console.error('Error create user: ', error);
        throw error;
    }
};

// Função para atualizar o campo idAuthGoogle de usuário já existente
const updateGoogleId = async (idAuthGoogle, email) => {
    try {
        const query = `
            UPDATE ${process.env.DB_SCHEMA}.usuarios
            SET idauthgoogle = $1
            WHERE email = $2
            RETURNING *;
        `;
        const values = [idAuthGoogle, email];

        const result = await pool.query(query, values);
        
        if (result.rows.length > 0) {
            return result.rows[0]; // Retorna o usuário atualizado
        } else {
            throw new Error(`Email informado ${user.email} não foi encontrado.`);
        }
    } catch {
        console.error('Error ao atualizar os dados do usuario: ', error);
        throw error;
    }
};

//Atualizar a senha do usuario pelo id
const updatePasswordById = async (userid, newPassword) => {
    try {
        const result = await pool.query(
            `UPDATE ${process.env.DB_SCHEMA}.usuarios SET senha = $1 WHERE ad_usuario_id = $2`,
            [newPassword, userid]
        );
        return result.rows[0];
    } catch {
        console.error('Error create user: ', error);
        throw error;
    }
}


// Exemplo de implementação de getUserByGoogleId
const getUserByGoogleId = async (idAuthGoogle) => {
    try {
        const query = `SELECT * FROM ${process.env.DB_SCHEMA}.usuarios WHERE idauthgoogle = $1`; // Ajuste a consulta conforme a sua tabela
        const result = await pool.query(query, [idAuthGoogle]);
        return result; // Deve retornar um objeto com uma propriedade `rows`
    } catch {
        console.error('Error create user: ', error);
        throw error;
    }
};

module.exports = { getUserByEmail, createUser, findById, getUserByPhone, getUserByGoogleId, updatePasswordById, updateGoogleId };