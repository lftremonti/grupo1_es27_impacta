const userModel = require('../models/userModel');
const userRoles = require('../models/rolesModel');
const bcrypt = require('bcrypt');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

const create = async (req, res, next) => {
    try {
        const { nome, email, telefone, senha } = req.body;

        // Verificar se o email já existe
        const existingUserByEmail = await userModel.getUserByEmail(email);
        if (existingUserByEmail.rows[0]) {
            return next(new ApiError(400, 'O email já está cadastrado!'));
        }
 
        // Verificar se o telefone já existe
        const existingUserByPhone = await userModel.getUserByPhone(telefone);
        if (existingUserByPhone.rows[0]) {
            return next(new ApiError(400, 'O número de telefone já está cadastrado!'));
        }

        //Criptografa a senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        //Entra na model para salvar o usuario
        const newUser = await userModel.createUser({ nome, email, telefone, senha: hashedPassword });
        
        // Associar a role padrão (Usuário Padrão) ao novo usuário
        const role = await userRoles.findByName("Usuário Padrão");
        await userRoles.assignRoleToUser(newUser.ad_usuario_id, role.ad_role_id);
        
        return successResponse(res, 201, 'Usuario criado com sucesso!');
    } catch (err) {
        next(new ApiError(500, 'Server error', err.message));
    }
};

const getUserById = async (req, res, next) => {
    const { id } = req.params;
    try {
        //Busca o usuario pelo id
        const user = await userModel.findById(id);

        //Caso não encontre o usuario devolve a resposta do erro
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        return successResponse(res, 200, 'Usuario Encontrado!', { user: user });
    } catch (error) {
        next(new ApiError(500, 'Server error', err.message));
    }
};

const getUserByEmail = async (req, res, next) => {
    const { email } = req.params;
    try {
        //Busca o usuario pelo id
        const user = await userModel.getUserByEmail(email);

        //Caso não encontre o usuario devolve a resposta do erro
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        return successResponse(res, 200, 'Usuario Encontrado!', { user: user.rows[0] });
    } catch (error) {
        next(new ApiError(500, 'Server error', err.message));
    }
};

module.exports = { create, getUserById, getUserByEmail };