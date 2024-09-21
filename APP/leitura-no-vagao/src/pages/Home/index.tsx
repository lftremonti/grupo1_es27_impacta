import React from 'react';
import { View, Text, Button} from 'react-native';
import { useAuth } from '../../hooks/auth';
import { styles } from './styles';

export function Home() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem-vindo à tela Home</Text>
      <Button title="Sair" onPress={handleSignOut} />
    </View>
  );
}