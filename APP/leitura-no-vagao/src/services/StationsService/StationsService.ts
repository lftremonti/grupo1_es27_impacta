import config from "../../config/config";
import * as SecureStorage from "expo-secure-store";

//Todos os pontos de doação
export async function getAllDonationPoint() {
    try {
        const token = await SecureStorage.getItemAsync('userToken');
        
        const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
        };

        // Adiciona o filtro de categoria se estiver selecionado
        const url = `${config.BASE_URL}/api/donationPoint/`;

        const response = await fetch(url, { method: 'GET', headers });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.log(`Error ao buscar os pontos de doação de livros no banco: ${config.BASE_URL}`, error);
        throw new Error('Error ao buscar os pontos de doação de livros no banco de dados');
    }
}

//Pontos de doação de livro por id
export async function getDonationPointByBookId(id: number) {
    try {
        const token = await SecureStorage.getItemAsync('userToken');
        
        const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
        };

        // Adiciona o filtro de categoria se estiver selecionado
        const url = `${config.BASE_URL}/api/donationPoint/getDonationPointByIdBook/${id}`;

        const response = await fetch(url, { method: 'GET', headers });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.log(`Error ao buscar os pontos de doação de livros no banco: ${config.BASE_URL}`, error);
        throw new Error('Error ao buscar os pontos de doação de livros no banco de dados');
    }
}