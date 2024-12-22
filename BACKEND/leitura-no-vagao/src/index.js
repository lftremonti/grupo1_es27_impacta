const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const favoriteBookRoutes = require('./routes/favoriteBookRoutes');
const categoryBooksRoutes = require('./routes/categoryBooksRoutes');
const reviewsBooksRoutes = require('./routes/reviewsRoutes');

// Importa o middleware de tratamento de erros personalizado.
const errorHandler = require('./middlewares/errorHandler');

// Configura o aplicativo para processar dados JSON no corpo das requisições.
// Configura o aplicativo para utilizar CORS, permitindo que outros domínios acessem sua API.
const app = express();
app.use(cors());
app.use(express.json());

//Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/favoriteBookRoutes', favoriteBookRoutes);
app.use('/api/categoryBooks', categoryBooksRoutes);
app.use('/api/reviews', reviewsBooksRoutes);

//Middleware de tratamento de erros. Se qualquer rota ou operação lançar um erro, este middleware será chamado.
app.use(errorHandler);

//Inicia o servidor e faz com que ele escute as requisições na porta definida. 
//Exibe uma mensagem no console indicando que o servidor está rodando.
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});