# React Native Mobile App - Implementation Guide

## Urban Grail Mobile (Android with Expo)

**Status**: Foundation Complete ✅
**Last Updated**: March 2026
**Platform**: Android
**Framework**: React Native + Expo

---

## What Has Been Built So Far

### ✅ Phase 1: Project Infrastructure
- **Root App Component** (`App.tsx`) - Main entry point with navigation setup
- **Theme Configuration** (`src/theme/colors.ts`) - Complete color system and typography
- **Navigation Structure**:
  - Root Navigator - Handles auth/app state
  - Auth Navigator - Login, Register, Forgot Password, OTP screens
  - Shop Navigator - Bottom tab navigation with 5 main sections
  - Stack Navigators - Nested navigation for each tab

### ✅ Phase 2: API Integration Layer
- **API Client** (`src/api/client.ts`):
  - Axios instance with base URL configuration
  - Request interceptor - Automatically adds JWT tokens
  - Response interceptor - Handles 401 errors and token refresh
  - Queue mechanism for failed requests during token refresh
  
- **API Endpoints** (`src/api/endpoints.ts`):
  - Centralized endpoint constants for all API routes
  - Helper function `buildUrl()` for path parameters
  
- **API Services**:
  - `auth.api.ts` - Login, register, refresh token, OTP, password reset
  - `products.api.ts` - Products, search, categories, reviews
  - `orders.api.ts` - Create orders, fetch, track, cancel

### ✅ Phase 3: State Management (Zustand Stores)
- **useAuthStore** - User authentication state and actions
  - `login()` - Authenticate user with email/password
  - `register()` - Create new user account
  - `logout()` - Clear auth data
  - `checkAuth()` - Restore auth from storage on app startup
  
- **useProductStore** - Products and shopping state
  - `fetchProducts()` - Get products with filters
  - `searchProducts()` - Search products
  - `fetchCategories()` - Get all categories
  - `setSelectedCategory()` - Filter by category
  
- **useCartStore** - Shopping cart state
  - `addItem()` - Add product to cart
  - `removeItem()` - Remove from cart
  - `updateQuantity()` - Change item quantity
  - `clearCart()` - Empty cart
  - Auto-calculates totals with tax and shipping
  
- **useOrderStore** - User orders state
  - `fetchOrders()` - Get user's order history
  - `createOrder()` - Place new order
  - `cancelOrder()` - Cancel existing order
  
- **useUIStore** - Global UI state
  - `showToast()` - Display toast notifications
  - `openModal()` / `closeModal()` - Manage modals
  - `setIsLoading()` - Control global loading state

### ✅ Phase 4: Security & Storage
- **Storage Utilities** (`src/utils/storage.ts`):
  - SecureStore for JWT tokens (encrypted)
  - AsyncStorage for user data and cart
  - Token expiry management
  - `checkTokenValidity()` for app startup
  
- **Error Handler** (`src/utils/errorHandler.ts`):
  - API error conversion to user-friendly messages
  - Error type detection and logging
  - Retry logic for network failures

### ✅ Phase 5: Core UI Components
- **Button** - Customizable button with variants (primary, secondary, outline, danger)
- **Input** - Text input with validation, error states, and password toggle
- **Card** - Container component for content grouping
- **Loading** - Activity indicator with full-screen option
- **ErrorMessage** - Error display component
- **SplashScreen** - App loading screen

### ✅ Phase 6: Screens (Partial)
- **LoginScreen** (`src/screens/auth/LoginScreen.tsx`)
  - Complete form with email/password validation
  - Error handling and loading states
  - Links to register and forgot password
  - Integrated with authentication store

---

## Next Steps - Remaining Tasks

### Task 3: Authentication Screens (Complete)
**Screens to Create**:
1. **RegisterScreen** - User registration form with validation
2. **ForgotPasswordScreen** - Email input for password reset
3. **OTPVerificationScreen** - OTP input and verification
4. **ResetPasswordScreen** - New password form

**Key Features**:
- Form validation with error messages
- OTP countdown timer
- Password confirmation matching
- Resend OTP button

---

### Task 4: Shop Screens (Create These)
**Files to Create**:
```
src/screens/shop/
├── HomeScreen.tsx          # Featured products, categories, banner
├── ProductListScreen.tsx   # Grid/list view with filters
├── ProductDetailScreen.tsx # Product info, reviews, add to cart
└── CategoriesScreen.tsx    # Category list and selection
```

**HomeScreen Features**:
- Featured products carousel
- Category shortcuts
- Search bar
- User welcome message

**ProductListScreen Features**:
- Product grid/list toggle
- Filtering by category, price, rating
- Sorting options
- Pagination
- Search integration

**ProductDetailScreen Features**:
- Product images carousel
- Description, specifications, reviews
- Rating and review count
- Add to cart button with quantity selector
- Related products

---

### Task 5: Cart & Checkout (Create These)
**Files to Create**:
```
src/screens/cart/
├── CartScreen.tsx      # Cart items, quantity controls, summary
└── CheckoutScreen.tsx  # Shipping form, payment method, order review
```

