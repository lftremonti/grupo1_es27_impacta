const pool = require('../config/db');


// Função para buscar a role pelo id
const findById = async (id) => {
    try{
        const result = await pool.query(`SELECT * FROM ${process.env.DB_SCHEMA}.roles WHERE ad_role_id = $1`, [id]);
        return result.rows[0];
    } catch {
        console.error('Error roles: ', error);
        throw error;
    }
};


// Função para buscar a role pelo nome
const findByName = async (nome) => {
    try{
        const result = await pool.query(`SELECT * FROM ${process.env.DB_SCHEMA}.roles WHERE nome = $1`, [nome]);
        return result.rows[0];
    } catch {
        console.error('Error roles: ', error);
        throw error;
    }
};

//Busca a role que esta vinculada ao usuario
const getUserRole = async (userId) => {
    try{
        const result = await pool.query(
            `SELECT R.ad_role_id AS roleId, R.nome AS role
             FROM ${process.env.DB_SCHEMA}.RolesUsuarios RU
             JOIN ${process.env.DB_SCHEMA}.Roles R ON RU.RoleID = R.ad_role_id
             WHERE RU.UsuarioID = $1`,
            [userId]
        );
        return result.rows[0];
    } catch {
        console.error('Error roles: ', error);
        throw error;
    }
};

// Vincular a role padrão para todos os usuarios cadastrados
const assignRoleToUser = async (userId, roleId) => {
    try{
        const result = await pool.query(
            `INSERT INTO ${process.env.DB_SCHEMA}.RolesUsuarios(UsuarioID, RoleID) VALUES ($1, $2) RETURNING *`,
            [userId, roleId]
        );
        return result.rows[0];
    }catch{
        console.error('Error roles: ', error);
        throw error;
    }
}

module.exports = { findById, findByName, assignRoleToUser, getUserRole };