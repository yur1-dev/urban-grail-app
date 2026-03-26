import { useCartStore } from '@store/useCartStore';
import { useUIStore } from '@store/useUIStore';
import { Product } from '@types/index';

/**
 * Custom hook for cart management
 */
export const useCart = () => {
  const cartStore = useCartStore();
  const { showToast } = useUIStore();

  const addItem = (product: Product, quantity: number = 1) => {
    try {
      cartStore.addItem(product, quantity);
      showToast(`${product.name} added to cart`, 'success');
      return true;
    } catch (error: any) {
      showToast(error.message || 'Failed to add item to cart', 'error');
      return false;
    }
  };

  const removeItem = (productId: string) => {
    try {
      cartStore.removeItem(productId);
      showToast('Item removed from cart', 'success');
      return true;
    } catch (error: any) {
      showToast(error.message || 'Failed to remove item', 'error');
      return false;
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        return removeItem(productId);
      }
      cartStore.updateQuantity(productId, quantity);
      return true;
    } catch (error: any) {
      showToast(error.message || 'Failed to update quantity', 'error');
      return false;
    }
  };

  const clear = () => {
    try {
      cartStore.clearCart();
      return true;
    } catch (error: any) {
      showToast(error.message || 'Failed to clear cart', 'error');
      return false;
    }
  };

  return {
    // State
    items: cartStore.items,
    isLoading: cartStore.isLoading,

    // Computed values
    subtotal: cartStore.getCartSubtotal(),
    tax: cartStore.getTaxAmount(),
    shipping: cartStore.getShippingCost(),
    total: cartStore.getCartTotal(),
    itemCount: cartStore.getItemCount(),
    isEmpty: cartStore.items.length === 0,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clear,
    loadFromStorage: cartStore.loadCartFromStorage,
    saveToStorage: cartStore.saveCartToStorage,
  };
};
