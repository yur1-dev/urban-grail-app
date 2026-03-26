import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

// Auth Navigation Params
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string; type: 'login' | 'register' | 'password_reset' };
  ResetPassword: { email: string; otp: string };
};

// Shop Bottom Tab Navigation Params
export type ShopTabParamList = {
  Home: undefined;
  Shop: undefined;
  Cart: undefined;
  Orders: undefined;
  Account: undefined;
};

// Home Stack (nested in Home tab)
export type HomeStackParamList = {
  HomeScreen: undefined;
  ProductDetail: { productId: string };
  Categories: undefined;
};

// Shop Stack (nested in Shop tab)
export type ShopStackParamList = {
  ProductList: { category?: string };
  ProductDetail: { productId: string };
  Search: { query?: string };
};

// Cart Stack (nested in Cart tab)
export type CartStackParamList = {
  CartScreen: undefined;
  Checkout: undefined;
  CheckoutSuccess: { orderId: string };
};

// Orders Stack (nested in Orders tab)
export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: { orderId: string };
  OrderTracking: { orderId: string };
};

// Account Stack (nested in Account tab)
export type AccountStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Address: undefined;
  Settings: undefined;
  Help: undefined;
};

// Root Navigator Types
export type RootParamList = {
  Auth: undefined;
  Shop: undefined;
  Splash: undefined;
};

// Navigation Props Types
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export type HomeStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  BottomTabNavigationProp<ShopTabParamList>
>;

export type ShopStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ShopStackParamList>,
  BottomTabNavigationProp<ShopTabParamList>
>;

export type CartStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<CartStackParamList>,
  BottomTabNavigationProp<ShopTabParamList>
>;

export type OrdersStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<OrdersStackParamList>,
  BottomTabNavigationProp<ShopTabParamList>
>;

export type AccountStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AccountStackParamList>,
  BottomTabNavigationProp<ShopTabParamList>
>;

export type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};
