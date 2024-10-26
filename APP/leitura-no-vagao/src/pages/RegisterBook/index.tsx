import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { getBookInfo } from '../../services/BookService/BookService';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';

// Definindo os tipos para a navegação
type RootStackParamList = {
  Home: undefined;
  BookInfoScreen: { bookInfo: any };
};

export function RegisterBook() {
  const [name, setName] = useState<string>(''); 
  const [email, setEmail] = useState<string>(''); 
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

  return (
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

          <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
            <Text style={styles.welcome}>Doe um livro</Text>
            <Text style={styles.instructions}>
              Compartilhe o conhecimento e inspire outras pessoas! Doe seus livros e transforme vidas através da leitura.
            </Text>

            <Animated.View entering={FadeInDown.delay(450).duration(5000).springify()}>
              <Text style={styles.label}>Nome do livro</Text>
              <View style={styles.viewInput}>
                <TextInput
                  placeholder="O pequeno Príncipe"
                  style={[styles.searchInput, styles.input]}
                  value={bookName}
                  onChangeText={setBookName}
                />
                <TouchableOpacity onPress={() => setScanned(true)}>
                  <Ionicons name="camera" size={24} style={styles.searchIcon} />
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(1450).duration(5000).springify()}>
              {isLoading ? (
                <TouchableOpacity style={styles.button}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.button} onPress={() => {}}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              )}
            </Animated.View>

          </Animated.View>
        </>
      )}
    </View>
  );
}
