import { BookWithCategory } from "@/types/BookWithCategory";
import config from "../../config/config";
import * as SecureStorage from "expo-secure-store";

export async function getAllCategoryService() {
    try {
        const token = await SecureStorage.getItemAsync('userToken');
        // Define os headers dinamicamente com base no token
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            // Durante o desenvolvimento, use a chave de bypass
            'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
        };

        const response = await fetch(`${config.BASE_URL}/api/categoryBooks/getActiveCategoriesWithBooks`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.log(`Error ao buscar as categorias no banco: ${config.BASE_URL}`, error);
        throw new Error('Error ao buscar as categorias no banco de dados');
    }
}

export async function getAllCategoryCreateBookService() {
    try {
        const token = await SecureStorage.getItemAsync('userToken');
        // Define os headers dinamicamente com base no token
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            // Durante o desenvolvimento, use a chave de bypass
            'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
        };

        const response = await fetch(`${config.BASE_URL}/api/categoryBooks/`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.log(`Error ao buscar as categorias no banco: ${config.BASE_URL}`, error);
        throw new Error('Error ao buscar as categorias no banco de dados');
    }
}

export async function linkBookWithCategory(linkPayload: BookWithCategory) {
    try {
        const token = await SecureStorage.getItemAsync('userToken');
        
        // Define os headers dinamicamente com base no token
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          // Durante o desenvolvimento, use a chave de bypass
          'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
        };
    
        const response = await fetch(`${config.BASE_URL}/api/categoryBooks/linkBookWithCategory`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(linkPayload),
        });
    
        if (!response.ok) {
          console.error(`Error: ${response.statusText}`)
          throw new Error(`Error: ${response.statusText}`);
        }
    
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error ao vincular o livro no banco com sua categoria: ${config.BASE_URL}`, error);
        throw new Error('Error ao salvar o livro no banco.');
    }
}