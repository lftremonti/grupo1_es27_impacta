const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const temporaryCodeModel = require('../models/temporaryCodeModel');
const userModel = require('../models/userModel');
const userRoles = require('../models/rolesModel');
const transporter = require('../config/nodemailer');
const { getHtmlTemplate } = require('../utils/Templates');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

//Funçao para realizar login
const login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;

        // Verifica se o email e senha foram fornecidos
        if (!email || !senha) {
            return next(new ApiError(400, 'E-mail e senha são obrigatórios.'));
        }

        const user = await userModel.getUserByEmail(email);

        // Verifica se o usuário existe
        if (!user || user.rows.length === 0) {
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
        const token = jwt.sign({ userId: user.ad_user_id }, process.env.JWT_SECRET, { expiresIn: '3h' });

        const userResult = user.rows[0];

        // Buscar a role do usuário
        const userRole = await userRoles.getUserRole(userResult.ad_usuario_id);

        // Retorna o token e os dados do usuário (sem a senha)
        return successResponse(res, 200, 'Login realizado com sucesso!', { token, user: { ...userResult, role: userRole }})
    } catch (err) {
        next(new ApiError(500, 'Server error', err.message));
    }
};

//Primeira etapa do reset da senha e validar o email e mandar o codigo para o email informado.
const sendResetCode = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModel.getUserByEmail(email);

        if (user.rows.length === 0) {
            return next(new ApiError(404, 'Email informado não encontrado!'));
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const userId = user.rows[0].ad_usuario_id;
        const expiresAt = new Date(Date.now() + 3600000); // 1 hora

        await temporaryCodeModel.createTemporaryCode(userId, code, expiresAt, "PASSWORD_RESET");

        // Obtem o template HTML e substitui o token
        const htmlContent = getHtmlTemplate(code);

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Código de redefinição de senha',
            html: htmlContent,
            attachments: [
                {
                    filename: 'icon.png',
                    path: path.join(__dirname, '../assets/icon.png'),
                    cid: 'icon'
                },
                {
                    filename: 'iconFacebook.png',
                    path: path.join(__dirname, '../assets/iconFacebook.png'),
                    cid: 'iconFacebook'
                },
                {
                    filename: 'iconInstagram.png',
                    path: path.join(__dirname, '../assets/iconInstagram.png'),
                    cid: 'iconInstagram'
                },
                {
                    filename: 'iconLinkedin.png',
                    path: path.join(__dirname, '../assets/iconLinkedin.png'),
                    cid: 'iconLinkedin'
                }
            ]
        };

        await transporter.sendMail(mailOptions);

        return successResponse(res, 200, 'Um codigo de redefinição de senha foi enviado para o email informado.', { userId });
    } catch (error) {
        next(new ApiError(500, 'server error', error.message));
    }
};

//Verifircar a resposta do usuario para validar o codigo que fornecemos
const verifyResetCode = async (req, res, next) => {
    try {
        const { userid, code } = req.body;
        const result = await temporaryCodeModel.findByUserIdAndCode(userid, code);

        if (result.rows.length === 0) {
            return next(new ApiError(404, 'Codigo inválido ou expirado.'));
        }

        return successResponse(res, 200, 'Sucesso', result.rows[0].ad_usuario_id);
    } catch (error) {
        next(new ApiError(500, 'Server error', error.message));
    }
};

//Com o codigo valido resetamos a senha e inativamos o codigo
const resetPassword = async (req, res, next) => {
    try {
        const { userid, code, newPassword } = req.body;
        // Encontrar o usuário pelo e-mail
        const userResult = await userModel.findById(userid);
        if (!userResult) {
            return next(new ApiError(404, 'Usuario não encontrado!'));
        }

        // Criptografar a nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userModel.updatePasswordById(userid, hashedPassword);

        await temporaryCodeModel.inativeCode(userid, code);

        return successResponse(res, 200, 'Senha resetada com sucesso!');
    } catch (error) {
        next(new ApiError(500, 'Server error', error.message));
    }
};

const loginWithGoogleId = async (req, res, next) => {
    try {
        const { email, idAuthGoogle } = req.body;

        // Verifica se o email e o idAuthGoogle foram fornecidos
        if (!email || !idAuthGoogle) {
            return next(new ApiError(400, 'E-mail e ID do Google são obrigatórios.'));
        }

        // Busca o usuário pelo email
        const user = await userModel.getUserByEmail(email);

        // Verifica se o usuário existe
        if (!user || user.rows.length === 0) {
            return next(new ApiError(401, 'Usuário não encontrado.'));
        }

        const userResult = user.rows[0];

        // Aqui você deve verificar se o ID do Google corresponde ao usuário
        // Para simplificar, vamos assumir que temos um campo id_google na tabela do usuário
        if (userResult.id_google !== idAuthGoogle) {
            return next(new ApiError(401, 'ID do Google não corresponde ao usuário.'));
        }

        // Gera o token JWT
        const token = jwt.sign({ userId: userResult.ad_user_id }, process.env.JWT_SECRET, { expiresIn: '3h' });

        // Buscar a role do usuário
        const userRole = await userRoles.getUserRole(userResult.ad_usuario_id);

        // Retorna o token e os dados do usuário (sem a senha)
        return successResponse(res, 200, 'Login realizado com sucesso!', { token, user: { ...userResult, role: userRole } });
    } catch (err) {
        next(new ApiError(500, 'Server error', err.message));
    }
};


module.exports = { login, sendResetCode, verifyResetCode, resetPassword, loginWithGoogleId };