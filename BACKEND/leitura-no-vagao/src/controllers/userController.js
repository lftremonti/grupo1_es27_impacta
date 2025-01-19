const userModel = require('../models/userModel');
const userRoles = require('../models/rolesModel');
const bcrypt = require('bcrypt');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

const create = async (req, res, next) => {
    console.log("API de Criar usuarios.")
    try {
        const { nome, email, telefone, senha, idAuthGoogle } = req.body;

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

        // Verificar se o idAuthGoogle já existe
        if (idAuthGoogle) {
            const existingUserByGoogleId = await userModel.getUserByGoogleId(idAuthGoogle);
            if (existingUserByGoogleId.rows[0]) {
                return next(new ApiError(400, 'Este ID do Google já está associado a um usuário!'));
            }
        }

        //Criptografa a senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        //Entra na model para salvar o usuario
        const newUser = await userModel.createUser({ nome, email, telefone, senha: hashedPassword, idAuthGoogle});
        
        // Associar a role padrão (Usuário Padrão) ao novo usuário
        const role = await userRoles.findByName("Usuário Padrão");
        await userRoles.assignRoleToUser(newUser.ad_usuario_id, role.ad_role_id);
        
        return successResponse(res, 201, 'Usuario criado com sucesso!');
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Server error', error.message));
    }
};

const updateGoogleId = async (req, res, next) => {
    try {
        const { idAuthGoogle, email } = req.body;

        // Verifica se o email e o idAuthGoogle foram fornecidos
        if (!idAuthGoogle || !email) {
            return next(new ApiError(400, 'E-mail e ID do Google são obrigatórios.'));
        }

        // Verificar se o idAuthGoogle já existe
        if (idAuthGoogle) {
            const existingUserByGoogleId = await userModel.getUserByGoogleId(idAuthGoogle);
            if (existingUserByGoogleId.rows[0]) {
                return next(new ApiError(400, 'Este ID do Google já está associado a um usuário!'));
            }
        }

        //Entra na model para atualizar o usuario
        await userModel.updateGoogleId(idAuthGoogle, email);
        
        return successResponse(res, 201, 'Usuario criado com sucesso!');
    } catch (error) {
        console.error(`Error: ${error}`);
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
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Server error', error.message));
    }
};

const getUserByEmail = async (req, res, next) => {
    const { email } = req.params;
    try {
        //Busca o usuario pelo id
        const user = await userModel.getUserByEmail(email);

        //Caso não encontre o usuario devolve a resposta do erro
        if (!user.rows[0]) return res.status(404).json({ error: 'Usuário não encontrado' });

        return successResponse(res, 200, 'Usuario Encontrado!', { user: user.rows[0] });
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Server error', error.message));
    }
};


const checkUserByEmail = async (req, res, next) => {
    const { email } = req.params;
    try {
        // Busca o usuário pelo email
        const user = await userModel.getUserByEmail(email);

        // Retorna um objeto com a propriedade exists
        if (!user.rows[0]) {
            return res.status(200).json({ exists: false }); // User not found
        }

        return res.status(200).json({ exists: true, user: user.rows[0] }); // User found
    } catch (error) {
        console.error(`Error: ${error}`);
        next(new ApiError(500, 'Server error', error.message));
    }
};


module.exports = { create, updateGoogleId, getUserById, getUserByEmail, checkUserByEmail };