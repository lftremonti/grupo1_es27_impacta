import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import users from '../data/users.json';

const COLLECTION_USERS = '@appname:users';
const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora em milissegundos

type User = {
  id: string;
  username: string;
  firstName: string;
  avatar: string;
  email: string;
  token: string;
  tokenExpiration: number; // Adicionamos a expiração do token
};

type AuthContextData = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function signIn(email: string, password: string) {
    try {
      setLoading(true);

      const foundUser = users.find(user => user.email === email && user.password === password);

      if (!foundUser) {
        throw new Error('Dados de acesso inválidos.\n Por favor tente novamente.');
      }

      const userWithToken = {
        ...foundUser,
        tokenExpiration: Date.now() + TOKEN_EXPIRATION_TIME,
      };

      await AsyncStorage.setItem(COLLECTION_USERS, JSON.stringify(userWithToken));
      setUser(userWithToken);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem(COLLECTION_USERS);
    setUser(null);
  }

  async function loadUserStorageData() {
    const storage = await AsyncStorage.getItem(COLLECTION_USERS);

    if (storage) {
      const userLogged = JSON.parse(storage) as User;
      setUser(userLogged);
      checkTokenExpiration(userLogged);
    }
  }

  function checkTokenExpiration(user: User) {
    if (user.tokenExpiration && Date.now() > user.tokenExpiration) {
      signOut();
    }
  }

  useEffect(() => {
    loadUserStorageData();
    const interval = setInterval(() => {
      if (user) {
        checkTokenExpiration(user);
      }
    }, 10000); // Verifica a cada 10 segundos

    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
