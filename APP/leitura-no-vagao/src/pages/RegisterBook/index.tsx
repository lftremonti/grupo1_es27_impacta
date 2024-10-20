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

import { Camera } from 'expo-camera';
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

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSignUp = async () => {
    // Implementar lógica de signup
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (!alertShown) {
      setScannedCode(data);
      setScanned(false);
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
              navigation.navigate('BookInfoScreen', { bookInfo: info });
            },
          },
          {
            text: 'Cancelar',
            onPress: () => {
              setAlertShown(false);
              setScanned(true); 
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color={styles.backArrowColor.color} />
      </TouchableOpacity>

      <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
        <Text style={styles.welcome}>Doe um livro</Text>
        <Text style={styles.instructions}>
          Compartilhe o conhecimento e inspire outras pessoas! Doe seus livros e transforme vidas através da leitura.
        </Text>

        <Animated.View entering={FadeInDown.delay(450).duration(5000).springify()}>
          <Text style={styles.label2}>Nome do livro</Text>
          <View style={styles.pbrino2}>
            <TextInput
              placeholder="O pequeno Príncipe"
              style={[styles.psearchInput2, styles.input2]}
              value={bookName}
              onChangeText={setBookName}
            />
            <TouchableOpacity onPress={() => setScanned(true)}>
              <Ionicons name="camera" size={24} style={styles.psearchIcon2} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1450).duration(5000).springify()}>
          {isLoading ? (
            <TouchableOpacity style={styles.button}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

      </Animated.View>
    </View>
  );
}
