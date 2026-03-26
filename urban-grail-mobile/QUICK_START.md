# Urban Grail Mobile - Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd urban-grail-mobile
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local and set your API base URL
```

### 3. Start the App
```bash
npm start

# For Android emulator
npm run android

# For physical device
# Scan QR code with Expo Go app
```

---

## Project Already Created With:

✅ **Complete Project Structure**
- All folders and file organization ready
- TypeScript configuration
- Babel configuration

✅ **API Integration Layer**
- Axios client with interceptors
- Token refresh mechanism
- Error handling
- All endpoints configured

✅ **State Management (Zustand)**
- Auth store (login, register, logout)
- Product store (browsing, filtering)
- Cart store (add, remove, totals)
- Order store (create, track)
- UI store (loading, toasts, themes)

✅ **Custom Hooks**
- `useAuth()` - Authentication
- `useCart()` - Shopping cart
- `useProducts()` - Product browsing
- `useOrders()` - Order management

✅ **Navigation Structure**
- Bottom tab navigation
- Stack navigation for each tab
- Conditional auth/app navigation
- Type-safe navigation params

✅ **Theme System**
- Color palette
- Typography scales
- Spacing system
- Dark mode support

✅ **UI Components**
- GlobalLoading - Loading spinner
- ToastContainer - Notifications
- CustomButton - Reusable button
- More components ready for creation

✅ **Utilities**
- Storage (SecureStore + AsyncStorage)
- Error handling & parsing
- Form validators
- Data formatters
- Constants & configuration

✅ **TypeScript Types**
- Auth types
- Product types
- Order types
- API response types
- Navigation param types

---

## What You Need to Complete

### 1. Screen Components (Medium Priority)

Create the remaining screen files. Use `LoginScreen.tsx` as a template:

**Auth Screens:**
- `src/screens/auth/RegisterScreen.tsx`
- `src/screens/auth/ForgotPasswordScreen.tsx`
- `src/screens/auth/OTPVerificationScreen.tsx`

**Shop Screens:**
- `src/screens/shop/HomeScreen.tsx`
- `src/screens/shop/ProductListScreen.tsx`
- `src/screens/shop/ProductDetailScreen.tsx`

**Search Screen:**
- `src/screens/search/SearchScreen.tsx`

**Cart & Checkout:**
- `src/screens/cart/CartScreen.tsx`
- `src/screens/cart/CheckoutScreen.tsx`

**Orders:**
- `src/screens/orders/OrdersScreen.tsx`
- `src/screens/orders/OrderDetailScreen.tsx`

**Account:**
- `src/screens/account/ProfileScreen.tsx`
- `src/screens/account/SettingsScreen.tsx`

### 2. Reusable Components (Medium Priority)

Create UI components in `src/components/`:

**Common:**
- Input component
- Card component
- Loading skeleton
- Error message display
- Empty state component
- Modal/dialog

**Shop Components:**
- ProductCard
- ProductGrid
- CategoryFilter
- SearchBar

**Cart Components:**
- CartItem
- CartSummary
- EmptyCart

**Auth Components:**
- RegisterForm
- PasswordResetForm
- OTPInput

### 3. Testing (Low Priority for MVP)

Setup testing files:
- `__tests__/api/client.test.ts`
- `__tests__/store/useAuthStore.test.ts`
- `__tests__/utils/validators.test.ts`

### 4. Assets (Low Priority for MVP)

Add to `assets/`:
- `icon.png` (1024x1024)
- `splash.png` (1242x2208)
- `adaptive-icon.png` (1080x1080)
- App icons and images

---

## API Configuration

Update your API URL in `.env.local`:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

The API client is ready to connect to your Urban Grail web API. No additional configuration needed!

---

## Example: Creating a Screen

Here's the structure for a new screen:

```typescript
import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { useProducts } from '@hooks/useProducts';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

type HomeScreenProps = any; // Use: RootStackProps<'Tabs'>

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { products, isLoading, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts(1, 10);
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Featured Products</Text>
      {/* Your content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
  },
});
```

---

## Example: Using Stores

```typescript
// In a screen or component
import { useAuthStore } from '@store/useAuthStore';
import { useCartStore } from '@store/useCartStore';

function MyComponent() {
  // Get state and actions
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items, total, addItem } = useCartStore();

  // Use them
  return (
    <>
      <Text>{user?.email}</Text>
      <Text>Cart total: ${total}</Text>
      <Button onPress={() => addItem(product)} />
    </>
  );
}
```

---

## Example: Using Custom Hooks

```typescript
import { useAuth } from '@hooks/useAuth';
import { useCart } from '@hooks/useCart';

function LoginScreen() {
  const { login, isLoading } = useAuth();
  const { addItem, total } = useCart();

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      // Auto-navigates via App.tsx
    }
  };

  return (
    <CustomButton
      label="Login"
      onPress={handleLogin}
      loading={isLoading}
    />
  );
}
```

---

## API Call Examples

All API calls are already configured:

```typescript
// Products API
const { products } = await productsApi.getProducts(1, 10);
const { product } = await productsApi.getProductDetail(productId);
const { categories } = await productsApi.getCategories();

// Orders API
const { order } = await ordersApi.createOrder(orderData);
const { orders } = await ordersApi.getOrders(1, 10);

// Auth API
const { user, accessToken } = await authApi.login(email, password);
await authApi.logout();
```

---

## Running on Android Device

### Via USB:
```bash
# Enable USB debugging on Android device
# Connect device
adb devices  # Should show your device

npm start
# Select Android from menu or press 'a'
```

### Via WiFi:
```bash
npm start
# Get IP address from server output
# Enter it in Expo Go when connecting
```

---

## Build & Deploy Checklist

Before release:
- [ ] All screens created
- [ ] API endpoints tested
- [ ] Error handling works
- [ ] Loading states working
- [ ] Forms validated
- [ ] Navigation flows tested
- [ ] Cart/checkout working
- [ ] Orders display correctly
- [ ] Images optimized
- [ ] App icons created
- [ ] Splash screen created
- [ ] Environment variables set
- [ ] API URL points to production

---

## File Locations Reference

| Purpose | Location |
|---------|----------|
| API Client | `src/api/client.ts` |
| API Endpoints | `src/api/endpoints.ts` |
| Auth API | `src/api/auth.api.ts` |
| Products API | `src/api/products.api.ts` |
| Orders API | `src/api/orders.api.ts` |
| Auth Store | `src/store/useAuthStore.ts` |
| Cart Store | `src/store/useCartStore.ts` |
| Custom Hooks | `src/hooks/*.ts` |
| Theme | `src/theme/*.ts` |
| Types | `src/types/*.ts` |
| Utils | `src/utils/*.ts` |
| Navigation | `src/navigation/*.tsx` |
| Root Component | `App.tsx` |
| Configuration | `app.json`, `.env.local` |

---

## Development Tips

1. **Import Aliases**: Use `@screens/`, `@components/`, `@store/`, etc.
2. **Console Logs**: Use `console.log('[component-name] message')` for easy debugging
3. **Type Safety**: Always use proper TypeScript types
4. **Reusable Code**: Create hooks for repeated logic
5. **Error Handling**: Let stores handle API errors, they show toasts automatically

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure `.env.local`
3. ✅ Start the app with `npm start`
4. Create remaining screen files
5. Create reusable UI components
6. Test auth flow
7. Test shopping flow
8. Build and deploy

---

**Happy coding! 🚀**

For detailed information, see `SETUP_GUIDE.md`.
