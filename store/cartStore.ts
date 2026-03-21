"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, IProduct } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: IProduct, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, size) => {
        const existing = get().items.find(
          (i) => i.product._id === product._id && i.size === size,
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product._id === product._id && i.size === size
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity: 1, size }] });
        }
      },
      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (i) => !(i.product._id === productId && i.size === size),
          ),
        });
      },
      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product._id === productId && i.size === size
              ? { ...i, quantity }
              : i,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "urban-grail-cart" },
  ),
);
