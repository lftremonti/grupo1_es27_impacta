import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';
import {DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { User } from '../types/User'; // Importe a interface User
import { useAuthSignIn } from '../hooks/auth';

interface CustomDrawerProps extends DrawerContentComponentProps {
  userData: User | null;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ userData, ...props }) => {
  
  const { signOutUser } = useAuthSignIn();

  const handleSignOut = async () => {
    await signOutUser();
  };

  useEffect(() => {
  }, [userData]);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: '#073F72'}}>
        <View style={{padding: 20, backgroundColor: '#073F72'}}>
          <Image source={require('../assets/user-profile.jpg')} style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}/>
          <Text style={{color: '#fff', fontSize: 18, marginBottom: 5}}>
            {userData?.nome}
          </Text>
        </View>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc', backgroundColor: '#f0f0f0'}}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Profile', { user: userData })} style={{paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="person-circle-outline" size={22} />
            <Text style={{ fontSize: 15, marginLeft: 5}}>
              Perfil
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} />
            <Text style={{ fontSize: 15, marginLeft: 5}}>
              Sair
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
  
export default CustomDrawer;  