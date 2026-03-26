# React Native Mobile App - Quick Start Guide

## TL;DR

Your complete React Native Expo app foundation is ready. Follow these steps:

---

## Step 1: Initial Setup (5 minutes)

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Create .env.local with your API URL
# Copy from .env.example and update:
# EXPO_PUBLIC_API_BASE_URL=https://your-api.com/api

# 3. Start development server
npm start

# 4. Run on Android (in new terminal)
npm run android
```

If issues, try: `npm start -c` (clears cache)

---

## Step 2: Test Login (2 minutes)

1. App opens to Login screen ✅
2. Enter test credentials from your web app
3. Should navigate to Home screen
4. If error, check:
   - `.env.local` has correct API URL
   - Network tab in terminal shows requests
   - API is running and returns correct data

---

## Step 3: Build Next Screen

All screens follow this pattern:

### Example: RegisterScreen

```typescript
import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { AuthStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

type ScreenProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: ScreenProp;
}

const RegisterScreen = ({ navigation }: Props) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const { register, isLoading, error, clearError } = useAuthStore();
  const { showToast } = useUIStore();

  const validateForm = () => {
    // Validation logic
    return true;
  };

  const handleRegister = async () => {
    clearError();
    if (!validateForm()) return;

    try {
      await register(formData);
      showToast('Registration successful!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {error && <ErrorMessage message={error} onDismiss={clearError} />}

      <Input
        label="First Name"
        value={formData.firstName}
        onChangeText={(firstName) => setFormData(prev => ({ ...prev, firstName }))}
      />

      <Input
        label="Email"
        value={formData.email}
        onChangeText={(email) => setFormData(prev => ({ ...prev, email }))}
        keyboardType="email-address"
      />

      <Input
        label="Password"
        value={formData.password}
        onChangeText={(password) => setFormData(prev => ({ ...prev, password }))}
        secureTextEntry
      />

      <Button
        onPress={handleRegister}
        loading={isLoading}
        disabled={isLoading}
        fullWidth
      >
        Create Account
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
});

export default RegisterScreen;
```

---

## Available Store Hooks

### useAuthStore
```typescript
const { 
  user,           // User object or null
  token,          // JWT token or null
  isAuthenticated,// Boolean
  isLoading,      // Boolean
  error,          // Error message or null
  login,          // (email, password) => Promise
  register,       // (data) => Promise
  logout,         // () => Promise
  checkAuth,      // () => Promise
} = useAuthStore();
```

### useProductStore
```typescript
const {
  products,       // Product[]
  featured,       // Product[]
  categories,     // Category[]
  isLoading,      // Boolean
  error,          // Error message
  fetchProducts,  // (filters) => Promise
  fetchFeaturedProducts, // (limit) => Promise
  fetchCategories,// () => Promise
  searchProducts, // (query) => Promise
} = useProductStore();
```

### useCartStore
```typescript
const {
  items,          // CartItem[]
  subtotal,       // Number
  tax,            // Number
  shippingCost,   // Number
  total,          // Number
  addItem,        // (product, quantity) => void
  removeItem,     // (productId) => void
  updateQuantity, // (productId, quantity) => void
  clearCart,      // () => Promise
  getItemCount,   // () => number
} = useCartStore();
```

### useOrderStore
```typescript
const {
  orders,         // Order[]
  selectedOrder,  // Order or null
  isLoading,      // Boolean
  error,          // Error message
  fetchOrders,    // () => Promise
  createOrder,    // (data) => Promise
  cancelOrder,    // (orderId) => Promise
} = useOrderStore();
```

### useUIStore
```typescript
const {
  isLoading,      // Boolean
  toast,          // ToastMessage or null
  showToast,      // (message, type, duration) => void
  hideToast,      // () => void
  openModal,      // (name) => void
  closeModal,     // (name) => void
  isModalOpen,    // (name) => boolean
} = useUIStore();
```

---

## API Service Usage

### Direct API Calls
```typescript
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';

// Simple GET
const products = await apiClient.get(endpoints.products.list);

// GET with parameters
const params = { page: 1, limit: 10 };
const products = await apiClient.get(endpoints.products.list, { params });

// POST with data
const result = await apiClient.post(endpoints.auth.login, {
  email: 'user@example.com',
  password: 'password123'
});

// PUT/DELETE
await apiClient.put(url, data);
await apiClient.delete(url);
```

### API Services (Recommended)
```typescript
import { authApi } from '@/api/auth.api';
import { productsApi } from '@/api/products.api';
import { ordersApi } from '@/api/orders.api';

// These handle response parsing automatically
const user = await authApi.login({ email, password });
const products = await productsApi.getProducts();
const orders = await ordersApi.getOrders();
```

---

## Component Usage

### Button
```typescript
<Button
  mode="contained"
  onPress={() => handlePress()}
  loading={isLoading}
  disabled={isLoading}
  fullWidth
  variant="primary" // or 'secondary', 'outline', 'danger'
>
  Click Me
</Button>
```

### Input
```typescript
<Input
  label="Email"
  placeholder="Enter email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  errorMessage="Invalid email"
  keyboardType="email-address"
  secureTextEntry={false}
/>
```

### Card
```typescript
import Card, { CardContent, CardTitle, CardActions } from '@/components/common/Card';

<Card variant="elevated">
  <CardTitle title="Title" subtitle="Subtitle" />
  <CardContent>
    Content here
  </CardContent>
  <CardActions>
    <Button>Action</Button>
  </CardActions>
</Card>
```

### Loading
```typescript
<Loading size="large" color={colors.primary} fullScreen={false} />
```

### Error
```typescript
<ErrorMessage message="Error occurred" onDismiss={() => clearError()} />
```

---

## Navigation

### Navigate to Screen
```typescript
// From any screen with navigation prop
navigation.navigate('ScreenName');
navigation.navigate('ScreenName', { param: 'value' });

// From hooks
import { useNavigation } from '@react-navigation/native';
const navigation = useNavigation();
```

### Screen Names

**Auth Stack**:
- `Login`
- `Register`
- `ForgotPassword`
- `OTPVerification`
- `ResetPassword`

**Shop Bottom Tabs**:
- `Home`
- `Shop`
- `Cart`
- `Orders`
- `Account`

### Navigate with Parameters
```typescript
// Define in types.ts
export type ShopTabParamList = {
  ProductDetail: { productId: string };
};

// Navigate
navigation.navigate('ProductDetail', { productId: '123' });

// Receive in screen
const { productId } = route.params;
```

---

## Debugging

### View Logs
```bash
npm start
# Shows all logs and errors
```

### View API Requests
Look for `[v0] API Request:` and `[v0] API Response:` in logs

### Clear Cache and Restart
```bash
npm start -c
```

### Test API Connection
```typescript
// In any screen:
import { apiClient } from '@/api/client';

const testAPI = async () => {
  try {
    const response = await apiClient.get('/products');
    console.log('[v0] API Works:', response.data);
  } catch (error) {
    console.error('[v0] API Error:', error);
  }
};

useEffect(() => {
  testAPI();
}, []);
```

---

## Environment Variables

### Update `.env.local`
```env
# Required - Your API domain
EXPO_PUBLIC_API_BASE_URL=https://your-domain.com/api

# Optional - Customize as needed
EXPO_PUBLIC_API_TIMEOUT=30000
EXPO_PUBLIC_APP_NAME=Urban Grail Mobile
EXPO_PUBLIC_AUTH_TIMEOUT=3600000
EXPO_PUBLIC_ENABLE_NOTIFICATIONS=true
EXPO_PUBLIC_DEBUG_MODE=false
```

### Access in Code
```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const timeout = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000');
```

---

## Folder Structure Quick Reference

```
src/
├── api/           ← API calls (use these)
├── store/         ← State management (use these)
├── screens/       ← Create screens here
├── navigation/    ← Already configured
├── components/    ← Reusable components
├── types/         ← TypeScript types
├── utils/         ← Helper functions
└── theme/         ← Colors and styles
```

---

## Common Patterns

### Load Data on Screen Open
```typescript
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    await store.fetchData();
  } catch (error) {
    showToast('Error loading data', 'error');
  }
};
```

### Form Submission
```typescript
const handleSubmit = async () => {
  if (!validateForm()) {
    showToast('Please fix errors', 'error');
    return;
  }

  try {
    await store.action(formData);
    showToast('Success!', 'success');
    navigation.goBack();
  } catch (error) {
    showToast(error.message, 'error');
  }
};
```

### List with Pull to Refresh
```typescript
const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await store.fetchData();
  setRefreshing(false);
};

