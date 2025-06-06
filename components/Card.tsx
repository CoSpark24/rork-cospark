import React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export default function Card({
  children,
  style,
  elevation = 'small',
  borderRadius = 'medium',
}: CardProps) {
  const getElevationStyle = () => {
    switch (elevation) {
      case 'none':
        return {};
      case 'medium':
        return styles.elevationMedium;
      case 'large':
        return styles.elevationLarge;
      default:
        return styles.elevationSmall;
    }
  };

  const getBorderRadiusStyle = () => {
    switch (borderRadius) {
      case 'none':
        return {};
      case 'small':
        return styles.borderRadiusSmall;
      case 'large':
        return styles.borderRadiusLarge;
      case 'full':
        return styles.borderRadiusFull;
      default:
        return styles.borderRadiusMedium;
    }
  };

  return (
    <View
      style={[
        styles.card,
        getElevationStyle(),
        getBorderRadiusStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    overflow: 'hidden',
  },
  elevationSmall: {
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  elevationMedium: {
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  elevationLarge: {
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  borderRadiusSmall: {
    borderRadius: Theme.borderRadius.sm,
  },
  borderRadiusMedium: {
    borderRadius: Theme.borderRadius.md,
  },
  borderRadiusLarge: {
    borderRadius: Theme.borderRadius.lg,
  },
  borderRadiusFull: {
    borderRadius: Theme.borderRadius.full,
  },
});