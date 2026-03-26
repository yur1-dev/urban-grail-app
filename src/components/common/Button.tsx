import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button as PaperButton, ButtonProps as PaperButtonProps } from 'react-native-paper';
import { colors } from '../../theme/colors';

interface CustomButtonProps extends Omit<PaperButtonProps, 'mode'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const Button = ({
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  ...props
}: CustomButtonProps) => {
  const isDisabled = disabled || loading;

  const getButtonColor = (): string => {
    if (isDisabled) return colors.disabled;

    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'danger':
        return colors.error;
      case 'outline':
        return colors.border;
      default:
        return colors.primary;
    }
  };

  const getMode = (): 'text' | 'outlined' | 'contained' | 'elevated' => {
    return variant === 'outline' ? 'outlined' : 'contained';
  };

  return (
    <PaperButton
      mode={getMode()}
      disabled={isDisabled}
      loading={loading}
      buttonColor={getButtonColor()}
      textColor={variant === 'outline' ? getButtonColor() : colors.surface}
      style={[styles.button, fullWidth && styles.fullWidth, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
