import * as SecureStore from 'expo-secure-store';

/**
 * Função para decodificar o JWT sem usar bibliotecas externas.
 * @param token O token JWT a ser decodificado.
 * @returns O payload decodificado (parte do meio do JWT).
 */
function decodeToken(token) {
  const base64Url = token.split('.')[1]; // Pega a parte do payload do JWT
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

/**
 * Verifica a validade do token armazenado no SecureStore.
 * @returns {Promise<boolean>} Retorna true se o token for válido e não expirou, ou false se estiver ausente ou expirado.
 */
export async function checkTokenValidity() {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
      return false; // Retorna false se não houver token armazenado
    }

    // Decodifica o token JWT manualmente
    const decodedToken = decodeToken(token);
    const currentTime = Date.now() / 1000;

    // Verifica se o token ainda é válido com base na data de expiração
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.log('Erro ao checar o token', error);
    return false; // Retorna false se houver algum erro ao verificar o token
  }
}