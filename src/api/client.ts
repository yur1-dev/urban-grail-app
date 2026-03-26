import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';
import { handleApiError, logError } from '../utils/errorHandler';

// Get API base URL from environment
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000');

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Create Axios instance with base configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  /**
   * Request Interceptor - Add token to headers
   */
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await storage.getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log('[v0] API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasToken: !!token,
      });

      return config;
    },
    (error) => {
      logError(handleApiError(error), 'request interceptor');
      return Promise.reject(error);
    }
  );

  /**
   * Response Interceptor - Handle responses and errors
   */
  client.interceptors.response.use(
    (response) => {
      console.log('[v0] API Response:', {
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        status: response.status,
      });

      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Don't retry if request already retried
      if (!originalRequest) {
        return Promise.reject(error);
      }

      // Handle 401 Unauthorized - Try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue the request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await storage.getRefreshToken();

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Call refresh token endpoint (adjust URL based on your API)
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken },
            {
              timeout: API_TIMEOUT,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const newToken = response.data.token;
          const newRefreshToken = response.data.refreshToken;

          // Save new tokens
          await storage.saveToken(newToken);
          if (newRefreshToken) {
            await storage.saveRefreshToken(newRefreshToken);
          }

          // Save token expiry if provided
          if (response.data.expiresIn) {
            await storage.saveTokenExpiry(response.data.expiresIn);
          }

          client.defaults.headers.Authorization = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          processQueue(null, newToken);
          isRefreshing = false;

          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          isRefreshing = false;

          // Clear auth data and trigger logout
          await storage.clearAuthData();

          logError(
            handleApiError(refreshError),
            'token refresh'
          );

          return Promise.reject(refreshError);
        }
      }

      logError(handleApiError(error), 'API response');
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

export default apiClient;
