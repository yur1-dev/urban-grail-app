import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1a73e8',           // Google Blue - Primary brand color
    onPrimary: '#ffffff',
    primaryContainer: '#d3e3fd',
    onPrimaryContainer: '#001d4d',
    
    secondary: '#6f5b40',          // Warm brown - Accent
    onSecondary: '#ffffff',
    secondaryContainer: '#f8dcc8',
    onSecondaryContainer: '#281a0d',
    
    tertiary: '#5f6368',           // Dark gray - Neutral
    onTertiary: '#ffffff',
    tertiaryContainer: '#e8eaed',
    onTertiaryContainer: '#1a1a1a',
    
    error: '#d32f2f',              // Google Red
    onError: '#ffffff',
    errorContainer: '#f9dedc',
    onErrorContainer: '#410e0b',
    
    background: '#fafbfc',
    onBackground: '#1a1a1a',
    
    surface: '#ffffff',
    onSurface: '#1a1a1a',
    surfaceVariant: '#e8eaed',
    onSurfaceVariant: '#5f6368',
    
    outline: '#b3b3b3',
    outlineVariant: '#d3d3d3',
    
    scrim: '#000000',
    
    // Custom colors
    success: '#2e7d32',
    warning: '#f57c00',
    info: '#1976d2',
  },
};

export const colors = {
  primary: '#1a73e8',
  secondary: '#6f5b40',
  tertiary: '#5f6368',
  error: '#d32f2f',
  success: '#2e7d32',
  warning: '#f57c00',
  background: '#fafbfc',
  surface: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#5f6368',
  border: '#d3d3d3',
  disabled: '#e8eaed',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const typography = {
  headline: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
};
