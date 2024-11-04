import { RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../routes/app.routes";
import { FlatList, Text, TouchableOpacity, View, Modal, TextInput, TouchableWithoutFeedback, Keyboard  } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { createReviewsBookService, getReviewsBookByIdService} from '../../services/ReviewsBookService/ReviewsBookService';
import { ActivityIndicator, Provider as PaperProvider } from 'react-native-paper';
import CustomDialog from '../../components/CustomDialog';
import { ReviewsBook } from "../../types/ReviewsBook";
import * as SecureStore from 'expo-secure-store';

type CommentsBookProps = {
    route: RouteProp<RootStackParamList, 'CommentsBook'>;
    navigation: StackNavigationProp<RootStackParamList, 'CommentsBook'>;
};

export default function CommentsBook({ route, navigation }: CommentsBookProps) {
    const { reviews: initialReviews, averageRating } = route.params;
    const [reviews, setReviews] = useState(initialReviews);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const { book } = route.params;
    const [selectedSortOption, setSelectedSortOption] = useState("Mais Recentes");
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);
    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [userRating, setUserRating] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
                setReviews(response.data.reviews);
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

    //Fecha o modal dos comentarios
    const closeCommentModal = () => {
        setIsCommentModalVisible(false);
        setCommentText("");
        setUserRating(0);
        setErrors({ commentText: false });
    };

    const sortOptions = [
        { label: "Melhores Avaliações", value: "Melhores Avaliações" },
        { label: "Mais Recentes", value: "Mais Recentes" }
    ];

    // Filtra as avaliações com base na classificação selecionada
    const filteredReviews = selectedRating
        ? reviews.filter(review => review.pontuacao === selectedRating)
        : reviews;

    // Ordena as avaliações de acordo com a opção selecionada
    const sortedReviews = filteredReviews.sort((a, b) => {
        if (selectedSortOption === "Melhores Avaliações") return b.pontuacao - a.pontuacao;
        if (selectedSortOption === "Mais Recentes") return new Date(b.data_avaliacao).getTime() - new Date(a.data_avaliacao).getTime();
        return 0;
    });

    // Calcular a porcentagem de avaliações
    const getRatingPercentage = (rating: number) => {
        const totalReviews = reviews.length;
        const count = reviews.filter(review => review.pontuacao === rating).length;
        return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    };

    const renderStarRating = () => (
        <View style={styles.ratingContainer}>
            {[5, 4, 3, 2, 1].map(rating => (
                <TouchableOpacity
                    key={rating}
                    onPress={() => setSelectedRating(rating)}
                    style={styles.starRow}
                >
                    <Text style={styles.star}>{'★'.repeat(rating)}</Text>
                    <View style={styles.progressBar}>
                        <View 
                            style={[styles.progressFill, { width: `${getRatingPercentage(rating)}%` }]} 
                        />
                    </View>
                    <Text style={styles.percentageText}>{`${getRatingPercentage(rating).toFixed(1)}%`}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
    
    const renderReview = ({ item }: { item: typeof reviews[0] }) => (
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

    const openSortModal = () => setIsSortModalVisible(true);
    const closeSortModal = () => setIsSortModalVisible(false);

    const selectSortOption = (option: string) => {
        setSelectedSortOption(option);
        closeSortModal();
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

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text></Text>
                <TouchableOpacity onPress={() => navigation.navigate('BookDetails', { book: book })} style={styles.backButton}>
                    <Icon name="arrow-back-outline" size={24} color={styles.backArrowColor.color} />
                </TouchableOpacity>

                <Text style={styles.title}>Avaliações dos usuarios</Text>
                {averageRating && Number(averageRating.total_avaliacoes) > 0 && (
                    <View style={styles.bookRatingContainer}>
                        <View  style={{flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
                            <Text style={styles.bookRatingAverage}>{Number(averageRating.media_avaliacao).toFixed(1)}</Text>
                            <Text style={styles.bookRatingStars}>{'★'.repeat(Number(averageRating.media_avaliacao))}</Text>
                        </View>
                        <TouchableOpacity onPress={openCommentModal}>
                            <Text style={{fontWeight: 'bold'}}>Escreva um comentario</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {renderStarRating()}
                
                <View style={[styles.sortContainer, {borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 0,}]}>
                    <Text style={{fontWeight: 'bold'}}>Total de avaliações: {reviews.length}</Text>
                    <TouchableOpacity onPress={openSortModal} style={[styles.sortButton, {marginBottom: 10}]}>
                        <Text style={styles.sortButtonText}>{selectedSortOption}</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredReviews}
                    renderItem={renderReview}
                    keyExtractor={(item) => `review-${item.ad_avaliacoes_id}`}
                    style={{ marginTop: 5 }}
                    showsHorizontalScrollIndicator={false}
                />

                {/**Modal para ordernar os comentarios */}
                <Modal
                    transparent
                    visible={isSortModalVisible}
                    animationType="slide"
                    onRequestClose={closeSortModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Ordenar por</Text>
                            <FlatList
                                data={sortOptions}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.modalItem} 
                                        onPress={() => selectSortOption(item.value)}
                                    >
                                        <Text style={styles.modalItemText}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.value}
                            />
                            <TouchableOpacity onPress={closeSortModal} style={styles.modalCloseButton}>
                                <Text style={styles.modalCloseButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                
                <Modal
                    transparent
                    visible={isCommentModalVisible}
                    animationType="slide"
                    onRequestClose={closeCommentModal}
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
                                        <TouchableOpacity
                                            key={rating}
                                            onPress={() => setUserRating(rating)}
                                        >
                                            <Text style={[
                                                styles.commentStart,
                                                userRating >= rating && styles.selectedStar
                                            ]}>★</Text>
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
            </View>
            <CustomDialog
                visible={visible}
                hideDialog={hideDialog}
                title={dialogTitle}
                message={dialogMessage}
                type={dialogType}
            />
        </PaperProvider>
    );
}
