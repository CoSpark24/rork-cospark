import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradient?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  gradient = false,
}: ButtonProps) {
  const getButtonStyles = () => {
    const buttonStyles: StyleProp<ViewStyle>[] = [styles.button];

    // Add size styles
    switch (size) {
      case 'small':
        buttonStyles.push(styles.buttonSmall);
        break;
      case 'large':
        buttonStyles.push(styles.buttonLarge);
        break;
      default:
        buttonStyles.push(styles.buttonMedium);
    }

    // Add variant styles (if not using gradient)
    if (!gradient) {
      switch (variant) {
        case 'secondary':
          buttonStyles.push(styles.buttonSecondary);
          break;
        case 'outline':
          buttonStyles.push(styles.buttonOutline);
          break;
        case 'text':
          buttonStyles.push(styles.buttonText);
          break;
        default:
          buttonStyles.push(styles.buttonPrimary);
      }
    }

    // Add full width style
    if (fullWidth) {
      buttonStyles.push(styles.buttonFullWidth);
    }

    // Add disabled style
    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
    }

    return buttonStyles;
  };

  const getTextStyles = () => {
    const textStyles: StyleProp<TextStyle>[] = [styles.buttonLabel];

    // Add size styles
    switch (size) {
      case 'small':
        textStyles.push(styles.buttonLabelSmall);
        break;
      case 'large':
        textStyles.push(styles.buttonLabelLarge);
        break;
      default:
        textStyles.push(styles.buttonLabelMedium);
    }

    // Add variant styles
    switch (variant) {
      case 'secondary':
        textStyles.push(styles.buttonLabelSecondary);
        break;
      case 'outline':
        textStyles.push(styles.buttonLabelOutline);
        break;
      case 'text':
        textStyles.push(styles.buttonLabelText);
        break;
      default:
        textStyles.push(styles.buttonLabelPrimary);
    }

    // Add disabled style
    if (disabled) {
      textStyles.push(styles.buttonLabelDisabled);
    }

    return textStyles;
  };

  const renderButtonContent = () => {
    return (
      <>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={
              variant === 'outline' || variant === 'text'
                ? Colors.primary
                : Colors.white
            }
          />
        ) : (
          <>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Text style={[getTextStyles(), textStyle]}>{title}</Text>
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </>
        )}
      </>
    );
  };

  if (gradient && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyles(), style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientContainer}
        >
          {renderButtonContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), style]}
      activeOpacity={0.8}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
}

const View = ({ style, children }: { style?: StyleProp<ViewStyle>; children: React.ReactNode }) => (
  <React.Fragment>{children}</React.Fragment>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
  },
  buttonSmall: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
  },
  buttonMedium: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  buttonLarge: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonText: {
    backgroundColor: 'transparent',
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
    borderColor: Colors.disabled,
  },
  buttonLabel: {
    fontWeight: Theme.typography.weights.medium as any,
    textAlign: 'center',
  },
  buttonLabelSmall: {
    fontSize: Theme.typography.sizes.sm,
  },
  buttonLabelMedium: {
    fontSize: Theme.typography.sizes.md,
  },
  buttonLabelLarge: {
    fontSize: Theme.typography.sizes.lg,
  },
  buttonLabelPrimary: {
    color: Colors.white,
  },
  buttonLabelSecondary: {
    color: Colors.white,
  },
  buttonLabelOutline: {
    color: Colors.primary,
  },
  buttonLabelText: {
    color: Colors.primary,
  },
  buttonLabelDisabled: {
    color: Colors.gray500,
  },
  leftIcon: {
    marginRight: Theme.spacing.xs,
  },
  rightIcon: {
    marginLeft: Theme.spacing.xs,
  },
  gradientContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
    width: '100%',
    height: '100%',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
});