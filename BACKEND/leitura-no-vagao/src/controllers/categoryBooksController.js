const categoryBookModel = require('../models/categoryBooksModel');
const { validarCamposObrigatorios } = require('../utils/validationUtils');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

const createCategoryBook = async (req, res, next) => {
    try {
        const { nome, descricao } = req.body;

        // Verificar campos obrigatórios
        const erroCampos = validarCamposObrigatorios(req.body, ["nome"]);
        if (erroCampos) {
            return next(new ApiError(400, erroCampos));
        }

        // Criação do livro no banco de dados
        const newCategory = await categoryBookModel.createCategoryBook({ nome, descricao });

        return successResponse(res, 201, 'Categoria criada com sucesso!', { category: newCategory });
    } catch (error) {
        next(new ApiError(500, 'Erro ao criar a categoria', error.message));
        console.error(`Error: ${error}`);
    }
};

const linkBookWithCategory = async (req, res, next) => {
    try {
        const { livroId, categoryId } = req.body;

        // Verificar campos obrigatórios
        const erroCampos = validarCamposObrigatorios(req.body, ["livroId", "categoryId"]);
        if (erroCampos) {
            return next(new ApiError(400, erroCampos));
        }

        // Criação do livro no banco de dados
        const newCategory = await categoryBookModel.linkBookWithCategory({ livroId, categoryId });

        return successResponse(res, 201, 'Vinculado a categoria criada com sucesso!', { category: newCategory });
    } catch (error) {
        next(new ApiError(500, 'Erro ao vincular uma categoria ao livro', error.message));
        console.error(`Error: ${error}`);
    }
}

const findByNameCategoryBook = async (req, res, next) => {
    const { nome } = req.params;
    try {
        const category = await categoryBookModel.findByNameCategoryBook(nome);
        
        if (category) {
            return successResponse(res, 200, 'Categoria encontrado no banco de dados!', { category: category });
        }

        return next(new ApiError(404, 'Categoria não encontrado em nenhum lugar.'));
    } catch (error) {
        next(new ApiError(500, 'Erro ao buscar informações da categoria.', error.message));
        console.error(`Error: ${error}`);
    }
};

const getAllCategory = async (req, res, next) => {
    try {
        const category = await categoryBookModel.findAllCategory();
        return successResponse(res, 200, 'Categorias encontrados!', { category });
    } catch (error) {
        next(new ApiError(500, 'Erro ao buscar as categorias', error.message));
        console.error(`Error: ${error}`);
    }
};

const getActiveCategoriesWithBooks = async (req, res, next) => {
    try {
        const category = await categoryBookModel.getActiveCategoriesWithBooks();
        return successResponse(res, 200, 'Categorias encontrados!', { category });
    } catch (error) {
        next(new ApiError(500, 'Erro ao buscar as categorias', error.message));
        console.error(`Error: ${error}`);
    }
};

const getCategoryById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const book = await categoryBookModel.findCategoryById(id);
        if (!book) {
            return next(new ApiError(404, 'Livro não encontrado'));
        }

        return successResponse(res, 200, 'Livro encontrado!', { book });
    } catch (error) {
        next(new ApiError(500, 'Erro ao buscar o livro', error.message));
        console.error(`Error: ${error}`);
    }
};

module.exports = { createCategoryBook, findByNameCategoryBook, getAllCategory, getCategoryById, getActiveCategoriesWithBooks, linkBookWithCategory };