// Define a type for the Colors object to ensure TypeScript recognizes all properties
type ColorsType = {
  // Primary Brand Colors
  primary: string;
  primaryLight: string;

  // Secondary Brand Colors
  secondary: string;
  secondaryLight: string;

  // Accent Colors
  accent: string;
  accentLight: string;

  // Text Colors
  text: string;
  textSecondary: string;
  white: string;

  // Status Colors
  success: string;
  warning: string;
  error: string;
  disabled: string;

  // UI Colors
  background: string;
  card: string;
  border: string;

  // Grayscale Shades
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Gradients
  gradientStart: string;
  gradientEnd: string;

  // Optional (Dark Mode or Opacity)
  darkBackground: string;
  overlay: string;
};

const Colors: ColorsType = {
  // Primary Brand Colors
  primary: '#4F46E5',
  primaryLight: '#818CF8',

  // Secondary Brand Colors
  secondary: '#10B981',
  secondaryLight: '#34D399',

  // Accent Colors
  accent: '#F59E0B',
  accentLight: '#FBBF24',

  // Text Colors
  text: '#1F2937',
  textSecondary: '#6B7280',
  white: '#FFFFFF',

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  disabled: '#D1D5DB',

  // UI Colors
  background: '#F9FAFB',
  card: '#FFFFFF',
  border: '#E5E7EB',

  // Grayscale Shades
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Gradients
  gradientStart: '#3730A3',
  gradientEnd: '#6366F1',

  // Optional (Dark Mode or Opacity)
  darkBackground: '#1A2138',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export default Colors;