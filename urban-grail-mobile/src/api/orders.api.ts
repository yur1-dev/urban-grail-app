import { api, API_ENDPOINTS } from './client';
import {
  Order,
  OrderDetail,
  CreateOrderRequest,
  CreateOrderResponse,
  OrdersListResponse,
  OrderDetailResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  PaymentResponse,
} from '@types/index';

export const ordersApi = {
  // Get user's orders
  async getOrders(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<OrdersListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    return api.get(
      `${API_ENDPOINTS.ORDERS.LIST}?${params.toString()}`
    );
  },

  // Get single order details
  async getOrderDetail(orderId: string): Promise<OrderDetailResponse> {
    return api.get(API_ENDPOINTS.ORDERS.DETAIL(orderId));
  },

  // Create new order
  async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    return api.post(API_ENDPOINTS.ORDERS.CREATE, {
      items: data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    });
  },

  // Cancel order
  async cancelOrder(
    orderId: string,
    reason: string
  ): Promise<CancelOrderResponse> {
    return api.post(API_ENDPOINTS.ORDERS.CANCEL(orderId), {
      reason,
    });
  },

  // Track order
  async trackOrder(orderId: string): Promise<any> {
    return api.get(API_ENDPOINTS.ORDERS.TRACK(orderId));
  },

  // Update order status (admin)
  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return api.patch(API_ENDPOINTS.ORDERS.DETAIL(orderId), {
      status,
    });
  },

  // Create payment for order
  async createPayment(
    orderId: string,
    paymentMethodId?: string
  ): Promise<PaymentResponse> {
    return api.post(API_ENDPOINTS.PAYMENT.CREATE, {
      orderId,
      paymentMethodId,
    });
  },

  // Verify payment
  async verifyPayment(
    orderId: string,
    paymentId: string,
    transactionId: string
  ): Promise<PaymentResponse> {
    return api.post(API_ENDPOINTS.PAYMENT.VERIFY, {
      orderId,
      paymentId,
      transactionId,
    });
  },
};
