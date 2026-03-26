import React from 'react';
import { Button, ButtonProps as PaperButtonProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

interface CustomButtonProps extends Omit<PaperButtonProps, 'children'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
}

export default function CustomButton({
  label,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  style,
  ...props
}: CustomButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
        };
      case 'outline':
        return {
          borderWidth: 1,
          borderColor: colors.primary,
          backgroundColor: colors.background,
        };
      default:
        return {
          backgroundColor: colors.primary,
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
        };
      case 'large':
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
        };
      default:
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
        };
    }
  };

  return (
    <Button
      {...props}
      mode={variant === 'outline' ? 'outlined' : 'contained'}
      loading={loading}
      disabled={loading || props.disabled}
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        style,
      ]}
      labelStyle={[
        styles.label,
        variant === 'outline' && { color: colors.primary },
      ]}
    >
      {label}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
});
