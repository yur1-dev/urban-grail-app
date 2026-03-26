import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStack } from '@react-navigation/native-stack';
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

import { RootStackParamList } from '@navigation/types';
import { useAuthStore } from '@store/useAuthStore';
import { useUIStore } from '@store/useUIStore';
import { useCartStore } from '@store/useCartStore';

import SplashScreenComponent from '@screens/splash/SplashScreen';
import AuthNavigator from '@navigation/AuthNavigator';
import ShopNavigator from '@navigation/ShopNavigator';
import { colors } from '@theme/colors';
import GlobalLoading from '@components/common/GlobalLoading';
import ToastContainer from '@components/common/ToastContainer';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

const Stack = NativeStack.Navigator<RootStackParamList>();

const lightTheme = MD3LightTheme;
const darkTheme = MD3DarkTheme;

export default function App() {
  const { isAuthenticating, isAuthenticated, restoreAuth } = useAuthStore();
  const { theme, loadThemePreference, loadLanguagePreference } = useUIStore();
  const { loadCartFromStorage } = useCartStore();

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Restore authentication state
        await restoreAuth();

        // Load user preferences
        await loadThemePreference();
        await loadLanguagePreference();

        // Load cart from storage
        await loadCartFromStorage();

        // Hide splash screen after initialization
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('[App] Initialization error:', error);
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, []);

  const themeObj = theme === 'dark' ? darkTheme : lightTheme;

  // Show splash screen while authenticating
  if (isAuthenticating) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={themeObj}>
          <SplashScreenComponent />
        </PaperProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={themeObj}>
        <NavigationContainer
          theme={{
            dark: theme === 'dark',
            colors: {
              primary: colors.primary,
              background: colors.background,
              card: colors.surface,
              text: colors.text.primary,
              border: colors.border,
              notification: colors.error,
            },
          }}
        >
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animationEnabled: true,
            }}
          >
            {isAuthenticated ? (
              // Authenticated user - Show main app
              <Stack.Screen
                name="Tabs"
                component={ShopNavigator}
                options={{
                  animationTypeForReplace: 'pop',
                }}
              />
            ) : (
              // Unauthenticated user - Show auth screens
              <Stack.Screen
                name="Auth"
                component={AuthNavigator}
                options={{
                  animationTypeForReplace: 'pop',
                }}
              />
            )}
          </Stack.Navigator>

          {/* Global Loading Indicator */}
          <GlobalLoading />

          {/* Toast Notifications */}
          <ToastContainer />
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
