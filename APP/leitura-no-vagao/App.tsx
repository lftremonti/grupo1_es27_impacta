import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Routes } from './src/routes';
import { AuthProvider } from './src/hooks/auth';
import { AlertNotificationRoot } from 'react-native-alert-notification'; // Importar AlertNotificationRoot
import { Montserrat_700Bold, Montserrat_500Medium, Montserrat_400Regular } from '@expo-google-fonts/montserrat';

// Impedir que a splash screen esconda automaticamente
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Montserrat_700Bold,
          Montserrat_500Medium,
          Montserrat_400Regular,
        });
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      } catch (e) {
        console.error('Error loading fonts', e);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Retorne null para que não renda até as fontes serem carregadas
  }

  return (
    <AlertNotificationRoot>
      <View style={{ flex: 1 }}>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </View>
    </AlertNotificationRoot>
  );
}
