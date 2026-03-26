// API Endpoints Configuration
// All endpoints are relative to EXPO_PUBLIC_API_BASE_URL

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: {
      SEND: '/auth/forgot-password/send',
      VERIFY: '/auth/forgot-password/verify',
      RESET: '/auth/forgot-password/reset',
    },
  },

  // Products endpoints
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CATEGORIES: '/categories',
    SEARCH: '/products/search',
  },

  // Orders endpoints
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    TRACK: (id: string) => `/orders/${id}/track`,
  },

  // Payment endpoints
  PAYMENT: {
    CREATE: '/payment/create',
    VERIFY: '/payment/verify',
    WEBHOOK: '/payment/webhook',
  },

  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/password',
    UPLOAD_AVATAR: '/upload',
  },

  // Reviews endpoints
  REVIEWS: {
    LIST: (productId: string) => `/products/${productId}/reviews`,
    CREATE: (productId: string) => `/products/${productId}/reviews`,
    UPDATE: (productId: string, reviewId: string) =>
      `/products/${productId}/reviews/${reviewId}`,
    DELETE: (productId: string, reviewId: string) =>
      `/products/${productId}/reviews/${reviewId}`,
  },
} as const;
