const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const userRoles = require('../models/rolesModel');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

const login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;

        // Verifica se o email e senha foram fornecidos
        if (!email || !senha) {
            return next(new ApiError(400, 'E-mail e senha são obrigatórios.'));
        }

        const user = await userModel.getUserByEmail(email);

        // Verifica se o usuário existe
        if (!user) {
            return next(new ApiError(401, 'Email ou senha inválidos.'));
        }

        // Verifica se a senha está definida no banco de dados
        if (!user.rows[0].senha) {
            return next(new ApiError(500, 'Senha não definida para este usuário.'));
        }

        // Verifica se a senha fornecida é válida
        const isPasswordValid = await bcrypt.compare(senha, user.rows[0].senha);
        if (!isPasswordValid) {
            return next(new ApiError(401, 'Email ou senha inválidos.'));
        }

        // Gera o token JWT
        const token = jwt.sign({ userId: user.ad_user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const userResult = user.rows[0];

        // Buscar a role do usuário
        const userRole = await userRoles.getUserRole(userResult.ad_usuario_id);

        // Retorna o token e os dados do usuário (sem a senha)
        return successResponse(res, 200, 'Login realizado com sucesso!', { token, user: { ...userResult, role: userRole }})
    } catch (err) {
        next(new ApiError(500, 'Server error', err.message));
    }
};

module.exports = { login };