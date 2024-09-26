import config from "../../config/config";
import * as SecureStorage from "expo-secure-store";

export async function signInService(email: string, senha: string) {
    try {
        const response = await fetch(`${config.BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.log(`Error ao realizar o login: ${config.BASE_URL} `, error);
        throw new Error('Error ao realizar o login.');
    }
}

export async function checkUserExistsService(email: string) {
    try {
        const token = await SecureStorage.getItemAsync('userToken');

        const response = await fetch(`${config.BASE_URL}/api/users/checkemail/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
            },
        });

        const result = await response.json();
        return result.exists; // Retorna true ou false
    } catch (error) {
        console.log(`Error ao verificar usuário: ${config.BASE_URL}`, error);
        throw new Error('Error ao verificar usuário.');
    }
}

export async function signInGoogleService(email: string, idAuthGoogle: string) {
    try {
        // O body da requisição será um objeto com os dados necessários
        const body = {
            email: email,
            idAuthGoogle: idAuthGoogle
        };

        const response = await fetch(`${config.BASE_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body), // Enviando os dados como JSON
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