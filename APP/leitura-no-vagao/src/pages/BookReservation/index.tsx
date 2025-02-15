import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    FlatList,
    Alert,
    PermissionsAndroid,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Provider } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { RootStackParamList } from "@/routes/app.routes";
import { Stations } from "@/types/Stations";
import { Book } from "@/types/Book";
import { getDonationPointByBookId } from "@/services/StationsService/StationsService";
import Geolocation from 'react-native-geolocation-service';

type BookDetailsProps = {
  route: RouteProp<RootStackParamList, 'BookReservation'>;
  navigation: StackNavigationProp<RootStackParamList, 'BookReservation'>;
};

export default function BookReservation({ route, navigation }: BookDetailsProps) {
    const { book } = route.params;
    const [stations, setStations] = useState<Stations[]>([]);
    const [selectedStation, setSelectedStation] = useState<number | null>(null);
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([book]);
    const [loading, setLoading] = useState<boolean>(false);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Permissão de Localização",
                    message: "Precisamos da sua localização para mostrar os pontos de doação.",
                    buttonNeutral: "Perguntar depois",
                    buttonNegative: "Cancelar",
                    buttonPositive: "OK"
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const getCurrentLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Alert.alert('Permissão negada', 'Não foi possível obter sua localização.');
            return;
        }
    
        Geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                Alert.alert('Erro ao obter localização', error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    useEffect(() => {
        getCurrentLocation();
        setFilteredBooks([book]);
        fetchStationsByBookId();
    }, [book]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                setSelectedStation(null);
                setStations([]);
                setFilteredBooks([book]);
            };
        }, [book])
    );

    const fetchStationsByBookId = async () => {
        setLoading(true);
        try {
            const response = await getDonationPointByBookId(book.ad_livros_id);
            if (response?.data?.donationPoint) {
                const formattedStations = response.data.donationPoint.map((station: Stations) => ({
                    ...station,
                    latitude: Number(station.latitude),
                    longitude: Number(station.longitude),
                }));
                setStations(formattedStations);
            } else {
                setStations([]);
            }
        } catch (error) {
            console.error('Erro ao buscar estações:', error);
            Alert.alert('Erro', 'Não foi possível carregar as estações.');
            setStations([]);
        } finally {
            setLoading(false);
        }
    };

    const renderBookSearch = ({ item }: { item: Book }) => {
        const imageSource = item.imagem_url
            ? { uri: item.imagem_url }
            : item.imagem_base64
                ? { uri: `data:image/png;base64,${item.imagem_base64}` }
                : null;

        return (
            <TouchableOpacity onPress={() => navigation.navigate('BookDetails', { book: item })}>
                <View style={styles.bookSearchContainer}>
                    {imageSource && <Image source={imageSource} style={styles.bookCover} />}
                    <View style={styles.bookSearchInfo}>
                        <Text style={styles.bookSearchTitle}>{item.titulo}</Text>
                        <Text style={styles.bookSearchAuthor}>{item.autor}</Text>
                        <Text style={styles.bookSearchAuthor}>Localizações Disponíveis:</Text>
                        {stations.length > 0 ? (
                            stations.map((station, index) => (
                                <Text key={index} style={styles.bookSearchAuthor}>
                                    {station.nome} - {station.rua} ({station.descricao})
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.bookSearchAuthor}>Nenhuma localização encontrada</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const selectedLocation = selectedStation
        ? stations.find((station) => station.ad_pontodoacao_id === selectedStation)
        : null;

    return (
        <Provider>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <FlatList
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    data={filteredBooks}
                    renderItem={renderBookSearch}
                    keyExtractor={(item, index) => `booksearch-${item.ad_livros_id}-${index}`}
                    ListHeaderComponent={
                        <>
                            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
                                <Ionicons name="arrow-back-outline" size={24} color={styles.backArrowColor.color} />
                            </TouchableOpacity>
                            <Animated.View entering={FadeInDown.delay(200).duration(3500).springify()}>
                                <Text style={styles.welcome}>Ótima escolha!</Text>
                                <Text style={styles.instructions}>
                                    Você selecionou um livro para embarcar em uma nova jornada. Agora, vamos encontrar onde ele está disponível para que você possa começar sua leitura!
                                </Text>
                            </Animated.View>
                        </>
                    }
                    ListFooterComponent={
                        <Animated.View entering={FadeInDown.delay(650).duration(3500).springify()}>
                            <Text style={styles.label}>Localização no mapa</Text>
                            <View style={styles.viewInputCategory}>
                                {loading ? (
                                    <ActivityIndicator size="large" color="#0000ff" />
                                ) : (
                                    <MapView
                                        style={styles.map}
                                        initialRegion={{
                                            latitude: currentLocation?.latitude || -23.55052,
                                            longitude: currentLocation?.longitude || -46.633308,
                                            latitudeDelta: 0.05,
                                            longitudeDelta: 0.05,
                                        }}
                                        region={
                                            selectedLocation ? {
                                                latitude: selectedLocation.latitude,
                                                longitude: selectedLocation.longitude,
                                                latitudeDelta: 0.01,
                                                longitudeDelta: 0.01,
                                            } : currentLocation ? {
                                                latitude: currentLocation.latitude,
                                                longitude: currentLocation.longitude,
                                                latitudeDelta: 0.05,
                                                longitudeDelta: 0.05,
                                            } : undefined
                                        }
                                    >
                                        {stations.map((station) => (
                                            <Marker key={station.ad_pontodoacao_id} coordinate={{ latitude: station.latitude, longitude: station.longitude }} title={station.nome} />
                                        ))}
                                        {currentLocation && (
                                            <Marker coordinate={currentLocation} title="Sua localização" pinColor="blue" />
                                        )}
                                    </MapView>
                                )}
                            </View>
                        </Animated.View>
                    }
                />
            </TouchableWithoutFeedback>
        </Provider>
    );
};