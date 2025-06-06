import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { 
  FileText, 
  Lightbulb, 
  CheckSquare, 
  Scale, 
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Zap
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";

export default function ToolkitScreen() {
  const router = useRouter();

  const tools = [
    {
      id: "pitch-deck",
      title: "AI Pitch Deck Generator",
      description: "Create professional investor presentations with AI assistance",
      icon: <FileText size={32} color={Colors.primary} />,
      route: "/pitch-deck/create",
      color: Colors.primary,
      isNew: false,
    },
    {
      id: "business-plan",
      title: "Business Plan Assistant",
      description: "Generate comprehensive business plans with market analysis",
      icon: <Lightbulb size={32} color={Colors.secondary} />,
      route: "/business-plan/create",
      color: Colors.secondary,
      isNew: true,
    },
    {
      id: "fundraising-checklist",
      title: "Fundraising Readiness",
      description: "Complete checklist to prepare for your funding round",
      icon: <CheckSquare size={32} color={Colors.accent} />,
      route: "/fundraising-checklist",
      color: Colors.accent,
      isNew: false,
    },
    {
      id: "legal-templates",
      title: "Legal Templates",
      description: "Essential legal documents and templates for startups",
      icon: <Scale size={32} color={Colors.success} />,
      route: "/legal-templates",
      color: Colors.success,
      isNew: false,
    },
    {
      id: "financial-modeling",
      title: "Financial Modeling",
      description: "Build financial projections and revenue models",
      icon: <TrendingUp size={32} color={Colors.warning} />,
      route: "/financial-modeling",
      color: Colors.warning,
      isNew: true,
    },
    {
      id: "market-research",
      title: "Market Research Tool",
      description: "Analyze your market size and competition",
      icon: <Target size={32} color={Colors.primary} />,
      route: "/market-research",
      color: Colors.primary,
      isNew: true,
    },
  ];

  const quickActions = [
    {
      title: "View All Pitch Decks",
      description: "Manage your existing presentations",
      icon: <FileText size={24} color={Colors.primary} />,
      route: "/pitch-decks",
    },
    {
      title: "Funding Calculator",
      description: "Calculate equity and valuation",
      icon: <DollarSign size={24} color={Colors.secondary} />,
      route: "/funding-calculator",
    },
    {
      title: "Team Builder",
      description: "Plan your team structure",
      icon: <Users size={24} color={Colors.accent} />,
      route: "/team-builder",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Startup Toolkit</Text>
        <Text style={styles.subtitle}>
          Everything you need to build and scale your startup
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Tools</Text>
        <View style={styles.toolsGrid}>
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              onPress={() => router.push(tool.route as any)}
            >
              <Card style={[styles.toolCardInner, { borderLeftColor: tool.color }]}>
                <View style={styles.toolHeader}>
                  <View style={styles.toolIcon}>
                    {tool.icon}
                  </View>
                  {tool.isNew && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickActionCard}
            onPress={() => router.push(action.route as any)}
          >
            <Card style={styles.quickActionInner}>
              <View style={styles.quickActionIcon}>
                {action.icon}
              </View>
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionDescription}>
                  {action.description}
                </Text>
              </View>
              <Zap size={20} color={Colors.textSecondary} />
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.promoCard}>
        <Text style={styles.promoTitle}>🚀 Pro Tip</Text>
        <Text style={styles.promoText}>
          Start with the Business Plan Assistant to define your strategy, then create a pitch deck to present to investors.
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
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  toolsGrid: {
    paddingHorizontal: Theme.spacing.lg,
  },
  toolCard: {
    marginBottom: Theme.spacing.md,
    marginHorizontal: Theme.spacing.sm,
  },
  toolCardInner: {
    borderLeftWidth: 4,
    position: "relative",
  },
  toolHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Theme.spacing.sm,
  },
  toolIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.small,
  },
  newBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  newBadgeText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.card,
  },
  toolTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  toolDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  quickActionCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.sm,
  },
  quickActionInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.md,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  quickActionDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  promoCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
    backgroundColor: Colors.primary + "10",
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  promoTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  promoText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});