**CartScreen Features**:
- List of cart items with images
- Quantity increment/decrement
- Remove item button
- Cart summary (subtotal, tax, shipping, total)
- Proceed to checkout button

**CheckoutScreen Features**:
- Shipping address form
- Address selection from saved
- Payment method selection
- Coupon code input
- Order review
- Place order button

---

### Task 6: Orders & Tracking (Create These)
**Files to Create**:
```
src/screens/orders/
├── OrdersScreen.tsx   # List of user orders with status
└── OrderDetailScreen.tsx # Order details, items, tracking
```

**Features**:
- Order history list
- Order status badges
- Order details view
- Track order functionality
- Cancel order option
- Download invoice button

---

### Task 7: User Profile (Create These)
**Files to Create**:
```
src/screens/account/
├── ProfileScreen.tsx        # User info display
├── EditProfileScreen.tsx    # Edit profile form
├── AddressScreen.tsx        # Manage delivery addresses
├── SettingsScreen.tsx       # App preferences
└── LogoutScreen.tsx         # Logout confirmation
```

**Features**:
- Profile picture, name, email
- Edit profile form
- Add/edit/delete addresses
- Notification preferences
- Dark mode toggle
- Logout functionality

---

## File Structure Reference

```
urban-grail-mobile/
├── App.tsx
├── app.json
├── package.json
├── babel.config.js
├── tsconfig.json
├── .env.local (DO NOT COMMIT)
├── .env.example
├── .gitignore
│
├── REACT_NATIVE_SETUP.md
├── MOBILE_APP_IMPLEMENTATION_GUIDE.md (this file)
│
├── src/
│   ├── api/
│   │   ├── client.ts ✅
│   │   ├── endpoints.ts ✅
│   │   ├── auth.api.ts ✅
│   │   ├── products.api.ts ✅
│   │   └── orders.api.ts ✅
│   │
│   ├── store/
│   │   ├── useAuthStore.ts ✅
│   │   ├── useProductStore.ts ✅
│   │   ├── useCartStore.ts ✅
│   │   ├── useOrderStore.ts ✅
│   │   └── useUIStore.ts ✅
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx ✅
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   ├── OTPVerificationScreen.tsx
│   │   │   └── ResetPasswordScreen.tsx
│   │   ├── shop/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── ProductListScreen.tsx
│   │   │   ├── ProductDetailScreen.tsx
│   │   │   └── CategoriesScreen.tsx
│   │   ├── cart/
│   │   │   ├── CartScreen.tsx
│   │   │   └── CheckoutScreen.tsx
│   │   ├── orders/
│   │   │   ├── OrdersScreen.tsx
│   │   │   └── OrderDetailScreen.tsx
│   │   ├── account/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   ├── AddressScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   └── LogoutScreen.tsx
│   │   └── splash/
│   │       └── SplashScreen.tsx ✅
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx ✅
│   │   ├── AuthNavigator.tsx ✅ (partial)
│   │   ├── ShopNavigator.tsx ✅
│   │   └── types.ts ✅
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx ✅
│   │   │   ├── Input.tsx ✅
│   │   │   ├── Card.tsx ✅
│   │   │   ├── Loading.tsx ✅
│   │   │   └── ErrorMessage.tsx ✅
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── CategoryFilter.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── EmptyCart.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx (logic in LoginScreen)
│   │       └── RegisterForm.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProducts.ts
│   │   ├── useCart.ts
│   │   ├── useOrders.ts
│   │   └── useAsync.ts
│   │
│   ├── types/
│   │   └── api.ts ✅
│   │
│   ├── utils/
│   │   ├── storage.ts ✅
│   │   ├── errorHandler.ts ✅
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   │
│   └── theme/
│       └── colors.ts ✅
│
├── __tests__/
│   ├── api/
│   ├── store/
│   └── utils/
│
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

---

## Environment Variables Configuration

### 1. Create `.env.local` (DO NOT COMMIT)
```env
# Your actual API domain
EXPO_PUBLIC_API_BASE_URL=https://your-actual-api-domain.com/api
EXPO_PUBLIC_API_TIMEOUT=30000

# App name
EXPO_PUBLIC_APP_NAME=Urban Grail Mobile

# Authentication timeout (1 hour)
EXPO_PUBLIC_AUTH_TIMEOUT=3600000

# Features
EXPO_PUBLIC_ENABLE_NOTIFICATIONS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false

# Debug mode
EXPO_PUBLIC_DEBUG_MODE=false
```

### 2. Update with Your Web API URL
Replace `https://your-actual-api-domain.com/api` with your actual Vercel/hosting domain:
- If web app is: `https://urban-grail.vercel.app`
- Then API base URL: `https://urban-grail.vercel.app/api`

### 3. Key Environment Variable Usage
```typescript
// In src/api/client.ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000')

// In components
const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL
const appName = process.env.EXPO_PUBLIC_APP_NAME
```

---

## Development Workflow

### Starting Development
```bash
# 1. Install dependencies (if not done)
npm install

# 2. Start development server
npm start

# 3. In another terminal, run on Android emulator
npm run android

# OR on physical device
# Connect device and run: npm run android
```

