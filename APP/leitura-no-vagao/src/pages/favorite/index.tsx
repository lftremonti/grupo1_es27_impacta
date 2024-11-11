import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { Book } from '../../types/Book';
import { useUser } from '@clerk/clerk-expo';
import { DrawerActions, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/app.routes';
import { StackNavigationProp } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Lottie from 'lottie-react-native';
import { getFavoriteBookService } from '../../services/BookService/BookService';

type FavoriteProps = {
    route: RouteProp<RootStackParamList, 'Favorite'>;
    navigation: StackNavigationProp<RootStackParamList, 'Favorite'>;
}; 

export function Favorite({ route, navigation }: FavoriteProps) {
    const { user } = useUser();
    const [books, setBooks] = useState<Book[]>([]);
    const [hasMoreBooks, setHasMoreBooks] = useState(false);

    //Buscar livros recomendados para voce
    const fetchRecommendedBooks = async (loadMore: boolean = false) => {
        if (!user) {
            console.error("User data is null or undefined");
            return;
        }

        try {
            const limit = 5;
            const offset = loadMore ? books.length : 0;
            
            const booksData = await getFavoriteBookService(limit, offset, parseInt(user.id));
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
                </View>
                </View>
            </TouchableOpacity>
        );
    };


    useEffect(() => {
        fetchRecommendedBooks();
    }, [user]);

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
                {books.length ? (
                    <FlatList
                        data={books}
                        renderItem={renderBookSearch}
                        keyExtractor={(item, index) => `book-${item.ad_livros_id}-${index}`}
                    />
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