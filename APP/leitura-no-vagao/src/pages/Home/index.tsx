import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, Button, Image, ActivityIndicator } from 'react-native';
import { useAuthSignIn } from '../../hooks/auth';
import { styles } from './styles';
import { useUser } from "@clerk/clerk-expo";
import { signInGoogleService, checkUserExistsService } from '../../services/SignIn/SignInService';
import { saveUserService, updateIdAuthGoogle } from '../../services/SignUp/SignUpService';
import { User } from '../../types/User';
import { DrawerActions } from '@react-navigation/native'; // Importação necessária
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Define a interface para o usuário
interface UserCreate {
  name: string;
  email: string;
  phone?: string; // Telefone é opcional
  password?: string; // Senha é opcional, pois pode não ser usada para login com Google
  idAuthGoogle?: string; // ID de autenticação do Google
}

// Define as propriedades do componente Home
type Props = {
  navigation: DrawerNavigationProp<any>; // Defina o tipo correto para a navegação
};

interface Book {
  id: string;
  title: string;
  author: string;
  coverImageUrl: string;
}

const booksData: Book[] = [
  {
    id: '1',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    coverImageUrl: 'https://example.com/catcher.jpg', // Use URLs reais
  },
  {
    id: '2',
    title: 'Someone Like You',
    author: 'Roald Dahl',
    coverImageUrl: 'https://example.com/someone.jpg',
  },
  {
    id: '3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverImageUrl: 'https://example.com/gatsby.jpg',
  },
];

export function Home({ navigation }: Props) {
  const { user } = useUser();
  const { signOutUser } = useAuthSignIn();
  const [loadingScreenHome, setLoadingScreenHome] = useState(true); // Estado de loading da tela
  const [userData, setUserData] = useState<User | null>(null); // Define o tipo correto para o estado userData

  // Pegando o email com fallback para string vazia caso seja undefined
  const email = user?.emailAddresses?.[0]?.emailAddress || ''; 
  const idAuthGoogle = user?.id || '';

  const handleSignOut = async () => {
    await signOutUser();
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer()); // Função para abrir o Drawer
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        // Tentar pegar o token e os dados do usuário do SecureStore
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUserData = await SecureStore.getItemAsync('userData');

        if (storedUserData) {
          // Se houver token e dados do usuário, carregar os dados
          setUserData(JSON.parse(storedUserData));
          setLoadingScreenHome(false);
        } else {
          // Verifica se o email está disponível antes de chamar a API
          if (email) {
            console.log("email", email);
            // Se não houver token, checar se o usuário existe na API
            const userExists = await checkUserExistsService(email);
            if (userExists.exists) {
              if(userExists.user.idauthgoogle === null){
                await updateIdAuthGoogle(idAuthGoogle, email)
              }
              // Se o usuário existir, efetuar login e obter token
              const getUserE = await signInGoogleService(email, idAuthGoogle);
              await SecureStore.setItemAsync('userToken', getUserE.data.token);
              await SecureStore.setItemAsync('userData', JSON.stringify(getUserE.data.user));
              setUserData(getUserE.data.user);
            } else {
              // Se o usuário não existir, construa o objeto User para salvar
              const newUser: UserCreate = {
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
      <Ionicons name="menu" size={30} onPress={openDrawer} />
      <Text style={styles.welcomeText}>Bem-vindo à tela Home</Text>
      <Image source={{ uri: user?.imageUrl }} style={styles.image} />
      <Text style={styles.text}>Full Name: {userData?.nome}</Text>
      <Text style={styles.text}>Email: {userData?.email}</Text>
      <Button title="Sair" onPress={handleSignOut} />
    </View>
  );
}
