import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface ErrorMessageProps {
  message: string;
  style?: ViewStyle;
  onDismiss?: () => void;
}

const ErrorMessage = ({ message, style, onDismiss }: ErrorMessageProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>⚠️</Text>
      <View style={styles.content}>
        <Text style={styles.message}>{message}</Text>
      </View>
      {onDismiss && (
        <Text style={styles.close} onPress={onDismiss}>
          ✕
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffebee',
    borderLeftColor: colors.error,
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  message: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  close: {
    fontSize: 18,
    color: colors.error,
    marginLeft: 12,
    fontWeight: 'bold',
  },
});

export default ErrorMessage;
