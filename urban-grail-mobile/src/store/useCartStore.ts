import { create } from 'zustand';
import { CartItem, Product } from '@types/index';
import { storage, STORAGE_KEYS } from '@utils/storage';
import { APP_CONSTANTS } from '@utils/constants';

interface CartState {
  // State
  items: CartItem[];
  isLoading: boolean;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loadCartFromStorage: () => Promise<void>;
  saveCartToStorage: () => Promise<void>;

  // Computed
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getItemCount: () => number;
  getTaxAmount: () => number;
  getShippingCost: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  // Initial state
  items: [],
  isLoading: false,

  // Add item to cart
  addItem: (product: Product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.productId === product._id
      );

      let updatedItems: CartItem[];

      if (existingItem) {
        // Update quantity if product already in cart
        updatedItems = state.items.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  APP_CONSTANTS.MAX_QUANTITY
                ),
                subtotal:
                  item.price *
                  Math.min(
                    item.quantity + quantity,
                    APP_CONSTANTS.MAX_QUANTITY
                  ),
              }
            : item
        );
      } else {
        // Add new item
        if (state.items.length >= APP_CONSTANTS.MAX_CART_ITEMS) {
          console.warn('[CartStore] Cart is full');
          return state;
        }

        updatedItems = [
          ...state.items,
          {
            productId: product._id,
            product,
            quantity,
            price: product.price,
            subtotal: product.price * quantity,
          },
        ];
      }

      // Save to storage
      get().saveCartToStorage();

      return { items: updatedItems };
    });
  },

  // Remove item from cart
  removeItem: (productId: string) => {
    set((state) => {
      const updatedItems = state.items.filter(
        (item) => item.productId !== productId
      );
      get().saveCartToStorage();
      return { items: updatedItems };
    });
  },

  // Update item quantity
  updateQuantity: (productId: string, quantity: number) => {
    set((state) => {
      if (quantity <= 0) {
        return state; // Use removeItem instead
      }

      if (quantity > APP_CONSTANTS.MAX_QUANTITY) {
        console.warn('[CartStore] Quantity exceeds maximum');
        quantity = APP_CONSTANTS.MAX_QUANTITY;
      }

      const updatedItems = state.items.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              subtotal: item.price * quantity,
            }
          : item
      );

      get().saveCartToStorage();

      return { items: updatedItems };
    });
  },

  // Clear cart
  clearCart: () => {
    set({ items: [] });
    get().saveCartToStorage();
  },

  // Load cart from storage
  loadCartFromStorage: async () => {
    try {
      set({ isLoading: true });

      const savedCart = await storage.getItem(STORAGE_KEYS.CART);

      if (savedCart && Array.isArray(savedCart)) {
        set({ items: savedCart });
      }
    } catch (err) {
      console.error('[CartStore] Error loading cart from storage:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  // Save cart to storage
  saveCartToStorage: async () => {
    try {
      const { items } = get();
      await storage.setItem(STORAGE_KEYS.CART, items);
    } catch (err) {
      console.error('[CartStore] Error saving cart to storage:', err);
    }
  },

  // Get cart subtotal (before tax and shipping)
  getCartSubtotal: () => {
    return get().items.reduce((total, item) => total + item.subtotal, 0);
  },

  // Get tax amount
  getTaxAmount: () => {
    const subtotal = get().getCartSubtotal();
    return subtotal * APP_CONSTANTS.TAX_RATE;
  },

  // Get shipping cost
  getShippingCost: () => {
    const subtotal = get().getCartSubtotal();
    if (subtotal >= APP_CONSTANTS.FREE_SHIPPING_THRESHOLD) {
      return 0;
    }
    return APP_CONSTANTS.STANDARD_SHIPPING;
  },

  // Get cart total (subtotal + tax + shipping)
  getCartTotal: () => {
    const subtotal = get().getCartSubtotal();
    const tax = get().getTaxAmount();
    const shipping = get().getShippingCost();
    return subtotal + tax + shipping;
  },

  // Get total item count
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
