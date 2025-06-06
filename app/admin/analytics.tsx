import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Stack } from "expo-router";
import { 
  TrendingUp, 
  Users, 
  DollarSign,
  MessageSquare,
  Calendar,
  Eye,
  Heart,
  Share,
  Download
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import StatsCard from "@/components/StatsCard";

const { width } = Dimensions.get("window");

interface AnalyticsData {
  userGrowth: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growthRate: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growthRate: number;
  };
  engagement: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
  };
  topContent: Array<{
    id: string;
    title: string;
    author: string;
    views: number;
    likes: number;
    type: string;
  }>;
}

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [analyticsData] = useState<AnalyticsData>({
    userGrowth: {
      total: 12450,
      thisMonth: 1250,
      lastMonth: 980,
      growthRate: 27.5,
    },
    revenue: {
      total: 2450000,
      thisMonth: 185000,
      lastMonth: 142000,
      growthRate: 30.3,
    },
    engagement: {
      totalPosts: 8920,
      totalLikes: 45600,
      totalComments: 12300,
      totalShares: 5670,
    },
    topContent: [
      {
        id: "1",
        title: "How to Build a Successful Startup",
        author: "Rahul Sharma",
        views: 12500,
        likes: 890,
        type: "Post",
      },
      {
        id: "2",
        title: "Fundraising Tips for Early Stage Startups",
        author: "Priya Patel",
        views: 9800,
        likes: 650,
        type: "Article",
      },
      {
        id: "3",
        title: "AI in Healthcare: The Future is Now",
        author: "Dr. Amit Kumar",
        views: 8200,
        likes: 520,
        type: "Post",
      },
    ],
  });

  const timeRanges = [
    { key: "7d", label: "7 Days" },
    { key: "30d", label: "30 Days" },
    { key: "90d", label: "90 Days" },
    { key: "1y", label: "1 Year" },
  ];

  const getGrowthColor = (rate: number) => {
    return rate >= 0 ? Colors.success : Colors.error;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return `₹${formatNumber(amount)}`;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Analytics Dashboard",
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.text,
        }}
      />

      <ScrollView style={styles.content}>
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          <Text style={styles.sectionTitle}>Time Range</Text>
          <View style={styles.timeRangeButtons}>
            {timeRanges.map((range) => (
              <TouchableOpacity
                key={range.key}
                style={[
                  styles.timeRangeButton,
                  timeRange === range.key && styles.timeRangeButtonActive,
                ]}
                onPress={() => setTimeRange(range.key as any)}
              >
                <Text
                  style={[
                    styles.timeRangeButtonText,
                    timeRange === range.key && styles.timeRangeButtonTextActive,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.statsRow}>
            <StatsCard
              title="Total Users"
              value={formatNumber(analyticsData.userGrowth.total)}
              icon={<Users size={24} color={Colors.primary} />}
              color={Colors.primary}
              subtitle={`+${analyticsData.userGrowth.growthRate}% this month`}
            />
            <StatsCard
              title="Monthly Revenue"
              value={formatCurrency(analyticsData.revenue.thisMonth)}
              icon={<DollarSign size={24} color={Colors.success} />}
              color={Colors.success}
              subtitle={`+${analyticsData.revenue.growthRate}% growth`}
            />
          </View>

          <View style={styles.statsRow}>
            <StatsCard
              title="Total Posts"
              value={formatNumber(analyticsData.engagement.totalPosts)}
              icon={<MessageSquare size={24} color={Colors.secondary} />}
              color={Colors.secondary}
            />
            <StatsCard
              title="Engagement"
              value={formatNumber(analyticsData.engagement.totalLikes)}
              icon={<Heart size={24} color={Colors.accent} />}
              color={Colors.accent}
              subtitle="Total likes"
            />
          </View>
        </View>

        {/* Growth Chart Placeholder */}
        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>User Growth Trend</Text>
          <View style={styles.chartPlaceholder}>
            <TrendingUp size={48} color={Colors.primary} />
            <Text style={styles.chartPlaceholderText}>
              Chart visualization would go here
            </Text>
            <Text style={styles.chartPlaceholderSubtext}>
              Integration with charting library needed
            </Text>
          </View>
        </Card>

        {/* Revenue Breakdown */}
        <Card style={styles.revenueCard}>
          <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
          <View style={styles.revenueMetrics}>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueLabel}>Pro Subscriptions</Text>
              <Text style={styles.revenueValue}>
                {formatCurrency(analyticsData.revenue.thisMonth * 0.85)}
              </Text>
              <Text style={styles.revenuePercentage}>85%</Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueLabel}>Event Tickets</Text>
              <Text style={styles.revenueValue}>
                {formatCurrency(analyticsData.revenue.thisMonth * 0.10)}
              </Text>
              <Text style={styles.revenuePercentage}>10%</Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueLabel}>Other</Text>
              <Text style={styles.revenueValue}>
                {formatCurrency(analyticsData.revenue.thisMonth * 0.05)}
              </Text>
              <Text style={styles.revenuePercentage}>5%</Text>
            </View>
          </View>
        </Card>

        {/* Engagement Stats */}
        <Card style={styles.engagementCard}>
          <Text style={styles.sectionTitle}>Engagement Overview</Text>
          <View style={styles.engagementGrid}>
            <View style={styles.engagementItem}>
              <Eye size={20} color={Colors.primary} />
              <Text style={styles.engagementValue}>
                {formatNumber(analyticsData.engagement.totalPosts * 15)}
              </Text>
              <Text style={styles.engagementLabel}>Total Views</Text>
            </View>
            <View style={styles.engagementItem}>
              <Heart size={20} color={Colors.error} />
              <Text style={styles.engagementValue}>
                {formatNumber(analyticsData.engagement.totalLikes)}
              </Text>
              <Text style={styles.engagementLabel}>Likes</Text>
            </View>
            <View style={styles.engagementItem}>
              <MessageSquare size={20} color={Colors.secondary} />
              <Text style={styles.engagementValue}>
                {formatNumber(analyticsData.engagement.totalComments)}
              </Text>
              <Text style={styles.engagementLabel}>Comments</Text>
            </View>
            <View style={styles.engagementItem}>
              <Share size={20} color={Colors.accent} />
              <Text style={styles.engagementValue}>
                {formatNumber(analyticsData.engagement.totalShares)}
              </Text>
              <Text style={styles.engagementLabel}>Shares</Text>
            </View>
          </View>
        </Card>

        {/* Top Content */}
        <Card style={styles.topContentCard}>
          <View style={styles.topContentHeader}>
            <Text style={styles.sectionTitle}>Top Performing Content</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {analyticsData.topContent.map((content, index) => (
            <View key={content.id} style={styles.contentItem}>
              <View style={styles.contentRank}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              <View style={styles.contentInfo}>
                <Text style={styles.contentTitle} numberOfLines={2}>
                  {content.title}
                </Text>
                <Text style={styles.contentAuthor}>by {content.author}</Text>
                <View style={styles.contentStats}>
                  <View style={styles.contentStat}>
                    <Eye size={12} color={Colors.textSecondary} />
                    <Text style={styles.contentStatText}>
                      {formatNumber(content.views)}
                    </Text>
                  </View>
                  <View style={styles.contentStat}>
                    <Heart size={12} color={Colors.textSecondary} />
                    <Text style={styles.contentStatText}>
                      {formatNumber(content.likes)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.contentType}>
                <Text style={styles.contentTypeText}>{content.type}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Export Options */}
        <Card style={styles.exportCard}>
          <Text style={styles.sectionTitle}>Export Data</Text>
          <Text style={styles.exportDescription}>
            Download analytics data for external analysis
          </Text>
          <View style={styles.exportButtons}>
            <TouchableOpacity style={styles.exportButton}>
              <Download size={16} color={Colors.primary} />
              <Text style={styles.exportButtonText}>Export CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Download size={16} color={Colors.primary} />
              <Text style={styles.exportButtonText}>Export PDF</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  timeRangeContainer: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  timeRangeButtons: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
  },
  timeRangeButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeRangeButtonText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    fontWeight: Theme.typography.weights.medium as any,
  },
  timeRangeButtonTextActive: {
    color: Colors.card,
  },
  metricsContainer: {
    marginBottom: Theme.spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: Theme.spacing.md,
  },
  chartCard: {
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.lg,
  },
  chartPlaceholder: {
    alignItems: "center",
    paddingVertical: Theme.spacing.xl,
  },
  chartPlaceholderText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
  },
  chartPlaceholderSubtext: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  revenueCard: {
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.lg,
  },
  revenueMetrics: {
    gap: Theme.spacing.md,
  },
  revenueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  revenueLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    flex: 1,
  },
  revenueValue: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginRight: Theme.spacing.md,
  },
  revenuePercentage: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    minWidth: 40,
    textAlign: "right",
  },
  engagementCard: {
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.lg,
  },
  engagementGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  engagementItem: {
    width: "48%",
    alignItems: "center",
    padding: Theme.spacing.md,
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
  },
  engagementValue: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginVertical: Theme.spacing.xs,
  },
  engagementLabel: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  topContentCard: {
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.lg,
  },
  topContentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  viewAllText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  contentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  contentRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.sm,
  },
  rankNumber: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.primary,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  contentAuthor: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  contentStats: {
    flexDirection: "row",
    gap: Theme.spacing.md,
  },
  contentStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  contentStatText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  contentType: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    backgroundColor: Colors.secondary + "20",
    borderRadius: Theme.borderRadius.sm,
  },
  contentTypeText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.secondary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  exportCard: {
    marginBottom: Theme.spacing.xl,
    padding: Theme.spacing.lg,
  },
  exportDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  exportButtons: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
  },
  exportButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exportButtonText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
});