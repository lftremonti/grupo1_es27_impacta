import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import ProgressBar from '../../../components/ProgressBar';
import { Provider as PaperProvider } from 'react-native-paper';
import { styles } from './styles';
import CustomDialog from '../../../components/CustomDialog';
import { checkUserExistsService } from '../../../services/SignIn/SignInService';
import { sendResetCode } from '../../../services/PasswordReset/PasswordResetService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../routes/auth.routes';  // Certifique-se de ajustar o caminho

// Definir o tipo de navegação
type EmailInputScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EmailInputScreen'>;

export function EmailInputScreen() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const navigation = useNavigation<EmailInputScreenNavigationProp>();
  const [errors, setErrors] = useState({ email: false });

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

  const handleSubmit = async () => {
    setErrors({ email: false });

    const newErrors = { email: !email };

    if (newErrors.email) {
      setErrors(newErrors);
      showDialog('Oops...', 'Parece que você esqueceu de preencher o email.', 'fail');
      return;
    }

    setIsLoading(true);

    try {
      const userExists = await checkUserExistsService(email);
      if (userExists.exists) {
        
        const sendCode = await sendResetCode(email);
        if(sendCode.type === 'success' && sendCode.status === 200){
          navigation.navigate('CodeValidationScreen', { userExists });
        } else {
          console.error("Erro ao enviar código de redefinição", sendCode);
          showDialog('Error', 'Falha ao enviar o código de redefinição. Tente novamente mais tarde.', 'fail');
        }
      }else{
        showDialog('Error', 'Email informado não existe na base de dados', 'fail');
      }
    } catch (error) {
      console.error("Error ao verificar usuario:", error);
      showDialog('Error', 'Não foi possível verificar o email, tente novamente mais tarde..', 'fail');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(33);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

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
          <Text style={styles.welcome}>Vamos redefinir sua senha!</Text>
          <Text style={styles.instructions}>Digite seu email para continuar.</Text>

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

          <Animated.View entering={FadeInDown.delay(650).duration(5000).springify()}>
            {isLoading ? (
              <TouchableOpacity style={styles.button}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(850).duration(5000).springify()}>
            <ProgressBar progress={progress} duration={1000} />
          </Animated.View>
        </Animated.View>
      </View>
    </PaperProvider>
  );
}