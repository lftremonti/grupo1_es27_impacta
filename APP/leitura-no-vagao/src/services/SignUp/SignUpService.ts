import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  username: string;
  firstName: string;
  avatar: string;
  email: string;
  password: string;
  token: string;
};

const USERS_KEY = '@users';

async function getUsers(): Promise<User[]> {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    throw new Error('Não foi possível obter os usuários');
  }
}

async function saveUsers(users: User[]): Promise<void> {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
    throw new Error('Não foi possível salvar os usuários');
  }
}

export async function addUser(newUser: User): Promise<void> {
  try {
    const users = await getUsers();

    // Gerar novo ID
    const nextId = (users.length > 0 ? Math.max(...users.map(user => parseInt(user.id))) : 0) + 1;

    // Adiciona o novo usuário com o ID gerado
    users.push({ ...newUser, id: nextId.toString() });
    await saveUsers(users);
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    throw new Error('Não foi possível adicionar o usuário');
  }
}
