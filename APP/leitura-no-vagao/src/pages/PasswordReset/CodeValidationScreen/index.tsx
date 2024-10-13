import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import ProgressBar from '../../../components/ProgressBar';
import { Provider as PaperProvider } from 'react-native-paper';
import { styles } from './styles';
import CustomDialog from '../../../components/CustomDialog';
import CodeInput from '../../../components/CodeInput';
import { verifySendCode } from '../../../services/PasswordReset/PasswordResetService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../routes/auth.routes';  // Certifique-se de ajustar o caminho

interface RouteParams {
  userExists: any;  // Defina o tipo adequado para userExists
}

type PasswordResetScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CodeValidationScreen'
>;

export function CodeValidationScreen() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); 

  const navigation = useNavigation<PasswordResetScreenNavigationProp>();
  const route = useRoute();  // Use o hook useRoute
  const { userExists } = route.params as RouteParams;
  
  const [errors, setErrors] = useState({ code: false });

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
    setErrors({ code: false });
    
    if (!code || code.length < 6) {
      showDialog('Código Inválido', 'O código deve ter 6 dígitos. Por favor, tente novamente.', 'fail');
      return;
    }

    setIsLoading(true);

    try {
      const isValidCode = await verifySendCode(userExists.user.ad_usuario_id, code);
      const userid = String(userExists.user.ad_usuario_id);

      if (isValidCode.status === 200) {
        navigation.navigate('PasswordResetScreen', { userid, code });
      } else {
        showDialog('Erro', 'O código que você inseriu está incorreto.', 'fail');
      }
    } catch (error) {
      console.error("Error ao verificar o codigo:", error);
      showDialog('Error', 'Não foi possível verificar o codigo, tente novamente mais tarde..', 'fail');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(66); 
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
        <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
          <Text style={styles.welcome}>Código Enviado!</Text>
          <Text style={styles.instructions}>Verifique seu email e insira o código de 6 dígitos que enviamos.</Text>

          <Animated.View entering={FadeInDown.delay(450).duration(5000).springify()}>
            <CodeInput
              value={code}
              onChange={setCode}
              hasError={errors.code} // Passa o estado de erro
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(650).duration(5000).springify()}>
            {isLoading ? (
              <TouchableOpacity style={styles.button}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Prosseguir</Text>
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