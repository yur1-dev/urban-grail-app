import { AxiosError } from 'axios';
import { ApiError } from '@types/index';

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const errorHandler = {
  // Parse Axios errors
  parseAxiosError(error: AxiosError<any>): AppError {
    const status = error.response?.status || error.status || 500;
    const data = error.response?.data;

    // Handle specific error responses from API
    if (data?.error) {
      return new AppError(
        data.error || data.message || 'An error occurred',
        data.code || `HTTP_${status}`,
        status,
        data.details
      );
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      return new AppError(
        'Request timeout. Please check your internet connection.',
        'TIMEOUT_ERROR',
        0
      );
    }

    if (error.code === 'ERR_NETWORK' || !error.response) {
      return new AppError(
        'Network error. Please check your internet connection.',
        'NETWORK_ERROR',
        0
      );
    }

    // Handle server errors
    if (status >= 500) {
      return new AppError(
        'Server error. Please try again later.',
        `HTTP_${status}`,
        status
      );
    }

    // Handle 401 Unauthorized
    if (status === 401) {
      return new AppError(
        'Session expired. Please log in again.',
        'UNAUTHORIZED',
        401
      );
    }

    // Handle 403 Forbidden
    if (status === 403) {
      return new AppError(
        'You do not have permission to access this resource.',
        'FORBIDDEN',
        403
      );
    }

    // Handle 404 Not Found
    if (status === 404) {
      return new AppError(
        'Resource not found.',
        'NOT_FOUND',
        404
      );
    }

    // Handle 422 Validation Error
    if (status === 422) {
      return new AppError(
        'Validation failed. Please check your input.',
        'VALIDATION_ERROR',
        422,
        data?.details
      );
    }

    // Default error
    return new AppError(
      error.message || 'An unexpected error occurred',
      `HTTP_${status}`,
      status
    );
  },

  // Parse general errors
  parseError(error: any): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof AxiosError) {
      return this.parseAxiosError(error);
    }

    if (error instanceof Error) {
      return new AppError(error.message, 'ERROR', 500);
    }

    return new AppError(
      typeof error === 'string' ? error : 'An unexpected error occurred',
      'UNKNOWN_ERROR',
      500
    );
  },

  // Get user-friendly error message
  getUserMessage(error: AppError | any): string {
    const parsed = this.parseError(error);

    const messages: Record<string, string> = {
      NETWORK_ERROR: 'Unable to connect. Check your internet.',
      TIMEOUT_ERROR: 'Request took too long. Please try again.',
      UNAUTHORIZED: 'Your session has expired. Please log in again.',
      FORBIDDEN: 'You do not have permission for this action.',
      NOT_FOUND: 'The requested resource was not found.',
      VALIDATION_ERROR: 'Please check your input and try again.',
    };

    return messages[parsed.code] || parsed.message;
  },

  // Log error for debugging
  logError(error: any, context?: string): void {
    const parsed = this.parseError(error);
    const message = context
      ? `[${context}] ${parsed.message}`
      : parsed.message;

    console.error('[AppError]', {
      message,
      code: parsed.code,
      statusCode: parsed.statusCode,
      details: parsed.details,
    });
  },

  // Check if error is recoverable
  isRecoverable(error: AppError | any): boolean {
    const parsed = this.parseError(error);

    // Non-recoverable errors
    const nonRecoverable = [
      'VALIDATION_ERROR',
      'UNAUTHORIZED',
      'FORBIDDEN',
    ];

    return !nonRecoverable.includes(parsed.code);
  },

  // Retry-able errors
  isRetryable(error: AppError | any): boolean {
    const parsed = this.parseError(error);

    // Retryable errors
    const retryable = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'HTTP_500',
      'HTTP_502',
      'HTTP_503',
      'HTTP_504',
    ];

    return retryable.includes(parsed.code);
  },
};
