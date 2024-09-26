import * as SecureStore from 'expo-secure-store'; // Usando SecureStore

/**
 * Função para decodificar a parte Base64 de um JWT.
 * @param base64Url A parte do token a ser decodificada
 * @returns O objeto decodificado
 */
function parseJwt(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

/**
 * Verifica a validade do token armazenado no SecureStore.
 * @returns {Promise<boolean>} Retorna true se o token for válido e não expirou, ou false se estiver ausente ou expirado.
 */
export async function checkTokenValidity(): Promise<boolean> {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    console.log("Token: ", token);

    if (!token) {
      return false; // Retorna false se não houver token armazenado
    }

    // Decodifica o token JWT para extrair a data de expiração
    const decodedToken = parseJwt(token);
    const currentTime = Date.now() / 1000;

    // Verifica se o token ainda é válido com base na data de expiração
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.log('Error ao checar o token', error);
    return false; // Retorna false se houver algum erro ao verificar o token
  }
}
