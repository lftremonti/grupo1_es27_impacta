import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import ProgressBar from '../../../components/ProgressBar';
import { Provider as PaperProvider } from 'react-native-paper';

import { styles } from './styles';
import CustomDialog from '../../../components/CustomDialog';
import CodeInput from '../../../components/CodeInput';

export function CodeValidationScreen() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); 

  const navigation = useNavigation();
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

    const isValidCode = code === '123456'; // Simulação de validação
    if (isValidCode) {
      navigation.navigate('PasswordResetScreen' as never);
    } else {
      showDialog('Erro', 'O código que você inseriu está incorreto.', 'fail');
    }
    setIsLoading(false);
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