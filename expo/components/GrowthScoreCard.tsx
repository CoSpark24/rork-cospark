import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TrendingUp, Target, Zap } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "./Card";

type GrowthScoreCardProps = {
  score: number;
  weeklyActivity: number;
  streakDays: number;
};

export default function GrowthScoreCard({
  score,
  weeklyActivity,
  streakDays,
}: GrowthScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return Colors.success;
    if (score >= 70) return Colors.secondary;
    if (score >= 50) return Colors.warning;
    return Colors.error;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Average";
    return "Needs Work";
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Growth Score</Text>
        <TrendingUp size={20} color={getScoreColor(score)} />
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: getScoreColor(score) }]}>
          {score}
        </Text>
        <Text style={styles.scoreLabel}>{getScoreLabel(score)}</Text>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metric}>
          <View style={styles.metricIcon}>
            <Target size={16} color={Colors.primary} />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{weeklyActivity}%</Text>
            <Text style={styles.metricLabel}>Weekly Activity</Text>
          </View>
        </View>

        <View style={styles.metric}>
          <View style={styles.metricIcon}>
            <Zap size={16} color={Colors.accent} />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{streakDays}</Text>
            <Text style={styles.metricLabel}>Day Streak</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
  },
  score: {
    fontSize: Theme.typography.sizes.xxxl,
    fontWeight: Theme.typography.weights.bold as any,
    marginBottom: Theme.spacing.xs,
  },
  scoreLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.sm,
  },
  metricContent: {
    alignItems: "center",
  },
  metricValue: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  metricLabel: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
});