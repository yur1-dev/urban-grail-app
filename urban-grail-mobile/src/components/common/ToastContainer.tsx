import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useUIStore, Toast } from '@store/useUIStore';
import { colors } from '@theme/colors';

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  const getBackgroundColor = (type: Toast['type']) => {
    const colorMap = {
      success: colors.success,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
    };
    return colorMap[type];
  };

  return (
    <View style={styles.container}>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          visible={true}
          onDismiss={() => removeToast(toast.id)}
          duration={toast.duration || 3000}
          style={[
            styles.toast,
            {
              backgroundColor: getBackgroundColor(toast.type),
              bottom: index * 60,
            },
          ]}
        >
          {toast.message}
        </Snackbar>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  toast: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
});
