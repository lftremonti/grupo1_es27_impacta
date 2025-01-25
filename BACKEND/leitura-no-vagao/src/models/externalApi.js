const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// URL base da API Google Books
const EXTERNAL_API_GOOGLE_API_BOOK_URL = 'https://www.googleapis.com/books/v1/volumes?q=isbn';

// Lista de chaves de API para fallback
//Criar mais de uma chave para mesma conta 
//tentar utilizar outras contas google e outras chaves
//Acessar o Google Cloud, criar um cahve de API
const API_KEYS = process.env.EXTERNAL_API_GOOGLE_KEY; // Substitua pelas suas chaves de API do Google

// Função para buscar livro por ISBN
const getBookByISBNGoogleBooks = async (isbn) => {
    let response;
    let error;

    // Tenta usar cada chave disponível
    for (const apiKey of API_KEYS) {
        try {
            response = await axios.get(`${EXTERNAL_API_GOOGLE_API_BOOK_URL}:${isbn}&key=${apiKey}`);
            if (response.data && response.data.items) {
                return response.data; // Retorna os dados do livro
            }
        } catch (err) {
            error = err;
            if (err.response && err.response.status === 429) {
                console.warn(`Cota excedida para a chave: ${apiKey}. Tentando próxima chave...`);
            } else {
                console.error('Erro ao buscar livro na API:', err.message);
                throw err; // Lança erro se não for relacionado à cota
            }
        }
    }

    // Lança erro se todas as tentativas falharem
    console.error('Todas as chaves falharam ou cota excedida.');
    throw error;
};

// Função para extrair a editora a partir da página do livro
const getPublisherFromGoogleBooks = async (bookUrl) => {
    try {
        if (!bookUrl || !bookUrl.startsWith("http")) {
            throw new Error("URL inválida fornecida.");
        }

        // Fazendo o request para a página do livro
        const { data } = await axios.get(bookUrl, {
            headers: { 
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36" 
            }
        });

        // Carregando o HTML na Cheerio
        const $ = cheerio.load(data);

        // Procurar pelo link do BiBTeX
        const bibtexLink = $("a").filter((_, el) => $(el).text().includes("BiBTeX")).attr("href");
        if (!bibtexLink) {
            throw new Error("Link para download do BiBTeX não encontrado.");
        }

        // Fazer o download do arquivo BiBTeX
        const bibtexResponse = await axios.get(bibtexLink, { responseType: 'stream' });

        // Criar um arquivo temporário
        const tempFilePath = path.join(__dirname, "temp.bib");
        const writer = fs.createWriteStream(tempFilePath);

        bibtexResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Ler o conteúdo do arquivo BiBTeX
        const bibtexContent = fs.readFileSync(tempFilePath, 'utf8');

        // Apagar o arquivo temporário
        fs.unlinkSync(tempFilePath);

        // Função para extrair o publisher
        const extractPublisher = (bibtex) => {
            const match = bibtex.match(/publisher={(.*?)}/);
            return match ? match[1] : null;
        };

        const publisher = extractPublisher(bibtexContent);

        return {
            publisher
        };
    } catch (error) {
        console.error("Erro:", error.message);
        throw error;
    }
};

//Tentar utilizar outra API


module.exports = { getBookByISBNGoogleBooks, getPublisherFromGoogleBooks };
