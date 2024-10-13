import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import ProgressBar from '../../../components/ProgressBar';
import { Provider as PaperProvider } from 'react-native-paper';
import { resetPassword } from '../../../services/PasswordReset/PasswordResetService';

import { styles } from './styles';
import CustomDialog from '../../../components/CustomDialog';

export function PasswordResetScreen() {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const route = useRoute();  // Use o hook useRoute
  const { userid, code } = route.params as { userid: string; code: string };

  const navigation = useNavigation();
  const [errors, setErrors] = useState({ password: false, confirmPassword: false });

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
    setErrors({ password: false, confirmPassword: false });

    const newErrors = {
      password: !password,
      confirmPassword: !confirmPassword
    };

    if (newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      showDialog('Campos obrigatórios', 'Preencha todos os campos para continuar.', 'fail');
      return;
    }

    setIsLoading(true);

    if (password !== confirmPassword) {
      showDialog('Ops...', 'As senhas não coincidem, tente novamente.', 'warning');
      setIsLoading(false);
      return;
    }

    try {
      const resetPass = await resetPassword(userid, code, password);

      if(resetPass.status === 200){
        showDialog('Sucesso', 'Senha redefinida com sucesso!', 'success');
      } else {
        console.log("Error ao resetar a senha")
        showDialog('Error', 'Não foi possível redefinir sua senha, tente novamente mais tarde..', 'fail');
      }
    } catch (error) {
      console.error("Error ao redefinir senha:", error);
      showDialog('Error', 'Não foi possível redefinir sua senha, tente novamente mais tarde..', 'fail');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(100);
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
          <Text style={styles.welcome}>Redefinir senha</Text>
          <Text style={styles.instructions}>Preencha os campos abaixo para redefinir sua senha.</Text>

          <Animated.View entering={FadeInDown.delay(450).duration(5000).springify()}>
            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputWrapper, errors.password && { borderColor: 'red', borderWidth: 1 }]}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Digite sua nova senha"
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
            <Text style={styles.label}>Confirmar senha</Text>
            <View style={[styles.inputWrapper, errors.confirmPassword && { borderColor: 'red', borderWidth: 1 }]}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                <Icon name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(850).duration(5000).springify()}>
            {isLoading ? (
              <TouchableOpacity style={styles.button}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Redefinir Senha</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1050).duration(5000).springify()}>
            <ProgressBar progress={progress} duration={1000}/>
          </Animated.View>
        </Animated.View>
      </View>
    </PaperProvider>
  );
}