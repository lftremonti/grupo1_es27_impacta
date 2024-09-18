// A classe ApiError estende a classe base Error para criar erros personalizados com status HTTP.
class ApiError extends Error {
    constructor(status, message, error = null) {
        super(message);
        this.type = 'error'; // Define o tipo de erro como 'error', que pode ser útil para identificar o tipo de resposta.
        this.status = status; // Define o status do erro (normalmente um código HTTP, como 400, 404, 500).
        this.message = message; // Define a mensagem de erro, herdada do construtor da classe Error.
        if (error) {
            this.error = error;  // Se um erro adicional for fornecido, ele será armazenado na propriedade 'error'.
        }
    }
}

module.exports = ApiError;