import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "./Card";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
};

export default function StatsCard({
  title,
  value,
  icon,
  color = Colors.primary,
}: StatsCardProps) {
  return (
    <Card style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        {icon}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    padding: Theme.spacing.md,
    flex: 1,
    margin: Theme.spacing.xs,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  value: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  title: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});