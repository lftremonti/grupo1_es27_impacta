import axios from 'axios';

export const getBookInfo = async (isbn: string) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    if (response.status === 200) {
      const data = response.data;
      if (data.items && data.items.length > 0) {
        const bookInfo = data.items[0].volumeInfo;
        return {
          title: bookInfo.title || 'N/A',
          authors: bookInfo.authors || ['N/A'],
          publisher: bookInfo.publisher || 'N/A',
          description: bookInfo.description || 'N/A'
        };
      }
    }
  } catch (error) {
    console.error('Erro ao obter informações do livro:', error);
  }
  return null;
};