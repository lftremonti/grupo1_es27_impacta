import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Image,
    FlatList
} from 'react-native';
import { ActivityIndicator, Provider } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import CustomDialog from '@/components/CustomDialog';
import { RootStackParamList } from "@/routes/app.routes";
import { Stations } from "@/types/Stations";
import { Book } from "@/types/Book";

type BookDetailsProps = {
  route: RouteProp<RootStackParamList, 'BookReservation'>;
  navigation: StackNavigationProp<RootStackParamList, 'BookReservation'>;
}; 

export default function BookReservation({ route, navigation }: BookDetailsProps){

    const { book, user } = route.params;
    const [stations, setStations] = useState<Stations[]>([]);
    const [selectedStation, setSelectedStation] = useState<number>();
    const [currentLocation, setCurrentLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([book]);

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

    const hideDialog = () => {
        setVisible(false);
        if (dialogType === 'success') {
        }
    };

    const selectedLocation = selectedStation
    ? stations.find((station) => station.ad_pontodoacao_id === selectedStation)
    : null;

    // Monta o layout dos livros a ser exibido ao utilizar a busca por nome
    const renderBookSearch = ({ item }: { item: Book }) => {
        // Definindo a fonte da imagem com uma expressão condicional
        const imageSource = item.imagem_url
          ? { uri: item.imagem_url }
          : item.imagem_base64
          ? { uri: `data:image/png;base64,${item.imagem_base64}` }
          : null;
      
        return (
          <TouchableOpacity onPress={() => navigation.navigate('BookDetails', { book: item })}>
            <View style={styles.bookSearchContainer}>
              {imageSource && (
                <Image source={imageSource} style={styles.bookCover} />
              )}
              <View style={styles.bookSearchInfo}>
                <Text style={styles.bookSearchTitle}>{item.titulo}</Text>
                <Text style={styles.bookSearchAuthor}>{item.autor}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
    };

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
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 5 }}>
                                    <Text style={styles.welcome}>Ótima escolha!</Text>
                                    <Text style={styles.instructions}>
                                        Você selecionou um livro para embarcar em uma nova jornada. Agora, vamos encontrar onde ele está disponível para que você possa começar sua leitura!
                                    </Text>
                                </View>
                            </Animated.View>
                        </>
                    }
                    ListFooterComponent={
                        <Animated.View entering={FadeInDown.delay(650).duration(3500).springify()}>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 5 }}></View>
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
                                    {selectedLocation && (
                                        <Marker
                                            coordinate={{
                                                latitude: Number(selectedLocation.latitude),
                                                longitude: Number(selectedLocation.longitude),
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
                    }
                />
            </TouchableWithoutFeedback>
        </Provider>
    );
}