### Hot Reload
- Changes to JavaScript files automatically reload
- Changes to `.env.local` require restart: `npm start -c`
- Changes to native code require rebuild

### Debugging
```bash
# View logs
npm start

# To clear cache and restart
npm start -c

# Open React Native Debugger
npm run android
```

---

## API Integration Checklist

Before running the app, ensure your API endpoints match:

- [ ] `POST /api/auth/login` - Returns `{ token, refreshToken, user }`
- [ ] `POST /api/auth/register` - Returns `{ token, refreshToken, user }`
- [ ] `POST /api/auth/logout` - No body required
- [ ] `POST /api/auth/refresh` - Accepts `{ refreshToken }`
- [ ] `GET /api/products` - Supports pagination and filters
- [ ] `GET /api/categories` - Returns category list
- [ ] `GET /api/products/:id` - Returns product detail
- [ ] `POST /api/orders` - Creates new order
- [ ] `GET /api/orders` - Gets user's orders
- [ ] `GET /api/users/profile` - Gets current user data

---

## Testing the Login Flow

### Step 1: Test with Your API
1. Update `.env.local` with your API domain
2. Run `npm start -c` to clear cache
3. Open app on emulator/device
4. Try login with test credentials

### Step 2: Verify Token Storage
```typescript
// In LoginScreen or any screen:
import { storage } from '../utils/storage';

const token = await storage.getToken();
console.log('[v0] Token:', token);
```

### Step 3: Test Token Refresh
Make an API call that should trigger refresh:
- Store will automatically refresh token
- Check network tab to see refresh request

---

## Common Issues & Solutions

### Issue: "API_BASE_URL is undefined"
**Solution**: 
1. Verify `.env.local` exists with `EXPO_PUBLIC_API_BASE_URL`
2. Run `npm start -c` to clear cache
3. Restart development server

### Issue: "Network request failed"
**Solution**:
1. Check API domain is correct in `.env.local`
2. Ensure API is running and accessible
3. For localhost testing: Use your computer's IP (not localhost)
4. Check CORS is enabled on backend

### Issue: "401 Unauthorized"
**Solution**:
1. Token may be expired - clear storage and re-login
2. Check API returns correct token format
3. Verify request headers include `Authorization: Bearer <token>`

### Issue: "Module not found"
**Solution**:
```bash
# Clear and reinstall
rm -rf node_modules
npm install
npm start -c
```

---

## Key Integration Points

### 1. API Base URL
- **Location**: `.env.local` → `EXPO_PUBLIC_API_BASE_URL`
- **Format**: `https://your-domain.com/api` (no trailing slash)
- **Example**: `https://urban-grail.vercel.app/api`

### 2. Authentication
- **Token Storage**: SecureStore (encrypted, secure)
- **Token Format**: JWT
- **Header Format**: `Authorization: Bearer <token>`
- **Refresh Endpoint**: `/api/auth/refresh`

### 3. Error Handling
- **Network Errors**: Show "Check internet connection"
- **401 Errors**: Attempt token refresh, then logout
- **Validation Errors**: Show field-specific messages
- **Server Errors**: Show generic "Server error, try again"

### 4. State Persistence
- **Auth Data**: Cleared on logout, restored on startup
- **Cart Data**: Persisted in AsyncStorage
- **User Data**: Stored in AsyncStorage alongside token

---

## Performance Considerations

### Image Optimization
- Use `expo-image` for lazy loading
- Set image dimensions explicitly
- Cache images appropriately

### API Requests
- Implement pagination for large lists
- Use request debouncing for search
- Cache responses where appropriate
- Cancel requests on screen unmount

### State Management
- Zustand is lightweight and performant
- Update only necessary stores on state change
- Use selectors to prevent unnecessary re-renders

---

## Security Checklist

- [x] Tokens stored in SecureStore (not AsyncStorage)
- [x] HTTPS enforced for all API calls
- [x] Token refresh implemented
- [x] 401 responses handled with logout
- [x] No hardcoded secrets in code
- [x] Input validation on forms
- [x] API errors don't expose sensitive data

---

## Building & Deployment

### Build for Android (APK)
```bash
# Requires EAS account
eas login

# Build preview (for testing)
npm run build:preview

# Build for production
npm run build:android

# Get APK for testing
# Download from EAS dashboard
```

### Submit to Google Play Store
1. Create Google Play Developer account
2. Create app listing
3. Upload signed APK
4. Add screenshots and description
5. Submit for review

---

## Resources & Documentation

- [Expo Documentation](https://docs.expo.dev)
- [React Navigation Guide](https://reactnavigation.org)
- [React Native Paper Docs](https://callstack.github.io/react-native-paper/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com)
- [Your Web App API Docs](https://github.com/yur1-dev/urban-grail-app)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `.env.local` and API configuration
3. Check console logs with `npm start`
4. Review API response format matches expected types
5. Open issue on GitHub repository

---

**Created**: March 2026
**Last Updated**: March 2026
**Status**: Foundation Complete - Ready for Screen Implementation
