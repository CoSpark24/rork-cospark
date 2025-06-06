import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
} from "react-native";
import { Stack } from "expo-router";
import { 
  Users, 
  Search, 
  Filter,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Shield
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "founder" | "investor" | "mentor";
  status: "active" | "banned" | "pending";
  joinDate: string;
  lastActive: string;
  subscriptionPlan: "free" | "pro";
  reportCount: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
      role: "founder",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-01-20",
      subscriptionPlan: "pro",
      reportCount: 0,
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya@example.com",
      role: "investor",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "2024-01-19",
      subscriptionPlan: "free",
      reportCount: 1,
    },
    {
      id: "3",
      name: "Suspicious User",
      email: "suspicious@example.com",
      role: "founder",
      status: "pending",
      joinDate: "2024-01-18",
      lastActive: "2024-01-18",
      subscriptionPlan: "free",
      reportCount: 5,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleBanUser = (userId: string) => {
    Alert.alert(
      "Ban User",
      "Are you sure you want to ban this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ban",
          style: "destructive",
          onPress: () => {
            setUsers(prev => 
              prev.map(user => 
                user.id === userId 
                  ? { ...user, status: "banned" as const }
                  : user
              )
            );
            Alert.alert("Success", "User has been banned");
          },
        },
      ]
    );
  };

  const handleApproveUser = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: "active" as const }
          : user
      )
    );
    Alert.alert("Success", "User has been approved");
  };

  const handleSendMessage = (user: User) => {
    Alert.prompt(
      "Send Message",
      `Send a message to ${user.name}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: (message) => {
            if (message?.trim()) {
              Alert.alert("Success", "Message sent successfully!");
            }
          },
        },
      ],
      "plain-text",
      "Hello, this is a message from the admin team..."
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return Colors.success;
      case "banned":
        return Colors.error;
      case "pending":
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "founder":
        return <Users size={16} color={Colors.primary} />;
      case "investor":
        return <Shield size={16} color={Colors.success} />;
      case "mentor":
        return <CheckCircle size={16} color={Colors.secondary} />;
      default:
        return <Users size={16} color={Colors.textSecondary} />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "User Management",
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.text,
        }}
      />

      <ScrollView style={styles.content}>
        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Role:</Text>
            <View style={styles.filterButtons}>
              {["all", "founder", "investor", "mentor"].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.filterButton,
                    filterRole === role && styles.filterButtonActive,
                  ]}
                  onPress={() => setFilterRole(role)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filterRole === role && styles.filterButtonTextActive,
                    ]}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <View style={styles.filterButtons}>
              {["all", "active", "pending", "banned"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterButton,
                    filterStatus === status && styles.filterButtonActive,
                  ]}
                  onPress={() => setFilterStatus(status)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filterStatus === status && styles.filterButtonTextActive,
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Users List */}
        <View style={styles.usersContainer}>
          {filteredUsers.map((user) => (
            <Card key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{user.name}</Text>
                    {getRoleIcon(user.role)}
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  {user.phone && (
                    <Text style={styles.userPhone}>{user.phone}</Text>
                  )}
                </View>
                <View style={styles.userStatus}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(user.status) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(user.status) },
                      ]}
                    >
                      {user.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.planBadge}>
                    {user.subscriptionPlan.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.userDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={14} color={Colors.textSecondary} />
                  <Text style={styles.detailText}>
                    Joined: {new Date(user.joinDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailText}>
                    Last Active: {new Date(user.lastActive).toLocaleDateString()}
                  </Text>
                </View>
                {user.reportCount > 0 && (
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailText, { color: Colors.error }]}>
                      Reports: {user.reportCount}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.userActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleSendMessage(user)}
                >
                  <Mail size={16} color={Colors.primary} />
                  <Text style={styles.actionButtonText}>Message</Text>
                </TouchableOpacity>

                {user.status === "pending" && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleApproveUser(user.id)}
                  >
                    <CheckCircle size={16} color={Colors.success} />
                    <Text style={[styles.actionButtonText, { color: Colors.success }]}>
                      Approve
                    </Text>
                  </TouchableOpacity>
                )}

                {user.status !== "banned" && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.banButton]}
                    onPress={() => handleBanUser(user.id)}
                  >
                    <Ban size={16} color={Colors.error} />
                    <Text style={[styles.actionButtonText, { color: Colors.error }]}>
                      Ban
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          ))}
        </View>

        {filteredUsers.length === 0 && (
          <Card style={styles.emptyState}>
            <Users size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyStateText}>No users found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </Card>
        )}
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
    marginBottom: Theme.spacing.md,
  },
  searchBar: {
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
  filtersContainer: {
    marginBottom: Theme.spacing.lg,
  },
  filterGroup: {
    marginBottom: Theme.spacing.md,
  },
  filterLabel: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Theme.spacing.xs,
  },
  filterButton: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  usersContainer: {
    gap: Theme.spacing.md,
  },
  userCard: {
    padding: Theme.spacing.md,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Theme.spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  userName: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  userEmail: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  userPhone: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  userStatus: {
    alignItems: "flex-end",
    gap: Theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  statusText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
  },
  planBadge: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  userDetails: {
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  detailText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  userActions: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  approveButton: {
    borderColor: Colors.success,
  },
  banButton: {
    borderColor: Colors.error,
  },
  actionButtonText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  emptyState: {
    alignItems: "center",
    padding: Theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
  },
  emptyStateSubtext: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});