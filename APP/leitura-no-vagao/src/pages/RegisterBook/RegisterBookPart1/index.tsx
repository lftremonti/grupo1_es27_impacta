import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { getBookByISBN } from '../../../services/BookService/BookService';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import * as ImagePicker from 'expo-image-picker';
import { Provider } from 'react-native-paper';
import CustomDialog from '@/components/CustomDialog';

// Definindo os tipos para a navegação
type RootStackParamList = {
  Home: undefined;
  BookInfoScreen: { bookInfo: any };
};

export function RegisterBookPart1() {

  const [images, setImages] = useState<{ base64?: string | null; uri: string }[]>([]);
  const [isbn, setIsbn] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [scanned, setScanned] = useState<boolean>(false);
  const [bookInfo, setBookInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingIsbn, setIsLoadingIsbn] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState({ isbn: false, title: false });
  const [errorsIsbn, setErrorsIsbn] = useState({ isbn: false });

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

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
        if (status !== 'granted') {
          Alert.alert('Permissão de câmera necessária', 'Por favor, permita o acesso à câmera.');
        }
      })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Apenas redefinir se necessário
        setTitle('');
        setIsbn('');
        setBookInfo(null);
        setImages([]);
      };
    }, [])
  );

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(false);
    setIsLoading(true);
    try {
      const bookData = await getBookByISBN(data);
      setBookInfo(bookData);
      setTitle(bookData?.data?.book?.title || '');
      Alert.alert("Código lido", "O código {code} foi lido. Verifique se está correto.".replace('{code}', data));
    } catch {
      Alert.alert("Erro ao buscar informações do livro.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para mostrar a câmera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Conceder permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const closeCamera = () => {
    setScanned(false);
  };

  // Obtenha a largura da tela
  const { width: screenWidth } = Dimensions.get('window');

  // Renderizar imagem individual
  const renderImage = ({ item }: { item: { base64?: string | null; uri: string } }) => {
    const imageSource = item.base64
      ? { uri: `data:image/jpeg;base64,${item.base64}` }
      : item.uri === 'placeholder'
      ? require('../../../assets/AddPhotoPlaceholder.png')
      : { uri: item.uri };
  
    return (
      <TouchableOpacity onPress={handlePickerImage}>
        <Image source={imageSource} style={[styles.bookCover,  { width: screenWidth, resizeMode: 'contain' }]} />
      </TouchableOpacity>
    );
  };
  
  const handlePickerImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita que sua aplicação acesse as imagens'
      );
    } else {
      const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        aspect: [4, 4],
        quality: 1,
      });
  
      if (canceled) {
        ToastAndroid.show('Operação cancelada', ToastAndroid.SHORT);
      } else if (assets.length > 0 && assets[0].base64) {
        setImages([...images, assets[0]]);
      }
    }
  };

  const handleSearchIsbn = async () => {
    setErrorsIsbn({ isbn: false });
   
    const newErrors = {
      isbn: !isbn
    };

    // Mostrar a caixa de erro pedindo que o usuário não preencheu todos os campos
    if (newErrors.isbn) {
      setErrorsIsbn(newErrors);
      showDialog('Campos Obrigatório', 'Por favor, preencha o campos ISBN para realizar a busca!', 'fail');
      return;
    }

    setIsLoadingIsbn(true);

    try{
      const bookData = await getBookByISBN(isbn);
      console.log(bookData)
      if (bookData) {
        populateData(bookData);
        setBookInfo(bookData); // Salvar todas as informações do livro
        showDialog('Sucesso', 'Informações do livro obtidas com sucesso!', 'success');
      } else {
        showDialog('Erro', 'Não foi possível encontrar o livro. Por favor preencha todos os campos.', 'fail');
      }
    } catch(error){
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      showDialog('Erro', `Lamentamos pelo ocorrido. Por favor, tente novamente.`, 'fail');
      console.log("Metodo handleSearchIsbn ERROR: " + errorMessage)
    } finally {
      setIsLoadingIsbn(false);
    }
  }

  const populateData = async (bookData: any) => {
    if(bookData.data.api === 0){
      setTitle(bookData.data.book.titulo);
    } else if (bookData.data.api === 1) {
      setTitle(bookData.data.book.title);
    }
  }

  const handleNext = async () => {
    // Resetar erros
    setErrors({ isbn: false, title: false });
    // Verifica se os campos estão vazios
    const newErrors = {
      isbn: !isbn,
      title: !title
    };
  
    // Mostrar a caixa de erro pedindo que o usuário não preencheu todos os campos
    if (newErrors.isbn || newErrors.title) {
      setErrors(newErrors);
      showDialog('Campos Obrigatórios', 'Por favor, preencha todos os campos!', 'fail');
      return;
    }
  
    setIsLoading(true);

    try {

      const newBookDataInfo = {
        isbn,
        title,
        images
      };    
      navigation.navigate('RegisterBookPart2' as any, { bookInfo, bookDataInfo: newBookDataInfo });
    } catch (error) {
      showDialog('Erro', `Lamentamos pelo ocorrido. Por favor, tente novamente.`, 'fail');
    } finally {
      setIsLoading(false);
      setBookInfo(null);
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {scanned ? (
                <CameraView style={styles.camera} onBarcodeScanned={handleBarCodeScanned}>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={closeCamera}>
                      <Text style={styles.text}>Fechar Câmera</Text>
                    </TouchableOpacity>
                  </View>
                </CameraView>
              ) : (
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
                      <Text style={styles.label}>Adicionar fotos do livro</Text>
                      <View style={styles.viewInputImage}>
                        <FlatList
                          data={images.length > 0 ? images : [{ uri: 'placeholder', base64: null }]} // Corrigido
                          renderItem={renderImage}
                          keyExtractor={(item, index) => `image-${index}`}
                          horizontal
                          pagingEnabled
                          snapToAlignment="center"
                          snapToInterval={screenWidth}
                          showsHorizontalScrollIndicator={false}
                          onMomentumScrollEnd={(event) => {
                            const index = Math.floor(event.nativeEvent.contentOffset.x / screenWidth);
                            setCurrentIndex(index);
                          }}
                        />
                      </View>
                    </Animated.View>

                    <Text style={styles.instructions}>
                    Preencha o ISBN no campo para que a gente complete os outros campos automaticamente. Ou, se preferir, use a câmera do celular para escanear o código ISBN do livro e deixe que a gente preencha tudo pra você!
                    </Text>

                    <Animated.View entering={FadeInDown.delay(650).duration(3500).springify()}>
                      <Text style={styles.label}>ISBN do livro</Text>
                      <View style={[styles.viewInput, errors.isbn && { borderColor: 'red', borderWidth: 1 }]}>
                        <TextInput
                          placeholder="Informe o codigo ISBN do livro"
                          style={[styles.searchInput, styles.input]}
                          value={isbn}
                          onChangeText={setIsbn}
                        />
                        {isLoadingIsbn ? (
                          <TouchableOpacity>
                            <ActivityIndicator size="large" color="#252525" />
                        </TouchableOpacity>
                        ): (
                          <TouchableOpacity onPress={handleSearchIsbn}>
                            <Ionicons name="search" size={24} style={styles.searchIcon} />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => setScanned(true)}>
                          <Ionicons name="camera" size={24} style={styles.searchIcon} />
                        </TouchableOpacity>
                      </View>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(850).duration(3500).springify()}>
                      <Text style={styles.label}>Titulo do livro</Text>
                      <View style={[styles.viewInput, errors.title && { borderColor: 'red', borderWidth: 1 }]}>
                        <TextInput
                          placeholder="Informe o titulo do livro"
                          style={[styles.searchInput, styles.input]}
                          value={title}
                          onChangeText={setTitle}
                        />
                      </View>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(1050).duration(3500).springify()}>
                      {isLoading ? (
                        <TouchableOpacity style={styles.button}>
                          <ActivityIndicator size="large" color="#FFFFFF" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity 
                          style={styles.button} 
                          onPress={handleNext}
                        >
                          <Text style={styles.buttonText}>Proximo</Text>
                        </TouchableOpacity>
                      )}
                    </Animated.View>

                  </Animated.View>
                </>
              )}
            
            </ScrollView>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </Provider>
  );
}