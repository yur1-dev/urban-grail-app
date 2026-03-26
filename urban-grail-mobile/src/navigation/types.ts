import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps, NativeStackScreenProps } from '@react-navigation/native-stack';

// Auth Stack Params
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: {
    email: string;
    isPasswordReset?: boolean;
  };
};

// Shop Stack Params
export type ShopStackParamList = {
  Home: undefined;
  ProductList: {
    categoryId?: string;
  };
  ProductDetail: {
    productId: string;
  };
};

// Cart Stack Params
export type CartStackParamList = {
  CartScreen: undefined;
  Checkout: undefined;
  OrderSuccess: {
    orderId: string;
  };
};

// Orders Stack Params
export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: {
    orderId: string;
  };
};

// Account Stack Params
export type AccountStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  AddressBook: undefined;
  Settings: undefined;
  Help: undefined;
};

// Bottom Tab Navigator Params
export type ShopTabsParamList = {
  ShopStack: NavigatorScreenParams<ShopStackParamList>;
  SearchStack: undefined;
  CartStack: NavigatorScreenParams<CartStackParamList>;
  OrdersStack: NavigatorScreenParams<OrdersStackParamList>;
  AccountStack: NavigatorScreenParams<AccountStackParamList>;
};

// Root Stack Params
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Tabs: NavigatorScreenParams<ShopTabsParamList>;
};

// Navigation Props Types
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type ShopScreenProps<T extends keyof ShopStackParamList> =
  NativeStackScreenProps<ShopStackParamList, T>;

export type CartScreenProps<T extends keyof CartStackParamList> =
  NativeStackScreenProps<CartStackParamList, T>;

export type OrdersScreenProps<T extends keyof OrdersStackParamList> =
  NativeStackScreenProps<OrdersStackParamList, T>;

export type AccountScreenProps<T extends keyof AccountStackParamList> =
  NativeStackScreenProps<AccountStackParamList, T>;

export type ShopTabsProps<T extends keyof ShopTabsParamList> =
  BottomTabScreenProps<ShopTabsParamList, T>;

export type RootStackProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
