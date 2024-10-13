import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';

import { Home } from '../pages/Home';

const Drawer = createDrawerNavigator();

export function AppRoutes() {
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false}}>
      
      <Drawer.Screen name="Home" component={Home} />
      {/* Adicione outras telas que necessitam do login aqui */}
    </Drawer.Navigator>
  );
}
