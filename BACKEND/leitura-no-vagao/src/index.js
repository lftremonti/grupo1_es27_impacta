const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Importa o middleware de tratamento de erros personalizado.
const errorHandler = require('./middlewares/errorHandler');

// Configura o aplicativo para processar dados JSON no corpo das requisições.
// Configura o aplicativo para utilizar CORS, permitindo que outros domínios acessem sua API.
const app = express();
app.use(cors());
app.use(express.json());

//Rotas
//

//Middleware de tratamento de erros. Se qualquer rota ou operação lançar um erro, este middleware será chamado.
app.use(errorHandler);

//Inicia o servidor e faz com que ele escute as requisições na porta definida. 
//Exibe uma mensagem no console indicando que o servidor está rodando.
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});