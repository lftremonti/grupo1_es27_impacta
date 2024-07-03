import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from './styles';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    
    // Simulate an API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Login Success', `Welcome back, ${email}!`);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-Vindo de Volta!</Text>
      <Text style={styles.instructions}>Por favor, insira seu email e sua senha para acessar sua conta</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Insira sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => Alert.alert('Esqueci a senha', 'Link para resetar senha enviado')}>
        <Text style={styles.forgotPassword}>Esqueceu sua senha? <Text style={styles.forgotPasswordLink}>Clique aqui</Text></Text>
      </TouchableOpacity>

      {isLoading ? (
        <TouchableOpacity style={styles.button}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>ou</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={() => Alert.alert('Login com Google')}>
        <View style={styles.googleButtonContent}>
          <Image source={require('../../assets/googleIcons.png')} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Entrar com o Google</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.signUpText}>Não possui uma conta?</Text>
      <TouchableOpacity style={styles.buttonSignUp} onPress={() => Alert.alert('Cadastrar', 'Tela de cadastro')}>
        <Text style={styles.signUpLink}>Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}
