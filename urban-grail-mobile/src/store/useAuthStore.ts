import { create } from 'zustand';
import { User, LoginResponse, RegisterResponse } from '@types/index';
import { secureStorage, storage, STORAGE_KEYS } from '@utils/storage';
import { authApi } from '@api/auth.api';
import { errorHandler, AppError } from '@utils/errorHandler';

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  resetPasswordWithOTP: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  restoreAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticating: false,
  error: null,
  isAuthenticated: false,

  // Login action
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authApi.login({ email, password });

      const { user, accessToken, refreshToken } = response.data!;

      // Save tokens to secure storage
      await secureStorage.setItem('accessToken', accessToken);
      await secureStorage.setItem('refreshToken', refreshToken);

      // Save user data
      await storage.setItem(STORAGE_KEYS.USER, user);

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'login');
      set({
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // Register action
  register: async (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authApi.register({
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
      });

      const { user, accessToken, refreshToken } = response.data!;

      // Save tokens to secure storage
      await secureStorage.setItem('accessToken', accessToken);
      await secureStorage.setItem('refreshToken', refreshToken);

      // Save user data
      await storage.setItem(STORAGE_KEYS.USER, user);

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'register');
      set({
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // Logout action
  logout: async () => {
    try {
      set({ isLoading: true });

      // Call logout endpoint (optional)
      try {
        await authApi.logout();
      } catch (err) {
        // Continue logout even if API call fails
        console.error('[AuthStore] Logout API call failed');
      }

      // Clear secure storage
      await secureStorage.removeItem('accessToken');
      await secureStorage.removeItem('refreshToken');

      // Clear user data
      await storage.removeItem(STORAGE_KEYS.USER);
      await storage.removeItem(STORAGE_KEYS.CART);

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'logout');
      set({ isLoading: false });
      throw error;
    }
  },

  // Send OTP for password reset
  sendOTP: async (email: string) => {
    try {
      set({ isLoading: true, error: null });

      await authApi.sendOTP(email);

      set({ isLoading: false });
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'sendOTP');
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Reset password with OTP
  resetPasswordWithOTP: async (
    email: string,
    otp: string,
    newPassword: string
  ) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authApi.resetPassword(email, otp, newPassword);

      // User can now log in with new password
      set({ isLoading: false, error: null });
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'resetPasswordWithOTP');
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Change password (for authenticated users)
  changePassword: async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      set({ isLoading: true, error: null });

      await authApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      set({ isLoading: false });
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'changePassword');
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Check auth status on app start
  checkAuthStatus: async () => {
    try {
      set({ isAuthenticating: true });

      // Try to get tokens from secure storage
      const accessToken = await secureStorage.getItem('accessToken');
      const refreshToken = await secureStorage.getItem('refreshToken');

      // Try to restore user data
      const user = await storage.getItem(STORAGE_KEYS.USER);

      if (accessToken && user) {
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
          isAuthenticating: false,
        });
      } else {
        set({
          isAuthenticated: false,
          isAuthenticating: false,
        });
      }
    } catch (err) {
      console.error('[AuthStore] Error checking auth status:', err);
      set({
        isAuthenticated: false,
        isAuthenticating: false,
      });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Set user (for manual updates)
  setUser: (user: User | null) => {
    set({ user });
  },

  // Restore auth from storage
  restoreAuth: async () => {
    try {
      set({ isAuthenticating: true });

      const accessToken = await secureStorage.getItem('accessToken');
      const user = await storage.getItem(STORAGE_KEYS.USER);

      if (accessToken && user) {
        set({
          accessToken,
          user,
          isAuthenticated: true,
          isAuthenticating: false,
        });
      } else {
        set({
          isAuthenticated: false,
          isAuthenticating: false,
        });
      }
    } catch (err) {
      console.error('[AuthStore] Error restoring auth:', err);
      set({
        isAuthenticated: false,
        isAuthenticating: false,
      });
    }
  },
}));
