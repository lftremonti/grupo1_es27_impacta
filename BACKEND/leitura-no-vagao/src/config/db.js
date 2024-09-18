const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Cria uma nova instância de 'Pool', que gerencia um conjunto de conexões com o banco de dados PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER, // Nome do usuário do banco de dados, obtido das variáveis de ambiente
    host: process.env.DB_HOST, // Host do banco de dados (ex.: localhost ou IP), obtido das variáveis de ambiente
    database: process.env.DB_DATABASE, // Nome do banco de dados, obtido das variáveis de ambiente
    password: process.env.DB_PASSWORD, // Senha do banco de dados, obtida das variáveis de ambiente
    port: process.env.DB_PORT || 5432, // Porta do banco de dados, com o padrão sendo 5432, caso não definida no .env
});

// Define o schema padrão logo após a conexão ser estabelecida
// O schema define um "namespace" dentro do banco de dados, garantindo que as tabelas e objetos estejam no contexto correto
pool.query(`SET search_path TO ${process.env.DB_SCHEMA}`);

module.exports = pool;