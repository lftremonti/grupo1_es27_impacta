import React, { useState, useEffect } from 'react';
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
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

import { styles } from './styles';
import { useAuth } from '../../hooks/auth';

export function SignIn() {
  const [email, setEmail] = useState(''); // email
  const [password, setPassword] = useState(''); // senha
  const [isLoading, setIsLoading] = useState(false); // loop de carregamento
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // senha visivel ou não
  const { signIn } = useAuth(); // Função de login
  const navigation = useNavigation(); // Para navegação
  const isFocused = useIsFocused(); // Para detectar se a tela está focada

  const [errors, setErrors] = useState({ email: false, password: false });

  const handleSignIn = async () => {
    // Resetar erros
    setErrors({ email: false, password: false });

    // Verifica se os campos estão vazios
    const newErrors = {
      email: !email,
      password: !password,
    };

    // Mostra a caixa de erro pedindo que o usuário preencha todos os campos
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Campos obrigatórios',
        textBody: 'Por favor, preencha todos os campos!',
        button: 'Fechar',
      });
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      Alert.alert('Login Success', `Welcome back, ${email}!`);
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Não foi possivel autenticar.',
        textBody: error.message,
        button: 'Fechar',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Força a animação a reproduzir sempre que a tela de login estiver focada
  useEffect(() => {
    if (isFocused) {
      // Qualquer lógica de inicialização necessária quando a tela é focada
    }
  }, [isFocused]);

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
          <Text style={styles.welcome}>Bem-Vindo</Text>
          <Text style={styles.instructions}>Por favor, insira seu email e sua senha para acessar sua conta</Text>

          <Animated.View entering={FadeInDown.delay(450).duration(5000).springify()}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && { borderColor: 'red', borderWidth: 1 }]}
              placeholder="Insira seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(450).duration(5000).springify()}>
            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputWrapper, errors.password && { borderColor: 'red', borderWidth: 1 }]}>
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
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(650).duration(5000).springify()}>
            <TouchableOpacity onPress={() => Alert.alert('Esqueci a senha', 'Link para resetar senha enviado')}>
              <Text style={styles.forgotPassword}>Esqueceu sua senha? <Text style={styles.forgotPasswordLink}>Clique aqui</Text></Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(850).duration(5000).springify()}>
            {isLoading ? (
              <TouchableOpacity style={styles.button}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1050).duration(5000).springify()}>
            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>ou</Text>
              <View style={styles.line} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1050).duration(5000).springify()}>
            <TouchableOpacity style={styles.googleButton} onPress={() => Alert.alert('Login com Google')}>
              <View style={styles.googleButtonContent}>
                <Image source={require('../../assets/googleIcons.png')} style={styles.googleIcon} />
                <Text style={styles.googleButtonText}>Entrar com o Google</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1050).duration(5000).springify()}>
            <Text style={styles.signUpText}>Não possui uma conta?</Text>
            <TouchableOpacity style={styles.buttonSignUp} onPress={() => navigation.navigate('SignUp' as never)}>
              <Text style={styles.signUpLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </AlertNotificationRoot>
  );
}