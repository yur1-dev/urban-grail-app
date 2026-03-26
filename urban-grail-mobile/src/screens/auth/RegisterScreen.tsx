import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useAuth } from '@hooks/useAuth';
import CustomButton from '@components/common/Button';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

export default function RegisterScreen({ navigation }: any) {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    const success = await register(
      formData.email,
      formData.firstName,
      formData.lastName,
      formData.password,
      formData.confirmPassword
    );
    if (success) {
      // Navigation handled by auth store change
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Join Urban Grail today
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <TextInput
              label="First Name"
              value={formData.firstName}
              onChangeText={(value) => setFormData({ ...formData, firstName: value })}
              placeholder="First name"
              editable={!isLoading}
              style={[styles.input, styles.halfInput]}
              mode="outlined"
            />
            <TextInput
              label="Last Name"
              value={formData.lastName}
              onChangeText={(value) => setFormData({ ...formData, lastName: value })}
              placeholder="Last name"
              editable={!isLoading}
              style={[styles.input, styles.halfInput]}
              mode="outlined"
            />
          </View>

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => setFormData({ ...formData, email: value })}
            placeholder="Enter your email"
            keyboardType="email-address"
            editable={!isLoading}
            style={styles.input}
            mode="outlined"
            autoCapitalize="none"
          />

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(value) => setFormData({ ...formData, password: value })}
            placeholder="At least 6 characters"
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

          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => setFormData({ ...formData, confirmPassword: value })}
            placeholder="Confirm password"
            secureTextEntry={!showPassword}
            editable={!isLoading}
            style={styles.input}
            mode="outlined"
          />

          <CustomButton
            label={isLoading ? 'Creating Account...' : 'Register'}
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            onPress={handleRegister}
            disabled={!formData.email || !formData.password || isLoading}
            style={styles.registerButton}
          />

          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.footerText}>
              Already have an account?{' '}
              <Text
                variant="bodySmall"
                style={styles.link}
                onPress={() => navigation.navigate('Login')}
              >
                Login
              </Text>
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
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
  },
  halfInput: {
    flex: 1,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
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
