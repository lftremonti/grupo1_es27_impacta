import config from "../../config/config";

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