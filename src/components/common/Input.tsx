import React, { useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import {
  TextInput as PaperTextInput,
  TextInputProps as PaperTextInputProps,
} from 'react-native-paper';
import { colors } from '../../theme/colors';

interface CustomInputProps extends Omit<PaperTextInputProps, 'mode'> {
  error?: boolean;
  errorMessage?: string;
  containerStyle?: ViewStyle;
  label?: string;
  secureTextEntry?: boolean;
}

const Input = React.forwardRef<PaperTextInput, CustomInputProps>(
  (
    {
      error = false,
      errorMessage,
      containerStyle,
      label,
      secureTextEntry = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(!secureTextEntry);

    return (
      <PaperTextInput
        ref={ref}
        mode="outlined"
        label={label}
        secureTextEntry={secureTextEntry && !showPassword}
        outlineColor={error ? colors.error : colors.border}
        activeOutlineColor={error ? colors.error : colors.primary}
        error={error}
        right={
          secureTextEntry ? (
            <PaperTextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          ) : undefined
        }
        style={[styles.input, containerStyle]}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
});

export default Input;
