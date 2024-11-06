import React, { useEffect, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, Image, ActivityIndicator, TextInput, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import { useAuthSignIn } from '../../hooks/auth';
import { styles } from './styles';
import { useUser } from "@clerk/clerk-expo";
import { signInGoogleService, checkUserExistsService } from '../../services/SignIn/SignInService';
import { saveUserService, updateIdAuthGoogle } from '../../services/SignUp/SignUpService';
import { User } from '../../types/User';
import { DrawerActions } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Book } from '../../types/Book';
import { Category } from '../../types/Category';
import { UserCreate } from '../../types/UserCreate';
import { getAllCategoryService } from '../../services/CategoryService/CategoryService';
import { getAllBookService, getFeaturedBooks, getTopRatedBooks, getRecommendedBooks,getNewArrivals } from '../../services/BookService/BookService';
import { RefreshControl } from 'react-native-gesture-handler';
import LoadingAnimation from '../../components/LoadingAnimation';

type Props = {
  navigation: DrawerNavigationProp<any>;
};

export function Home({ navigation }: Props) {
  const { user } = useUser();
  const { signOutUser } = useAuthSignIn();
  const [loadingScreenHome, setLoadingScreenHome] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const searchInputRef = useRef<TextInput>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [books, setBooks] = useState<Book[]>([]);
  const [featureBooks, setFeatureBooks] = useState<Book[]>([]);
  const [topRatedBooks, setTopRatedBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [newArrivalsBooks, setNewArrivalsBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  const [hasMoreBooks, setHasMoreBooks] = useState(false);
  const [hasMoreFeaturedBooks, setHasMoreFeaturedBooks] = useState(false);
  const [hasMoreTopRatedBooks, setHasMoreTopRatedBooks] = useState(false);
  const [hasMoreRecommendedBooks, setHasMoreRecommendedBooks] = useState(false);
  const [hasMoreNewArrivals, setHasMoreNewArrivals] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Pegando o email com fallback para string vazia caso seja undefined
  const email = user?.emailAddresses?.[0]?.emailAddress || ''; 
  const idAuthGoogle = user?.id || '';

  //Sair
  const handleSignOut = async () => {
    await signOutUser();
  };

  //Abre o Drawer
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  //Buscar categorias
  const fetchCategories = async () => {
    try {
      const categoryData = await getAllCategoryService();
      setCategories(categoryData.data.category);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  //Buscar todos os livros
  const fetchBooks = async (categoryId?: number, loadMore: boolean = false) => {
    try {
      const limit = 5;
      const offset = loadMore ? books.length : 0;
      
      const booksData = await getAllBookService(limit, offset, categoryId);
      const newBooks = booksData?.data?.books || [];
      
      setHasMoreBooks(newBooks.length === limit); // Verifica se há mais livros
      setBooks((prevBooks) => loadMore ? [...prevBooks, ...newBooks] : newBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  //Buscar livros populares
  const fetchFeaturedBooks = async (categoryId?: number, loadMore: boolean = false) => {
    try {
      const limit = 5;
      const offset = loadMore ? featureBooks.length : 0;
      
      const booksData = await getFeaturedBooks(limit, offset, categoryId);
      const newBooks = booksData?.data?.books || [];
      
      setHasMoreFeaturedBooks(newBooks.length === limit); // Verifica se há mais livros
      setFeatureBooks((prevBooks) => loadMore ? [...prevBooks, ...newBooks] : newBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  //Buscar os livros mais bem avaliados
  const fetchTopRatedBooks = async (categoryId?: number, loadMore: boolean = false) => {
    try {
      const limit = 5;
      const offset = loadMore ? topRatedBooks.length : 0;
      
      const booksData = await getTopRatedBooks(limit, offset, categoryId);
      const newBooks = booksData?.data?.books || [];
      
      setHasMoreTopRatedBooks(newBooks.length === limit); // Verifica se há mais livros
      setTopRatedBooks((prevBooks) => loadMore ? [...prevBooks, ...newBooks] : newBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  //Buscar livros recomendados para voce
  const fetchRecommendedBooks = async (categoryId?: number, loadMore: boolean = false) => {
    if (!userData) {
      console.error("User data is null or undefined");
      return;
    }

    try {
      const limit = 5;
      const offset = loadMore ? recommendedBooks.length : 0;
      
      const booksData = await getRecommendedBooks(limit, offset, userData.id, categoryId);
      const newBooks = booksData?.data?.books || [];
      
      setHasMoreRecommendedBooks(newBooks.length === limit); // Verifica se há mais livros
      setRecommendedBooks((prevBooks) => loadMore ? [...prevBooks, ...newBooks] : newBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  //Buscar livros descobertas sa semana
  const fetchNewArrivals = async (categoryId?: number, loadMore: boolean = false) => {
    try {
      const limit = 5;
      const offset = loadMore ? newArrivalsBooks.length : 0;
      
      const booksData = await getNewArrivals(limit, offset, categoryId);
      const newBooks = booksData?.data?.books || [];
      
      setHasMoreNewArrivals(newBooks.length === limit);
      setNewArrivalsBooks((prevBooks) => loadMore ? [...prevBooks, ...newBooks] : newBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    }
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
                name: user?.fullName || '',
                email: email,
                phone: '',
                password: '',
                idAuthGoogle: idAuthGoogle
              };
              await saveUserService(newUser);
            }
          } else {
            throw new Error("Email do usuário não encontrado.");
          }
          await fetchCategories();
          setLoadingScreenHome(false);
        }
      } catch (error) {
        console.error("Error loading user token:", error);
        handleSignOut();
      }
    };

    initialize();
    fetchCategories();
    fetchBooks();
    fetchFeaturedBooks();
    fetchTopRatedBooks();
    fetchRecommendedBooks();
    fetchNewArrivals();
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

  //Filtra os livros de acordo com a categoria selecionada
  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      fetchBooks();
      fetchFeaturedBooks();
      fetchTopRatedBooks();
      fetchRecommendedBooks();
      fetchNewArrivals();
    } else {
      setSelectedCategory(categoryId);
      fetchBooks(parseInt(categoryId));
      fetchFeaturedBooks(parseInt(categoryId));
      fetchTopRatedBooks(parseInt(categoryId));
      fetchRecommendedBooks(parseInt(categoryId));
      fetchNewArrivals(parseInt(categoryId));
    }
  };  

  // Função para carregar mais livros
  const loadMoreBooks = () => {
    fetchBooks(selectedCategory ? parseInt(selectedCategory) : undefined, true);
  };

  // Função para carregar mais livros para Featured
  const loadMoreFeaturedBooks = () => {
    fetchFeaturedBooks(selectedCategory ? parseInt(selectedCategory) : undefined, true);
  };

  // Função para carregar mais livros para Top Rated
  const loadMoreTopRatedBooks = () => {
    fetchTopRatedBooks(selectedCategory ? parseInt(selectedCategory) : undefined, true);
  };

  // Função para carregar mais livros para Recommended
  const loadMoreRecommendedBooks = () => {
    fetchRecommendedBooks(selectedCategory ? parseInt(selectedCategory) : undefined, true);
  };

  // Função para carregar mais livros para New Arrivals
  const loadMoreNewArrivalsBooks = () => {
    fetchNewArrivals(selectedCategory ? parseInt(selectedCategory) : undefined, true);
  };

  // Monta o layout dos livros a ser exibido
  const renderBook = ({ item }: { item: Book }) => {
    // Definindo a fonte da imagem com uma expressão condicional
    const imageSource = item.imagem_url
      ? { uri: item.imagem_url }
      : item.imagem_base64
      ? { uri: `data:image/png;base64,${item.imagem_base64}` }
      : null;
  
    return (
      <TouchableOpacity onPress={() => navigation.navigate('BookDetails', { book: item })}>
        <View style={styles.bookItem}>
          {imageSource && (
            <Image source={imageSource} style={styles.bookCover} />
          )}
          <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">{item.titulo}</Text>
          <Text style={styles.bookAuthor}>{item.autor}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Monta o layout dos livros a ser exibido ao utilizar a busca por nome
  const renderBookSearch = ({ item }: { item: Book }) => {
    // Definindo a fonte da imagem com uma expressão condicional
    const imageSource = item.imagem_url
      ? { uri: item.imagem_url }
      : item.imagem_base64
      ? { uri: `data:image/png;base64,${item.imagem_base64}` }
      : null;
  
    return (
      <TouchableOpacity onPress={() => navigation.navigate('BookDetails', { book: item })}>
        <View style={styles.bookSearchContainer}>
          {imageSource && (
            <Image source={imageSource} style={styles.bookCover} />
          )}
          <View style={styles.bookSearchInfo}>
            <Text style={styles.bookSearchTitle}>{item.titulo}</Text>
            <Text style={styles.bookSearchAuthor}>{item.autor}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Monta o layout das categorias a ser exibido
  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.categoryItem,
        selectedCategory === String(item.ad_categoria_id) ? styles.activeCategory : styles.inactiveCategory,
      ]}
      onPress={() => handleCategoryPress(String(item.ad_categoria_id))}
    >
      <Text
        style={[
          styles.categoryTitle,
          selectedCategory === String(item.ad_categoria_id) ? styles.activeCategoryText : styles.inactiveCategoryText,
        ]}
      >
        {item.nome}
      </Text>
    </TouchableOpacity>
  );

  //Filtrar os livros de acordo com nome passado
  const filterBooks = (query: any) => {
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = featureBooks.filter(book =>
        book.titulo.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks([]);
    }
  };

  //Atualiza a tela refazendo as chamdas em todas as apis
  const onRefresh = async () => {
    setRefreshing(true);
    const refreshDuration = 7000;
    try {
      await fetchCategories();
      await fetchBooks();
      await fetchFeaturedBooks();
      await fetchTopRatedBooks();
      await fetchRecommendedBooks();
      await fetchNewArrivals();
    } catch(error) {
      console.error('Error refreshing data:', error);
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, refreshDuration);
    }
  };

  return (
    <>
      {/* Exibir o indicador de carregamento enquanto refreshing for true */}
      {refreshing ? (
        <LoadingAnimation />
      ) : (
        <ScrollView style={styles.container} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
            <TextInput ref={searchInputRef} placeholder="Pesquisar...." 
              style={styles.searchInput} 
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                filterBooks(text);
              }}
            />
          </TouchableOpacity>

          {searchQuery ? (
            <View>
              <Text style={styles.sectionTitle}>Resultados da Pesquisa:</Text>
              {searchQuery.length && filteredBooks.length ? (
                <FlatList
                  data={filteredBooks}
                  renderItem={renderBookSearch}
                  keyExtractor={(item, index) => `booksearch-${item.ad_livros_id}-${index}`}
                />
              ) : (
                <Text style={styles.headerQuestion}>Desculpe, não encontramos nenhum resultado!</Text>
              )}
            </View>
            ) : (
              <>
                <FlatList
                  data={categories}
                  renderItem={renderCategory}
                  keyExtractor={(item, index) => `category-${item.ad_categoria_id}-${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.booksList}
                />

                <Text style={styles.sectionTitle}>Todos os livros</Text>
                <FlatList
                  data={books}
                  renderItem={renderBook}
                  keyExtractor={(item, index) => `book-${item.ad_livros_id}-${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.booksList}
                  ListFooterComponent={hasMoreBooks ? (
                    <TouchableOpacity onPress={loadMoreBooks} style={styles.loadMoreButton}>
                      <View style={styles.loadMoreContent}>
                        <Ionicons name="chevron-forward" size={50} />
                      </View>
                      <Text style={styles.loadMoreText}>Carregar Mais</Text>
                    </TouchableOpacity>
                  ) : null}
                />

                <Text style={styles.sectionTitle}>Populares</Text>
                <FlatList
                  data={featureBooks}
                  renderItem={renderBook}
                  keyExtractor={(item, index) => `book-${item.ad_livros_id}-${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.booksList}
                  ListFooterComponent={hasMoreFeaturedBooks ? (
                    <TouchableOpacity onPress={loadMoreFeaturedBooks} style={styles.loadMoreButton}>
                      <View style={styles.loadMoreContent}>
                        <Ionicons name="chevron-forward" size={50} />
                      </View>
                      <Text style={styles.loadMoreText}>Carregar Mais</Text>
                    </TouchableOpacity>
                  ) : null}
                />

                <Text style={styles.sectionTitle}>Os livros mais bem avaliados</Text>
                <FlatList
                  data={topRatedBooks}
                  renderItem={renderBook}
                  keyExtractor={(item, index) => `book-${item.ad_livros_id}-${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.booksList}
                  ListFooterComponent={hasMoreTopRatedBooks ? (
                    <TouchableOpacity onPress={loadMoreTopRatedBooks} style={styles.loadMoreButton}>
                      <View style={styles.loadMoreContent}>
                        <Ionicons name="chevron-forward" size={50} />
                      </View>
                      <Text style={styles.loadMoreText}>Carregar Mais</Text>
                    </TouchableOpacity>
                  ) : null}
                />

                {recommendedBooks && recommendedBooks.length > 0 ? (
                  <>
                    <Text style={styles.sectionTitle}>Recomendado para você</Text>
                    <FlatList
                      data={recommendedBooks}
                      renderItem={renderBook}
                      keyExtractor={(item, index) => `book-${item.ad_livros_id}-${index}`}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.booksList}
                      ListFooterComponent={hasMoreRecommendedBooks ? (
                        <TouchableOpacity onPress={loadMoreRecommendedBooks} style={styles.loadMoreButton}>
                          <View style={styles.loadMoreContent}>
                            <Ionicons name="chevron-forward" size={50} />
                          </View>
                          <Text style={styles.loadMoreText}>Carregar Mais</Text>
                        </TouchableOpacity>
                      ) : null}
                    />
                  </>
                ) : (
                  <></>
                )}

                <Text style={styles.sectionTitle}>Descobertas da semana</Text>
                <FlatList
                  data={newArrivalsBooks}
                  renderItem={renderBook}
                  keyExtractor={(item, index) => `book-${item.ad_livros_id}-${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.booksList}
                  ListFooterComponent={hasMoreNewArrivals ? (
                    <TouchableOpacity onPress={loadMoreNewArrivalsBooks} style={styles.loadMoreButton}>
                      <View style={styles.loadMoreContent}>
                        <Ionicons name="chevron-forward" size={50} />
                      </View>
                      <Text style={styles.loadMoreText}>Carregar Mais</Text>
                    </TouchableOpacity>
                  ) : null}
                />
              </>
            )}
        </ScrollView>  
      )}
    </>
  );
}