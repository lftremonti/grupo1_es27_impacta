// Função utilitária para retornar respostas de sucesso em APIs
const successResponse = (res, status, message, data = {}) => {
    // Retorna uma resposta JSON com o status HTTP especificado
    return res.status(status).json({
        type: 'success', // Indica que o tipo de resposta é de sucesso
        status,   // Código de status HTTP (por exemplo, 200, 201)
        message,  // Mensagem descritiva do sucesso (ex.: 'Operação realizada com sucesso')
        data  // Dados opcionais a serem retornados na resposta (padrão: objeto vazio)
    });
};

module.exports = { successResponse };