import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, Button, Image, ActivityIndicator } from 'react-native';
import { useAuthSignIn } from '../../hooks/auth';
import { styles } from './styles';
import { useUser } from "@clerk/clerk-expo";
import { signInGoogleService, checkUserExistsService } from '../../services/SignIn/SignInService';
import { saveUserService } from '../../services/SignUp/SignUpService'

// Define a interface para o usuário
interface User {
  name: string;
  email: string;
  phone?: string; // Telefone é opcional
  password?: string; // Senha é opcional, pois pode não ser usada para login com Google
  idAuthGoogle?: string; // ID de autenticação do Google
}

export function Home() {
  const { user } = useUser();
  const { signOutUser } = useAuthSignIn();
  const [loadingScreenHome, setLoadingScreenHome] = useState(true); // Estado de loading da tela
  const [userData, setUserData] = useState(null);

  // Pegando o email com fallback para string vazia caso seja undefined
  const email = user?.emailAddresses?.[0]?.emailAddress || ''; 
  const idAuthGoogle = user?.id || '';

  const handleSignOut = async () => {
    await signOutUser();
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        // Tentar pegar o token e os dados do usuário do SecureStore
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUserData = await SecureStore.getItemAsync('userData');

        console.log("storedUserData: ", storedUserData);
        console.log("storedToken:", storedToken);

        if (storedToken && storedUserData) {
          // Se houver token e dados do usuário, carregar os dados
          setUserData(JSON.parse(storedUserData));
          setLoadingScreenHome(false);
        } else {
          // Verifica se o email está disponível antes de chamar a API
          console.log("Entrou no else");
          if (email) {
            console.log("email", email);
            // Se não houver token, checar se o usuário existe na API
            const userExists = await checkUserExistsService(email);
            console.log("userExists:", userExists);
            if (userExists) {
              console.log("Entrou no if que dizer que o email existe")
              // Se o usuário existir, efetuar login e obter token
              const getUserE = await signInGoogleService(email, idAuthGoogle);
              console.log("getUserE: ", getUserE)
              await SecureStore.setItemAsync('userToken', getUserE.token);
              await SecureStore.setItemAsync('userData', JSON.stringify(getUserE.user));
              setUserData(getUserE.user);
            } else {
              // Se o usuário não existir, construa o objeto User para salvar
              const newUser: User = {
                name: user?.fullName || '', // Nome do usuário
                email: email,
                phone: '', // Telefone pode ser vazio
                password: '', // Senha será um token se estiver logando pelo Google
                idAuthGoogle: idAuthGoogle
              };
              await saveUserService(newUser);
            }
          } else {
            throw new Error("Email do usuário não encontrado.");
          }
          setLoadingScreenHome(false);
        }
      } catch (error) {
        console.error("Error loading user token:", error);
        handleSignOut();
      }
    };

    initialize();
  }, [user]);

  if (loadingScreenHome) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem-vindo à tela Home</Text>
      <Image source={{ uri: user?.imageUrl }} style={styles.image} />
      <Text style={styles.text}>Full Name: {user?.fullName}</Text>
      <Text style={styles.text}>Email: {email}</Text>
      <Button title="Sair" onPress={handleSignOut} />
    </View>
  );
}
