const pool = require('../config/db');

// Criar uma categoria de livros
const createCategoryBook = async (category) => {
    try {
        const query = `INSERT INTO ${process.env.DB_SCHEMA}.Categorias (nome, descricao) 
                        VALUES ($1, $2) RETURNING *`;
        const values = [category.nome, category.descricao];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

const linkBookWithCategory = async (livroId, categoryId) => {
    try {
        const query = `INSERT INTO ${process.env.DB_SCHEMA}.LivroCategorias (LivroID, CategoriaID) 
                        VALUES ($1, $2) RETURNING *`;
        const values = [livroId, categoryId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error linking a book to a category:', error);
        throw error;
    }
}

const linkBookWithCategoryExists = async (livroId, categoryId) => {
    try {
        const query = `SELECT EXISTS (
            SELECT 1 
            FROM ${process.env.DB_SCHEMA}.LivroCategorias 
            WHERE LivroID = $1 AND CategoriaID = $2
            ) AS exists`;
        const values = [livroId, categoryId];
        const result = await pool.query(query, values);
        return result.rows[0].exists;
    } catch (error) {
        console.error('Error linking a book to a category:', error);
        throw error;
    }
}

// Buscar categoria pelo nome
const findByNameCategoryBook = async (nome) => {
    try {
        const result = await pool.query(`SELECT * FROM ${process.env.DB_SCHEMA}.Categorias WHERE nome = $1 AND ativo = 'Y'`, [nome]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
};

// Buscar todas as categorias
const findAllCategory = async () => {
    try {
        const query = `SELECT * FROM ${process.env.DB_SCHEMA}.Categorias WHERE ativo = 'Y'`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

// Buscar as categorias que tenham livros já vinculados
const getActiveCategoriesWithBooks = async () => {
    try {
        const query = `
            SELECT C.*
            FROM ${process.env.DB_SCHEMA}.Categorias C
            JOIN ${process.env.DB_SCHEMA}.LivroCategorias LC ON C.ad_categoria_id = LC.CategoriaID
            JOIN ${process.env.DB_SCHEMA}.Livros L ON LC.LivroID = L.ad_livros_id
            WHERE C.ativo = 'Y' AND L.ativo = 'Y'
            GROUP BY C.ad_categoria_id;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

// Buscar uma categoria pelo ID
const findCategoryById = async (id) => {
    try {
        const result = await pool.query(`SELECT * FROM ${process.env.DB_SCHEMA}.Categorias WHERE ad_categoria_id = $1 AND ativo = 'Y'`, [id]);
        console.log("Id: ", id)
        console.log(result);
        return result.rows[0];
    } catch (error) {
        console.error('Error encontrar as categorias:', error);
        throw error;
    }
};

module.exports = { createCategoryBook, findByNameCategoryBook, findAllCategory, findCategoryById, getActiveCategoriesWithBooks, linkBookWithCategory, linkBookWithCategoryExists };