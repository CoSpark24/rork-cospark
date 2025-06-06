import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { 
  Users, 
  MessageSquare, 
  DollarSign, 
  Bell, 
  Shield, 
  Settings,
  TrendingUp,
  AlertTriangle,
  Plus,
  Search,
  Filter
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import StatsCard from "@/components/StatsCard";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  reportedContent: number;
  pendingReviews: number;
}

interface RecentActivity {
  id: string;
  type: "user_signup" | "subscription" | "report" | "event";
  description: string;
  timestamp: number;
  severity?: "low" | "medium" | "high";
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 12450,
    activeUsers: 8920,
    totalRevenue: 2450000,
    monthlyRevenue: 185000,
    reportedContent: 23,
    pendingReviews: 12,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "report",
      description: "User reported inappropriate content in post #12345",
      timestamp: Date.now() - 30 * 60 * 1000,
      severity: "high",
    },
    {
      id: "2",
      type: "subscription",
      description: "New Pro subscription: Rahul Sharma",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      severity: "low",
    },
    {
      id: "3",
      type: "user_signup",
      description: "50 new user signups in the last hour",
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
      severity: "medium",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateCoupon = () => {
    Alert.prompt(
      "Create Coupon",
      "Enter coupon details",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: (code) => {
            if (code?.trim()) {
              Alert.alert("Success", `Coupon "${code}" created successfully!`);
            }
          },
        },
      ],
      "plain-text",
      "SAVE20"
    );
  };

  const handleSendNotification = () => {
    Alert.prompt(
      "Send Push Notification",
      "Enter notification message",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: (message) => {
            if (message?.trim()) {
              Alert.alert("Success", "Notification sent to all users!");
            }
          },
        },
      ],
      "plain-text",
      "New feature available!"
    );
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "high":
        return Colors.error;
      case "medium":
        return Colors.warning;
      default:
        return Colors.success;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "report":
        return <AlertTriangle size={16} color={Colors.error} />;
      case "subscription":
        return <DollarSign size={16} color={Colors.success} />;
      case "user_signup":
        return <Users size={16} color={Colors.primary} />;
      default:
        return <TrendingUp size={16} color={Colors.secondary} />;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Admin Dashboard",
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.text,
        }}
      />

      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users, content, reports..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<Users size={24} color={Colors.primary} />}
            color={Colors.primary}
          />
          <StatsCard
            title="Monthly Revenue"
            value={`₹${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
            icon={<DollarSign size={24} color={Colors.success} />}
            color={Colors.success}
          />
        </View>

        <View style={styles.statsContainer}>
          <StatsCard
            title="Reported Content"
            value={stats.reportedContent}
            icon={<AlertTriangle size={24} color={Colors.error} />}
            color={Colors.error}
          />
          <StatsCard
            title="Pending Reviews"
            value={stats.pendingReviews}
            icon={<Shield size={24} color={Colors.warning} />}
            color={Colors.warning}
          />
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push("/admin/users")}
            >
              <Users size={24} color={Colors.primary} />
              <Text style={styles.quickActionText}>Manage Users</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push("/admin/content")}
            >
              <MessageSquare size={24} color={Colors.secondary} />
              <Text style={styles.quickActionText}>Review Content</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleCreateCoupon}
            >
              <DollarSign size={24} color={Colors.success} />
              <Text style={styles.quickActionText}>Create Coupon</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleSendNotification}
            >
              <Bell size={24} color={Colors.warning} />
              <Text style={styles.quickActionText}>Send Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push("/admin/analytics")}
            >
              <TrendingUp size={24} color={Colors.accent} />
              <Text style={styles.quickActionText}>Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push("/admin/settings")}
            >
              <Settings size={24} color={Colors.textSecondary} />
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push("/admin/activity")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                {getActivityIcon(activity.type)}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
                <Text style={styles.activityTime}>
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              {activity.severity && (
                <View
                  style={[
                    styles.severityIndicator,
                    { backgroundColor: getSeverityColor(activity.severity) },
                  ]}
                />
              )}
            </View>
          ))}
        </Card>

        {/* System Health */}
        <Card style={styles.healthCard}>
          <Text style={styles.sectionTitle}>System Health</Text>
          <View style={styles.healthMetrics}>
            <View style={styles.healthMetric}>
              <Text style={styles.healthLabel}>Server Status</Text>
              <View style={styles.healthStatus}>
                <View style={[styles.healthDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.healthValue}>Operational</Text>
              </View>
            </View>

            <View style={styles.healthMetric}>
              <Text style={styles.healthLabel}>Database</Text>
              <View style={styles.healthStatus}>
                <View style={[styles.healthDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.healthValue}>Healthy</Text>
              </View>
            </View>

            <View style={styles.healthMetric}>
              <Text style={styles.healthLabel}>API Response</Text>
              <View style={styles.healthStatus}>
                <View style={[styles.healthDot, { backgroundColor: Colors.warning }]} />
                <Text style={styles.healthValue}>245ms</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Emergency Actions */}
        <Card style={styles.emergencyCard}>
          <Text style={styles.sectionTitle}>Emergency Actions</Text>
          <Text style={styles.emergencyDescription}>
            Use these actions only in critical situations
          </Text>
          <View style={styles.emergencyActions}>
            <Button
              title="Maintenance Mode"
              onPress={() => Alert.alert("Confirm", "Enable maintenance mode?")}
              variant="outline"
              style={styles.emergencyButton}
            />
            <Button
              title="Emergency Broadcast"
              onPress={() => Alert.alert("Confirm", "Send emergency notification?")}
              variant="outline"
              style={styles.emergencyButton}
            />
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
  searchContainer: {
    flexDirection: "row",
    marginBottom: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
  },
  filterButton: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: Theme.spacing.lg,
  },
  quickActionsCard: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionButton: {
    width: "48%",
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    marginTop: Theme.spacing.xs,
    textAlign: "center",
  },
  activityCard: {
    marginBottom: Theme.spacing.lg,
  },
  activityHeader: {
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
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  activityTime: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  severityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  healthCard: {
    marginBottom: Theme.spacing.lg,
  },
  healthMetrics: {
    gap: Theme.spacing.sm,
  },
  healthMetric: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Theme.spacing.xs,
  },
  healthLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  healthStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Theme.spacing.xs,
  },
  healthValue: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    fontWeight: Theme.typography.weights.medium as any,
  },
  emergencyCard: {
    marginBottom: Theme.spacing.xl,
    borderColor: Colors.error,
    borderWidth: 1,
  },
  emergencyDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  emergencyActions: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
  },
  emergencyButton: {
    flex: 1,
  },
});