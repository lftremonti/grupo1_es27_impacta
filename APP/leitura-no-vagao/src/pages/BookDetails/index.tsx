import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, Dimensions  } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Provider } from 'react-native-paper';
import { styles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../routes/app.routes';
import { getBookByIdService } from '../../services/BookService/BookService';
import { Book } from '../../types/Book';
import { Comments } from '../../types/Comments';
import { AverageBook } from '../../types/AverageBook';

type BookDetailsProps = {
  route: RouteProp<RootStackParamList, 'BookDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'BookDetails'>;
}; 

export function BookDetails({ route, navigation }: BookDetailsProps) {
  const { book } = route.params;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [bookImage, setBooksImage] = useState<Book[]>([]);
  const [bookReviews, setBooksReviews] = useState<Comments[]>([]);
  const [bookAverage, setBookAverage] = useState<AverageBook>();
  const [currentIndex, setCurrentIndex] = useState(0); // Estado para o índice atual da imagem
  const flatListRef = useRef<FlatList<Book>>(null); // Referência para o FlatList

  const fetchBookById = async () => {
    try {
      const bookData = await getBookByIdService(book.ad_livros_id);
      setBooksImage(bookData.data.bookImage);
      setBooksReviews(bookData.data.reviewsBook);
      setBookAverage(bookData.data.averageBook[0]);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    fetchBookById();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Limpa o estado quando a tela perde o foco
      return () => {
        setBooksImage([]);
        setBooksReviews([]);
        setBookAverage(undefined);
        setCurrentIndex(0); // Limpa o currentIndex
        setIsDescriptionExpanded(false); // Limpa o isDescriptionExpanded
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      // Carrega os dados quando a tela ganha o foco
      fetchBookById();
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: 0, animated: false }); // Rola para a primeira imagem
      }
    }, [book.ad_livros_id])
  );

  // Função para renderizar os comentários
  const renderComment = ({ item }: { item: typeof bookReviews[0] }) => (
    <View style={styles.commentContainer}>
      <Ionicons name="person-circle-outline" size={45} style={styles.userIcon} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>{item.nome}</Text>
        </View>
        <Text style={styles.commentRating}>Avaliação: {'★'.repeat(item.pontuacao)}</Text>
        <Text style={styles.commentText}>{item.comentario}</Text>
        <Text style={styles.commentDate}>Avaliado em {formatDate(item.data_avaliacao)}</Text>
      </View>
    </View>
  );

  // Obtenha a largura da tela
  const { width: screenWidth } = Dimensions.get('window');

  // Renderizar imagem individual
  const renderImage = ({ item }: { item: Book }) => {
    const imageSource = item.imagem_url
      ? { uri: item.imagem_url }
      : item.imagem_base64
      ? { uri: `data:image/png;base64,${item.imagem_base64}` }
      : null;

    return (
      <Image source={imageSource ? imageSource : require('../../assets/ErrorImageBook.png')} style={[styles.bookCover, { width: screenWidth, resizeMode: 'contain' }]} />
    );
  };

  const navigateToComments = () => {
    navigation.navigate('CommentsBook', {
      reviews: bookReviews, // Passando as avaliações como parâmetro
      averageRating: bookAverage, // Passando a média das avaliações
      book: book
    });
  };

  // Função para formatar a data no formato "dd de mês de yyyy"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    const months = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    const month = months[date.getMonth()];
    
    return `${day} de ${month} de ${year}`;
  };

  return (
    <Provider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <Text></Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home' as never)} style={styles.backButton}>
            <Icon name="arrow-back-outline" size={24} color={styles.backArrowColor.color} />
          </TouchableOpacity>

          <View style={{borderBottomWidth: 2, borderBottomColor: '#ccc', paddingBottom: 20,}}>
            <View style={{backgroundColor: '#f0f0f0', borderRadius: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 0,}}>
              {/* FlatList para imagens em carrossel */}
              <FlatList
                data={bookImage}
                renderItem={renderImage}
                keyExtractor={(item, index) => `bookimage-${item.ad_livros_id}-${index}`}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                snapToInterval={screenWidth} // Define a largura para "prender" cada imagem na tela
                showsHorizontalScrollIndicator={false}
                onScrollToIndexFailed={() => {
                  // Em caso de erro, você pode tratar aqui
                }}
                onMomentumScrollEnd={(event) => {
                  const index = Math.floor(event.nativeEvent.contentOffset.x / screenWidth);
                  setCurrentIndex(index); // Atualiza o índice atual
                }}
              />
              <View style={styles.pagination}>
                {bookImage.map((_, index) => (
                  <Text key={index} style={[styles.paginationDot, currentIndex === index ? styles.activeDot : null]}>&bull;</Text>
                ))}
              </View>
              <Text style={styles.bookTitle}>{book.titulo}</Text>
              <Text style={styles.bookAuthor}>{book.autor}</Text>
              {bookAverage && Number(bookAverage.total_avaliacoes) > 0 && (
                <View style={styles.bookRatingContainer}>
                  <Text style={styles.bookRatingStars}>{'★'.repeat(Number(bookAverage.media_avaliacao))}</Text>
                  <Text style={styles.bookRatingAverage}>{Number(bookAverage.media_avaliacao).toFixed(1)}</Text>
                </View>
              )}
            </View>

            <View style={{borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 0, 
        marginBottom: 5}} >
              <Text style={styles.sectionTitle}>Detalhes</Text>
            </View>
            <View style={{backgroundColor: '#f0f0f0',borderRadius: 20, padding: 15}}>
              <Text style={styles.bookDescription} numberOfLines={isDescriptionExpanded ? undefined : 5} ellipsizeMode="tail">{book.descricao.replace(/(\. )/g, '$1\n\n')}</Text>
            </View>
            <TouchableOpacity onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
              <Text style={styles.toggleDescriptionText}>
                {isDescriptionExpanded ? 'Ver menos' : 'Ver mais'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.readButton}>
              <Text style={styles.readButtonText}>Adicionar nos favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.readButton}>
              <Text style={styles.readButtonText}>Quero ler</Text>
            </TouchableOpacity>
          
          </View>

          <View>
            <View style={{borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 0,}} >
              <Text style={styles.sectionTitle}>Avaliações dos usuarios</Text>
            </View>
            {bookReviews && bookReviews.length > 0 ? (
              <FlatList
                data={bookReviews.slice(0, 3)} // Exibe os 3 primeiros comentários
                renderItem={renderComment}
                style={{marginTop: 10, marginBottom: 15}}
                keyExtractor={(item, index) => `bookreviews-${item.ad_avaliacoes_id}-${index}`}
                ListFooterComponent={
                  bookReviews.length > 3 ? (
                    <TouchableOpacity style={styles.loadMoreButton} onPress={navigateToComments}>
                      <Text style={styles.loadMoreText}>Visualizar mais</Text>
                    </TouchableOpacity>
                  ) : null // Retorna null se não houver mais comentários
                }
              />
            ) : (
              <View style={[styles.commentContainer, {padding: 15, marginTop: 10, marginBottom: 40}]}>
                <View style={styles.commentContent}>
                  <Text style={[styles.commentText, {justifyContent: 'center', alignItems:'center', textAlign:'center'}]}>Não ha avaliações de usuarios para esse livro.</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </Provider>
  );
}