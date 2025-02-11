import { DonateBookCreate } from "@/types/DonateBookCreate";
import config from "../../config/config";
import * as SecureStorage from "expo-secure-store";

// Criar o registro da doação
export async function donateBook(donateBook: DonateBookCreate) {
  try {
    const token = await SecureStorage.getItemAsync('userToken');
    
    // Define os headers dinamicamente com base no token
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      // Durante o desenvolvimento, use a chave de bypass
      'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
    };

    const response = await fetch(`${config.BASE_URL}/api/donate/donateBook`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(donateBook), // Envia os dados do usuário
    });

    if (!response.ok) {
      console.error(`Error: ${response.statusText}`)
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result; // Retorna a resposta do servidor
  } catch (error) {
    console.error(`Error ao salvar doação no banco: ${config.BASE_URL}`, error);
    throw new Error('Error ao salvar o livro no banco.');
  }
}