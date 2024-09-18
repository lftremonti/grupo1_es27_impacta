const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//Obriga o usuario a passar o token, para acessar algumas rotas das APIS
exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};