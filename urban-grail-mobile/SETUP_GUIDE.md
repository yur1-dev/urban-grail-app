# Urban Grail Mobile App - Complete Setup Guide

## Project Overview

This is a React Native mobile application built with Expo, targeting Android devices. It connects to the Urban Grail web API for authentication, products, orders, and payments.

**Tech Stack:**
- React Native 0.73.6
- Expo 50.0.0
- React Navigation 6.x
- Zustand for state management
- TypeScript
- React Native Paper for UI components
- Axios for API calls

---

## Phase 1: Installation & Setup

### Step 1.1: Prerequisites

Ensure you have the following installed:
- Node.js 18+ and npm/yarn/pnpm
- Expo CLI: `npm install -g expo-cli`
- Android SDK (for Android development)
- Android Emulator or physical device

### Step 1.2: Install Dependencies

```bash
cd urban-grail-mobile

# Install npm packages
npm install
# or
yarn install
# or
pnpm install
```

### Step 1.3: Configure Environment Variables

1. Create `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your API configuration:
```
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
EXPO_PUBLIC_APP_NAME=Urban Grail Mobile
EXPO_PUBLIC_AUTH_TIMEOUT=3600000
EXPO_PUBLIC_ENABLE_NOTIFICATIONS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false
```

3. **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

---

## Phase 2: Development Setup

### Step 2.1: Start Development Server

```bash
# Start Expo development server
npm start

# Start with Android emulator
npm run android

# Or start with web preview
npm run web
```

### Step 2.2: Using Android Emulator

If you don't have an Android emulator set up:

```bash
# List available emulators
emulator -list-avds

# Start an emulator
emulator @emulator_name

# Then run expo start --android
```

### Step 2.3: Using Physical Android Device

1. Install Expo Go app from Google Play Store
2. Connect device via USB or same WiFi
3. Run `npm start` and scan QR code with Expo Go app

---

## Phase 3: Project Structure

```
urban-grail-mobile/
├── App.tsx                    # Root component
├── app.json                  # Expo configuration
├── babel.config.js          # Babel configuration
├── tsconfig.json            # TypeScript configuration
├── package.json
├── .env.example             # Environment template
├── .env.local               # Local environment (DO NOT COMMIT)
│
├── src/
│   ├── api/                 # API client & endpoints
│   │   ├── client.ts        # Axios instance with interceptors
│   │   ├── endpoints.ts     # API endpoint constants
│   │   ├── auth.api.ts      # Auth API calls
│   │   ├── products.api.ts  # Products API calls
│   │   └── orders.api.ts    # Orders API calls
│   │
│   ├── store/               # Zustand stores
│   │   ├── useAuthStore.ts
│   │   ├── useCartStore.ts
│   │   ├── useProductStore.ts
│   │   ├── useOrderStore.ts
│   │   └── useUIStore.ts
│   │
│   ├── screens/             # Screen components
│   │   ├── auth/            # Authentication screens
│   │   ├── shop/            # Shopping screens
│   │   ├── cart/            # Cart & checkout
│   │   ├── orders/          # Orders & tracking
│   │   ├── account/         # User profile & settings
│   │   └── splash/          # Splash screen
│   │
│   ├── components/          # Reusable components
│   │   ├── common/          # Common/shared components
│   │   ├── auth/            # Auth-specific components
│   │   ├── shop/            # Shop-specific components
│   │   └── cart/            # Cart-specific components
│   │
│   ├── navigation/          # Navigation configuration
│   │   ├── types.ts         # Navigation types
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── ShopNavigator.tsx
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   └── useOrders.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── index.ts
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   └── order.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── storage.ts       # SecureStore & AsyncStorage
│   │   ├── errorHandler.ts  # Error handling
│   │   ├── validators.ts    # Form validation
│   │   ├── formatters.ts    # Data formatting
│   │   └── constants.ts     # App constants
│   │
│   └── theme/               # Theme configuration
│       ├── colors.ts
│       ├── spacing.ts
│       └── typography.ts
│
├── assets/                  # App images, icons, fonts
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── __tests__/              # Test files
```

---

## Phase 4: Key Features Configuration

### 4.1: Authentication Flow

The app uses JWT-based authentication with secure token storage:

1. **Login**: Email + Password → JWT token stored in SecureStore
2. **Registration**: New user creation with email verification
3. **Forgot Password**: OTP-based password reset
4. **Token Refresh**: Automatic token refresh before expiry
5. **Logout**: Clear tokens and redirect to login

**Files:**
- `src/store/useAuthStore.ts` - Auth state management
- `src/hooks/useAuth.ts` - Auth hook wrapper
- `src/api/auth.api.ts` - Auth API calls

### 4.2: Product Browsing

Browse products with filtering and search:

1. **List Products**: Paginated product list with categories
2. **Search**: Real-time product search
3. **Filters**: Price range, ratings, stock status
4. **Product Details**: Full product info, images, reviews
5. **Reviews**: View and add product reviews

**Files:**
- `src/store/useProductStore.ts` - Product state
- `src/hooks/useProducts.ts` - Product hook
- `src/api/products.api.ts` - Product API calls

### 4.3: Shopping Cart

Cart management with persistence:

1. **Add to Cart**: Add products with quantity
2. **Update Quantity**: Modify item quantities
3. **Remove Items**: Delete items from cart
4. **Cart Totals**: Calculate subtotal, tax, shipping
5. **Persistence**: Cart saved to device storage

**Files:**
- `src/store/useCartStore.ts` - Cart state
- `src/hooks/useCart.ts` - Cart hook

### 4.4: Orders & Checkout

Complete order management:

1. **Create Order**: Checkout flow with shipping & payment
2. **Order History**: View all user orders
3. **Order Tracking**: Real-time order status tracking
4. **Order Details**: Full order information and items
5. **Cancel Orders**: Cancel orders if permitted

**Files:**
- `src/store/useOrderStore.ts` - Order state
- `src/hooks/useOrders.ts` - Order hook
- `src/api/orders.api.ts` - Order API calls

### 4.5: User Profile

User account management:

1. **View Profile**: Display user information
2. **Edit Profile**: Update personal details
3. **Manage Addresses**: Save shipping addresses
4. **Settings**: Preferences, notifications, language
5. **Security**: Change password, logout

---

## Phase 5: Environment Variables Reference

### Required Variables

```
EXPO_PUBLIC_API_BASE_URL        # Your API base URL
EXPO_PUBLIC_APP_NAME            # App display name
EXPO_PUBLIC_AUTH_TIMEOUT        # Token expiry time (ms)
```

### Optional Variables

```
EXPO_PUBLIC_ENABLE_NOTIFICATIONS  # Enable push notifications (true/false)
EXPO_PUBLIC_ENABLE_ANALYTICS     # Enable analytics (true/false)
EXPO_PUBLIC_LOG_LEVEL            # Log level (debug/info/warn/error)
```

### Development vs Production

**Development (.env.local):**
- API_BASE_URL: `http://localhost:3000/api` or your dev server
- LOG_LEVEL: `debug`
- ANALYTICS: `false` (optional)

