import { apiClient } from './client';
import { endpoints, buildUrl } from './endpoints';
import {
  Order,
  CreateOrderRequest,
  PaginatedResponse,
  TrackingInfo,
} from '../types/api';

/**
 * Orders API Service
 */

export const ordersApi = {
  /**
   * Create new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post(endpoints.orders.create, orderData);
    return response.data.data || response.data;
  },

  /**
   * Get all orders for current user
   */
  async getOrders(page?: number, limit?: number): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get(endpoints.orders.list, {
      params: {
        page,
        limit,
      },
    });
    return response.data.data || response.data;
  },

  /**
   * Get order by ID
   */
  async getOrderDetail(orderId: string): Promise<Order> {
    const response = await apiClient.get(
      buildUrl(endpoints.orders.detail, { id: orderId })
    );
    return response.data.data || response.data;
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<{ message: string }> {
    const response = await apiClient.post(
      buildUrl(endpoints.orders.cancel, { id: orderId }),
      { reason }
    );
    return response.data.data || response.data;
  },

  /**
   * Get tracking information for an order
   */
  async trackOrder(orderId: string): Promise<TrackingInfo> {
    const response = await apiClient.get(
      buildUrl(endpoints.orders.track, { id: orderId })
    );
    return response.data.data || response.data;
  },

  /**
   * Get order invoice
   */
  async getOrderInvoice(orderId: string): Promise<{ invoiceUrl: string }> {
    const response = await apiClient.get(
      buildUrl(endpoints.orders.invoice, { id: orderId })
    );
    return response.data.data || response.data;
  },
};

export default ordersApi;
