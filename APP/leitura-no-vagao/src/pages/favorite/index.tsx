import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { Book } from '../../types/Book';
import { useUser } from '@clerk/clerk-expo';
import { DrawerActions, RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/app.routes';
import { StackNavigationProp } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Lottie from 'lottie-react-native';
import { getFavoriteBookService } from '../../services/BookService/BookService';
import * as SecureStore from 'expo-secure-store';
import { Button } from 'react-native-paper';
import { removeFavoriteBookService } from '../../services/FavoriteBookService/FavoriteBookService';
import { FavoriteBook } from '../../types/FavoriteBook';
import { User } from '@/types/User';

type FavoriteProps = {
    route: RouteProp<RootStackParamList, 'Favorite'>;
    navigation: StackNavigationProp<RootStackParamList, 'Favorite'>;
}; 

export function Favorite({ route, navigation }: FavoriteProps) {
    const { user } = useUser();
    const [books, setBooks] = useState<Book[]>([]);
    const [hasMoreBooks, setHasMoreBooks] = useState(false);
    const [userData, setUserData] = useState<User | null>();

    //getUserId para retornar o ID do usuário
    const getUserId = async (): Promise<number | null> => {
        const storedUserData = await SecureStore.getItemAsync('userData');
        
        if (storedUserData) {
            const parsedData = JSON.parse(storedUserData);
            return parsedData.id;
        }

        console.warn("No user data found in secure storage");
        return null;
    };

    // Função para remover o livro da lista de favoritos
    const removeBookFromFavorites = async (bookId: number) => {
        try {
            const usuarioId = await getUserId();

            if (usuarioId === null) {
                alert("Erro ao recuperar o ID do usuário. Tente novamente.");
                return;
            }
            
            const newFavoriteBook: FavoriteBook = {
                usuarioid: usuarioId,
                livroid: bookId,
            };

            await removeFavoriteBookService(newFavoriteBook);
            setBooks(prevBooks => prevBooks.filter(book => book.ad_livros_id !== bookId));
            console.log('Livro removido dos favoritos');
        } catch (error) {
            console.error('Erro ao remover o livro dos favoritos:', error);
        }
    };

    //Buscar livros recomendados para voce
    const fetchRecommendedBooks = async (loadMore: boolean = false) => {
        const usuarioId = await getUserId();

        if (usuarioId === null) {
            alert("Erro ao recuperar o ID do usuário. Tente novamente.");
            return;
        }

        try {
            const limit = 5;
            const offset = loadMore ? books.length : 0;
            const booksData = await getFavoriteBookService(limit, offset, usuarioId);
            const newBooks = booksData?.data?.books || [];
            
            setHasMoreBooks(newBooks.length === limit); // Verifica se há mais livros
            setBooks((prevBooks) => loadMore ? [...prevBooks, ...newBooks] : newBooks);
        } catch (error) {
            console.error('Error loading books:', error);
        }
    };

    //Abre o Drawer
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    // Monta o layout dos livros a ser exibido
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
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Button mode="contained"  onPress={() => navigation.navigate('BookReservation', { book: item, user: userData! })} style={[styles.button, { marginRight: 8}]}>
                                <Text style={styles.buttonText}>Quero Ler</Text>
                            </Button>
                            <Button mode="contained" onPress={()=>{removeBookFromFavorites(item.ad_livros_id)}} style={styles.button}>
                                <Text style={styles.buttonText}>Remover</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        const loadBooks = async () => {
            await fetchRecommendedBooks();
        };

        const fetchUserData = async () => {
            const storedToken = await SecureStore.getItemAsync('userToken');
            const storedUserData = await SecureStore.getItemAsync('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                setUserData(parsedUserData);
            }
        };
            
        fetchUserData();
        loadBooks();
    }, [user]);

    useFocusEffect(
        React.useCallback(() => {
          // Limpa o estado quando a tela perde o foco
          return () => {
            setBooks([]);
          };
        }, [])
    );
    
    useFocusEffect(
        React.useCallback(() => {
            // Carrega os dados quando a tela ganha o foco
            const loadBooks = async () => {
                await fetchRecommendedBooks();
            };
            loadBooks();
        }, [])
    );

    return(
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)} style={styles.backButton}>
                            <Icon name="arrow-back-outline" size={25} style={styles.backArrowColor} />
                        </TouchableOpacity>
                    </View>
                    <Icon name="list-outline" size={25} style={styles.menuIcon} onPress={openDrawer}/>
                </View>
                <Text style={styles.title}>Sua lista de favoritos</Text>
                {books && books.length > 0 ? (
                    <View style={{marginTop: 10, borderRadius: 50}}>
                        <FlatList
                            data={books}
                            renderItem={renderBookSearch}
                            keyExtractor={(item, index) => `book-${item.ad_livros_id}-${index}`}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.booksList}
                        />
                    </View>
                ) : (
                    <View style={styles.subContainer}>
                        <Lottie
                            source={require('../../assets/AnimationHeart.json')} // ajuste o caminho conforme necessário
                            autoPlay
                            loop
                            style={styles.animation} // Usando o estilo para a animação
                        />
                        <Text style={styles.headerQuestion}>Todos os seus livros salvos serão exibidos aqui.</Text>
                    </View>
                )}
            </View>
        </GestureHandlerRootView>
    );
}