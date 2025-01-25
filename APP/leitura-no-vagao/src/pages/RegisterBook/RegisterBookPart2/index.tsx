import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/routes/app.routes';

type BookRegisterProps = {
  route: RouteProp<RootStackParamList, 'RegisterBookPart2'>;
  navigation: StackNavigationProp<RootStackParamList, 'RegisterBookPart2'>;
}; 

export function RegisterBookPart2({ route, navigation }: BookRegisterProps) {

  const { bookInfo } = route.params;
  const [description, setDescription] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [publisher, setPublisher] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  useEffect(() => {
    // Verifica se bookInfo não é null ou vazio e preenche os campos
    if (bookInfo) {
      setDescription(bookInfo.data.book.description || bookInfo.data.book.textSnippet || '');
      setAuthor(bookInfo.data.book.authors?.join(', ') || '');
      setPublisher(bookInfo.data.publisher.publisher || '');
      setYear(bookInfo.data.book.publishedDate || '');
    }
  }, [bookInfo]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
                  <Text style={styles.label}>Categoria do Livro</Text>
                  <View style={styles.viewInput}>
                    <TextInput
                      placeholder="Informe o titulo"
                      style={[styles.searchInput, styles.input]}
                      value={year}
                      onChangeText={setYear}
                    />
                  </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(1450).duration(3500).springify()}>
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
    </ScrollView>
  );
}