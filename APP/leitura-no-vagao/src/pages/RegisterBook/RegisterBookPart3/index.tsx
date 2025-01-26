import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
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

type BookRegisterProps = {
  route: RouteProp<RootStackParamList, 'RegisterBookPart3'>;
  navigation: StackNavigationProp<RootStackParamList, 'RegisterBookPart3'>;
};

export function RegisterBookPart3({ route, navigation }: BookRegisterProps){
  const { bookInfo } = route.params;

  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const stations = [
    { id: 1, name: 'Estação Sé', latitude: -23.55052, longitude: -46.633308 },
    { id: 2, name: 'Estação Consolação', latitude: -23.556735, longitude: -46.662327 },
    { id: 3, name: 'Estação Luz', latitude: -23.536201, longitude: -46.633105 },
  ];

  const selectedLocation = selectedStation
  ? stations.find((station) => station.id === selectedStation)
  : null;

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
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        Alert.alert('Erro ao obter localização', error.message);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
              <View style={styles.viewInputCategory}>
                <Picker
                  selectedValue={selectedStation}
                  onValueChange={(itemValue) => setSelectedStation(itemValue)}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="Selecione um endereço" value={null} />
                  {stations.map((station) => (
                    <Picker.Item key={station.id} label={station.name} value={station.id} />
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
                        latitude: selectedLocation.latitude,
                        longitude: selectedLocation.longitude,
                      }}
                      title={selectedLocation.name}
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
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home' as never)}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}