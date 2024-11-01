import { RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../routes/app.routes";
import { FlatList, Text, TouchableOpacity, View, Modal  } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

type CommentsBookProps = {
    route: RouteProp<RootStackParamList, 'CommentsBook'>;
    navigation: StackNavigationProp<RootStackParamList, 'CommentsBook'>;
};

export default function CommentsBook({ route, navigation }: CommentsBookProps) {
    const { reviews, averageRating } = route.params;
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const { book } = route.params;
    const [selectedSortOption, setSelectedSortOption] = useState("Mais Recentes");
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);

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

    return (
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
                    <TouchableOpacity>
                        <Text style={{fontWeight: 'bold'}}>Escreva um comentario</Text>
                    </TouchableOpacity>
                </View>
            )}

            {renderStarRating()}
            
            {/**chat aqui tambem faz essa melhoria: Esse vai ficar do outro lado da tela na direita */}
            <View style={styles.sortContainer}>
                <Text style={{fontWeight: 'bold'}}>Numero de Avaliações: {reviews.length}</Text>
                <TouchableOpacity onPress={openSortModal} style={styles.sortButton}>
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

        </View>
    );
}
