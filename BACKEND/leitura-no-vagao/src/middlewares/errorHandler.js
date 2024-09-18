// Importa a classe ApiError para manipulação de erros personalizados
const ApiError = require('../utils/ApiError');

// Middleware para capturar e tratar erros em toda a aplicação
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            type: err.type,  // Tipo do erro (nesse caso, 'error')
            status: err.status, // Código de status HTTP (ex.: 400, 404, 500)
            message: err.message, // Mensagem detalhada do erro
            error: err.error || null // Detalhes adicionais do erro (se disponíveis)
        });
    }

     // Para outros erros não tratados explicitamente (erros genéricos)
    return res.status(500).json({
        type: 'error', // Define o tipo de resposta como 'error'
        status: 500, // Código de status HTTP 500 (erro interno do servidor)
        message: 'Internal Server Error', // Mensagem genérica de erro
        error: err.message // Detalhes do erro original
    });
};

module.exports = errorHandler;