<FlatList
  data={items}
  refreshing={refreshing}
  onRefresh={onRefresh}
/>
```

---

## Useful Commands

```bash
# Start development server
npm start

# Run on Android emulator
npm run android

# Run on iOS (if you switch platforms)
npm run ios

# Clear cache and restart
npm start -c

# Build for production
npm run build:android

# Build preview (for testing)
npm run build:preview

# Run tests
npm test

# Check code issues
npm run lint
```

---

## Checklist to Build Each Screen

- [ ] Create file in correct folder
- [ ] Import navigation type
- [ ] Import store hooks
- [ ] Add screen to navigator
- [ ] Create form/list UI
- [ ] Add loading state
- [ ] Add error handling
- [ ] Add success toast
- [ ] Test with real API
- [ ] Test error cases
- [ ] Test loading state

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| App won't start | Run `npm install` then `npm start -c` |
| API connection fails | Check `.env.local` has correct API URL |
| Token expires on login | Ensure API returns `token` in response |
| Screens won't navigate | Check screen name in navigator matches |
| State not persisting | Check `saveToStorage` is called in store |
| Components styling off | Check colors imported from `theme/colors.ts` |

---

## Next Steps

1. **Read**: `REACT_NATIVE_SETUP.md` - Installation details
2. **Follow**: Steps to get app running locally
3. **Build**: Next screen using patterns above
4. **Test**: With your actual API
5. **Deploy**: When ready for Play Store

---

## Need Help?

Check these files:
- **Setup Issues**: `REACT_NATIVE_SETUP.md`
- **Architecture**: `MOBILE_APP_IMPLEMENTATION_GUIDE.md`
- **Overview**: `REACT_NATIVE_PROJECT_SUMMARY.md`
- **Code Examples**: Look at `LoginScreen.tsx` for pattern

---

**Ready to build screens?** You have all the tools! Each screen is simple following the patterns.
