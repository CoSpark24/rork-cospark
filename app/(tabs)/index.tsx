import React from "react";
import { View, Text, StyleSheet, Platform, Image } from "react-native";
import LottieView from "lottie-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import { TrendingUp, Flame } from "lucide-react-native";

type Props = {
  score: number;
  weeklyActivity: number;
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

// Main Home Screen Component
const HomeScreen: React.FC = () => {
  // Mock data for the GrowthScoreCard
  // Assuming weeklyActivity was previously an array, now converted to a single number
  const mockData = {
    score: 750,
    weeklyActivity: 42, // Changed from array to number (e.g., total activity count)
    streakDays: 5,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to CoSpark</Text>
        <Text style={styles.headerSubtitle}>Build your startup journey</Text>
      </View>

      {/* Platform-specific animation or image */}
      {Platform.OS !== "web" ? (
        <LottieView
          source={require("../../assets/lottie/welcome-animation.json")} // Placeholder path, replace with actual local asset
          autoPlay
          loop
          style={styles.animation}
        />
      ) : (
        <Image
          source={{
            uri: "https://cdn3d.iconscout.com/3d/premium/thumb/startup-4108329-3407649.png",
          }}
          style={styles.animation}
          resizeMode="contain"
        />
      )}

      <GrowthScoreCard
        score={mockData.score}
        weeklyActivity={mockData.weeklyActivity} // Ensure this is a number
        streakDays={mockData.streakDays}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Theme.spacing.xl,
  },
  header: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  headerTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
  },
  animation: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: Theme.spacing.lg,
  },
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

export default HomeScreen;