import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

import { styles } from './styles';

export function SignUp() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  
  const navigation = useNavigation();

  const [errors, setErrors] = useState({ name: false, email: false, password: false, confirmPassword: false });

  const handleSignUp = () => {
    // Resetar erros
    setErrors({ name: false, email: false, password: false, confirmPassword: false });

    // Verifica se os campos estão vazios
    const newErrors = {
      name: !name,
      email: !email,
      password: !password,
      confirmPassword: !confirmPassword
    };

    //mostra a caixa de erro pedindo que o usuario não preencheu todos os campos
    if (newErrors.name || newErrors.email || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Campos obrigatórios',
        textBody: 'Por favor, preencha todos os campos!',
        button: 'Fechar',
      });
      return;
    }
    
    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Ops...',
        textBody: 'As senhas não coincidem!\nPor favor, tente novamente.',
        button: 'Fechar',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Cadastro Sucesso',
        textBody: `Bem-vindo, ${name}!`,
      });
    }, 2000);
  };

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn' as never)} style={styles.backButton}>
          <Icon name="arrow-back-outline" size={24} color={styles.backArrowColor.color} />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
          <Text style={styles.welcome}>Vamos começar sua jornada!</Text>
          <Text style={styles.instructions}>Por favor, preencha todos os campo para criamos sua conta</Text>

          <Animated.View entering={FadeInDown.delay(450).duration(5000).springify()}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={[styles.input, errors.name && { borderColor: 'red', borderWidth: 1 }]}
              placeholder="Insira seu nome"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(650).duration(5000).springify()}>
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

          <Animated.View entering={FadeInDown.delay(850).duration(5000).springify()}>
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

          <Animated.View entering={FadeInDown.delay(1050).duration(5000).springify()}>
            <Text style={styles.label}>Confirmação</Text>
            <View style={[styles.inputWrapper, errors.confirmPassword && { borderColor: 'red', borderWidth: 1 }]}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                <Icon name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1250).duration(5000).springify()}>
            {isLoading ? (
              <TouchableOpacity style={styles.button}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Criar conta</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1450).duration(5000).springify()}>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn' as never)}>
              <Text style={styles.signUpText}>Já possui uma conta? <Text style={styles.forgotPasswordLink}>Clique aqui</Text></Text>
            </TouchableOpacity>
          </Animated.View>

        </Animated.View>
      </View>
    </AlertNotificationRoot>
  );
}