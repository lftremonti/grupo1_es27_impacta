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
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching book:', error);
        throw error;
    }
};

// Buscar todos os livros
const findAllBooks = async (limit, offset, categoryId) => {
    try {
        const query = `
            SELECT L.*, I.URLImagem AS imagem_url, I.ImagemBase64 AS imagem_base64
            FROM ${process.env.DB_SCHEMA}.Livros L
            LEFT JOIN ${process.env.DB_SCHEMA}.LivroImagens LI ON L.ad_livros_id = LI.LivroID
            LEFT JOIN ${process.env.DB_SCHEMA}.Imagem I ON LI.ImagemID = I.ad_imagem_id
            ${categoryId ? `INNER JOIN ${process.env.DB_SCHEMA}.LivroCategorias LC ON L.ad_livros_id = LC.LivroID` : ''}
            WHERE L.ativo = 'Y' AND i.is_default = TRUE
            ${categoryId ? 'AND LC.CategoriaID = $3' : ''}
            LIMIT $1 OFFSET $2;
        `;

        const params = [limit, offset];
        if (categoryId) {
            params.push(categoryId);
        }

        const result = await pool.query(query, params);
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
const getBookByISBNExist = async (isbn) => {
    try {
        const query = `SELECT EXISTS (
            SELECT 1 FROM ${process.env.DB_SCHEMA}.Livros 
            WHERE ISBN10 = $1 OR ISBN13 = $1
        ) AS exist`;
        const result = await pool.query(query, [isbn]);
        return result.rows[0].exist; // Retorna o livro encontrado ou undefined
    } catch (error) {
        console.error('Erro ao buscar livro no banco de dados:', error);
        throw error;
    }
};

// Função para buscar um livro pelo ISBN10 ou ISBN13 no banco de dados
const getBookByISBN = async (isbn) => {
    try {
        const query = `SELECT * FROM ${process.env.DB_SCHEMA}.Livros WHERE ISBN10 = $1 OR ISBN13 = $1`;
        const result = await pool.query(query, [isbn]);
        return result.rows[0]; // Retorna o livro encontrado ou undefined
    } catch (error) {
        console.error('Erro ao buscar livro no banco de dados:', error);
        throw error;
    }
};

// Destaques
const getFeaturedBooks = async (limit, offset, categoryId) => {
    try {
        let query = `
            SELECT DISTINCT L.*, 
                COALESCE(LEITURAS.popularidade, 0) + COALESCE(SALVOS.salvos, 0) AS popularidade,
                I.URLImagem AS imagem_url, I.ImagemBase64 AS imagem_base64
            FROM ${process.env.DB_SCHEMA}.Livros L
            LEFT JOIN (
                SELECT HL.LivroID, COUNT(HL.LivroID) AS popularidade
                FROM ${process.env.DB_SCHEMA}.HistoricoLivros HL
                JOIN ${process.env.DB_SCHEMA}.StatusLivros SL ON HL.StatusID = SL.ad_status_id
                WHERE SL.nome IN ('Concluído', 'Em andamento')
                GROUP BY HL.LivroID
            ) LEITURAS ON L.ad_livros_id = LEITURAS.LivroID
            LEFT JOIN (
                SELECT LS.LivroID, COUNT(LS.LivroID) AS salvos
                FROM ${process.env.DB_SCHEMA}.LivrosSalvos LS
                GROUP BY LS.LivroID
            ) SALVOS ON L.ad_livros_id = SALVOS.LivroID
            LEFT JOIN ${process.env.DB_SCHEMA}.LivroImagens LI ON L.ad_livros_id = LI.LivroID
            LEFT JOIN ${process.env.DB_SCHEMA}.Imagem I ON LI.ImagemID = I.ad_imagem_id AND I.is_default = TRUE
            ${categoryId ? `INNER JOIN ${process.env.DB_SCHEMA}.LivroCategorias LC ON L.ad_livros_id = LC.LivroID` : ''}
            WHERE L.ativo = 'Y' AND I.is_default = TRUE
            ${categoryId ? 'AND LC.CategoriaID = $3' : ''}
            AND (COALESCE(LEITURAS.popularidade, 0) + COALESCE(SALVOS.salvos, 0)) > 0
            ORDER BY popularidade DESC
            LIMIT $1 OFFSET $2;
        `;

        const params = [limit, offset];
        if (categoryId) {
            params.push(categoryId);
        }

        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Error fetching featured books:', error);
        throw error;
    }
};

// Livros mais bem avaliados
const getTopRatedBooks = async (limit, offset, categoryId) => {
    try {
        const query = `
            SELECT L.*, AVG(A.pontuacao) AS media_avaliacao, I.URLImagem AS imagem_url, I.ImagemBase64 AS imagem_base64
            FROM ${process.env.DB_SCHEMA}.Livros L
            JOIN ${process.env.DB_SCHEMA}.Avaliacoes A ON L.ad_livros_id = A.LivroID
            LEFT JOIN ${process.env.DB_SCHEMA}.LivroImagens LI ON L.ad_livros_id = LI.LivroID
            LEFT JOIN ${process.env.DB_SCHEMA}.Imagem I ON LI.ImagemID = I.ad_imagem_id
            ${categoryId ? `INNER JOIN ${process.env.DB_SCHEMA}.LivroCategorias LC ON L.ad_livros_id = LC.LivroID` : ''}
            WHERE L.ativo = 'Y' AND A.ativo = 'Y' AND I.is_default = true
            ${categoryId ? 'AND LC.CategoriaID = $3' : ''}
            GROUP BY L.ad_livros_id, I.ad_imagem_id
            ORDER BY media_avaliacao DESC
            LIMIT $1 OFFSET $2;
        `;
        const queryParams = [limit, offset];
        if (categoryId) {
            queryParams.push(categoryId);
        }

        const result = await pool.query(query, queryParams);
        return result.rows;
    } catch (error) {
        console.error('Error fetching top-rated books:', error);
        throw error;
    }
};

// Recomendado para você
const getRecommendedBooks = async (userId, limit, offset, categoryId) => {
    try {
        const query = `
            SELECT L.*, I.URLImagem AS imagem_url, I.ImagemBase64 AS imagem_base64
            FROM ${process.env.DB_SCHEMA}.Livros L
            JOIN ${process.env.DB_SCHEMA}.LivroCategorias LC ON L.ad_livros_id = LC.LivroID
            LEFT JOIN ${process.env.DB_SCHEMA}.LivroImagens LI ON L.ad_livros_id = LI.LivroID
            LEFT JOIN ${process.env.DB_SCHEMA}.Imagem I ON LI.ImagemID = I.ad_imagem_id
            WHERE LC.CategoriaID IN (
                SELECT DISTINCT LC2.CategoriaID
                FROM ${process.env.DB_SCHEMA}.HistoricoLivros HL
                JOIN ${process.env.DB_SCHEMA}.LivroCategorias LC2 ON HL.LivroID = LC2.LivroID
                WHERE HL.UsuarioID = $1
            ) 
            AND NOT EXISTS (
                SELECT 1
                FROM ${process.env.DB_SCHEMA}.HistoricoLivros HL2
                WHERE HL2.LivroID = L.ad_livros_id AND HL2.UsuarioID = $1
            ) 
            AND L.ativo = 'Y' 
            AND I.is_default = TRUE
            ${categoryId ? 'AND LC.CategoriaID = $4' : ''}
            GROUP BY L.ad_livros_id, I.URLImagem, I.imagembase64
            LIMIT $2 OFFSET $3;
        `;

        const values = [userId, limit, offset];
        if (categoryId) {
            values.push(categoryId);
        }

        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error fetching recommended books:', error);
        throw error;
    }
};

// Descobertas da semana
const getNewArrivals = async (limit, offset, categoryId) => {
    try {
        const query = `
            SELECT L.*, I.URLImagem AS imagem_url, I.ImagemBase64 AS imagem_base64
            FROM ${process.env.DB_SCHEMA}.Livros L
            LEFT JOIN ${process.env.DB_SCHEMA}.LivroImagens LI ON L.ad_livros_id = LI.LivroID
            LEFT JOIN ${process.env.DB_SCHEMA}.Imagem I ON LI.ImagemID = I.ad_imagem_id
            ${categoryId ? `INNER JOIN ${process.env.DB_SCHEMA}.LivroCategorias LC ON L.ad_livros_id = LC.LivroID` : ''}
            WHERE L.ativo = 'Y' AND I.is_default = TRUE
            ${categoryId ? 'AND LC.CategoriaID = $3' : ''}
            ORDER BY L.criado DESC
            LIMIT $1 OFFSET $2;
        `;

        const queryParams = [limit, offset];
        if (categoryId) {
            queryParams.push(categoryId);
        }

        const result = await pool.query(query, queryParams);
        return result.rows;
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        throw error;
    }
};

// Buscar as imagens de livro pelo ID
const findBookImageById = async (id) => {
    try {
        const query = `
            SELECT 
                l.ad_livros_id AS livro_id,
                i.ad_imagem_id AS imagem_id,
                i.nome AS imagem_nome,
                i.URLImagem AS imagem_url,
                i.ImagemBase64 AS imagem_base64
            FROM 
                ${process.env.DB_SCHEMA}.Livros l
            LEFT JOIN 
                ${process.env.DB_SCHEMA}.LivroImagens li ON l.ad_livros_id = li.LivroID
            LEFT JOIN 
                ${process.env.DB_SCHEMA}.Imagem i ON li.ImagemID = i.ad_imagem_id
            WHERE 
                l.ad_livros_id = $1
                AND l.ativo = 'Y' 
                AND li.ativo = 'Y'
                AND i.ativo = 'Y';
        `;
        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (error) {
        console.error('Error ao buscar as imagens do livro:', error);
        throw error;
    }
};

// Livros favoritos usuario logado
const findFavoriteBooks = async (limit, offset, id) => {
    try {
        const query = `
            SELECT L.*, I.URLImagem AS imagem_url, I.ImagemBase64 AS imagem_base64
            FROM ${process.env.DB_SCHEMA}.LivrosSalvos L2
            LEFT JOIN ${process.env.DB_SCHEMA}.Livros L ON L2.livroid = L.ad_livros_id 
            LEFT JOIN ${process.env.DB_SCHEMA}.LivroImagens LI ON L.ad_livros_id = LI.LivroID
            LEFT JOIN ${process.env.DB_SCHEMA}.Imagem I ON LI.ImagemID = I.ad_imagem_id
            WHERE L.ativo = 'Y' AND i.is_default = TRUE AND L2.usuarioid = $3 AND L2.ativo = 'Y'
            LIMIT $1 OFFSET $2;
        `;

        const params = [limit, offset];
        if (id) {
            params.push(id);
        }

        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Error fetching favorite books:', error);
        throw error;
    }
};


const addImages = async (images) => {
    try {
        const query = `INSERT INTO ${process.env.DB_SCHEMA}.Imagem (is_default, nome, URLImagem, ImagemBase64) 
                        VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [book.titulo, book.autor, book.editora, book.ano_publicacao, book.descricao, book.ISBN10, book.ISBN13];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating book:', error);
        throw error;
    }
};

module.exports = { createBook, updateBook, getBookByISBN, findById, 
    findAllBooks, deleteBookById, getFeaturedBooks, getTopRatedBooks, 
    getRecommendedBooks, getNewArrivals, findBookImageById, findFavoriteBooks, getBookByISBNExist};
