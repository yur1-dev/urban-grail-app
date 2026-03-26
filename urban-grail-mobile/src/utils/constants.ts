export const APP_CONSTANTS = {
  // App config
  APP_NAME: 'Urban Grail',
  APP_VERSION: '1.0.0',

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // Timeout values (in milliseconds)
  API_TIMEOUT: 15000,
  TOKEN_EXPIRY: 3600000, // 1 hour
  SESSION_TIMEOUT: 1800000, // 30 minutes

  // Validation
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,

  // Product
  MIN_PRODUCT_PRICE: 0,
  MAX_PRODUCT_PRICE: 999999,
  MIN_RATING: 0,
  MAX_RATING: 5,

  // Order
  ORDER_STATUSES: [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ] as const,
  PAYMENT_STATUSES: [
    'pending',
    'completed',
    'failed',
    'refunded',
  ] as const,
  PAYMENT_METHODS: [
    'credit_card',
    'debit_card',
    'upi',
    'netbanking',
    'wallet',
    'cod',
  ] as const,

  // Cart
  MAX_CART_ITEMS: 50,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 999,

  // Retry config
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second

  // Cache duration (in milliseconds)
  CACHE_DURATION: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 30 * 60 * 1000, // 30 minutes
    LONG: 60 * 60 * 1000, // 1 hour
  },

  // File upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],

  // Date formats
  DATE_FORMAT: 'MMM dd, yyyy',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'MMM dd, yyyy HH:mm',

  // Currency
  DEFAULT_CURRENCY: 'USD',
  CURRENCY_CODE: 'USD',

  // Tax rate (example: 10%)
  TAX_RATE: 0.1,

  // Shipping cost
  STANDARD_SHIPPING: 5.99,
  EXPRESS_SHIPPING: 14.99,
  FREE_SHIPPING_THRESHOLD: 50,

  // Search
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,

  // Notification
  NOTIFICATION_DURATION: 3000, // 3 seconds

  // UI
  BORDER_RADIUS: {
    SMALL: 4,
    MEDIUM: 8,
    LARGE: 12,
    EXTRA_LARGE: 16,
  },

  ICON_SIZE: {
    SMALL: 16,
    MEDIUM: 20,
    LARGE: 24,
    EXTRA_LARGE: 32,
  },

  // Error codes
  ERROR_CODES: {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  },
} as const;

// URL patterns
export const URL_PATTERNS = {
  EMAIL:
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/ as RegExp,
  PHONE: /^[\d\s\-\+\(\)]+$/ as RegExp,
  URL: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/ as RegExp,
  POSTCODE: /^[a-zA-Z0-9\s\-]{2,10}$/ as RegExp,
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
