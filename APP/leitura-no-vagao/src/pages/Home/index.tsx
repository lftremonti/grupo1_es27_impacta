import React, { useEffect, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, Button, Image, ActivityIndicator, TextInput, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useAuthSignIn } from '../../hooks/auth';
import { styles } from './styles';
import { useUser } from "@clerk/clerk-expo";
import { signInGoogleService, checkUserExistsService } from '../../services/SignIn/SignInService';
import { saveUserService, updateIdAuthGoogle } from '../../services/SignUp/SignUpService';
import { User } from '../../types/User';
import { DrawerActions } from '@react-navigation/native'; // Importação necessária
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Book } from '../../types/Book';
import { booksData } from '../../data/BookJson';
import { Category } from '../../types/Category';
import { category } from '../../data/CategoryJson';
import { UserCreate } from '../../types/UserCreate';

// Define as propriedades do componente Home
type Props = {
  navigation: DrawerNavigationProp<any>;
};

export function Home({ navigation }: Props) {
  const { user } = useUser();
  const { signOutUser } = useAuthSignIn();
  const [loadingScreenHome, setLoadingScreenHome] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const searchInputRef = useRef<TextInput>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(booksData);

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
      <View style={{ flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 8, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity onPress={() => navigation.navigate('BookDetails', { book: item })}>
      <View style={styles.bookItem}>
        <Image source={{ uri: item.coverImageUrl }} style={styles.bookCover} />
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.categoryItem,
        selectedCategory === item.id ? styles.activeCategory : styles.inactiveCategory,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryTitle,
          selectedCategory === item.id ? styles.activeCategoryText : styles.inactiveCategoryText,
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerGreeting}>Olá!</Text>
        </View>
        <Ionicons name="person-circle-outline" size={45} style={styles.menuIcon} onPress={openDrawer}/>
      </View>

      <Text style={styles.headerQuestion}>O que você quer ler hoje?</Text>

      <TouchableOpacity
        style={styles.searchContainer}
        activeOpacity={1}
        onPress={() => searchInputRef.current?.focus()}
      >
        <Ionicons name="search" size={20} style={styles.searchIcon} />
        <TextInput ref={searchInputRef} placeholder="Pesquisar...." style={styles.searchInput} />
      </TouchableOpacity>

      <FlatList
        data={category}
        renderItem={renderCategory}
        keyExtractor={(item, index) => `category-${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
      />

      <Text style={styles.sectionTitle}>Destaques</Text>
      <FlatList
        data={filteredBooks}
        renderItem={renderItem}
        keyExtractor={(item, index) => `book-${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
      />

      <Text style={styles.sectionTitle}>Os livros mais bem avaliados</Text>
      <FlatList
        data={filteredBooks}
        renderItem={renderItem}
        keyExtractor={(item, index) => `book-${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
      />

      <Text style={styles.sectionTitle}>Recomendado para você</Text>
      <FlatList
        data={filteredBooks}
        renderItem={renderItem}
        keyExtractor={(item, index) => `book-${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
      />

      <Text style={styles.sectionTitle}>Descobertas da semana</Text>
      <FlatList
        data={filteredBooks}
        renderItem={renderItem}
        keyExtractor={(item, index) => `book-${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
      />
    </ScrollView>
  );
}
