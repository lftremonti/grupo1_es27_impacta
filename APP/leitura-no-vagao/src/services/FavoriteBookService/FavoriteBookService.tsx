import config from "../../config/config";
import * as SecureStorage from "expo-secure-store";
import { FavoriteBook } from "../../types/FavoriteBook";

export async function createFavoriteBookService(favoriteBook: FavoriteBook) {
    try {
        const token = await SecureStorage.getItemAsync('userToken');
        // Define os headers dinamicamente com base no token
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            // Durante o desenvolvimento, use a chave de bypass
            'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
        };

        // Define o corpo da requisição com os dados necessários
        const body = JSON.stringify(favoriteBook);

        const response = await fetch(`${config.BASE_URL}/api/favoriteBook/`, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.log(`Error ao adicionar o livro a sua lista de favoritos : ${config.BASE_URL}`, error);
        throw new Error('Error ao adicionar o livro a sua lista de favoritos');
    }
}