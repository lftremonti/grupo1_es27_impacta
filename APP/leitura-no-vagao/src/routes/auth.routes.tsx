import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { EmailInputScreen } from '../pages/PasswordReset/EmailInputScreen';
import { CodeValidationScreen } from '../pages/PasswordReset/CodeValidationScreen';
import { PasswordResetScreen } from '../pages/PasswordReset/PasswordResetScreen';

// Definir tipos para as rotas
export type RootStackParamList = {
  SignIn: undefined;  // Rota que não precisa de parâmetro
  SignUp: undefined; // Também sem parâmetros
  EmailInputScreen: undefined;
  CodeValidationScreen: { userExists: any };  // Rota que precisa de um parâmetro
  PasswordResetScreen: { userid: string; code: string }
};

const Stack = createStackNavigator<RootStackParamList>();

export function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="EmailInputScreen" component={EmailInputScreen} />
      <Stack.Screen name="CodeValidationScreen" component={CodeValidationScreen} />
      <Stack.Screen name="PasswordResetScreen" component={PasswordResetScreen} />
    </Stack.Navigator>
  );
}
