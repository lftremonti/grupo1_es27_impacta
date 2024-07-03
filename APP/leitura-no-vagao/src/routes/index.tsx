import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { SignIn } from '../pages/SignIn';

export function Routes(){
  
    return(
      <NavigationContainer>
        <SignIn />
      </NavigationContainer>
    )
  }