import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { secureStorage, STORAGE_KEYS } from '@utils/storage';
import { errorHandler } from '@utils/errorHandler';
import { API_ENDPOINTS } from './endpoints';

// Configuration from environment
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor - Add authorization token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await secureStorage.getItem('accessToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => {
    return Promise.reject(errorHandler.parseAxiosError(error));
  }
);

// Response Interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await secureStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { accessToken, expiresIn } = response.data.data;

        // Save new access token
        await secureStorage.setItem('accessToken', accessToken);

        // Reset axios instance with new token
        apiClient.defaults.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear auth data and redirect to login
        await secureStorage.removeItem('accessToken');
        await secureStorage.removeItem('refreshToken');

        // This will be handled by the store
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Parse and reject all other errors
    return Promise.reject(errorHandler.parseAxiosError(error));
  }
);

// API Call Methods
export const api = {
  // GET request
  async get<T = any>(url: string, config?: any): Promise<T> {
    try {
      const response = await apiClient.get<any, AxiosResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw errorHandler.parseError(error);
    }
  },

  // POST request
  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await apiClient.post<any, AxiosResponse<T>>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw errorHandler.parseError(error);
    }
  },

  // PUT request
  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await apiClient.put<any, AxiosResponse<T>>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw errorHandler.parseError(error);
    }
  },

  // PATCH request
  async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await apiClient.patch<any, AxiosResponse<T>>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw errorHandler.parseError(error);
    }
  },

  // DELETE request
  async delete<T = any>(url: string, config?: any): Promise<T> {
    try {
      const response = await apiClient.delete<any, AxiosResponse<T>>(
        url,
        config
      );
      return response.data;
    } catch (error) {
      throw errorHandler.parseError(error);
    }
  },
};

// Export for manual use
export { API_ENDPOINTS };
