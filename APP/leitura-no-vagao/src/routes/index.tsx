import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';
import { useAuthSignIn } from '../hooks/auth';
import { useAuth } from '@clerk/clerk-expo';

export function Routes() {
  const { user } = useAuthSignIn();
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <NavigationContainer>
      {isSignedIn || (user && user.id) ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
