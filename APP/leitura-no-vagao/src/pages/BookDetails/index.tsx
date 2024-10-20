import React, { useMemo, useRef, useState } from 'react';
import { View, Text, Image, FlatList, Button, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Provider } from 'react-native-paper';
import { styles } from './styles';
import { comments } from '../../data/CommentsJson';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../routes/app.routes';

type BookDetailsProps = {
  route: RouteProp<RootStackParamList, 'BookDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'BookDetails'>;
}; 

export function BookDetails({ route, navigation }: BookDetailsProps) {
  const { book } = route.params;

  // Função para renderizar os comentários
  const renderComment = ({ item }: { item: typeof comments[0] }) => (
    <View style={styles.commentContainer}>
      <Ionicons name="person-circle-outline" size={45} style={styles.userIcon} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>{item.user}</Text>
        </View>
        <Text style={styles.commentRating}>Avaliação: {'★'.repeat(item.rating)}</Text>
        <Text style={styles.commentText}>{item.comment}</Text>
        <Text style={styles.commentDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <Provider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <Text></Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home' as never)} style={styles.backButton}>
            <Icon name="arrow-back-outline" size={24} color={styles.backArrowColor.color} />
          </TouchableOpacity>

          <View style={{borderBottomWidth: 2, borderBottomColor: '#ccc', paddingBottom: 20,}}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 0,}}>
              <Image source={{ uri: book.coverImageUrl }} style={styles.bookCover} />
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <Text style={styles.bookRating}>{'★'.repeat(book.rating)} {book.rating}.0</Text>
            </View>

            <Text style={styles.sectionTitle}>Detalhes</Text>
            <Text style={styles.bookDescription}>{book.description}</Text>
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
            <FlatList
              data={comments.slice(0, 3)} // Exibe os 3 primeiros comentários
              renderItem={renderComment}
              style={{marginTop: 10}}
              keyExtractor={(item) => item.id}
              ListFooterComponent={
                comments.length > 3 ? (
                  <TouchableOpacity style={styles.loadMoreButton} onPress={() => {}}>
                    <Text style={styles.loadMoreText}>Visualizar mais</Text>
                  </TouchableOpacity>
                ) : null // Retorna null se não houver mais comentários
              }
            />
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </Provider>
  );
}