import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Secure Storage for sensitive data (tokens, passwords)
export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('[SecureStore] Error setting item:', error);
      throw error;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('[SecureStore] Error getting item:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('[SecureStore] Error removing item:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      // SecureStore doesn't have a clear method, so we remove known keys
      const keys = ['accessToken', 'refreshToken', 'user'];
      await Promise.all(keys.map((key) => this.removeItem(key)));
    } catch (error) {
      console.error('[SecureStore] Error clearing storage:', error);
    }
  },
};

// General Storage for non-sensitive data
export const storage = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
    } catch (error) {
      console.error('[AsyncStorage] Error setting item:', error);
      throw error;
    }
  },

  async getItem(key: string): Promise<any | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('[AsyncStorage] Error getting item:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('[AsyncStorage] Error removing item:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[AsyncStorage] Error clearing storage:', error);
    }
  },

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('[AsyncStorage] Error getting keys:', error);
      return [];
    }
  },

  async multiGet(keys: string[]): Promise<Record<string, any>> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};
      values.forEach(([key, value]) => {
        result[key] = value ? JSON.parse(value) : null;
      });
      return result;
    } catch (error) {
      console.error('[AsyncStorage] Error multi-getting items:', error);
      return {};
    }
  },
};

// Storage keys constants
export const STORAGE_KEYS = {
  AUTH: 'auth',
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recent_searches',
  SAVED_ADDRESSES: 'saved_addresses',
  FAVORITES: 'favorites',
} as const;
