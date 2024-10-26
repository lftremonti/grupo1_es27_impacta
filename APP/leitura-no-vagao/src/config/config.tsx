import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.URL_API || `http://localhost:3333`;
const TOKEN_URL = Constants.expoConfig?.extra?.BYPASS_TOKEN_KEY;

export default {
    BASE_URL,
    TOKEN_URL
}