**Production (.env.production):**
- API_BASE_URL: Your production API domain
- LOG_LEVEL: `warn` or `error`
- ANALYTICS: `true` (optional)

---

## Phase 6: API Integration Details

### Base URL Configuration

The API base URL is configured in `src/api/client.ts`:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
```

### API Endpoints

All endpoints are relative to the base URL:

**Auth Endpoints:**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/send-otp` - Send OTP for password reset
- `POST /auth/forgot-password/reset` - Reset password

**Products Endpoints:**
- `GET /products` - Get products list (paginated)
- `GET /products/:id` - Get product details
- `GET /categories` - Get all categories
- `GET /products/search?query=...` - Search products

**Orders Endpoints:**
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `POST /orders` - Create new order
- `POST /orders/:id/cancel` - Cancel order

**Payment Endpoints:**
- `POST /payment/create` - Create payment
- `POST /payment/verify` - Verify payment

### Request/Response Handling

The API client includes automatic error handling, token refresh, and request/response interceptors:

```typescript
// Make API call with automatic error handling
const response = await productsApi.getProducts(1, 10);

// Error handling
try {
  const order = await ordersApi.createOrder(orderData);
} catch (error) {
  // Error is automatically parsed and user-friendly message is provided
  console.error(error.message);
}
```

---

## Phase 7: State Management (Zustand)

### Store Usage

Each store is a Zustand store with actions and selectors:

```typescript
import { useAuthStore } from '@store/useAuthStore';

function MyComponent() {
  const { user, isAuthenticated, login } = useAuthStore();

  const handleLogin = async () => {
    await login(email, password);
  };

  return <Button onPress={handleLogin} />;
}
```

### Stores Overview

