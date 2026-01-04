import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const createTokenCache = () => {
    return {
        getToken: async (key: string) => {
            // NOTE: SecureStore is disabled because the native module is missing (needs rebuild).
            // Using AsyncStorage directly to prevent "Cannot find native module" RedBox error.
            try {
                return await AsyncStorage.getItem(key);
            } catch (e) {
                console.error("AsyncStorage error:", e);
                return null;
            }
        },
        saveToken: async (key: string, token: string) => {
            try {
                return await AsyncStorage.setItem(key, token);
            } catch (e) {
                console.error("AsyncStorage save error:", e);
            }
        },
    };
};

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined;
