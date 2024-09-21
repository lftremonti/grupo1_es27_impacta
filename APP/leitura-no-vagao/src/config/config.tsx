import Constants from 'expo-constants';

const BASE_URL =  Constants.expoConfig?.extra?.URL_API || `http://localhost:3333`;

export default {
    BASE_URL
}