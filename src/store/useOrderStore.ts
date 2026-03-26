import { create } from 'zustand';
import { Order, CreateOrderRequest, PaginatedResponse } from '../types/api';
import { ordersApi } from '../api/orders.api';
import { handleApiError } from '../utils/errorHandler';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOrders: (page?: number, limit?: number) => Promise<void>;
  fetchOrderDetail: (orderId: string) => Promise<void>;
  createOrder: (orderData: CreateOrderRequest) => Promise<Order>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  trackOrder: (orderId: string) => Promise<any>;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  isLoading: false,
  error: null,

  fetchOrders: async (page?: number, limit?: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.getOrders(
        page || get().currentPage,
        limit || get().pageSize
      );

      set({
        orders: response.data,
        currentPage: response.pagination.page,
        totalPages: response.pagination.pages,
        isLoading: false,
      });

      console.log('[v0] Orders loaded:', response.data.length);
    } catch (error: any) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError.message,
      });
      throw apiError;
    }
  },

  fetchOrderDetail: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersApi.getOrderDetail(orderId);

      set({
        selectedOrder: order,
        isLoading: false,
      });

      console.log('[v0] Order detail loaded:', order.orderNumber);
    } catch (error: any) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError.message,
      });
      throw apiError;
    }
  },

  createOrder: async (orderData: CreateOrderRequest) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersApi.createOrder(orderData);

      // Add to orders list
      set({
        orders: [order, ...get().orders],
        selectedOrder: order,
        isLoading: false,
      });

      console.log('[v0] Order created:', order.orderNumber);
      return order;
    } catch (error: any) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError.message,
      });
      throw apiError;
    }
  },

  cancelOrder: async (orderId: string, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      await ordersApi.cancelOrder(orderId, reason);

      // Update order in list
      const orders = get().orders.map((order) =>
        order._id === orderId
          ? { ...order, orderStatus: 'cancelled' as const }
          : order
      );

      set({
        orders,
        isLoading: false,
      });

      console.log('[v0] Order cancelled:', orderId);
    } catch (error: any) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError.message,
      });
      throw apiError;
    }
  },

  trackOrder: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const tracking = await ordersApi.trackOrder(orderId);

      set({ isLoading: false });

      console.log('[v0] Order tracking loaded:', orderId);
      return tracking;
    } catch (error: any) {
      const apiError = handleApiError(error);
      set({
        isLoading: false,
        error: apiError.message,
      });
      throw apiError;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
