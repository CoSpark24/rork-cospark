import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Lightbulb, Plus } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useBusinessPlanStore } from "@/store/business-plan-store";
import { BusinessPlanData } from "@/types";

export default function BusinessPlansScreen() {
  const router = useRouter();
  const { businessPlans, isLoading, error, fetchBusinessPlans } = useBusinessPlanStore();

  useEffect(() => {
    fetchBusinessPlans();
  }, []);

  const renderBusinessPlan = ({ item }: { item: BusinessPlanData }) => (
    <TouchableOpacity
      onPress={() => router.push(`/business-plan/${item.id}`)}
    >
      <Card style={styles.planCard}>
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{item.businessName}</Text>
          <Text style={styles.planDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.planIndustry}>{item.industry}</Text>
        <Text style={styles.planDescription} numberOfLines={2}>
          {item.executiveSummary}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading business plans...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={fetchBusinessPlans}
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Business Plans</Text>
          <Text style={styles.subtitle}>
            Create and manage your business plans
          </Text>
        </View>
        <Button
          title="Create"
          onPress={() => router.push("/business-plan/create")}
          leftIcon={<Plus size={18} color={Colors.card} />}
          gradient
        />
      </View>

      {businessPlans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Lightbulb size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Business Plans Yet</Text>
          <Text style={styles.emptyText}>
            Create your first business plan to define your strategy and attract investors
          </Text>
          <Button
            title="Create Business Plan"
            onPress={() => router.push("/business-plan/create")}
            gradient
            style={styles.button}
          />
        </View>
      ) : (
        <FlatList
          data={businessPlans}
          renderItem={renderBusinessPlan}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  listContent: {
    padding: Theme.spacing.xl,
  },
  planCard: {
    marginBottom: Theme.spacing.md,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.xs,
  },
  planName: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  planDate: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  planIndustry: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.primary,
    marginBottom: Theme.spacing.sm,
  },
  planDescription: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
  },
  emptyText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Theme.spacing.xl,
    maxWidth: "80%",
  },
  loadingText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
  },
  errorText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.error,
    marginBottom: Theme.spacing.md,
    textAlign: "center",
  },
  button: {
    minWidth: 200,
  },
});