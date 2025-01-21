import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { getBookByISBN } from '../../../services/BookService/BookService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';

// Definindo os tipos para a navegação
type RootStackParamList = {
  Home: undefined;
  BookInfoScreen: { bookInfo: any };
};

export function RegisterBookPart2() {

  const [description, setDescription] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [publisher, setPublisher] = useState<string>('');
  const [year, setYear] = useState<string>('');
  
  const [alertShown, setAlertShown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
          <>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
              <Ionicons name="arrow-back-outline" size={24} color={styles.backArrowColor.color} />
            </TouchableOpacity>

            <Animated.View entering={FadeInDown.delay(200).duration(3500).springify()}>
              <Text style={styles.welcome}>Doe um livro</Text>
              <Text style={styles.instructions}>
                Compartilhe o conhecimento e inspire outras pessoas! Doe seus livros e transforme vidas através da leitura.
              </Text>

              <Text style={styles.instructions}>
                Preencha todos os dados.
              </Text>

              <Animated.View entering={FadeInDown.delay(450).duration(3500).springify()}>
                <Text style={styles.label}>Descrição</Text>
                  <TextInput
                    placeholder="Informe a descrição"
                    style={[styles.descriptionInput, styles.input]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                  />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(650).duration(3500).springify()}>
                <Text style={styles.label}>Autor</Text>
                <View style={styles.viewInput}>
                  <TextInput
                    placeholder="Informe o autor"
                    style={[styles.searchInput, styles.input]}
                    value={author}
                    onChangeText={setAuthor}
                  />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(850).duration(3500).springify()}>
                <Text style={styles.label}>Editora</Text>
                <View style={styles.viewInput}>
                  <TextInput
                    placeholder="Informe a titulo"
                    style={[styles.searchInput, styles.input]}
                    value={publisher}
                    onChangeText={setPublisher}
                  />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(1050).duration(3500).springify()}>
                <Text style={styles.label}>Ano de publicação</Text>
                <View style={styles.viewInput}>
                  <TextInput
                    placeholder="Informe o titulo"
                    style={[styles.searchInput, styles.input]}
                    value={year}
                    onChangeText={setYear}
                  />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(1250).duration(3500).springify()}>
                {isLoading ? (
                  <TouchableOpacity style={styles.button}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home' as never)}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                  </TouchableOpacity>
                )}
              </Animated.View>

            </Animated.View>
          </>
      </View>
    </TouchableWithoutFeedback>
  );
}