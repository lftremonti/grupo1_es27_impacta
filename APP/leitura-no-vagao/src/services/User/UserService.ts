import config from "../../config/config";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUserByEmailService(email: string) {
    try {
        const token = await AsyncStorage.getItem('userToken');
        
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
        return result;
    } catch (error) {
        console.log(`Error ao consultar o email do usuario no banco: ${config.BASE_URL}`, error);
        throw new Error('Error ao consultar o email do usuario no banco.');
    }
}