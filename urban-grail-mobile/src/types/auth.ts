import { ApiResponse } from './api';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'rider';
  createdAt: string;
  updatedAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface LoginResponse extends ApiResponse<{
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {}

export interface RegisterResponse extends ApiResponse<{
  user: User;
  accessToken: string;
  refreshToken: string;
}> {}

export interface OTPRequest {
  email: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
  newPassword: string;
}

export interface OTPResponse extends ApiResponse<{
  message: string;
  expiresIn: number;
}> {}

export interface VerifyOTPResponse extends ApiResponse<{
  user: User;
  accessToken: string;
}> {}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse extends ApiResponse<{
  accessToken: string;
  expiresIn: number;
}> {}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeResponse extends ApiResponse<{
  message: string;
}> {}
