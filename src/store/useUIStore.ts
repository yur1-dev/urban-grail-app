import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIState {
  isLoading: boolean;
  toast: ToastMessage | null;
  modals: Record<string, boolean>;
  theme: 'light' | 'dark';

  // Actions
  setIsLoading: (loading: boolean) => void;
  showToast: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    duration?: number
  ) => void;
  hideToast: () => void;
  openModal: (modalName: string) => void;
  closeModal: (modalName: string) => void;
  closeAllModals: () => void;
  isModalOpen: (modalName: string) => boolean;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isLoading: true,
  toast: null,
  modals: {},
  theme: 'light',

  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  showToast: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    duration: number = 3000
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    set({
      toast: {
        id,
        message,
        type,
        duration,
      },
    });

    console.log('[v0] Toast shown:', { message, type });

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        const currentToast = get().toast;
        if (currentToast?.id === id) {
          get().hideToast();
        }
      }, duration);
    }
  },

  hideToast: () => {
    set({ toast: null });
  },

  openModal: (modalName: string) => {
    set({
      modals: {
        ...get().modals,
        [modalName]: true,
      },
    });

    console.log('[v0] Modal opened:', modalName);
  },

  closeModal: (modalName: string) => {
    set({
      modals: {
        ...get().modals,
        [modalName]: false,
      },
    });

    console.log('[v0] Modal closed:', modalName);
  },

  closeAllModals: () => {
    const modals = get().modals;
    const allClosed = Object.keys(modals).reduce(
      (acc, key) => {
        acc[key] = false;
        return acc;
      },
      {} as Record<string, boolean>
    );

    set({ modals: allClosed });

    console.log('[v0] All modals closed');
  },

  isModalOpen: (modalName: string) => {
    return get().modals[modalName] || false;
  },

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });

    console.log('[v0] Theme changed:', theme);
  },
}));
