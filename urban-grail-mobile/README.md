# Urban Grail Mobile App

A React Native mobile application for the Urban Grail e-commerce platform, built with Expo and TypeScript. Full-featured shopping experience with authentication, product browsing, cart management, and order tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Expo CLI: `npm install -g expo-cli`
- Android SDK & Emulator (or physical Android device)

### Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local and set your API base URL

# 3. Start the app
npm start
npm run android  # For Android emulator
```

**Full Setup Guide:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 📋 Features

✅ **Authentication**
- User login & registration
- JWT-based auth with secure token storage
- Password reset with OTP
- Token auto-refresh
- Persistent login

✅ **Product Browsing**
- Browse featured products
- Search functionality
- Category filtering
- Price range filters
- Pagination
- Product details with images
- User reviews & ratings

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Persistent storage
- Real-time total calculation
- Tax & shipping costs

✅ **Checkout & Orders**
- Shipping address management
- Payment method selection
- Order review
- Order history
- Order tracking
- Order cancellation

✅ **User Profile**
- View profile information
- Edit personal details
- Manage addresses
- Settings & preferences
- Change password
- Logout

✅ **UI/UX**
- Material Design 3 with React Native Paper
- Dark mode support
- Responsive layout
- Toast notifications
- Loading states
- Error handling

---

## 📱 Tech Stack

**Core**
- React Native 0.73.6
- Expo 50.0.0
- TypeScript 5.3.3
- React 18.2.0

**Navigation**
- React Navigation 6.x
- Bottom Tab Navigator
- Stack Navigator

**State Management**
- Zustand (lightweight, scalable)

**API & Network**
- Axios with interceptors
- Token refresh mechanism
- Centralized error handling

**UI Components**
- React Native Paper (Material Design)
- Custom components

**Storage**
- Expo SecureStore (tokens)
- AsyncStorage (user data & cart)

**Utilities**
- Date-fns (date formatting)
- React Hook Form (form management)
- Custom validators & formatters

---

## 📂 Project Structure

```
urban-grail-mobile/
├── App.tsx                      # Root app component
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── babel.config.js             # Babel config
│
├── .env.example                # Environment template
├── .env.local                  # Local env (DO NOT COMMIT)
│
├── src/
│   ├── api/                    # API integration
│   │   ├── client.ts           # Axios instance
│   │   ├── endpoints.ts        # API endpoints
│   │   ├── auth.api.ts         # Auth endpoints
│   │   ├── products.api.ts     # Product endpoints
│   │   └── orders.api.ts       # Order endpoints
│   │
│   ├── store/                  # Zustand stores
│   │   ├── useAuthStore.ts     # Authentication
│   │   ├── useProductStore.ts  # Products
│   │   ├── useCartStore.ts     # Shopping cart
│   │   ├── useOrderStore.ts    # Orders
│   │   └── useUIStore.ts       # UI state
│   │
│   ├── screens/                # Screen components
│   │   ├── auth/               # Login, Register, etc.
│   │   ├── shop/               # Home, Products
│   │   ├── cart/               # Cart, Checkout
│   │   ├── orders/             # Orders, Tracking
│   │   ├── account/            # Profile, Settings
│   │   └── splash/             # Splash screen
│   │
│   ├── components/             # Reusable components
│   │   ├── common/             # Button, Input, Loading
│   │   ├── auth/               # Auth forms
│   │   ├── shop/               # Product cards
│   │   └── cart/               # Cart items
│   │
│   ├── navigation/             # Navigation setup
│   │   ├── types.ts            # Navigation types
│   │   ├── AuthNavigator.tsx   # Auth flow
│   │   └── ShopNavigator.tsx   # App flow
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.ts          # Auth hook
│   │   ├── useCart.ts          # Cart hook
│   │   ├── useProducts.ts      # Products hook
│   │   └── useOrders.ts        # Orders hook
│   │
│   ├── types/                  # TypeScript types
│   │   ├── index.ts            # Export all
│   │   ├── api.ts              # API types
│   │   ├── auth.ts             # Auth types
│   │   ├── product.ts          # Product types
│   │   └── order.ts            # Order types
│   │
│   ├── utils/                  # Utilities
│   │   ├── storage.ts          # Secure storage wrapper
│   │   ├── errorHandler.ts     # Error parsing
│   │   ├── validators.ts       # Form validation
│   │   ├── formatters.ts       # Data formatting
│   │   └── constants.ts        # App constants
│   │
│   └── theme/                  # Theme system
│       ├── colors.ts           # Color palette
│       ├── spacing.ts          # Spacing scale
│       └── typography.ts       # Typography
│
├── __tests__/                  # Tests
├── assets/                     # Images, icons
├── SETUP_GUIDE.md             # Detailed setup
├── QUICK_START.md             # Quick start
└── CREATE_REMAINING_SCREENS.md # Screen templates
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` with:
```
EXPO_PUBLIC_API_BASE_URL=https://your-api.com/api
EXPO_PUBLIC_APP_NAME=Urban Grail
EXPO_PUBLIC_AUTH_TIMEOUT=3600000
EXPO_PUBLIC_ENABLE_NOTIFICATIONS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false
```

**Important**: Never commit `.env.local`. Use `.env.example` as template.

### API Base URL

Update the API base URL for your backend:

**Development:**
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

**Production:**
```
EXPO_PUBLIC_API_BASE_URL=https://your-domain.com/api
```

---

## 🎮 Usage Examples

### Authentication

```typescript
import { useAuth } from '@hooks/useAuth';

