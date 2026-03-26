import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge } from 'react-native-paper';

import { ShopStackParamList, ShopTabsParamList } from './types';
import { useCartStore } from '@store/useCartStore';

// Screens
import HomeScreen from '@screens/shop/HomeScreen';
import ProductListScreen from '@screens/shop/ProductListScreen';
import ProductDetailScreen from '@screens/shop/ProductDetailScreen';
import SearchScreen from '@screens/search/SearchScreen';
import CartScreen from '@screens/cart/CartScreen';
import CheckoutScreen from '@screens/cart/CheckoutScreen';
import OrdersScreen from '@screens/orders/OrdersScreen';
import OrderDetailScreen from '@screens/orders/OrderDetailScreen';
import ProfileScreen from '@screens/account/ProfileScreen';
import SettingsScreen from '@screens/account/SettingsScreen';

import { colors } from '@theme/colors';

const ShopStack = createNativeStackNavigator<ShopStackParamList>();
const CartStack = createNativeStackNavigator();
const OrdersStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<ShopTabsParamList>();

function ShopStackNavigator() {
  return (
    <ShopStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ShopStack.Screen name="Home" component={HomeScreen} />
      <ShopStack.Screen name="ProductList" component={ProductListScreen} />
      <ShopStack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </ShopStack.Navigator>
  );
}

function CartStackNavigator() {
  return (
    <CartStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CartStack.Screen name="CartScreen" component={CartScreen} />
      <CartStack.Screen name="Checkout" component={CheckoutScreen} />
    </CartStack.Navigator>
  );
}

function OrdersStackNavigator() {
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <OrdersStack.Screen name="OrdersList" component={OrdersScreen} />
      <OrdersStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </OrdersStack.Navigator>
  );
}

function AccountStackNavigator() {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AccountStack.Screen name="Profile" component={ProfileScreen} />
      <AccountStack.Screen name="Settings" component={SettingsScreen} />
    </AccountStack.Navigator>
  );
}

export default function ShopNavigator() {
  const { items } = useCartStore();
  const cartCount = items.length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'ShopStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchStack') {
            iconName = focused ? 'magnify' : 'magnify';
          } else if (route.name === 'CartStack') {
            iconName = focused ? 'shopping' : 'shopping-outline';
          } else if (route.name === 'OrdersStack') {
            iconName = focused ? 'package-variant' : 'package-variant-outline';
          } else if (route.name === 'AccountStack') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return (
            <>
              <MaterialCommunityIcons name={iconName} size={size} color={color} />
              {route.name === 'CartStack' && cartCount > 0 && (
                <Badge style={{ position: 'absolute', top: -5, right: -10 }}>
                  {cartCount}
                </Badge>
              )}
            </>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: -5,
        },
      })}
    >
      <Tab.Screen
        name="ShopStack"
        component={ShopStackNavigator}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen
        name="CartStack"
        component={CartStackNavigator}
        options={{
          tabBarLabel: 'Cart',
        }}
      />
      <Tab.Screen
        name="OrdersStack"
        component={OrdersStackNavigator}
        options={{
          tabBarLabel: 'Orders',
        }}
      />
      <Tab.Screen
        name="AccountStack"
        component={AccountStackNavigator}
        options={{
          tabBarLabel: 'Account',
        }}
      />
    </Tab.Navigator>
  );
}
