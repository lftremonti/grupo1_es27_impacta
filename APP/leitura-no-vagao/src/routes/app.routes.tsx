import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as SecureStore from 'expo-secure-store'; // Não se esqueça de importar SecureStore
import CustomDrawer from '../components/CustomDrawer';
import { Home } from '../pages/Home';
import { BookDetails } from '../pages/BookDetails';
import { User } from '../types/User'; // Importe a interface User
import { RegisterBook } from '../pages/RegisterBook'
import { Book } from '../types/Book';

// Definir o tipo de parâmetros para o BookDetails
export type RootStackParamList = {
  Home: undefined;
  BookDetails: { book: Book };
  RegisterBook: undefined;
  CommentsBook: undefined;
};

const Drawer = createDrawerNavigator<RootStackParamList>();

export function AppRoutes() {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = await SecureStore.getItemAsync('userToken');
      const storedUserData = await SecureStore.getItemAsync('userData');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawer {...props} userData={userData} />}
      screenOptions={{ headerShown: false }}
      key={userData?.nome}>
      
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen
        name="BookDetails"
        component={BookDetails}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen 
        name="RegisterBook" 
        component={RegisterBook} 
        options={{
          title: 'Doar Livro',
        }}
      />
    </Drawer.Navigator>
  );
}
