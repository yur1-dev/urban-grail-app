import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@theme/colors';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text variant="displayLarge" style={styles.title}>
        Urban Grail
      </Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      <Text variant="labelLarge" style={styles.subtitle}>
        Loading...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  subtitle: {
    color: colors.text.secondary,
  },
});
