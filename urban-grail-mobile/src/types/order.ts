import { ApiResponse, PaginatedResponse } from './api';
import { Product, Category } from './product';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'upi' | 'netbanking' | 'wallet' | 'cod';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  product?: Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface OrderDetail extends Order {
  timeline?: OrderTimeline[];
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  message: string;
  location?: string;
}

export interface CreateOrderRequest {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface CreateOrderResponse extends ApiResponse<{
  order: Order;
  paymentUrl?: string;
}> {}

export interface OrdersListResponse extends ApiResponse<PaginatedResponse<Order>> {}

export interface OrderDetailResponse extends ApiResponse<OrderDetail> {}

export interface CancelOrderRequest {
  reason: string;
}

export interface CancelOrderResponse extends ApiResponse<{
  order: Order;
  message: string;
}> {}

export interface PaymentResponse extends ApiResponse<{
  paymentId: string;
  status: PaymentStatus;
  message: string;
}> {}
