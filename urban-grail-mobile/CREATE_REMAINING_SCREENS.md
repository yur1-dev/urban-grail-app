# Creating Remaining Screen Files

This document provides the template code for all remaining screen files you need to create.

## Files to Create

Copy and paste the templates below into the appropriate files:

### 1. `src/screens/auth/ForgotPasswordScreen.tsx`

```typescript
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useAuth } from '@hooks/useAuth';
import CustomButton from '@components/common/Button';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

export default function ForgotPasswordScreen({ navigation }: any) {
  const { sendOTP, isLoading } = useAuth();
  const [email, setEmail] = useState('');

  const handleSendOTP = async () => {
    const success = await sendOTP(email);
    if (success) {
      navigation.navigate('OTPVerification', { email, isPasswordReset: true });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Reset Password
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Enter your email to receive a reset code
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          editable={!isLoading}
          style={styles.input}
          mode="outlined"
          autoCapitalize="none"
        />

        <CustomButton
          label={isLoading ? 'Sending...' : 'Send Reset Code'}
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
          onPress={handleSendOTP}
          disabled={!email || isLoading}
          style={styles.button}
        />

        <CustomButton
          label="Back to Login"
          variant="outline"
          size="large"
          fullWidth
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing['2xl'],
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: spacing['3xl'],
    alignItems: 'center',
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  description: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    gap: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
  },
  button: {
    marginTop: spacing.md,
  },
});
```

### 2. `src/screens/auth/OTPVerificationScreen.tsx`

```typescript
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useAuth } from '@hooks/useAuth';
import CustomButton from '@components/common/Button';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

export default function OTPVerificationScreen({ route, navigation }: any) {
  const { email, isPasswordReset } = route.params;
  const { resetPassword, isLoading } = useAuth();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleVerifyAndReset = async () => {
    const success = await resetPassword(email, otp, newPassword);
    if (success) {
      navigation.navigate('Login');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Verify Email
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Enter the code sent to {email}
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Reset Code"
          value={otp}
          onChangeText={setOtp}
          placeholder="Enter 6-digit code"
          keyboardType="number-pad"
          editable={!isLoading}
          style={styles.input}
          mode="outlined"
          maxLength={6}
        />

        <TextInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
          secureTextEntry={!showPassword}
          editable={!isLoading}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm password"
          secureTextEntry={!showPassword}
          editable={!isLoading}
          style={styles.input}
          mode="outlined"
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <CustomButton
          label={isLoading ? 'Resetting...' : 'Reset Password'}
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
          onPress={handleVerifyAndReset}
          disabled={!otp || !newPassword || isLoading}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing['2xl'],
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: spacing['3xl'],
    alignItems: 'center',
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  description: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    gap: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
  },
  button: {
    marginTop: spacing.md,
  },
});
```

### 3. `src/screens/shop/HomeScreen.tsx`

```typescript
import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useProducts } from '@hooks/useProducts';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

export default function HomeScreen({ navigation }: any) {
  const { products, categories, fetchProducts, fetchCategories, selectCategory } = useProducts(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts(1, 10);
      fetchCategories();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Urban Grail
      </Text>

      {categories.length > 0 && (
        <View style={styles.categoriesSection}>
          <Text variant="labelLarge" style={styles.sectionTitle}>
            Categories
          </Text>
          <FlatList
            data={categories}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.categoryCard}
                onPress={() => selectCategory(item._id)}
              >
                <Text variant="labelMedium">{item.name}</Text>
              </Pressable>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {products.length > 0 && (
        <View style={styles.productsSection}>
          <Text variant="labelLarge" style={styles.sectionTitle}>
            Featured Products
          </Text>
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
              >
                <View style={styles.productImagePlaceholder} />
                <Text variant="labelMedium" numberOfLines={2}>
                  {item.name}
                </Text>
                <Text variant="labelSmall" style={styles.price}>
                  ${item.price}
                </Text>
              </Pressable>
            )}
            numColumns={2}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.lg,
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  categoriesSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  categoryCard: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  productsSection: {
    marginBottom: spacing.xl,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    flex: 1,
  },
  productImagePlaceholder: {
    backgroundColor: colors.border,
    height: 120,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  price: {
    color: colors.primary,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
});
```

### 4. `src/screens/shop/ProductListScreen.tsx`

```typescript
import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { useProducts } from '@hooks/useProducts';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

export default function ProductListScreen({ route, navigation }: any) {
  const categoryId = route.params?.categoryId;
  const { products, isLoading, fetchProducts } = useProducts(false);

  useEffect(() => {
    fetchProducts(1, 20);
  }, [categoryId]);

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Products
      </Text>

      {products.length === 0 && !isLoading && (
        <View style={styles.empty}>
          <Text variant="bodyLarge">No products found</Text>
        </View>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={styles.productImagePlaceholder} />
            <View style={styles.productInfo}>
              <Text variant="labelLarge" numberOfLines={2}>
                {item.name}
              </Text>
              <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <Text variant="labelMedium" style={styles.price}>
                ${item.price}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.lg,
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  productImagePlaceholder: {
    backgroundColor: colors.border,
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  description: {
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  price: {
    color: colors.primary,
    fontWeight: '600',
  },
});
```

### 5. Create More Screen Stubs

For the remaining screens, use this basic template:

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

export default function [ScreenName]Screen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Screen Name Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.lg,
  },
});
```

**Create these files using the basic template:**
- `src/screens/shop/ProductDetailScreen.tsx`
- `src/screens/search/SearchScreen.tsx`
- `src/screens/cart/CartScreen.tsx`
- `src/screens/cart/CheckoutScreen.tsx`
- `src/screens/orders/OrdersScreen.tsx`
- `src/screens/orders/OrderDetailScreen.tsx`
- `src/screens/account/ProfileScreen.tsx`
- `src/screens/account/SettingsScreen.tsx`

## How to Use This Guide

1. Copy each template above
2. Create the file with the exact path provided
3. Paste the template code
4. Fill in any `[ScreenName]` placeholders
5. Customize the UI as needed for your design

All templates use:
- Theme colors, spacing, typography from `src/theme/`
- Custom hooks from `src/hooks/`
- Zustand stores from `src/store/`
- Proper TypeScript types

## Quick Commands

Create all required directories:
```bash
mkdir -p src/screens/{auth,shop,search,cart,orders,account}
```

Then create the files with the templates above.

---

The app structure is fully prepared to handle these screens. Just create them with the templates and your app will be ready to test!
