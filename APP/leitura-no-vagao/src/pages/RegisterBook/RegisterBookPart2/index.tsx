import React, { useState, useEffect, useCallback } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/routes/app.routes';
import { getAllCategoryCreateBookService } from '@/services/CategoryService/CategoryService';
import { Category } from '@/types/Category';
import { Provider } from 'react-native-paper';
import CustomDialog from '@/components/CustomDialog';

type BookRegisterProps = {
  route: RouteProp<RootStackParamList, 'RegisterBookPart2'>;
  navigation: StackNavigationProp<RootStackParamList, 'RegisterBookPart2'>;
}; 

export function RegisterBookPart2({ route, navigation }: BookRegisterProps){

  const { bookInfo, bookDataInfo } = route.params;
  const [description, setDescription] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [publisher, setPublisher] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [errors, setErrors] = useState({ description: false, author: false, publisher: false, year: false, categories: false });

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

  const fetchCategories = async () => {
    try {
      const categoryData = await getAllCategoryCreateBookService();
      setCategories(categoryData.data.category);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    if (bookInfo) {
      setDescription(bookInfo.data.book.description || bookInfo.data.book.textSnippet || '');
      setAuthor(bookInfo.data.book.authors?.join(', ') || '');
      setPublisher(bookInfo.data.publisher.publisher || '');
      setYear(bookInfo.data.book.publishedDate || '');
    }

    fetchCategories();
  }, [bookInfo]);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
  
      return () => {
        setDescription('');
        setAuthor('');
        setPublisher('');
        setYear('');
        setSelectedCategory(0);
        setCategories([]);
      };
    }, [])
  );

  const handleNext = async () => {
    // Resetar erros
    setErrors({ description: false, author: false, publisher: false, year: false, categories: false });
    // Verifica se os campos estão vazios
    const newErrors = {
      description: !description,
      author: !author,
      publisher: !publisher, 
      year: !year, 
      categories: !selectedCategory
    };
  
    // Mostrar a caixa de erro pedindo que o usuário não preencheu todos os campos
    if (newErrors.description || newErrors.author || newErrors.publisher || newErrors.year || newErrors.categories) {
      setErrors(newErrors);
      showDialog('Campos Obrigatórios', 'Por favor, preencha todos os campos!', 'fail');
      return;
    }
  
    setIsLoading(true);

    try {

      const newBookDataInfo = {
        bookDataInfo,
        description,
        author,
        publisher,
        year,
        selectedCategory
      };
      navigation.navigate('RegisterBookPart3' as any, { bookInfo, bookDataInfo: newBookDataInfo });
    } catch (error) {
      showDialog('Erro', `Lamentamos pelo ocorrido. Por favor, tente novamente.`, 'fail');
    } finally {
      setIsLoading(false);
    }
  };

  const hideDialog = () => {
    setVisible(false);
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
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
                  <Text style={styles.label}>Descrição do livro</Text>
                  <TextInput
                    placeholder="Informe a descrição do livro"
                    style={[styles.descriptionInput, styles.input,  errors.description && { borderColor: 'red', borderWidth: 1 }]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                  />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(650).duration(3500).springify()}>
                  <Text style={styles.label}>Autor do livro</Text>
                  <View style={[styles.viewInput, errors.author && { borderColor: 'red', borderWidth: 1 }]}>
                    <TextInput
                      placeholder="Informe o autor do livro"
                      style={[styles.searchInput, styles.input]}
                      value={author}
                      onChangeText={setAuthor}
                    />
                  </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(850).duration(3500).springify()}>
                  <Text style={styles.label}>Editora do livro</Text>
                  <View style={[styles.viewInput, errors.publisher && { borderColor: 'red', borderWidth: 1 }]}>
                    <TextInput
                      placeholder="Informe a editora do livro"
                      style={[styles.searchInput, styles.input]}
                      value={publisher}
                      onChangeText={setPublisher}
                    />
                  </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(1050).duration(3500).springify()}>
                  <Text style={styles.label}>Ano de publicação do livro</Text>
                  <View style={[styles.viewInput, errors.year && { borderColor: 'red', borderWidth: 1 }]}>
                    <TextInput
                      placeholder="Informe o Ano de publicação do livro"
                      style={[styles.searchInput, styles.input]}
                      value={year}
                      onChangeText={setYear}
                    />
                  </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(1250).duration(3500).springify()}>
                  <Text style={styles.label}>Categoria do Livro</Text>
                  <View style={[styles.viewInputCategory, errors.categories && { borderColor: 'red', borderWidth: 1 }]}>
                    <Picker
                      selectedValue={selectedCategory}
                      onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                      style={styles.pickerStyle}  // Estilo do Picker
                    >
                      <Picker.Item label="Selecione uma categoria" value="" />
                      {categories.map((category: Category) => (
                        <Picker.Item
                          key={category.ad_categoria_id}
                          label={category.nome}
                          value={category.ad_categoria_id}
                          style={[
                            selectedCategory === category.ad_categoria_id
                              ? styles.selectedPickerItem  // Alterar cor do item selecionado
                              : {}
                          ]}
                        />
                      ))}
                    </Picker>
                  </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(1450).duration(3500).springify()}>
                  {isLoading ? (
                    <TouchableOpacity style={styles.button}>
                      <ActivityIndicator size="large" color="#FFFFFF" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                      <Text style={styles.buttonText}>Proximo</Text>
                    </TouchableOpacity>
                  )}
                </Animated.View>
              </Animated.View>
            </>          
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </Provider>
  );
}