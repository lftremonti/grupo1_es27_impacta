import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types/User';
import { checkTokenValidity } from '../utils/checkTokenValidity';
import { useAuth } from "@clerk/clerk-expo";

type AuthContextData = {
  user: User | null;
  signIn: (result: any) => Promise<User>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { signOut } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const loadUserData = async () => {
      const isTokenValid = await checkTokenValidity();

      if (isTokenValid) {
        const storedUser = await SecureStore.getItemAsync('userData');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else {
        await SecureStore.deleteItemAsync('userData');
        await SecureStore.deleteItemAsync('userToken');
        setUser(null);
      }
    };

    loadUserData();

    // Verifica a validade do token a cada 5 minutos (300000 ms)
    interval = setInterval(async () => {
      const isTokenValid = await checkTokenValidity();
      if (!isTokenValid) {
        await SecureStore.deleteItemAsync('userData');
        await SecureStore.deleteItemAsync('userToken');
        setUser(null);
      }
    }, 300000); // a cada 5 minutos

    return () => clearInterval(interval); 
  }, []);

  const signOutUser = async () => {
    await SecureStore.deleteItemAsync('userData');
    await SecureStore.deleteItemAsync('userToken');
    setUser(null);
    signOut();
  };

  const signIn = async (result: any) => {
    const userData: User = {
      id: result.data.user.ad_usuario_id,
      nome: result.data.user.nome,
      email: result.data.user.email,
      ativo: result.data.user.ativo,
      telefone: result.data.user.telefone,
      criado: result.data.user.criado,
      imagemId: result.data.user.imagemid,
      enderecoId: result.data.user.enderecoid,
      roleid: result.data.user.role.roleid,
      role: result.data.user.role.role,
      token: result.data.token
    };

    setUser(userData);

    return userData;
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthSignIn() {
  return useContext(AuthContext);
}
