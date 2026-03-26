import { create } from 'zustand';
import { storage, STORAGE_KEYS } from '@utils/storage';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIState {
  // Global loading state
  isGlobalLoading: boolean;
  globalLoadingMessage: string;

  // Toast notifications
  toasts: Toast[];

  // Modals and overlays
  isModalVisible: boolean;
  modalContent: {
    title?: string;
    message?: string;
    type?: 'alert' | 'confirm' | 'input';
    actions?: Array<{
      label: string;
      onPress: () => void;
      type?: 'default' | 'cancel' | 'destructive';
    }>;
  };

  // Theme
  isDarkMode: boolean;
  theme: 'light' | 'dark';

  // Language
  language: string;

  // UI Controls
  isBottomSheetVisible: boolean;
  bottomSheetContent: any;

  // Actions
  setGlobalLoading: (isLoading: boolean, message?: string) => void;
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  showModal: (content: UIState['modalContent']) => void;
  hideModal: () => void;
  toggleDarkMode: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  loadThemePreference: () => Promise<void>;
  setLanguage: (language: string) => void;
  loadLanguagePreference: () => Promise<void>;
  showBottomSheet: (content: any) => void;
  hideBottomSheet: () => void;
}

let toastCounter = 0;

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isGlobalLoading: false,
  globalLoadingMessage: '',
  toasts: [],
  isModalVisible: false,
  modalContent: {},
  isDarkMode: false,
  theme: 'light',
  language: 'en',
  isBottomSheetVisible: false,
  bottomSheetContent: null,

  // Set global loading
  setGlobalLoading: (isLoading: boolean, message = '') => {
    set({
      isGlobalLoading: isLoading,
      globalLoadingMessage: message,
    });
  },

  // Show toast notification
  showToast: (message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = `toast-${++toastCounter}`;

    const toast: Toast = {
      id,
      message,
      type,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  // Remove specific toast
  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  // Clear all toasts
  clearToasts: () => {
    set({ toasts: [] });
  },

  // Show modal
  showModal: (content: UIState['modalContent']) => {
    set({
      isModalVisible: true,
      modalContent: content,
    });
  },

  // Hide modal
  hideModal: () => {
    set({
      isModalVisible: false,
      modalContent: {},
    });
  },

  // Toggle dark mode
  toggleDarkMode: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      storage.setItem(STORAGE_KEYS.THEME, newTheme);
      return {
        isDarkMode: newTheme === 'dark',
        theme: newTheme,
      };
    });
  },

  // Set theme
  setTheme: (theme: 'light' | 'dark') => {
    set({
      theme,
      isDarkMode: theme === 'dark',
    });
    storage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Load theme preference
  loadThemePreference: async () => {
    try {
      const savedTheme = await storage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme) {
        set({
          theme: savedTheme as 'light' | 'dark',
          isDarkMode: savedTheme === 'dark',
        });
      }
    } catch (err) {
      console.error('[UIStore] Error loading theme preference:', err);
    }
  },

  // Set language
  setLanguage: (language: string) => {
    set({ language });
    storage.setItem(STORAGE_KEYS.LANGUAGE, language);
  },

  // Load language preference
  loadLanguagePreference: async () => {
    try {
      const savedLanguage = await storage.getItem(STORAGE_KEYS.LANGUAGE);
      if (savedLanguage) {
        set({ language: savedLanguage });
      }
    } catch (err) {
      console.error('[UIStore] Error loading language preference:', err);
    }
  },

  // Show bottom sheet
  showBottomSheet: (content: any) => {
    set({
      isBottomSheetVisible: true,
      bottomSheetContent: content,
    });
  },

  // Hide bottom sheet
  hideBottomSheet: () => {
    set({
      isBottomSheetVisible: false,
      bottomSheetContent: null,
    });
  },
}));
