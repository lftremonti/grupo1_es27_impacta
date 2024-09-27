import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Routes } from './src/routes';
import { AuthProvider } from './src/hooks/auth';
import { Montserrat_700Bold, Montserrat_500Medium, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from './src/storage/tokenCache';
import { LogBox } from 'react-native';

// Impedir que a splash screen esconda automaticamente
SplashScreen.preventAutoHideAsync();
const EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

LogBox.ignoreAllLogs(); 

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
    <View style={{ flex: 1 }}>
      <ClerkProvider publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ClerkProvider>
    </View>
  );
}
