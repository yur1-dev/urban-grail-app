import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useAuth } from '@hooks/useAuth';
import CustomButton from '@components/common/Button';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

type LoginScreenProps = any; // Proper typing with navigation params

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      // Navigation handled by auth store change
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>
            Urban Grail
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Welcome Back
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

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
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
            label={isLoading ? 'Logging in...' : 'Login'}
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            onPress={handleLogin}
            disabled={!email || !password || isLoading}
            style={styles.loginButton}
          />

          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.footerText}>
              Don't have an account?{' '}
              <Text
                variant="bodySmall"
                style={styles.link}
                onPress={() => navigation.navigate('Register')}
              >
                Register
              </Text>
            </Text>
            <Text
              variant="bodySmall"
              style={styles.link}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              Forgot Password?
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing['2xl'],
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
  subtitle: {
    color: colors.text.secondary,
  },
  form: {
    gap: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  footerText: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
  },
});
