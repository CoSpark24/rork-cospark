import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: "none" | "small" | "medium" | "large";
};

export default function Card({
  children,
  style,
  elevation = "small",
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        elevation !== "none" && Theme.shadows[elevation],
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
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    overflow: "hidden",
  },
});