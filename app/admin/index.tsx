import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import {
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  Bell,
  Flag,
  HelpCircle,
  ChevronRight,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";

export default function AdminDashboard() {
  const router = useRouter();

  const adminMenuItems = [
    {
      title: "Analytics Dashboard",
      icon: <BarChart3 size={24} color={Colors.primary} />,
      description: "View platform metrics and growth statistics",
      route: "/admin/analytics",
    },
    {
      title: "User Management",
      icon: <Users size={24} color={Colors.secondary} />,
      description: "Manage users, roles, and permissions",
      route: "/admin/users",
    },
    {
      title: "Content Moderation",
      icon: <MessageSquare size={24} color={Colors.accent} />,
      description: "Review and moderate user-generated content",
      route: "/admin/content",
    },
    {
      title: "Platform Settings",
      icon: <Settings size={24} color={Colors.text} />,
      description: "Configure platform settings and features",
      route: "/admin/settings",
    },
    {
      title: "Notifications",
      icon: <Bell size={24} color={Colors.warning} />,
      description: "Send and manage push notifications",
      route: "/admin/notifications",
    },
    {
      title: "Reports & Flags",
      icon: <Flag size={24} color={Colors.error} />,
      description: "Review reported content and users",
      route: "/admin/reports",
    },
    {
      title: "Help & Support",
      icon: <HelpCircle size={24} color={Colors.info} />,
      description: "Manage support tickets and FAQs",
      route: "/admin/support",
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Admin Dashboard",
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>
            Manage and monitor the CoSpark platform
          </Text>
        </View>

        <View style={styles.menuContainer}>
          {adminMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(item.route)}
            >
              <Card style={styles.menuItem}>
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemIcon}>{item.icon}</View>
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={Colors.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            CoSpark Admin Panel • Version 1.0.0
          </Text>
        </View>
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
  header: {
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
  },
  menuContainer: {
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  menuItem: {
    padding: Theme.spacing.md,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemIcon: {
    marginRight: Theme.spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  menuItemDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  footer: {
    alignItems: "center",
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  footerText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
});