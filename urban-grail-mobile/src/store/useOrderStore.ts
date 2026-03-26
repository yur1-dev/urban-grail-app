import { create } from 'zustand';
import { Order, OrderDetail, CreateOrderRequest, Pagination } from '@types/index';
import { ordersApi } from '@api/orders.api';
import { errorHandler } from '@utils/errorHandler';

interface OrderState {
  // State
  orders: Order[];
  selectedOrder: OrderDetail | null;
  pagination: Pagination;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;

  // Actions
  fetchOrders: (page?: number, limit?: number, status?: string) => Promise<void>;
  fetchOrderDetail: (orderId: string) => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<Order>;
  cancelOrder: (orderId: string, reason: string) => Promise<void>;
  trackOrder: (orderId: string) => Promise<any>;
  setSelectedOrder: (order: OrderDetail | null) => void;
  clearError: () => void;
}

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 0,
};

export const useOrderStore = create<OrderState>((set, get) => ({
  // Initial state
  orders: [],
  selectedOrder: null,
  pagination: DEFAULT_PAGINATION,
  isLoading: false,
  isCreating: false,
  error: null,

  // Fetch orders
  fetchOrders: async (page = 1, limit = 10, status?: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await ordersApi.getOrders(page, limit, status);

      set({
        orders: response.data!.data,
        pagination: response.data!.pagination,
        isLoading: false,
      });
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'fetchOrders');
      set({
        isLoading: false,
        error: error.message,
      });
    }
  },

  // Fetch order detail
  fetchOrderDetail: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await ordersApi.getOrderDetail(orderId);

      set({
        selectedOrder: response.data!,
        isLoading: false,
      });
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'fetchOrderDetail');
      set({
        isLoading: false,
        error: error.message,
        selectedOrder: null,
      });
      throw error;
    }
  },

  // Create order
  createOrder: async (data: CreateOrderRequest) => {
    try {
      set({ isCreating: true, error: null });

      const response = await ordersApi.createOrder(data);

      const newOrder = response.data!.order;

      // Add to orders list
      set((state) => ({
        orders: [newOrder, ...state.orders],
        isCreating: false,
      }));

      return newOrder;
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'createOrder');
      set({
        isCreating: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId: string, reason: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await ordersApi.cancelOrder(orderId, reason);

      // Update order in list
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? response.data!.order : order
        ),
        selectedOrder:
          state.selectedOrder?._id === orderId
            ? (response.data!.order as OrderDetail)
            : state.selectedOrder,
        isLoading: false,
      }));
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'cancelOrder');
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Track order
  trackOrder: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await ordersApi.trackOrder(orderId);

      set({ isLoading: false });

      return response;
    } catch (err) {
      const error = errorHandler.parseError(err);
      errorHandler.logError(error, 'trackOrder');
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Set selected order
  setSelectedOrder: (order: OrderDetail | null) => {
    set({ selectedOrder: order });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
