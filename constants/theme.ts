export default {
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 4,
    },
  },
  colors: {
    primary: '#4361EE',
    primaryLight: '#4895EF',
    accent: '#F4A261',
    background: '#FFFFFF',
    white: '#FFFFFF',
    black: '#000000',
    textPrimary: '#1B1B1B',
    textSecondary: '#666666',
    error: '#DC2626',
    success: '#059669',
    border: '#E5E7EB',
    card: '#F9FAFB',
    disabled: '#E5E7EB',
    gray500: '#6B7280',
    gradientStart: '#4361EE',
    gradientEnd: '#4895EF',
  },
  animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeInOut: 'ease-in-out',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
    },
  },
};