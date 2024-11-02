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
import { saveUserService } from '../../services/SignUp/SignUpService';
import { Provider as PaperProvider } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';

import { styles } from './styles';
import CustomDialog from '../../components/CustomDialog';

export function SignUp() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);

  const navigation = useNavigation();
  const [errors, setErrors] = useState({ name: false, email: false, phone: false, password: false, confirmPassword: false });

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
      navigation.navigate('SignIn' as never);
    }
  };

  const handleSignUp = async () => {
    // Resetar erros
    setErrors({ name: false, email: false, phone: false, password: false, confirmPassword: false });
    // Verifica se os campos estão vazios
    const newErrors = {
      name: !name,
      email: !email,
      phone: !phone,
      password: !password,
      confirmPassword: !confirmPassword
    };

    // Mostrar a caixa de erro pedindo que o usuário não preencheu todos os campos
    if (newErrors.name || newErrors.email || newErrors.phone || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      showDialog('Campos Obrigatórios', 'Por favor, preencha todos os campos!', 'fail');
      return;
    }

    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      showDialog('Ops...', 'As senhas não coincidem!\nPor favor, tente novamente.', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const newUser = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        idAuthGoogle: ''
      };

      await saveUserService(newUser); // Salvar o novo usuário
        
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      showDialog('Erro', `Lamentamos pelo ocorrido. Por favor, tente novamente.`, 'fail');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaperProvider>
      <CustomDialog
        visible={visible}
        hideDialog={hideDialog}
        title={dialogTitle}
        message={dialogMessage}
        type={dialogType}
      />
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn' as never)} style={styles.backButton}>
          <Icon name="arrow-back-outline" size={24} color={styles.backArrowColor.color} />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
          <Text style={styles.welcome}>Vamos começar sua jornada!</Text>
          <Text style={styles.instructions}>Por favor, preencha todos os campos para criar sua conta</Text>

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
            <Text style={styles.label}>Telefone</Text>
            <TextInputMask
              style={[styles.input, errors.phone && { borderColor: 'red', borderWidth: 1 }]}
              placeholder="Insira o numero do seu telefone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCapitalize="none"
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1050).duration(5000).springify()}>
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

          <Animated.View entering={FadeInDown.delay(1250).duration(5000).springify()}>
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

          <Animated.View entering={FadeInDown.delay(1450).duration(5000).springify()}>
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

          <Animated.View entering={FadeInDown.delay(1650).duration(5000).springify()}>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn' as never)}>
              <Text style={styles.signUpText}>Já possui uma conta? <Text style={styles.forgotPasswordLink}>Clique aqui</Text></Text>
            </TouchableOpacity>
          </Animated.View>

        </Animated.View>
      </View>
    </PaperProvider>
  );
}