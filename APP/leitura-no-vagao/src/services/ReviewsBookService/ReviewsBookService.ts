import config from "../../config/config";
import * as SecureStorage from "expo-secure-store";
import { ReviewsBook } from '../../types/ReviewsBook';

export async function createReviewsBookService(review: ReviewsBook) {
    try {
        const token = await SecureStorage.getItemAsync('userToken');
        // Define os headers dinamicamente com base no token
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            // Durante o desenvolvimento, use a chave de bypass
            'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
        };

        // Define o corpo da requisição com os dados necessários
        const body = JSON.stringify(review);

        const response = await fetch(`${config.BASE_URL}/api/reviews/`, {
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
        console.log(`Error ao cadastrar a avaliação no banco: ${config.BASE_URL}`, error);
        throw new Error('Error ao cadastrar a avaliação no banco de dados');
    }
}

// Busca as avaliações do livro por id
export async function getReviewsBookByIdService(id: number) {
    try {
      const token = await SecureStorage.getItemAsync('userToken');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
      };
  
      const url = `${config.BASE_URL}/api/reviews/book/${id}`;
  
      const response = await fetch(url, { method: 'GET', headers });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.log(`Error ao buscar as avaliações no banco: ${config.BASE_URL}`, error);
      throw new Error('Error ao buscar as avaliações no banco de dados');
    }
}