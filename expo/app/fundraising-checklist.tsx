import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { CheckSquare, Square, Award, TrendingUp } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import { useFundraisingStore } from "@/store/fundraising-store";

export default function FundraisingChecklistScreen() {
  const { 
    checklist, 
    completedItems, 
    toggleItem, 
    getCompletionPercentage,
    fetchChecklist 
  } = useFundraisingStore();

  useEffect(() => {
    fetchChecklist();
  }, []);

  const completionPercentage = getCompletionPercentage();

  const renderChecklistItem = (item: any) => {
    const isCompleted = completedItems.includes(item.id);
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.checklistItem}
        onPress={() => toggleItem(item.id)}
      >
        <Card style={[
          styles.itemCard,
          isCompleted && styles.completedCard
        ]}>
          <View style={styles.itemHeader}>
            <View style={styles.itemLeft}>
              {isCompleted ? (
                <CheckSquare size={24} color={Colors.success} />
              ) : (
                <Square size={24} color={Colors.textSecondary} />
              )}
              <Text style={[
                styles.itemTitle,
                isCompleted && styles.completedText
              ]}>
                {item.title}
              </Text>
            </View>
            {item.priority === "high" && (
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityText}>HIGH</Text>
              </View>
            )}
          </View>
          <Text style={[
            styles.itemDescription,
            isCompleted && styles.completedText
          ]}>
            {item.description}
          </Text>
          {item.tips && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 Tips:</Text>
              {item.tips.map((tip: string, index: number) => (
                <Text key={index} style={styles.tipText}>
                  • {tip}
                </Text>
              ))}
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fundraising Readiness</Text>
        <Text style={styles.subtitle}>
          Complete this checklist to prepare for your funding round
        </Text>
      </View>

      <Card style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Award size={32} color={Colors.primary} />
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressPercentage}>
              {completionPercentage}% Complete
            </Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${completionPercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {completedItems.length} of {checklist.length} items completed
        </Text>
      </Card>

      {checklist.map((category) => (
        <View key={category.category} style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <TrendingUp size={24} color={Colors.primary} />
            <Text style={styles.categoryTitle}>{category.category}</Text>
          </View>
          {category.items.map(renderChecklistItem)}
        </View>
      ))}

      <Card style={styles.tipCard}>
        <Text style={styles.tipCardTitle}>🚀 Pro Tip</Text>
        <Text style={styles.tipCardText}>
          Focus on completing high-priority items first. These are essential for most investors and will significantly improve your chances of securing funding.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Theme.spacing.xl,
    paddingBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
  },
  progressCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  progressInfo: {
    marginLeft: Theme.spacing.md,
    flex: 1,
  },
  progressTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  progressPercentage: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: Theme.spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  categorySection: {
    marginBottom: Theme.spacing.lg,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  categoryTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginLeft: Theme.spacing.sm,
  },
  checklistItem: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.sm,
  },
  itemCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.border,
  },
  completedCard: {
    borderLeftColor: Colors.success,
    backgroundColor: Colors.success + "05",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Theme.spacing.sm,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  completedText: {
    opacity: 0.7,
  },
  priorityBadge: {
    backgroundColor: Colors.error,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  priorityText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.card,
  },
  itemDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  tipsContainer: {
    backgroundColor: Colors.background,
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  tipsTitle: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  tipText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  tipCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
    backgroundColor: Colors.primary + "10",
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  tipCardTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  tipCardText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});