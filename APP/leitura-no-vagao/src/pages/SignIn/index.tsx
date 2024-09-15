import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Provider as PaperProvider } from 'react-native-paper';

import { styles } from './styles';
import { useAuth } from '../../hooks/auth';
import CustomDialog from '../../components/CustomDialog';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { signIn } = useAuth();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [key, setKey] = useState(Math.random());

  const [errors, setErrors] = useState({ email: false, password: false });
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
  };

  const handleSignIn = async () => {
    setErrors({ email: false, password: false });
    const newErrors = {
      email: !email,
      password: !password,
    };

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      showDialog('Campos Obrigatorios', 'Por favor, preencha todos os campos!', 'fail');
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      Alert.alert('Login Success', `Welcome back, ${email}!`);
    } catch (error: any) {
      showDialog('Error', 'Não foi possível autenticar.', 'fail');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setEmail('');
      setPassword('');
      setErrors({ email: false, password: false });
      setKey(Math.random());
    }
  }, [isFocused]);

  return (
    <PaperProvider>
      <CustomDialog
        visible={visible}
        hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        type={dialogType}
      />
      <View key={key} style={styles.container}>
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
            <TouchableOpacity onPress={() => navigation.navigate('EmailInputScreen' as never)}>
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
    </PaperProvider>
  );
}