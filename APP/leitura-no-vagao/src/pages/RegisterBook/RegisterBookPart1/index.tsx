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
  FlatList,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { getBookByISBN } from '../../../services/BookService/BookService';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { Book } from '@/types/Book';
import { launchImageLibrary } from 'react-native-image-picker';

// Definindo os tipos para a navegação
type RootStackParamList = {
  Home: undefined;
  BookInfoScreen: { bookInfo: any };
};

export function RegisterBookPart1() {

  const [images, setImages] = useState<string[]>([]);
  const [isbn, setIsbn] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [bookInfo, setBookInfo] = useState<any>(null); 
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [alertShown, setAlertShown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingIsbn, setIsLoadingIsbn] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
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
  const renderImage = ({ item }: { item: string | null }) => (
    <TouchableOpacity onPress={handleAddImage}>
      <Image
        source={item ? { uri: item } : require('../../../assets/AddPhotoPlaceholder.png')}
        style={styles.bookCover}
      />
    </TouchableOpacity>
  );

  const handleAddImage = () => {
    console.log("Entrou no metodo handleAddImage")
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0, // Permite selecionar múltiplas imagens
      },
      (response) => {
        if (response.assets) {
          const newImages = response.assets.map((asset) => asset.uri || '');
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
      }
    );
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
      if (bookData) {
        setTitle(bookData.data.book.title); // Preencher o campo "title"
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
      setIsLoading(false);
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
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
                  <Text style={styles.label}>Adicionar fotos</Text>
                  <View style={styles.viewInputImage}>
                    <FlatList
                      data={images.length > 0 ? images : [null]}
                      renderItem={renderImage}
                      keyExtractor={(item, index) => `image-${index}`}
                      horizontal
                      pagingEnabled
                      snapToAlignment="center"
                      snapToInterval={screenWidth}
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                </Animated.View>

                <Text style={styles.instructions}>
                Preencha o ISBN no campo para que a gente complete os outros campos automaticamente. Ou, se preferir, use a câmera do celular para escanear o código ISBN do livro e deixe que a gente preencha tudo pra você!
                </Text>

                <Animated.View entering={FadeInDown.delay(650).duration(3500).springify()}>
                  <Text style={styles.label}>ISBN</Text>
                  <View style={styles.viewInput}>
                    <TextInput
                      placeholder="Informe o codigo ISBN"
                      style={[styles.searchInput, styles.input]}
                      value={isbn}
                      onChangeText={setIsbn}
                    />
                    {isLoading ? (
                      <TouchableOpacity>
                        <ActivityIndicator size="large" color="#FFFFFF" />
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
                  <View style={styles.viewInput}>
                    <TextInput
                      placeholder="Informe o titulo"
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
                      onPress={() => navigation.navigate('RegisterBookPart2' as any, { bookInfo })}
                    >
                      <Text style={styles.buttonText}>Proximo</Text>
                    </TouchableOpacity>
                  )}
                </Animated.View>

              </Animated.View>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}