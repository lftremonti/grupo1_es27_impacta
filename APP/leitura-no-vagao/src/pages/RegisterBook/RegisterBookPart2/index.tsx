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
  Dimensions
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { getBookByISBN } from '../../../services/BookService/BookService';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { Book } from '@/types/Book';
import { launchImageLibrary } from 'react-native-image-picker';

// Definindo os tipos para a navegação
type RootStackParamList = {
  Home: undefined;
  BookInfoScreen: { bookInfo: any };
};

export function RegisterBookPart2() {

  const [images, setImages] = useState<string[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [bookInfo, setBookInfo] = useState<any>(null); 
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [alertShown, setAlertShown] = useState<boolean>(false);
  const [bookName, setBookName] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
        if (status !== 'granted') {
          Alert.alert('Permissão de câmera necessária', 'Por favor, permita o acesso à câmera.');
        }
      })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (!alertShown) {
      setScannedCode(data);
      setScanned(true);
      const info = await getBookInfo(data);
      setBookInfo(info);
      setAlertShown(true);

      Alert.alert(
        'Código lido',
        `O código ${data} foi lido. Verifique se está correto.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setAlertShown(false);
            },
          },
          {
            text: 'Cancelar',
            onPress: () => {
              setAlertShown(false);
              setScanned(false); 
            },
          },
        ]
      );
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
  const renderImage = ({ item }: { item: string | null }) => {
    // Define a fonte da imagem ou usa a imagem padrão
    const imageSource = item
    ? { uri: item } // Usa a imagem do URI
    : require('../../../assets/AddPhotoPlaceholder.png');

    return (
      <TouchableOpacity>
        <Image
          source={imageSource}
          style={[styles.bookCover, { width: screenWidth, height: 100, resizeMode: 'contain' }]}
        />
      </TouchableOpacity>
    );
  };

  const handleAddImage = () => {
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

  return (
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
                    value={bookName}
                    onChangeText={setBookName}
                  />
                  <TouchableOpacity onPress={() => setScanned(true)}>
                    <Ionicons name="search" size={24} style={styles.searchIcon} />
                  </TouchableOpacity>
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
                    value={bookName}
                    onChangeText={setBookName}
                  />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(1050).duration(3500).springify()}>
                {isLoading ? (
                  <TouchableOpacity style={styles.button}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.button} onPress={() => {}}>
                    <Text style={styles.buttonText}>Proximo</Text>
                  </TouchableOpacity>
                )}
              </Animated.View>

            </Animated.View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}