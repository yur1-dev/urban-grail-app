import { apiClient } from './client';
import { endpoints } from './endpoints';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  ResetPasswordRequest,
} from '../types/api';

/**
 * Authentication API Service
 * All auth-related API calls
 */

export const authApi = {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post(endpoints.auth.login, data);
    return response.data.data || response.data;
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post(endpoints.auth.register, data);
    return response.data.data || response.data;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await apiClient.post(endpoints.auth.logout);
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post(endpoints.auth.refresh, { refreshToken });
    return response.data.data || response.data;
  },

  /**
   * Send OTP to email
   */
  async sendOTP(data: SendOTPRequest): Promise<SendOTPResponse> {
    const response = await apiClient.post(endpoints.auth.sendOTP, data);
    return response.data.data || response.data;
  },

  /**
   * Verify OTP sent to email
   */
  async verifyOTP(data: VerifyOTPRequest): Promise<{ verified: boolean }> {
    const response = await apiClient.post(endpoints.auth.verifyOTP, data);
    return response.data.data || response.data;
  },

  /**
   * Send password reset OTP
   */
  async sendForgotPasswordOTP(email: string): Promise<SendOTPResponse> {
    const response = await apiClient.post(endpoints.auth.forgotPasswordSend, { email });
    return response.data.data || response.data;
  },

  /**
   * Reset password with OTP and new password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post(endpoints.auth.resetPassword, data);
    return response.data.data || response.data;
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    const response = await apiClient.get(endpoints.user.profile);
    return response.data.data || response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: any) {
    const response = await apiClient.put(endpoints.user.updateProfile, data);
    return response.data.data || response.data;
  },
};

export default authApi;
