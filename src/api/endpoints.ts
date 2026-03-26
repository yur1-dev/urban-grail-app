/**
 * API Endpoints Constants
 * All endpoints relative to API_BASE_URL defined in environment
 */

export const endpoints = {
  // Authentication Endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    sendOTP: '/auth/send-otp',
    verifyOTP: '/auth/verify-otp',
    forgotPasswordSend: '/auth/forgot-password/send',
    forgotPasswordVerify: '/auth/forgot-password/verify',
    resetPassword: '/auth/reset-password',
  },

  // User Endpoints
  user: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    address: '/users/address',
    addAddress: '/users/address',
    updateAddress: '/users/address/:id',
    deleteAddress: '/users/address/:id',
  },

  // Products Endpoints
  products: {
    list: '/products',
    detail: '/products/:id',
    search: '/products/search',
    category: '/products/category/:category',
    featured: '/products/featured',
    reviews: '/products/:id/reviews',
    addReview: '/products/:id/reviews',
  },

  // Categories Endpoints
  categories: {
    list: '/categories',
    detail: '/categories/:id',
  },

  // Cart Endpoints
  cart: {
    list: '/cart',
    add: '/cart',
    update: '/cart/:id',
    remove: '/cart/:id',
    clear: '/cart/clear',
  },

  // Order Endpoints
  orders: {
    create: '/orders',
    list: '/orders',
    detail: '/orders/:id',
    cancel: '/orders/:id/cancel',
    track: '/orders/:id/track',
    invoice: '/orders/:id/invoice',
  },

  // Payment Endpoints
  payment: {
    create: '/payment/create',
    verify: '/payment/verify',
    webhook: '/payment/webhook',
    methods: '/payment/methods',
  },

  // Wishlist Endpoints (Optional)
  wishlist: {
    list: '/wishlist',
    add: '/wishlist',
    remove: '/wishlist/:id',
  },

  // Coupon/Promo Endpoints
  coupons: {
    validate: '/coupons/validate',
  },

  // Notifications Endpoints
  notifications: {
    list: '/notifications',
    mark: '/notifications/:id/mark-read',
    markAll: '/notifications/mark-all-read',
    preferences: '/notifications/preferences',
  },
};

/**
 * Helper to replace path parameters
 * Usage: buildUrl(endpoints.products.detail, { id: '123' })
 */
export const buildUrl = (
  template: string,
  params?: Record<string, string | number>
): string => {
  if (!params) return template;

  let url = template;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  return url;
};

/**
 * Example usage in API calls:
 *
 * import { endpoints, buildUrl } from './endpoints';
 *
 * // Simple endpoint
 * apiClient.get(endpoints.products.list);
 *
 * // Endpoint with parameters
 * apiClient.get(buildUrl(endpoints.products.detail, { id: productId }));
 *
 * // Endpoint with query parameters
 * apiClient.get(endpoints.products.list, { params: { page: 1, limit: 10 } });
 */
