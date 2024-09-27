import config from "../../config/config";

// Define a interface para o usuário
interface User {
  name: string;
  email: string;
  phone?: string; // Telefone é opcional
  password?: string; // Senha é opcional, pois pode não ser usada para login com Google
  idAuthGoogle?: string; // ID de autenticação do Google
}

// Função para gerar um token fictício
const generateToken = () => {
  // Aqui você pode implementar uma lógica real de geração de token, por exemplo, usando uma biblioteca de geração de UUID
  return "tokenGeradoPeloGoogle"; // Exemplo de token gerado
};

// Serviço para salvar o usuário
export async function saveUserService(user: User) {
  try {

    // Define os headers dinamicamente com base no token
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Prepara os dados do usuário para envio
    const requestBody = {
      nome: user.name,
      email: user.email,
      telefone: user.phone || '', // Se o telefone não for informado, salva como uma string vazia
      senha: user.idAuthGoogle ? generateToken() : user.password, // Salva null para a senha se logou com Google
      idAuthGoogle: user.idAuthGoogle || null, // Salva o idAuthGoogle se fornecido
    };

    const response = await fetch(`${config.BASE_URL}/api/users/create`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody), // Envia os dados do usuário
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result; // Retorna a resposta do servidor
  } catch (error) {
    console.log(`Error ao salvar o usuário no banco: ${config.BASE_URL}`, error);
    throw new Error('Error ao salvar o usuário no banco.');
  }
}


export async function updateIdAuthGoogle(idAuthGoogle: string, email: string){
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.TOKEN_URL}`,
    };

    const requestBody = {
      idAuthGoogle: idAuthGoogle,
      email: email
    };

    const response = await fetch(`${config.BASE_URL}/api/users/updateGoogleId`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(requestBody), // Envia os dados do usuário
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result; // Retorna a resposta do servidor
  } catch (error) {
    console.log(`Error ao salvar o usuário no banco: ${config.BASE_URL}`, error);
    throw new Error('Error ao salvar o usuário no banco.');
  }
}