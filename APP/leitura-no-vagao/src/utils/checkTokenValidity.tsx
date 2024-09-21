import AsyncStorage from '@react-native-async-storage/async-storage';

const jwt_decode = require('jwt-decode')

interface DecodedToken {
    exp: number;
}

export async function checkTokenValidity(): Promise<boolean> {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if(!token) {
            return false;
        }

        const decodedToken: DecodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp > currentTime;
    } catch (error) {
        console.log('Error ao checar o token', error);
        return false;
    }
}