import { api, API_ENDPOINTS } from './client';
import {
  AuthCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
  OTPRequest,
  OTPVerification,
  OTPResponse,
  VerifyOTPResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  PasswordChangeRequest,
  PasswordChangeResponse,
} from '@types/index';

export const authApi = {
  // Login with email and password
  async login(credentials: AuthCredentials): Promise<LoginResponse> {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email: credentials.email,
      password: credentials.password,
    });
  },

  // Register new user
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    return api.post(API_ENDPOINTS.AUTH.REGISTER, {
      email: credentials.email,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
    });
  },

  // Logout user (optional backend call)
  async logout(): Promise<any> {
    return api.post(API_ENDPOINTS.AUTH.LOGOUT, {});
  },

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });
  },

  // Send OTP for password reset
  async sendOTP(email: string): Promise<OTPResponse> {
    return api.post(API_ENDPOINTS.AUTH.SEND_OTP, {
      email,
    });
  },

  // Verify OTP and reset password
  async verifyOTPAndResetPassword(
    data: OTPVerification
  ): Promise<VerifyOTPResponse> {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD.VERIFY, {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword,
    });
  },

  // Send forgot password email
  async sendForgotPasswordEmail(email: string): Promise<OTPResponse> {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD.SEND, {
      email,
    });
  },

  // Reset password with OTP
  async resetPassword(email: string, otp: string, newPassword: string): Promise<VerifyOTPResponse> {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD.RESET, {
      email,
      otp,
      newPassword,
    });
  },

  // Change password (requires current password)
  async changePassword(
    data: PasswordChangeRequest
  ): Promise<PasswordChangeResponse> {
    return api.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  },
};
