import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
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

type BookDetailsProps = {
  route: RouteProp<RootStackParamList, 'BookReservation'>;
  navigation: StackNavigationProp<RootStackParamList, 'BookReservation'>;
}; 

export default function BookReservation({ route, navigation }: BookDetailsProps){

    const [stations, setStations] = useState<Stations[]>([]);
    const [selectedStation, setSelectedStation] = useState<number>();
    const [currentLocation, setCurrentLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    const selectedLocation = selectedStation
    ? stations.find((station) => station.ad_pontodoacao_id === selectedStation)
    : null;

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
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </Provider>
    );
}