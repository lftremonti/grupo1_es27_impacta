import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, Dimensions, Modal, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Provider, Title } from 'react-native-paper';
import { styles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../routes/app.routes';
import { getBookByIdService } from '../../services/BookService/BookService';
import { Book } from '../../types/Book';
import { Comments } from '../../types/Comments';
import { AverageBook } from '../../types/AverageBook';
import { createReviewsBookService, getReviewsBookByIdService } from '../../services/ReviewsBookService/ReviewsBookService';
import { ActivityIndicator, Provider as PaperProvider } from 'react-native-paper';
import CustomDialog from '../../components/CustomDialog';
import { ReviewsBook } from '../../types/ReviewsBook';
import * as SecureStore from 'expo-secure-store';
import LottieView from 'lottie-react-native';
import { FavoriteBook } from '../../types/FavoriteBook';
import { createFavoriteBookService } from '../../services/FavoriteBookService/FavoriteBookService';
import { User } from '../../types/User'; // Importe a interface User

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
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isBookFavoriteModalVisible, setIsBookFavoriteModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnimationVisible, setAnimationVisible] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  const [errors, setErrors] = useState({ commentText: false });

  const [visible, setVisible] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [dialogMessage, setDialogMessage] = useState<string>('');
  const [dialogType, setDialogType] = useState<'alert' | 'warning' | 'success' | 'fail'>('alert');

  const showDialog = (title: string, message: string, type: 'alert' | 'warning' | 'success' | 'fail') => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogType(type);
    setVisible(true);
  };

  // Função para buscar as avaliações do livro pelo ID
  const fetchBookReviews = async (bookId: number) => {
    try {
      const response = await getReviewsBookByIdService(bookId);
        if (response.status === 200) {
          // Atualizar o estado com as avaliações recebidas
          setBooksReviews(response.data.reviews);
        }
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
    }
  };

  const hideDialog = () => {
    setVisible(false);
    if (dialogType === 'success') {
      //Fechar o modal
      closeCommentModal();
      // Chamar a função para buscar as avaliações do livro
      fetchBookReviews(book.ad_livros_id);
    }
  };

  //Abre o modal dos comentarios
  const openCommentModal = () => setIsCommentModalVisible(true);

  //Abre o modal dos livros favoritos
  const openBookFavoriteModal = async () => {
    setAnimationVisible(true); // Inicia a animação imediatamente
  
    try {
      const success = await handleAddFavoriteBook(); // Aguarda a API
  
      const timer = setTimeout(() => {
        setAnimationVisible(false);
        if (success) {
          setIsBookFavoriteModalVisible(true); // Abre o modal somente em caso de sucesso
        }
      }, 1500); // Mantém a animação visível por 1.5 segundos após o retorno da API
  
      return () => clearTimeout(timer); // Limpa o temporizador ao desmontar
    } catch (error) {
      console.error("Erro ao abrir o modal de favoritos:", error);
  
      // Finaliza a animação após o tempo definido, sem abrir o modal
      const timer = setTimeout(() => {
        setAnimationVisible(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  };  

  //Fecha o modal dos comentarios
  const closeCommentModal = () => {
    setIsCommentModalVisible(false);
    setCommentText("");
    setUserRating(0);
    setErrors({ commentText: false });
  };

  //Fecha o modal dos livros favoritos
  const closeBookFavoriteModal = () => {
    setIsBookFavoriteModalVisible(false);
  };

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
    const fetchUserData = async () => {
      const storedToken = await SecureStore.getItemAsync('userToken');
      const storedUserData = await SecureStore.getItemAsync('userData');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      }
    };
    
    fetchUserData();
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

  // Renderizar imagem individual
  const renderImageModal = ({ item, style }: { item: Book; style?: object }) => {
    const imageSource = item.imagem_url
      ? { uri: item.imagem_url }
      : item.imagem_base64
      ? { uri: `data:image/png;base64,${item.imagem_base64}` }
      : null;
  
    return (
      <Image
        source={imageSource ? imageSource : require('../../assets/ErrorImageBook.png')}
        style={[styles.bookCover, style, { resizeMode: 'contain' }]} // Combina estilos
      />
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

  const handleSaveReview = async () => {
    try {
      // Resetar erros
      setErrors({ commentText: false });

      setIsLoading(true);

      const usuarioId = await getUserId();

      if (usuarioId === null) {
        alert("Erro ao recuperar o ID do usuário. Tente novamente.");
        return;
      }

      const newReview: ReviewsBook = {
        livroId: book.ad_livros_id,
        usuarioId: usuarioId,
        pontuacao: userRating,
        comentario: commentText,
        data_avaliacao: new Date().toISOString().split('T')[0]
      };

      // Verifica se os campos estão vazios
      const newErrors = {
        commentText: !commentText,
      };

      // Mostrar a caixa de erro pedindo que o usuário não preencheu todos os campos
      if (newErrors.commentText) {
        setErrors(newErrors);
        return;
      }

      const response = await createReviewsBookService(newReview);

      // Verifica se o status da resposta é 201 e se o tipo é "success"
      if (response.status === 201 && response.type === "success") {
        closeCommentModal(); // Fecha o modal
        showDialog("Sucesso", "Avaliação salva com sucesso!", 'success'); // Exibe o diálogo
      } else {
        // Aqui você pode tratar outros casos, como falhas na criação da avaliação
        closeCommentModal();
        showDialog("Erro", "Ocorreu um erro ao salvar a avaliação.", 'fail');
      }

    } catch (error) {
      closeCommentModal();
      console.error("Erro ao salvar a avaliação:", error);
      showDialog('Erro', "Erro ao salvar a avaliação. Tente novamente.", 'fail');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFavoriteBook = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
  
      const usuarioId = await getUserId();
  
      if (usuarioId === null) {
        alert("Erro ao recuperar o ID do usuário. Tente novamente.");
        return false;
      }
  
      const newFavoriteBook: FavoriteBook = {
        usuarioid: usuarioId,
        livroid: book.ad_livros_id,
      };
  
      const response = await createFavoriteBookService(newFavoriteBook);
  
      if (response.status === 201 && response.type === "success") {
        return true;
      } else {
        showDialog("Erro", "Ocorreu um erro ao adicionar o livro aos favoritos.", "fail");
        return false;
      }
    } catch (error) {
      console.error("Erro ao adicionar o livro aos favoritos:", error);
      showDialog("Erro", "Erro ao adicionar o livro aos favoritos. Tente novamente.", "fail");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Provider>
      <CustomDialog
        visible={visible}
        hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        type={dialogType}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
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
            <TouchableOpacity style={styles.readButton} onPress={openBookFavoriteModal}>
              <Text style={styles.readButtonText}>Adicionar aos favoritos</Text>
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
                style={{marginTop: 10, marginBottom: 10}}
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
              <View style={[styles.commentContainer, {padding: 15, marginTop: 10, marginBottom: 10}]}>
                <View style={styles.commentContent}>
                  <Text style={[styles.commentText, {justifyContent: 'center', alignItems:'center', textAlign:'center'}]}>Não ha avaliações de usuarios para esse livro.</Text>
                </View>
              </View>
            )}
            <TouchableOpacity style={[styles.loadMoreButton, {marginBottom: 35}]} onPress={openCommentModal}>
              <Text style={styles.loadMoreText}>Escreva um comentario</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/** Modal para avaliação do livro */}
        <Modal
          transparent
          visible={isCommentModalVisible}
          animationType="slide"
          onRequestClose={closeCommentModal}
          onDismiss={closeCommentModal}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Escreva sua avaliação</Text>
              <TextInput
                style={[styles.commentInput, errors.commentText && { borderColor: 'red', borderWidth: 1 }]}
                placeholder="Digite seu comentário aqui"
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <Text style={styles.ratingPrompt}>Como você classificaria?</Text>
              <View style={styles.starRatingContainer}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <TouchableOpacity key={rating} onPress={() => setUserRating(rating)}>
                    <Text style={[styles.commentStart, userRating >= rating && styles.selectedStar]}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: "center"}}>
                {isLoading ? (
                  <TouchableOpacity style={[styles.modalCloseButton, {backgroundColor: '#073F72', marginRight: 20}]}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  </TouchableOpacity>
                ) : ( 
                  <TouchableOpacity onPress={handleSaveReview} style={[styles.modalCloseButton, {backgroundColor: '#073F72', marginRight: 20}]}>
                    <Text style={[styles.modalCloseButtonText, {color:'#FFF'}]}>Salvar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={closeCommentModal} style={[styles.modalCloseButton, {backgroundColor: '#073F72'}]}>
                    <Text style={[styles.modalCloseButtonText, {color:'#FFF'}]}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </Modal>

        {isAnimationVisible && (
          <LottieView
            source={require('../../assets/AnimationHeart.json')} // ajuste o caminho conforme necessário
            autoPlay
            loop={true} // Configura para tocar apenas uma vez
            style={styles.animation}
          />
        )}

        {/**Modal para exibir livros favoritos*/}
        <Modal 
          transparent
          animationType="slide" 
          visible={isBookFavoriteModalVisible} 
          onDismiss={closeBookFavoriteModal} 
          style={styles.modalBookFavoriteContainer}
        >
          <TouchableWithoutFeedback onPress={closeBookFavoriteModal}>
            <View style={styles.modalBookFavoriteOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.dialog}>
            <Title style={styles.BookFavoritetitle}>Adicionado aos seus livros favoritos</Title>
            <ScrollView>
              <View style={styles.subContainerModalBook}>
                {renderImageModal({ item: book, style: styles.imageModalBook })}
              </View>
              <View style={{borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 0, marginBottom: 5}}>
                <Text style={[styles.message, {textAlign: 'center', fontWeight: 'bold'}]}>{book.titulo}</Text>
              </View>
            </ScrollView>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('Favorite', {user: userData!})} 
              style={[styles.button, { backgroundColor: '#073F72' }]}
            >
              <Text style={styles.buttonText}>Sua lista de livros favoritos</Text>
            </Button>
            <Button mode="contained" onPress={closeBookFavoriteModal} style={[styles.button, { backgroundColor: '#073F72' }]}>
              <Text style={styles.buttonText}>Fechar</Text>
            </Button>
          </View>
        </Modal>

      </GestureHandlerRootView>
    </Provider>
  );
}