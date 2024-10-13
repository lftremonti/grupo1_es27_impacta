import config from "../../config/config";

export async function sendResetCode(email: string) {
    try {
        const response = await fetch(`${config.BASE_URL}/api/auth/send-reset-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.log(`Error ao enviar o codigo de autenticação para o usuário: ${config.BASE_URL}`, error);
        throw new Error('Error ao verificar usuário.');
    }
}

export async function verifySendCode(userid: string, code: string) {
    try {
        const response = await fetch(`${config.BASE_URL}/api/auth/verify-reset-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid, code }),
        });

        const result = await response.json();
        return result; 
    } catch (error) {
        console.log(`Error ao verificar o codigo de autenticação: ${config.BASE_URL}`, error);
        throw new Error('Error ao verificar o codigo de autenticação.');
    }
}

export async function resetPassword(userid: string, code: string, newPassword: string) {
    try {
        const response = await fetch(`${config.BASE_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid, code, newPassword }),
        });

        const result = await response.json();
        return result; 
    } catch (error) {
        console.log(`Error ao verificar o codigo de autenticação: ${config.BASE_URL}`, error);
        throw new Error('Error ao verificar o codigo de autenticação.');
    }
}