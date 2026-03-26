import { useAuthStore } from '@store/useAuthStore';
import { useUIStore } from '@store/useUIStore';

/**
 * Custom hook that provides authentication functionality
 * with integrated UI state management
 */
export const useAuth = () => {
  const authStore = useAuthStore();
  const { setGlobalLoading, showToast } = useUIStore();

  const login = async (email: string, password: string) => {
    try {
      setGlobalLoading(true, 'Logging in...');
      await authStore.login(email, password);
      showToast('Welcome back!', 'success');
      return true;
    } catch (error: any) {
      showToast(error.message || 'Login failed', 'error');
      return false;
    } finally {
      setGlobalLoading(false);
    }
  };

  const register = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      setGlobalLoading(true, 'Creating account...');
      await authStore.register(
        email,
        firstName,
        lastName,
        password,
        confirmPassword
      );
      showToast('Account created successfully!', 'success');
      return true;
    } catch (error: any) {
      showToast(error.message || 'Registration failed', 'error');
      return false;
    } finally {
      setGlobalLoading(false);
    }
  };

  const logout = async () => {
    try {
      setGlobalLoading(true, 'Logging out...');
      await authStore.logout();
      showToast('Logged out successfully', 'success');
      return true;
    } catch (error: any) {
      showToast(error.message || 'Logout failed', 'error');
      return false;
    } finally {
      setGlobalLoading(false);
    }
  };

  const sendOTP = async (email: string) => {
    try {
      setGlobalLoading(true, 'Sending OTP...');
      await authStore.sendOTP(email);
      showToast('OTP sent to your email', 'success');
      return true;
    } catch (error: any) {
      showToast(error.message || 'Failed to send OTP', 'error');
      return false;
    } finally {
      setGlobalLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string
  ) => {
    try {
      setGlobalLoading(true, 'Resetting password...');
      await authStore.resetPasswordWithOTP(email, otp, newPassword);
      showToast('Password reset successfully', 'success');
      return true;
    } catch (error: any) {
      showToast(error.message || 'Password reset failed', 'error');
      return false;
    } finally {
      setGlobalLoading(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      setGlobalLoading(true, 'Changing password...');
      await authStore.changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );
      showToast('Password changed successfully', 'success');
      return true;
    } catch (error: any) {
      showToast(error.message || 'Password change failed', 'error');
      return false;
    } finally {
      setGlobalLoading(false);
    }
  };

  return {
    // State
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    isAuthenticating: authStore.isAuthenticating,
    error: authStore.error,

    // Actions
    login,
    register,
    logout,
    sendOTP,
    resetPassword,
    changePassword,
    clearError: authStore.clearError,
    checkAuthStatus: authStore.checkAuthStatus,
    restoreAuth: authStore.restoreAuth,
  };
};
