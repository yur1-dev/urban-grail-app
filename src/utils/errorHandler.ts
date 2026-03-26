import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

/**
 * Convert API errors to user-friendly messages
 */
export const handleApiError = (error: any): ApiError => {
  // Network error
  if (!axios.isAxiosError(error)) {
    return {
      message: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
    };
  }

  const axiosError = error as AxiosError;

  // Network connectivity error
  if (!axiosError.response) {
    return {
      message: 'Unable to connect to server. Please check your internet connection.',
      code: 'NETWORK_ERROR',
    };
  }

  const status = axiosError.response.status;
  const data = axiosError.response.data as any;

  console.log('[v0] API Error:', {
    status,
    message: data?.message || data?.error,
    data,
  });

  switch (status) {
    case 400:
      return {
        message: data?.message || 'Invalid request. Please check your input.',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        details: data?.details,
      };

    case 401:
      return {
        message: 'Session expired. Please login again.',
        code: 'UNAUTHORIZED',
        statusCode: 401,
      };

    case 403:
      return {
        message: 'You do not have permission to perform this action.',
        code: 'FORBIDDEN',
        statusCode: 403,
      };

    case 404:
      return {
        message: 'The requested resource was not found.',
        code: 'NOT_FOUND',
        statusCode: 404,
      };

    case 409:
      return {
        message: data?.message || 'This resource already exists.',
        code: 'CONFLICT',
        statusCode: 409,
      };

    case 429:
      return {
        message: 'Too many requests. Please wait a moment and try again.',
        code: 'RATE_LIMIT',
        statusCode: 429,
      };

    case 500:
      return {
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
        statusCode: 500,
      };

    case 503:
      return {
        message: 'Service temporarily unavailable. Please try again later.',
        code: 'SERVICE_UNAVAILABLE',
        statusCode: 503,
      };

    default:
      return {
        message: data?.message || 'An error occurred. Please try again.',
        code: 'API_ERROR',
        statusCode: status,
        details: data,
      };
  }
};

/**
 * Form validation error handler
 */
export const handleValidationError = (
  error: any,
  fieldName?: string
): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.type === 'required') {
    return `${fieldName || 'This field'} is required`;
  }

  if (error?.type === 'pattern') {
    return `${fieldName || 'This field'} format is invalid`;
  }

  if (error?.type === 'minLength') {
    return `${fieldName || 'This field'} must be at least ${error.value?.requiredLength} characters`;
  }

  if (error?.type === 'maxLength') {
    return `${fieldName || 'This field'} must not exceed ${error.value?.requiredLength} characters`;
  }

  return 'Invalid input';
};

/**
 * Format error response for display
 */
export const formatErrorMessage = (error: ApiError): string => {
  if (error.details?.field) {
    return `${error.details.field}: ${error.message}`;
  }
  return error.message;
};

/**
 * Check if error is a specific type
 */
export const isErrorType = (error: ApiError, type: string): boolean => {
  return error.code === type;
};

/**
 * Retry handler for failed requests
 */
export const shouldRetryRequest = (error: ApiError): boolean => {
  // Retry on network errors, 5xx errors, and rate limiting
  const retryableCodes = ['NETWORK_ERROR', 'SERVER_ERROR', 'SERVICE_UNAVAILABLE', 'RATE_LIMIT'];
  return retryableCodes.includes(error.code || '');
};

/**
 * Log error for debugging (can be extended to send to analytics service)
 */
export const logError = (
  error: ApiError,
  context?: string
): void => {
  console.error(`[v0] Error${context ? ` in ${context}` : ''}:`, {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    details: error.details,
    timestamp: new Date().toISOString(),
  });
};
