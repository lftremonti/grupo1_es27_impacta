import config from "../../config/config";
import * as SecureStorage from "expo-secure-store";

export async function getUserByEmailService(email: string) {
    try {
        const token = await SecureStorage.getItemAsync('userToken');
        
        // Define os headers dinamicamente com base no token
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            // Durante o desenvolvimento, use a chave de bypass
            'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
        };

        const response = await fetch(`${config.BASE_URL}/api/users/email/${email}`, {
            method: 'GET',
            headers: headers, // Usa os headers definidos dinamicamente
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("result", result)
        return result;
    } catch (error) {
        console.log(`Error ao consultar o email do usuario no banco: ${config.BASE_URL}`, error);
        throw new Error('Error ao consultar o email do usuario no banco.');
    }
}