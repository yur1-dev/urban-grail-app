import { create } from 'zustand';
import { User, LoginRequest, RegisterRequest } from '../types/api';
import { authApi } from '../api/auth.api';
import { storage } from '../utils/storage';
import { handleApiError } from '../utils/errorHandler';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(data);

      // Save tokens
      await storage.saveToken(response.token);
      if (response.refreshToken) {
        await storage.saveRefreshToken(response.refreshToken);
      }

      // Save user data
      await storage.saveUser(response.user);

      set({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('[v0] Login successful:', response.user.email);
    } catch (error: any) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError.message,
        isAuthenticated: false,
      });
      throw apiError;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(data);

      // Save tokens
      await storage.saveToken(response.token);
      if (response.refreshToken) {
        await storage.saveRefreshToken(response.refreshToken);
      }

      // Save user data
      await storage.saveUser(response.user);

      set({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('[v0] Registration successful:', response.user.email);
    } catch (error: any) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError.message,
        isAuthenticated: false,
      });
      throw apiError;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Call logout endpoint
      await authApi.logout();

      // Clear stored data
      await storage.clearAuthData();

      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      console.log('[v0] Logout successful');
    } catch (error: any) {
      // Even if logout API fails, clear local data
      await storage.clearAuthData();

      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // Try to restore from storage
      const token = await storage.getToken();
      const user = await storage.getUser();

      if (token && user) {
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        console.log('[v0] Auth restored from storage');
      } else {
        set({
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('[v0] Auth check error:', error);
      set({
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));
