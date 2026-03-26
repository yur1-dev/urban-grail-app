import { create } from 'zustand';
import { CartItem, Product } from '../types/api';
import { asyncStorage } from '../utils/storage';

interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  taxRate: number; // Default 10%
  shippingRate: number; // Flat rate or percentage

  // Actions
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => Promise<void>;
  calculateTotals: () => void;
  loadCart: () => Promise<void>;

  // Getters
  getItemCount: () => number;
  getItem: (productId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  shippingCost: 0,
  total: 0,
  taxRate: 0.1, // 10% tax
  shippingRate: 50, // Fixed shipping cost

  addItem: (product: Product, quantity: number) => {
    const state = get();
    const existingItem = state.items.find((item) => item.productId === product._id);

    let newItems;
    if (existingItem) {
      // Update quantity if item already exists
      newItems = state.items.map((item) =>
        item.productId === product._id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              subtotal: (item.quantity + quantity) * item.price,
            }
          : item
      );
    } else {
      // Add new item
      const newItem: CartItem = {
        _id: `${product._id}-${Date.now()}`,
        productId: product._id,
        product,
        quantity,
        price: product.price,
        subtotal: product.price * quantity,
      };
      newItems = [...state.items, newItem];
    }

    set({ items: newItems });
    get().calculateTotals();

    // Save to storage
    asyncStorage.set('cart', newItems);

    console.log('[v0] Item added to cart:', product.name, quantity);
  },

  removeItem: (productId: string) => {
    const state = get();
    const newItems = state.items.filter((item) => item.productId !== productId);

    set({ items: newItems });
    get().calculateTotals();

    // Save to storage
    asyncStorage.set('cart', newItems);

    console.log('[v0] Item removed from cart:', productId);
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const state = get();
    const newItems = state.items.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity,
            subtotal: quantity * item.price,
          }
        : item
    );

    set({ items: newItems });
    get().calculateTotals();

    // Save to storage
    asyncStorage.set('cart', newItems);

    console.log('[v0] Quantity updated:', productId, quantity);
  },

  clearCart: async () => {
    set({
      items: [],
      subtotal: 0,
      tax: 0,
      shippingCost: 0,
      total: 0,
    });

    // Clear from storage
    await asyncStorage.remove('cart');

    console.log('[v0] Cart cleared');
  },

  calculateTotals: () => {
    const state = get();
    const subtotal = state.items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = Math.round(subtotal * state.taxRate * 100) / 100;
    const shippingCost = subtotal > 0 ? state.shippingRate : 0;
    const total = Math.round((subtotal + tax + shippingCost) * 100) / 100;

    set({
      subtotal: Math.round(subtotal * 100) / 100,
      tax,
      shippingCost,
      total,
    });

    console.log('[v0] Cart totals calculated:', {
      subtotal,
      tax,
      shippingCost,
      total,
    });
  },

  loadCart: async () => {
    try {
      const savedCart = await asyncStorage.get('cart');
      if (savedCart && Array.isArray(savedCart)) {
        set({ items: savedCart });
        get().calculateTotals();
        console.log('[v0] Cart loaded from storage:', savedCart.length, 'items');
      }
    } catch (error) {
      console.error('[v0] Error loading cart:', error);
    }
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getItem: (productId: string) => {
    return get().items.find((item) => item.productId === productId);
  },
}));
