import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Button, Image, ActivityIndicator } from 'react-native';
import { useAuthSignIn } from '../../hooks/auth';
import { styles } from './styles';
import { useUser } from "@clerk/clerk-expo";
import { signInGoogleService, checkUserExistsService } from '../../services/SignIn/SignInService';

export function Home() {
  const { user } = useUser();
  const { signOutUser } = useAuthSignIn();
  const [loadingScreenHome, setLoadingScreenHome] = useState(true); // Estado de loading da tela

  // Pegando o email com fallback para string vazia caso seja undefined
  const email = user?.emailAddresses?.[0]?.emailAddress || ''; 
  const idAuthGoogole = user?.id || '';

  const handleSignOut = async () => {
    await signOutUser();
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        // Tentar pegar o token da AsyncStorage
        const storedToken = await AsyncStorage.getItem('userToken');

        if (storedToken) {
          // Se houver token, salvar no estado e parar o loading
          setLoadingScreenHome(false);
        } else {
          // Verifica se o email está disponível antes de chamar a API
          if (email) {
            // Se não houver token, checar se o usuário existe na API
            const userExists = await checkUserExistsService(email);

            if (userExists) {
              // Se o usuário existir, efetuar login e obter token
              const getUserE = await signInGoogleService(email,idAuthGoogole);

              await AsyncStorage.setItem('userToken', getUserE.token);
            } else {
              // Se o usuário não existir, cadastrá-lo
              //Ajustar
              //const signUpToken = await signUpService(user);
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
      <Text style={styles.text}>First Name: {user?.firstName}</Text>
      <Text style={styles.text}>Email: {email}</Text>
      <Button title="Sair" onPress={handleSignOut} />
    </View>
  );
}
