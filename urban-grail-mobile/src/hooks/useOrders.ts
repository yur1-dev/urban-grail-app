import { useOrderStore } from '@store/useOrderStore';
import { useUIStore } from '@store/useUIStore';
import { CreateOrderRequest } from '@types/index';

/**
 * Custom hook for orders management
 */
export const useOrders = () => {
  const orderStore = useOrderStore();
  const { setGlobalLoading, showToast } = useUIStore();

  const fetchOrders = async (page: number = 1, limit: number = 10, status?: string) => {
    try {
      await orderStore.fetchOrders(page, limit, status);
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch orders', 'error');
    }
  };

  const fetchOrderDetail = async (orderId: string) => {
    try {
      setGlobalLoading(true);
      await orderStore.fetchOrderDetail(orderId);
    } catch (error: any) {
      showToast(error.message || 'Failed to fetch order details', 'error');
    } finally {
      setGlobalLoading(false);
    }
  };

  const createOrder = async (data: CreateOrderRequest) => {
    try {
      setGlobalLoading(true, 'Creating order...');
      const order = await orderStore.createOrder(data);
      showToast('Order created successfully!', 'success');
      return order;
    } catch (error: any) {
      showToast(error.message || 'Failed to create order', 'error');
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const cancelOrder = async (orderId: string, reason: string) => {
    try {
      setGlobalLoading(true, 'Cancelling order...');
      await orderStore.cancelOrder(orderId, reason);
      showToast('Order cancelled successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to cancel order', 'error');
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const trackOrder = async (orderId: string) => {
    try {
      setGlobalLoading(true);
      const tracking = await orderStore.trackOrder(orderId);
      return tracking;
    } catch (error: any) {
      showToast(error.message || 'Failed to track order', 'error');
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  return {
    // State
    orders: orderStore.orders,
    selectedOrder: orderStore.selectedOrder,
    pagination: orderStore.pagination,
    isLoading: orderStore.isLoading,
    isCreating: orderStore.isCreating,
    error: orderStore.error,

    // Actions
    fetchOrders,
    fetchOrderDetail,
    createOrder,
    cancelOrder,
    trackOrder,
    setSelectedOrder: orderStore.setSelectedOrder,
    clearError: orderStore.clearError,
  };
};
