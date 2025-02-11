import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { Picker } from '@react-native-picker/picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/routes/app.routes';
import { ActivityIndicator, Provider } from 'react-native-paper';
import CustomDialog from '@/components/CustomDialog';
import { Stations } from '@/types/Stations';
import { getAllDonationPoint } from '../../../services/StationsService/StationsService';
import { saveBook } from '@/services/BookService/BookService';
import { linkBookWithCategory } from '@/services/CategoryService/CategoryService';
import { donateBook } from '@/services/DonateBookService/DonateBookService';
import * as SecureStore from 'expo-secure-store';

type BookRegisterProps = {
  route: RouteProp<RootStackParamList, 'RegisterBookPart3'>;
  navigation: StackNavigationProp<RootStackParamList, 'RegisterBookPart3'>;
};

export function RegisterBookPart3({ route, navigation }: BookRegisterProps){
  const { bookDataInfo } = route.params;

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stations, setStations] = useState<Stations[]>([]);
  const [selectedStation, setSelectedStation] = useState<number>();
  const [errors, setErrors] = useState({ selectedStation: false });

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
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
          return;
        }
      }
      getCurrentLocation();
    };

    requestLocationPermission();
    fetchStations();
  }, []);

  const selectedLocation = selectedStation
  ? stations.find((station) => station.ad_pontodoacao_id === selectedStation)
  : null;

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Apenas redefinir se necessário
        setSelectedStation(0);
        setStations([]);
      };
    }, [])
  );

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },(error) => {
        Alert.alert('Erro ao obter localização', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  //getUserId para retornar o ID do usuário
  const getUserId = async (): Promise<number | null> => {
    const storedUserData = await SecureStore.getItemAsync('userData');   
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      return parsedData.id;
    }
  
    console.warn("No user data found in secure storage");
    return null;
  };

  const handleRegisterBook = async () => {
    setErrors({ selectedStation: false });
    const newErrors = {
      selectedStation: !selectedStation,
    };
  
    if (newErrors.selectedStation) {
      setErrors(newErrors);
      showDialog('Campos Obrigatórios', 'Por favor, preencha todos os campos!', 'fail');
      return;
    }
  
    setIsLoading(true);

    try {
      const usuarioId = await getUserId();

      const bookPayload = {
        titulo: bookDataInfo.bookDataInfo.title,
        autor: bookDataInfo.author,
        editora: bookDataInfo.publisher,
        ano_publicacao: bookDataInfo.year,
        descricao: bookDataInfo.description,
        ISBN10: '',
        ISBN13: bookDataInfo.bookDataInfo.isbn,
        images: bookDataInfo.bookDataInfo.images
      };

      const newBook = await saveBook(bookPayload);
      
      const linkPayload = {
        livroId: newBook.data.book.ad_livros_id,
        categoryId: bookDataInfo.selectedCategory
      };

      await linkBookWithCategory(linkPayload);

      if(selectedStation != null && usuarioId != null) {
        const donatebook = {
          isbn: bookDataInfo.bookDataInfo.isbn,
          pontoDeDoacaoId: selectedStation,
          usuarioId: usuarioId
        }
  
        const donate = await donateBook(donatebook);
        if(donate.status == 201){
          showDialog("Sucesso", "Doação registrada com sucesso!", 'success');
        }
      }
    } catch (error) {
      showDialog('Erro', `Lamentamos pelo ocorrido. Por favor, tente novamente.`, 'fail');
      console.log(Error)
    } finally {
      setIsLoading(false);
    }
  };

  const hideDialog = () => {
    setVisible(false);
    if (dialogType === 'success') {
      navigation.navigate('Home' as never);
    }
  };

  const fetchStations = async () => {
    try {
      const response = await getAllDonationPoint(); 
  
      if (response?.data?.donationPoint) {
        const formattedStations = response.data.donationPoint.map((station: Stations) => ({
          ...station,
          latitude: Number(station.latitude),  // Converte para número
          longitude: Number(station.longitude) // Converte para número
        }));
        setStations(formattedStations);
      } else {
        setStations([]); // Garante um array vazio caso não existam dados
      }
    } catch (error) {
      console.error('Erro ao buscar estações:', error);
      setStations([]); // Evita `undefined`
    }
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
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
              <Ionicons name="arrow-back-outline" size={24} color={styles.backArrowColor.color} />
            </TouchableOpacity>

            <Animated.View entering={FadeInDown.delay(200).duration(3500).springify()}>
              <Text style={styles.welcome}>Doe um livro</Text>
              <Text style={styles.instructions}>
                Compartilhe o conhecimento e inspire outras pessoas! Doe seus livros e transforme vidas através da leitura.
              </Text>

              <Animated.View entering={FadeInDown.delay(450).duration(3500).springify()}>
                <Text style={styles.label}>Selecione uma estação de São Paulo:</Text>
                <View style={[styles.viewInputCategory, errors.selectedStation && { borderColor: 'red', borderWidth: 1 }]}>
                <Picker
                  selectedValue={selectedStation ?? stations[0]?.ad_pontodoacao_id}
                  onValueChange={(itemValue) => setSelectedStation(itemValue)}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="Selecione um endereço" value='' />
                  {stations.map((station: Stations) => (
                    <Picker.Item 
                      key={station.ad_pontodoacao_id} 
                      label={station.nome} 
                      value={station.ad_pontodoacao_id} />
                  ))}
                </Picker>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(650).duration(3500).springify()}>
                <Text style={styles.label}>Localização no mapa</Text>
                <View style={styles.viewInputCategory}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: currentLocation?.latitude || -23.55052,
                      longitude: currentLocation?.longitude || -46.633308,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    }}
                    region={
                      selectedLocation
                        ? {
                            latitude: selectedLocation.latitude,
                            longitude: selectedLocation.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                          }
                        : currentLocation
                        ? {
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                          }
                        : undefined
                    }
                  >
                    {selectedLocation && (
                      <Marker
                        coordinate={{
                          latitude: Number(selectedLocation.latitude), // Converte para número
                          longitude: Number(selectedLocation.longitude), // Converte para número
                        }}
                        title={selectedLocation.nome}
                      />
                    )}
                    {currentLocation && (
                      <Marker
                        coordinate={{
                          latitude: currentLocation.latitude,
                          longitude: currentLocation.longitude,
                        }}
                        title="Sua localização"
                        pinColor="blue"
                      />
                    )}
                  </MapView>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(850).duration(3500).springify()}>
                <TouchableOpacity style={styles.button} onPress={handleRegisterBook}>
                {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                ) : ( 
                  <Text style={styles.buttonText}>Cadastrar</Text>
                )}
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </Provider>
  );
}