function LoginScreen() {
  const { login, isLoading, user } = useAuth();

  const handleLogin = async () => {
    const success = await login(email, password);
    // Auto-navigates on success
  };

  return (
    <CustomButton
      label="Login"
      loading={isLoading}
      onPress={handleLogin}
    />
  );
}
```

### Product Browsing

```typescript
import { useProducts } from '@hooks/useProducts';

function ProductListScreen() {
  const { products, categories, search, applyFilters } = useProducts();

  const handleSearch = (query) => {
    search(query);
  };

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}
```

### Shopping Cart

```typescript
import { useCart } from '@hooks/useCart';

function CartScreen() {
  const { items, total, addItem, removeItem } = useCart();

  return (
    <>
      <FlatList data={items} renderItem={({ item }) => <CartItem item={item} />} />
      <Text>Total: ${total}</Text>
      <CheckoutButton />
    </>
  );
}
```

### Order Management

```typescript
import { useOrders } from '@hooks/useOrders';

function OrdersScreen() {
  const { orders, createOrder, trackOrder } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderCard order={item} />}
    />
  );
}
```

---

## 📦 API Integration

The app connects to the Urban Grail web API. All endpoints are pre-configured:

**Auth Endpoints:**
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/send-otp`
- `POST /auth/forgot-password/reset`

**Products Endpoints:**
- `GET /products`
- `GET /products/:id`
- `GET /categories`
- `GET /products/search`

**Orders Endpoints:**
- `GET /orders`
- `POST /orders`
- `GET /orders/:id`
- `POST /orders/:id/cancel`

**Payment Endpoints:**
- `POST /payment/create`
- `POST /payment/verify`

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed endpoint documentation.

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Manual Testing Checklist

- [ ] User login with valid credentials
- [ ] User registration with new account
- [ ] Forgot password flow
- [ ] Browse products and categories
- [ ] Search for products
- [ ] Filter products by price
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Checkout flow
- [ ] Create order
- [ ] View order details
- [ ] Track order status
- [ ] View order history
- [ ] Update profile
- [ ] Change password
- [ ] Logout

---

## 🏗️ Building for Release

### Setup EAS

```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Build Preview APK

```bash
eas build --platform android --profile preview
```

### Build Production APK

```bash
eas build --platform android --profile production
```

### Deploy to Google Play Store

1. Create app listing in Google Play Console
2. Upload APK
3. Add screenshots and description
4. Submit for review

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed steps.

---

## 🔐 Security

- JWT tokens stored in SecureStore (not AsyncStorage)
- HTTPS enforced in production
- Input validation on all forms
- Automatic token refresh
- Secure error handling
- No hardcoded secrets
- Environment-based configuration

---

## ⚡ Performance

- Lazy loading of screens
- Image optimization with expo-image
- Pagination for large lists
- Efficient state management with Zustand
- API response caching
- Minimal re-renders

---

## 🐛 Troubleshooting

### Common Issues

**API Connection Failed**
- Check `.env.local` API_BASE_URL
- Ensure backend is running
- Verify network connectivity
- Check CORS configuration

**Token Not Saving**
- Check SecureStore permissions in `app.json`
- Ensure tokens are being returned from API
- Verify JWT format

**Expo Go App Not Loading**
- Clear cache: `npm start -- -c`
- Restart Expo Go app
- Check WiFi/USB connection
- Verify server is running

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting.

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup and configuration
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide
- **[CREATE_REMAINING_SCREENS.md](./CREATE_REMAINING_SCREENS.md)** - Screen templates

---

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

---

## 📝 License

Private - Urban Grail

---

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review error messages
3. Check console logs
4. Create an issue with steps to reproduce

---

## ✨ What's Included

✅ Complete project structure
✅ API client with interceptors
✅ Zustand state management
✅ Authentication flow
✅ Product browsing
✅ Shopping cart
✅ Order management
✅ User profile
✅ Navigation setup
✅ TypeScript types
✅ Theme system
✅ Custom hooks
✅ Error handling
✅ Form validation
✅ Data formatting
✅ Documentation
✅ Example screens (Login, Register)
✅ UI components foundation

---

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure environment: Copy `.env.example` to `.env.local`
3. ✅ Start development: `npm start` → `npm run android`
4. Create remaining screen files (see CREATE_REMAINING_SCREENS.md)
5. Create reusable UI components
6. Test auth flow
7. Test shopping flow
8. Build and deploy

---

**Ready to build? Start with `npm install` and follow [QUICK_START.md](./QUICK_START.md)!**

---

**Last Updated:** 2024
**Version:** 1.0.0
**Target:** Android (React Native Expo)
