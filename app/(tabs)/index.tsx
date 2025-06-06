import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import { TrendingUp, Flame } from "lucide-react-native";

type Props = {
  score: number;
  weeklyActivity: number; // Make sure this is a number, not number[]
  streakDays: number;
};

const GrowthScoreCard: React.FC<Props> = ({ score, weeklyActivity, streakDays }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Growth Score</Text>
      <View style={styles.metrics}>
        <View style={styles.metricItem}>
          <TrendingUp size={20} color={Colors.primary} />
          <Text style={styles.metricLabel}>Score</Text>
          <Text style={styles.metricValue}>{score}</Text>
        </View>
        <View style={styles.metricItem}>
          <Flame size={20} color={Colors.secondary} />
          <Text style={styles.metricLabel}>Weekly Activity</Text>
          <Text style={styles.metricValue}>{weeklyActivity}</Text>
        </View>
        <View style={styles.metricItem}>
          <Flame size={20} color={Colors.accent} />
          <Text style={styles.metricLabel}>Streak Days</Text>
          <Text style={styles.metricValue}>{streakDays}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  title: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  metrics: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  metricValue: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginTop: Theme.spacing.xs,
  },
});

export default GrowthScoreCard;
