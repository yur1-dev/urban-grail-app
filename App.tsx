import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { useAuthStore } from './src/store/useAuthStore';
import { useUIStore } from './src/store/useUIStore';
import RootNavigator from './src/navigation/RootNavigator';
import { theme } from './src/theme/colors';
import SplashScreen from './src/screens/splash/SplashScreen';
import { checkTokenValidity } from './src/utils/storage';

export default function App() {
  const { setUser, isAuthenticated, checkAuth } = useAuthStore();
  const { isLoading } = useUIStore();

  useEffect(() => {
    // Check if user has a valid token on app startup
    const initAuth = async () => {
      try {
        const isValid = await checkTokenValidity();
        if (isValid) {
          // Token exists and is valid, user will be loaded from store
          checkAuth();
        }
      } catch (error) {
        console.log('[v0] Auth check failed:', error);
      }
    };

    initAuth();
  }, []);

  // Show splash screen while checking authentication
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <RootNavigator isAuthenticated={isAuthenticated} />
      </NavigationContainer>
    </PaperProvider>
  );
}
