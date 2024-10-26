const pool = require('../config/db');

// Criar um novo livro
const createBook = async (book) => {
    try {
        const query = `INSERT INTO ${process.env.DB_SCHEMA}.Livros (titulo, autor, editora, ano_publicacao, descricao, ISBN10, ISBN13) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const values = [book.titulo, book.autor, book.editora, book.ano_publicacao, book.descricao, book.ISBN10, book.ISBN13];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating book:', error);
        throw error;
    }
};

// Atualizar um livro existente
const updateBook = async (id, book) => {
    try {
        const query = `UPDATE ${process.env.DB_SCHEMA}.Livros 
                       SET title = $1, author = $2, published_date = $3, genre = $4 
                       WHERE book_id = $5 RETURNING *`;
        const values = [book.title, book.author, book.publishedDate, book.genre, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
};

// Buscar um livro pelo ID
const findById = async (id) => {
    try {
        const result = await pool.query(`SELECT * FROM ${process.env.DB_SCHEMA}.Livros WHERE ad_livros_id = $1 AND ativo = 'Y'`, [id]);
        console.log("Id: ", id)
        console.log(result);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching book:', error);
        throw error;
    }
};

// Buscar todos os livros
const findAllBooks = async () => {
    try {
        const query = `SELECT * FROM ${process.env.DB_SCHEMA}.Livros`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

// Deletar um livro pelo ID
const deleteBookById = async (id) => {
    try {
        const query = `DELETE FROM ${process.env.DB_SCHEMA}.Livros WHERE book_id = $1`;
        await pool.query(query, [id]);
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
};

// Função para buscar um livro pelo ISBN10 ou ISBN13 no banco de dados
const getBookByISBN = async (isbn) => {
    try {
        const query = `SELECT * FROM Livros WHERE ISBN10 = $1 OR ISBN13 = $1`;
        const result = await pool.query(query, [isbn]);
        return result.rows[0]; // Retorna o livro encontrado ou undefined
    } catch (error) {
        console.error('Erro ao buscar livro no banco de dados:', error);
        throw error;
    }
};

module.exports = { createBook, updateBook, getBookByISBN, findById, findAllBooks, deleteBookById };
