/**
 * Kisan Seva Design System
 * Central source of truth for colors, spacing, typography, and shadows.
 * Import from here instead of hardcoding values in individual screens.
 */

export const colors = {
  // Primary — Farmer / Green theme
  primary: {
    darkest: '#1B5E20',
    dark: '#2E7D32',
    main: '#4CAF50',
    light: '#81C784',
    surface: '#E8F5E9',
    background: '#F1F8E9',
  },

  // Secondary — Buyer / Orange theme
  secondary: {
    dark: '#E65100',
    main: '#FF9800',
    light: '#FFB74D',
    surface: '#FFF3E0',
    background: '#FFF8F1',
  },

  // Semantic
  danger: '#d32f2f',
  info: '#1976D2',
  infoLight: '#90CAF9',

  // Text hierarchy
  text: {
    primary: '#222',
    dark: '#333',
    medium: '#555',
    secondary: '#666',
    tertiary: '#888',
    placeholder: '#999',
    muted: '#BDBDBD',
    disabled: '#9E9E9E',
    subtle: '#757575',
  },

  // Backgrounds
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    overlay: 'rgba(0,0,0,0.5)',
  },

  // Borders
  border: {
    light: '#DDD',
    focus: '#4CAF50',
  },

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 25,
  xxxl: 30,
  xxxxl: 40,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 22,
  xxxl: 24,
  title: 28,
  display: 32,
  hero: 64,
} as const;

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const borderRadius = {
  xs: 5,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 15,
  round: 20,
  pill: 25,
  full: 30,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
} as const;
