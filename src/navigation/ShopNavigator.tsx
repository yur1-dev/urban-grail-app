import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCartStore } from '../store/useCartStore';
import { colors } from '../theme/colors';

// Param List Types
import {
  ShopTabParamList,
  HomeStackParamList,
  ShopStackParamList,
  CartStackParamList,
  OrdersStackParamList,
  AccountStackParamList,
} from './types';

// Placeholder screens for now
import { View, Text } from 'react-native';

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name}</Text>
  </View>
);

// Home Stack
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const HomeStackNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: true,
      headerShadowVisible: false,
    }}
  >
    <HomeStack.Screen
      name="HomeScreen"
      component={() => <PlaceholderScreen name="Home Screen" />}
      options={{ title: 'Urban Grail', headerLargeTitle: true }}
    />
    <HomeStack.Screen
      name="ProductDetail"
      component={() => <PlaceholderScreen name="Product Detail" />}
      options={{ title: 'Product Details' }}
    />
    <HomeStack.Screen
      name="Categories"
      component={() => <PlaceholderScreen name="Categories" />}
      options={{ title: 'Categories' }}
    />
  </HomeStack.Navigator>
);

// Shop Stack
const ShopStack = createNativeStackNavigator<ShopStackParamList>();
const ShopStackNavigator = () => (
  <ShopStack.Navigator
    screenOptions={{
      headerShown: true,
      headerShadowVisible: false,
    }}
  >
    <ShopStack.Screen
      name="ProductList"
      component={() => <PlaceholderScreen name="Product List" />}
      options={{ title: 'Shop' }}
    />
    <ShopStack.Screen
      name="ProductDetail"
      component={() => <PlaceholderScreen name="Product Detail" />}
      options={{ title: 'Product Details' }}
    />
    <ShopStack.Screen
      name="Search"
      component={() => <PlaceholderScreen name="Search" />}
      options={{ title: 'Search Results' }}
    />
  </ShopStack.Navigator>
);

// Cart Stack
const CartStack = createNativeStackNavigator<CartStackParamList>();
const CartStackNavigator = () => (
  <CartStack.Navigator
    screenOptions={{
      headerShown: true,
      headerShadowVisible: false,
    }}
  >
    <CartStack.Screen
      name="CartScreen"
      component={() => <PlaceholderScreen name="Cart" />}
      options={{ title: 'Shopping Cart' }}
    />
    <CartStack.Screen
      name="Checkout"
      component={() => <PlaceholderScreen name="Checkout" />}
      options={{ title: 'Checkout' }}
    />
    <CartStack.Screen
      name="CheckoutSuccess"
      component={() => <PlaceholderScreen name="Order Confirmed" />}
      options={{ title: 'Order Confirmed', headerBackVisible: false }}
    />
  </CartStack.Navigator>
);

// Orders Stack
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();
const OrdersStackNavigator = () => (
  <OrdersStack.Navigator
    screenOptions={{
      headerShown: true,
      headerShadowVisible: false,
    }}
  >
    <OrdersStack.Screen
      name="OrdersList"
      component={() => <PlaceholderScreen name="Orders List" />}
      options={{ title: 'My Orders' }}
    />
    <OrdersStack.Screen
      name="OrderDetail"
      component={() => <PlaceholderScreen name="Order Detail" />}
      options={{ title: 'Order Details' }}
    />
    <OrdersStack.Screen
      name="OrderTracking"
      component={() => <PlaceholderScreen name="Order Tracking" />}
      options={{ title: 'Track Order' }}
    />
  </OrdersStack.Navigator>
);

// Account Stack
const AccountStack = createNativeStackNavigator<AccountStackParamList>();
const AccountStackNavigator = () => (
  <AccountStack.Navigator
    screenOptions={{
      headerShown: true,
      headerShadowVisible: false,
    }}
  >
    <AccountStack.Screen
      name="Profile"
      component={() => <PlaceholderScreen name="Profile" />}
      options={{ title: 'My Account' }}
    />
    <AccountStack.Screen
      name="EditProfile"
      component={() => <PlaceholderScreen name="Edit Profile" />}
      options={{ title: 'Edit Profile' }}
    />
    <AccountStack.Screen
      name="Address"
      component={() => <PlaceholderScreen name="My Addresses" />}
      options={{ title: 'My Addresses' }}
    />
    <AccountStack.Screen
      name="Settings"
      component={() => <PlaceholderScreen name="Settings" />}
      options={{ title: 'Settings' }}
    />
    <AccountStack.Screen
      name="Help"
      component={() => <PlaceholderScreen name="Help & Support" />}
      options={{ title: 'Help & Support' }}
    />
  </AccountStack.Navigator>
);

// Main Tab Navigator
const Tab = createBottomTabNavigator<ShopTabParamList>();

const ShopNavigator = () => {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingVertical: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopStackNavigator}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shopping-search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStackNavigator}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: itemCount > 0 ? itemCount : null,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shopping-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStackNavigator}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="package-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStackNavigator}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ShopNavigator;
