import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: boolean;
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  gradient = false,
}: ButtonProps) {
  const buttonStyles: ViewStyle[] = [
    styles.button,
    styles[`${size}Button`],
    styles[`${variant}Button`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabledButton,
    style || {},
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${size}Text`],
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle || {},
  ];

  const renderButtonContent = () => (
    <>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? Colors.card : Colors.primary}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </>
  );

  if (gradient && variant === "primary" && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.buttonWrapper, fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[buttonStyles, styles.gradientButton]}
        >
          {renderButtonContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: Theme.borderRadius.md,
    overflow: "hidden",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  gradientButton: {
    borderWidth: 0,
  },
  fullWidth: {
    width: "100%",
  },
  smallButton: {
    paddingVertical: Theme.spacing.xs,
  },
  mediumButton: {
    paddingVertical: Theme.spacing.sm,
  },
  largeButton: {
    paddingVertical: Theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
    borderWidth: 0,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  textButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  disabledButton: {
    backgroundColor: Colors.disabled,
    borderColor: Colors.disabled,
    opacity: 0.7,
  },
  text: {
    fontWeight: Theme.typography.weights.medium as any,
    textAlign: "center",
  },
  smallText: {
    fontSize: Theme.typography.sizes.sm,
  },
  mediumText: {
    fontSize: Theme.typography.sizes.md,
  },
  largeText: {
    fontSize: Theme.typography.sizes.lg,
  },
  primaryText: {
    color: Colors.card,
  },
  secondaryText: {
    color: Colors.card,
  },
  outlineText: {
    color: Colors.primary,
  },
  textText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.textSecondary,
  },
  leftIcon: {
    marginRight: Theme.spacing.xs,
  },
  rightIcon: {
    marginLeft: Theme.spacing.xs,
  },
});