import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useUIStore } from '@store/useUIStore';
import { colors } from '@theme/colors';

export default function GlobalLoading() {
  const { isGlobalLoading, globalLoadingMessage } = useUIStore();

  if (!isGlobalLoading) return null;

  return (
    <Modal transparent visible={isGlobalLoading} animationType="fade">
      <View style={styles.container}>
        <View style={styles.backdrop} />
        <View style={styles.content}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.spinner}
          />
          {globalLoadingMessage && (
            <Text variant="labelLarge" style={styles.message}>
              {globalLoadingMessage}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    color: colors.text.inverse,
    textAlign: 'center',
  },
});
