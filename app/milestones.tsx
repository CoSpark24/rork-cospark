import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Plus, CheckCircle, Circle, Clock, Lightbulb } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useMilestonesStore } from "@/store/milestones-store";
import { Milestone } from "@/types";

export default function MilestonesScreen() {
  const { 
    milestones, 
    isLoading, 
    error, 
    fetchMilestones, 
    completeMilestone,
    generateAITips 
  } = useMilestonesStore();

  useEffect(() => {
    fetchMilestones();
  }, []);

  const getCategoryColor = (category: Milestone['category']) => {
    switch (category) {
      case 'idea': return Colors.primary;
      case 'mvp': return Colors.secondary;
      case 'traction': return Colors.accent;
      case 'fundraising': return Colors.success;
      case 'scaling': return Colors.warning;
      default: return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={24} color={Colors.success} />;
      case 'in_progress':
        return <Clock size={24} color={Colors.warning} />;
      default:
        return <Circle size={24} color={Colors.textSecondary} />;
    }
  };

  const renderMilestone = ({ item }: { item: Milestone }) => (
    <Card style={styles.milestoneCard}>
      <View style={styles.milestoneHeader}>
        <View style={styles.statusContainer}>
          {getStatusIcon(item.status)}
          <View style={styles.milestoneInfo}>
            <Text style={styles.milestoneTitle}>{item.title}</Text>
            <View style={styles.categoryBadge}>
              <View 
                style={[
                  styles.categoryDot, 
                  { backgroundColor: getCategoryColor(item.category) }
                ]} 
              />
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.milestoneDescription}>
        {item.description}
      </Text>

      {item.aiTips && item.aiTips.length > 0 && (
        <View style={styles.tipsContainer}>
          <View style={styles.tipsHeader}>
            <Lightbulb size={16} color={Colors.warning} />
            <Text style={styles.tipsTitle}>AI Tips</Text>
          </View>
          {item.aiTips.map((tip, index) => (
            <Text key={index} style={styles.tip}>
              • {tip}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.milestoneActions}>
        {item.status !== 'completed' && (
          <Button
            title="Mark Complete"
            onPress={() => completeMilestone(item.id)}
            variant="outline"
            style={styles.actionButton}
          />
        )}
        <Button
          title="Get AI Tips"
          onPress={() => generateAITips(item.id)}
          leftIcon={<Lightbulb size={16} color={Colors.primary} />}
          variant="outline"
          style={styles.actionButton}
        />
      </View>
    </Card>
  );

  const groupedMilestones = milestones.reduce((acc, milestone) => {
    if (!acc[milestone.category]) {
      acc[milestone.category] = [];
    }
    acc[milestone.category].push(milestone);
    return acc;
  }, {} as Record<string, Milestone[]>);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading milestones...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={fetchMilestones}
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Startup Journey</Text>
          <Text style={styles.subtitle}>
            Track your progress and get AI-powered guidance
          </Text>
        </View>
        <Button
          title="Add"
          onPress={() => {/* TODO: Add milestone creation */}}
          leftIcon={<Plus size={18} color={Colors.card} />}
          gradient
        />
      </View>

      <FlatList
        data={milestones}
        renderItem={renderMilestone}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  milestoneCard: {
    marginBottom: Theme.spacing.lg,
  },
  milestoneHeader: {
    marginBottom: Theme.spacing.md,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  milestoneInfo: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  milestoneTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Theme.spacing.xs,
  },
  categoryText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  milestoneDescription: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  tipsContainer: {
    backgroundColor: Colors.warning + "10",
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  tipsTitle: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginLeft: Theme.spacing.xs,
  },
  tip: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  milestoneActions: {
    flexDirection: "row",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
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