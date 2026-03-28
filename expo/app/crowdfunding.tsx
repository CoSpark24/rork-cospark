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
import { DollarSign, Plus, TrendingUp, Users, Clock } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useCrowdfundingStore } from "@/store/crowdfunding-store";
import { CrowdfundingCampaign } from "@/types";

export default function CrowdfundingScreen() {
  const router = useRouter();
  const { campaigns, isLoading, error, fetchCampaigns } = useCrowdfundingStore();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const renderCampaign = ({ item }: { item: CrowdfundingCampaign }) => {
    const progressPercentage = (item.raisedAmount / item.goalAmount) * 100;
    const daysLeft = Math.ceil((item.deadline - Date.now()) / (1000 * 60 * 60 * 24));

    return (
      <TouchableOpacity
        onPress={() => router.push(`/crowdfunding/${item.id}`)}
      >
        <Card style={styles.campaignCard}>
          <Text style={styles.campaignTitle}>{item.title}</Text>
          <Text style={styles.campaignDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(progressPercentage, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progressPercentage.toFixed(1)}% funded
            </Text>
          </View>

          <View style={styles.campaignStats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                ₹{(item.raisedAmount / 100000).toFixed(1)}L
              </Text>
              <Text style={styles.statLabel}>raised</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                ₹{(item.goalAmount / 100000).toFixed(1)}L
              </Text>
              <Text style={styles.statLabel}>goal</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{item.backerCount}</Text>
              <Text style={styles.statLabel}>backers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{daysLeft}</Text>
              <Text style={styles.statLabel}>days left</Text>
            </View>
          </View>

          <View style={styles.campaignFooter}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Button
              title="View Details"
              onPress={() => router.push(`/crowdfunding/${item.id}`)}
              variant="outline"
              style={styles.viewButton}
            />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading campaigns...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={fetchCampaigns}
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Crowdfunding</Text>
          <Text style={styles.subtitle}>
            Fund innovative startups and launch your own campaign
          </Text>
        </View>
        <Button
          title="Create"
          onPress={() => router.push("/crowdfunding/create")}
          leftIcon={<Plus size={18} color={Colors.card} />}
          gradient
        />
      </View>

      {campaigns.length === 0 ? (
        <View style={styles.emptyContainer}>
          <DollarSign size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Campaigns Yet</Text>
          <Text style={styles.emptyText}>
            Be the first to launch a crowdfunding campaign for your startup
          </Text>
          <Button
            title="Create Campaign"
            onPress={() => router.push("/crowdfunding/create")}
            gradient
            style={styles.button}
          />
        </View>
      ) : (
        <FlatList
          data={campaigns}
          renderItem={renderCampaign}
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
  campaignCard: {
    marginBottom: Theme.spacing.lg,
  },
  campaignTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  campaignDescription: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  progressContainer: {
    marginBottom: Theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: Theme.spacing.xs,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.success,
  },
  progressText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: "right",
  },
  campaignStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Theme.spacing.md,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  statLabel: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  campaignFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    backgroundColor: Colors.success + "20",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  statusText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.success,
    fontWeight: Theme.typography.weights.medium as any,
  },
  viewButton: {
    paddingHorizontal: Theme.spacing.lg,
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