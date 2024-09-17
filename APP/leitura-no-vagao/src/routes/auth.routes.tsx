import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { EmailInputScreen } from '../pages/PasswordReset/EmailInputScreen';
import { CodeValidationScreen } from '../pages/PasswordReset/CodeValidationScreen';
import { PasswordResetScreen } from '../pages/PasswordReset/PasswordResetScreen';

const Stack = createStackNavigator();

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