**useAuthStore**
- User authentication and session management
- Handles login, register, logout, password reset

**useProductStore**
- Product browsing and filtering
- Categories, search, pagination

**useCartStore**
- Shopping cart management
- Persists to device storage
- Calculates totals with tax and shipping

**useOrderStore**
- User orders and order history
- Order creation and tracking
- Order status updates

**useUIStore**
- Global loading states
- Toast notifications
- Theme preference
- Modal/dialog management

---

## Phase 8: Running & Testing

### Development Commands

```bash
# Start development server
npm start

# Start with Android emulator
npm run android

# Clear cache and restart
npm start -- -c

# Run tests
npm test

# Build preview APK
npm run build:preview

# Build production APK
npm run build:android
```

### Testing the App

1. **Authentication**
   - Test login with valid credentials
   - Test registration with new account
   - Test forgot password flow
   - Test token refresh

2. **Products**
   - Browse product list
   - Search for products
   - Filter by category and price
   - View product details

3. **Shopping**
   - Add items to cart
   - Update quantities
   - Remove items
   - View cart total

4. **Checkout**
   - Fill shipping address
   - Select payment method
   - Review order
   - Complete purchase

5. **Orders**
   - View order history
   - View order details
   - Track order status
   - Cancel order (if allowed)

---

## Phase 9: Building for Release

### Setup EAS CLI

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS for the project
eas build:configure
```

### Create Android Keystore

```bash
# Generate keystore (one-time setup)
eas credentials

# Select Android
# Create new keystore when prompted
```

### Build Preview APK

```bash
# Build preview APK (for testing on device)
eas build --platform android --profile preview
```

### Build Production APK

```bash
# Build production APK (for Google Play)
eas build --platform android --profile production
```

### Prepare for Google Play Store

1. **Create Google Play Console Account**
   - Visit play.google.com/console
   - Create new app

2. **Prepare App Listing**
   - App name and description
   - Category and content rating
   - Screenshots (min 2, max 8)
   - Feature graphic (1024 x 500 px)
   - Icon (512 x 512 px)

3. **Prepare Release Notes**
   - Version history
   - What's new in this release

4. **Submit for Review**
   - Upload APK
   - Fill in required fields
   - Submit for review
   - Review typically takes 24-48 hours

---

## Phase 10: Common Issues & Solutions

### Issue: API Connection Failed

**Solution:**
- Check that `.env.local` has correct API_BASE_URL
- Ensure backend API is running and accessible
- Check network connectivity
- Verify CORS is properly configured on backend

### Issue: Token Refresh Not Working

**Solution:**
- Verify refresh token is saved in SecureStore
- Check backend refresh token endpoint is working
- Ensure token expiry time is configured correctly

### Issue: Expo Go App Not Loading

**Solution:**
- Run `npm start` and ensure server is running
- Clear Expo cache: `npm start -- -c`
- Restart Expo Go app
- Check device is on same WiFi as development machine

### Issue: Android Build Fails

**Solution:**
- Ensure Android SDK is properly installed
- Update Gradle: `eas build --platform android --profile preview`
- Clear build cache: `eas build --platform android --clear-cache`

---

## Phase 11: Security Best Practices

1. **Never hardcode secrets** - Use environment variables
2. **Always use HTTPS** - Enforce HTTPS in production
3. **Secure storage** - Use SecureStore for tokens
4. **Input validation** - Validate all user input
5. **Error handling** - Don't expose sensitive info in errors
6. **Keep dependencies updated** - Regularly update packages
7. **API key rotation** - Rotate API keys periodically

---

## Phase 12: Performance Optimization

1. **Lazy load screens** - Use React.lazy for heavy components
2. **Image optimization** - Use expo-image for efficient loading
3. **Pagination** - Implement pagination for large lists
4. **Caching** - Cache frequently accessed data
5. **Code splitting** - Split large bundles
6. **Monitor performance** - Use React Native Debugger

---

## Useful Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org
- **React Native Paper**: https://callstack.github.io/react-native-paper
- **Zustand**: https://github.com/pmndrs/zustand
- **Axios**: https://axios-http.com
- **TypeScript Handbook**: https://www.typescriptlang.org/docs

---

## Support & Troubleshooting

For issues and questions:
1. Check the relevant documentation above
2. Review error messages and console logs
3. Check GitHub issues for similar problems
4. Create a new issue with detailed steps to reproduce

---

**Last Updated:** 2024
**Version:** 1.0.0
