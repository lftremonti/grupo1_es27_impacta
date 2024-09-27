const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware de autenticação com suporte a bypass de token
exports.authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.replace('Bearer ', '');
    const bypassTokenKey = process.env.BYPASS_TOKEN_KEY;

    // Verifica se o token é igual à chave de bypass
    if (token === bypassTokenKey) {
        // Bypass o token e permita o acesso sem autenticação
        req.userId = 'bypass'; // Defina um valor padrão para o userId
        return next();
    }

    // Se não for o bypass, verifica o token JWT normal
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};
