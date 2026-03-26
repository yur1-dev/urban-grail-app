import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import ShopNavigator from './ShopNavigator';
import SplashScreen from '../screens/splash/SplashScreen';

const Stack = createNativeStackNavigator();

interface RootNavigatorProps {
  isAuthenticated: boolean;
}

const RootNavigator = ({ isAuthenticated }: RootNavigatorProps) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#ffffff' },
      }}
    >
      {isAuthenticated ? (
        // Authenticated User - Show App
        <Stack.Screen
          name="Shop"
          component={ShopNavigator}
          options={{
            animationEnabled: false,
          }}
        />
      ) : (
        // Non-Authenticated User - Show Auth Screens
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{
            animationEnabled: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
