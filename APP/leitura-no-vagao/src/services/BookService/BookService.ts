import { Book } from "@/types/Book";
import config from "../../config/config";
import * as SecureStorage from "expo-secure-store";
import { BookCreate } from "@/types/BookCreate";

//Todos os livros
export async function getAllBookService(limit: number, offset: number, categoryId?: number) {
  try {
    const token = await SecureStorage.getItemAsync('userToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
    };

    // Adiciona o filtro de categoria se estiver selecionado
    const url = `${config.BASE_URL}/api/books/?limit=${limit}&offset=${offset}${
      categoryId ? `&categoryId=${categoryId}` : ''
    }`;

    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.log(`Error ao buscar os livros no banco: ${config.BASE_URL}`, error);
    throw new Error('Error ao buscar os livros no banco de dados');
  }
}

//Todos os livros sem os limites
export async function getAllBookAllService() {
  try {
    const token = await SecureStorage.getItemAsync('userToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
    };

    // Adiciona o filtro de categoria se estiver selecionado
    const url = `${config.BASE_URL}/api/books/getAllBookAll`;

    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.log(`Error ao buscar os livros no banco: ${config.BASE_URL}`, error);
    throw new Error('Error ao buscar os livros no banco de dados');
  }
}

// Buscar livro por id
export async function getBookByIdService(id: number) {
  try {
    const token = await SecureStorage.getItemAsync('userToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
    };

    const url = `${config.BASE_URL}/api/books/${id}`;

    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.log(`Error ao buscar os livros no banco: ${config.BASE_URL}`, error);
    throw new Error('Error ao buscar os livros no banco de dados');
  }
}

// Buscar livro pelo ISBN
export async function getBookByISBN(isbn: string) {
  try {
    const token = await SecureStorage.getItemAsync('userToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
    };

    const url = `${config.BASE_URL}/api/books/isbnCreate/${isbn}`;

    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.log(`Error ao buscar os livros no banco: ${config.BASE_URL}`, error);
    throw new Error('Error ao buscar os livros no banco de dados');
  }
}

// Destaques
export async function getFeaturedBooks(limit: number, offset: number, categoryId?: number) {
  try {
    const token = await SecureStorage.getItemAsync('userToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
    };

    // Condicional para incluir o categoryId na URL se ele existir
    let url = `${config.BASE_URL}/api/books/featured?limit=${limit}&offset=${offset}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }

    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error ao buscar os livros no banco: ${config.BASE_URL}`, error);
    throw new Error('Error ao buscar os livros no banco de dados');
  }
}

// Livros mais bem avaliados
export async function getTopRatedBooks(limit: number, offset: number, categoryId?: number) {
  try {
    const token = await SecureStorage.getItemAsync('userToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
    };

    // Condicional para incluir o categoryId na URL se ele existir
    let url = `${config.BASE_URL}/api/books/top-rated?limit=${limit}&offset=${offset}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }

    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error ao buscar os livros no banco: ${config.BASE_URL}`, error);
    throw new Error('Error ao buscar os livros no banco de dados');
  }
}

// Recomendado para você
export async function getRecommendedBooks(limit: number, offset: number, userId: number, categoryId?: number) {
  try {
    const token = await SecureStorage.getItemAsync('userToken');
   
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
    };

    // Condicional para incluir o categoryId na URL se ele existir
    let url = `${config.BASE_URL}/api/books/recommended/${userId}?limit=${limit}&offset=${offset}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error ao buscar os livros no banco metodo getRecommendedBooks: ${config.BASE_URL}`, error);
    throw new Error('Error ao buscar os livros no banco de dados');
  }
}

// Descobertas da semana
export async function getNewArrivals(limit: number, offset: number, categoryId?: number) {
  try {
    const token = await SecureStorage.getItemAsync('userToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
    };

    // Condicional para incluir o categoryId na URL se ele existir
    let url = `${config.BASE_URL}/api/books/new-arrivals?limit=${limit}&offset=${offset}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }

    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error ao buscar os livros no banco: ${config.BASE_URL}`, error);
    throw new Error('Error ao buscar os livros no banco de dados');
  }
}

//Busca Livros adicionados como favoritos pelo usuario
export async function getFavoriteBookService(limit: number, offset: number, id: number) {
  try {
    const token = await SecureStorage.getItemAsync('userToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
    };

    let url = `${config.BASE_URL}/api/books/favoriteBooks/${id}?limit=${limit}&offset=${offset}`;
    
    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Apenas uma chamada para response.json()
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(`Error ao buscar os livros favoritos no banco: ${config.BASE_URL}`, error);
    throw new Error('Error ao buscar os livros favoritos no banco de dados');
  }
}

// Criar o livro
export async function saveBook(book: BookCreate) {
  try {
    const token = await SecureStorage.getItemAsync('userToken');
    
    // Define os headers dinamicamente com base no token
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token || process.env.BYPASS_TOKEN_KEY}`,
    };

    const response = await fetch(`${config.BASE_URL}/api/books/create`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(book), // Envia os dados do usuário
    });
    
    if (!response.ok) {
      console.error(`Error: ${response.statusText}`)
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error ao salvar o livro no banco: ${config.BASE_URL}`, error);
    throw new Error('Error ao salvar o livro no banco.');
  }
}