import * as SecureStorage from "expo-secure-store"

async function getToken(key: string){
    try {
        return SecureStorage.getItem(key)
    } catch (error) {
        throw error
    }
}

async function saveToken(key: string, value: string){
    try {
        return SecureStorage.setItemAsync(key, value)
    } catch (error) {
        throw error
    }
}

export const tokenCache = { getToken, saveToken }