import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';
const TOKEN_EXPIRY_KEY = 'token_expiry';

/**
 * Secure Storage - For sensitive data like tokens
 */

export const storage = {
  // Token Management
  async saveToken(token: string) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('[v0] Error saving token:', error);
      throw error;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('[v0] Error getting token:', error);
      return null;
    }
  },

  async removeToken() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('[v0] Error removing token:', error);
      throw error;
    }
  },

  async saveRefreshToken(token: string) {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('[v0] Error saving refresh token:', error);
      throw error;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('[v0] Error getting refresh token:', error);
      return null;
    }
  },

  async removeRefreshToken() {
    try {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('[v0] Error removing refresh token:', error);
      throw error;
    }
  },

  // Token Expiry
  async saveTokenExpiry(expiresIn: number) {
    try {
      const expiryTime = Date.now() + expiresIn;
      await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    } catch (error) {
      console.error('[v0] Error saving token expiry:', error);
      throw error;
    }
  },

  async getTokenExpiry(): Promise<number | null> {
    try {
      const expiry = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
      return expiry ? parseInt(expiry) : null;
    } catch (error) {
      console.error('[v0] Error getting token expiry:', error);
      return null;
    }
  },

  async isTokenExpired(): Promise<boolean> {
    try {
      const expiry = await this.getTokenExpiry();
      if (!expiry) return true;
      return Date.now() > expiry;
    } catch (error) {
      console.error('[v0] Error checking token expiry:', error);
      return true;
    }
  },

  // User Data (non-sensitive, stored in AsyncStorage)
  async saveUser(userData: any) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('[v0] Error saving user data:', error);
      throw error;
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('[v0] Error getting user data:', error);
      return null;
    }
  },

  async removeUser() {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('[v0] Error removing user data:', error);
      throw error;
    }
  },

  // Clear all auth data
  async clearAuthData() {
    try {
      await Promise.all([
        this.removeToken(),
        this.removeRefreshToken(),
        this.removeUser(),
        AsyncStorage.removeItem(TOKEN_EXPIRY_KEY),
      ]);
    } catch (error) {
      console.error('[v0] Error clearing auth data:', error);
      throw error;
    }
  },
};

/**
 * Token validity check - Used on app startup
 */
export async function checkTokenValidity(): Promise<boolean> {
  try {
    const token = await storage.getToken();
    if (!token) return false;

    const isExpired = await storage.isTokenExpired();
    if (isExpired) {
      await storage.clearAuthData();
      return false;
    }

    return true;
  } catch (error) {
    console.error('[v0] Error checking token validity:', error);
    return false;
  }
}

/**
 * Generic AsyncStorage utilities for non-sensitive data
 */
export const asyncStorage = {
  async set(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[v0] Error setting ${key}:`, error);
      throw error;
    }
  },

  async get(key: string): Promise<any | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`[v0] Error getting ${key}:`, error);
      return null;
    }
  },

  async remove(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[v0] Error removing ${key}:`, error);
      throw error;
    }
  },

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[v0] Error clearing AsyncStorage:', error);
      throw error;
    }
  },
};
