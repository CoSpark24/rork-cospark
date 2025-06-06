import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Stack } from "expo-router";
import {
  Flag,
  Search,
  Filter,
  CheckCircle,
  X,
  AlertTriangle,
  User,
  MessageSquare,
  Calendar,
  ChevronRight,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";

interface Report {
  id: string;
  type: "user" | "content" | "message" | "comment";
  reportedItemId: string;
  reportedItemTitle: string;
  reportedBy: string;
  reportReason: string;
  reportDate: string;
  status: "pending" | "resolved" | "dismissed";
  severity: "low" | "medium" | "high";
  description: string;
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      type: "user",
      reportedItemId: "user123",
      reportedItemTitle: "John Doe",
      reportedBy: "Jane Smith",
      reportReason: "Fake profile",
      reportDate: "2024-01-20",
      status: "pending",
      severity: "high",
      description: "This user appears to be using fake credentials and stock photos. They are sending suspicious messages to multiple founders.",
    },
    {
      id: "2",
      type: "content",
      reportedItemId: "post456",
      reportedItemTitle: "How to get funding without a product",
      reportedBy: "Rahul Sharma",
      reportReason: "Misleading information",
      reportDate: "2024-01-19",
      status: "pending",
      severity: "medium",
      description: "This post contains misleading information about fundraising that could harm early-stage founders.",
    },
    {
      id: "3",
      type: "message",
      reportedItemId: "msg789",
      reportedItemTitle: "Private message in conversation #45892",
      reportedBy: "Priya Patel",
      reportReason: "Harassment",
      reportDate: "2024-01-18",
      status: "pending",
      severity: "high",
      description: "User is sending threatening messages after being declined for a co-founder opportunity.",
    },
    {
      id: "4",
      type: "comment",
      reportedItemId: "comment101",
      reportedItemTitle: "Comment on 'Startup Valuation Methods'",
      reportedBy: "Alex Wong",
      reportReason: "Spam",
      reportDate: "2024-01-17",
      status: "resolved",
      severity: "low",
      description: "Comment contains promotional links to unrelated services.",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const handleResolveReport = (reportId: string) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: "resolved" as const }
          : report
      )
    );
    Alert.alert("Success", "Report marked as resolved");
  };

  const handleDismissReport = (reportId: string) => {
    Alert.alert(
      "Dismiss Report",
      "Are you sure you want to dismiss this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Dismiss",
          style: "destructive",
          onPress: () => {
            setReports(prev => 
              prev.map(report => 
                report.id === reportId 
                  ? { ...report, status: "dismissed" as const }
                  : report
              )
            );
            Alert.alert("Success", "Report has been dismissed");
          },
        },
      ]
    );
  };

  const handleTakeAction = (report: Report) => {
    let actionTitle = "";
    let actionMessage = "";
    
    switch (report.type) {
      case "user":
        actionTitle = "Take Action on User";
        actionMessage = "What action would you like to take on this user?";
        Alert.alert(
          actionTitle,
          actionMessage,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Send Warning", onPress: () => Alert.alert("Success", "Warning sent to user") },
            { text: "Restrict Account", onPress: () => Alert.alert("Success", "User account restricted") },
            { text: "Ban User", style: "destructive", onPress: () => Alert.alert("Success", "User has been banned") },
          ]
        );
        break;
      case "content":
      case "comment":
        actionTitle = "Take Action on Content";
        actionMessage = "What action would you like to take on this content?";
        Alert.alert(
          actionTitle,
          actionMessage,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Hide Content", onPress: () => Alert.alert("Success", "Content has been hidden") },
            { text: "Remove Content", style: "destructive", onPress: () => Alert.alert("Success", "Content has been removed") },
          ]
        );
        break;
      case "message":
        actionTitle = "Take Action on Message";
        actionMessage = "What action would you like to take on this message?";
        Alert.alert(
          actionTitle,
          actionMessage,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete Message", style: "destructive", onPress: () => Alert.alert("Success", "Message has been deleted") },
            { text: "Block Conversation", onPress: () => Alert.alert("Success", "Conversation has been blocked") },
          ]
        );
        break;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return Colors.error;
      case "medium":
        return Colors.warning;
      case "low":
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return Colors.success;
      case "dismissed":
        return Colors.textSecondary;
      case "pending":
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User size={16} color={Colors.primary} />;
      case "content":
        return <MessageSquare size={16} color={Colors.secondary} />;
      case "message":
        return <MessageSquare size={16} color={Colors.accent} />;
      case "comment":
        return <MessageSquare size={16} color={Colors.info} />;
      default:
        return <Flag size={16} color={Colors.textSecondary} />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportedItemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reportReason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || report.type === filterType;
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    const matchesSeverity = filterSeverity === "all" || report.severity === filterSeverity;
    
    return matchesSearch && matchesType && matchesStatus && matchesSeverity;
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Reports & Flags",
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
              placeholder="Search reports..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Type:</Text>
            <View style={styles.filterButtons}>
              {["all", "user", "content", "message", "comment"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterButton,
                    filterType === type && styles.filterButtonActive,
                  ]}
                  onPress={() => setFilterType(type)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filterType === type && styles.filterButtonTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <View style={styles.filterButtons}>
              {["all", "pending", "resolved", "dismissed"].map((status) => (
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

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Severity:</Text>
            <View style={styles.filterButtons}>
              {["all", "high", "medium", "low"].map((severity) => (
                <TouchableOpacity
                  key={severity}
                  style={[
                    styles.filterButton,
                    filterSeverity === severity && styles.filterButtonActive,
                  ]}
                  onPress={() => setFilterSeverity(severity)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filterSeverity === severity && styles.filterButtonTextActive,
                    ]}
                  >
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Reports List */}
        <View style={styles.reportsContainer}>
          {filteredReports.map((report) => (
            <Card key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportInfo}>
                  <View style={styles.typeRow}>
                    {getTypeIcon(report.type)}
                    <Text style={styles.reportType}>
                      {report.type.toUpperCase()}
                    </Text>
                    <View
                      style={[
                        styles.severityBadge,
                        { backgroundColor: getSeverityColor(report.severity) + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.severityText,
                          { color: getSeverityColor(report.severity) },
                        ]}
                      >
                        {report.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.reportTitle}>{report.reportedItemTitle}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(report.status) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(report.status) },
                    ]}
                  >
                    {report.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.reportBody}>
                <Text style={styles.reportDescription}>{report.description}</Text>
              </View>

              <View style={styles.reportDetails}>
                <View style={styles.detailItem}>
                  <Flag size={14} color={Colors.error} />
                  <Text style={styles.detailText}>
                    Reported by: {report.reportedBy}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <AlertTriangle size={14} color={Colors.warning} />
                  <Text style={styles.detailText}>
                    Reason: {report.reportReason}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={14} color={Colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {new Date(report.reportDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {report.status === "pending" && (
                <View style={styles.reportActions}>
                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => handleTakeAction(report)}
                  >
                    <Text style={styles.viewDetailsText}>Take Action</Text>
                    <ChevronRight size={16} color={Colors.primary} />
                  </TouchableOpacity>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.resolveButton]}
                      onPress={() => handleResolveReport(report.id)}
                    >
                      <CheckCircle size={16} color={Colors.success} />
                      <Text style={[styles.actionButtonText, { color: Colors.success }]}>
                        Resolve
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.dismissButton]}
                      onPress={() => handleDismissReport(report.id)}
                    >
                      <X size={16} color={Colors.error} />
                      <Text style={[styles.actionButtonText, { color: Colors.error }]}>
                        Dismiss
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Card>
          ))}
        </View>

        {filteredReports.length === 0 && (
          <Card style={styles.emptyState}>
            <Flag size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyStateText}>No reports found</Text>
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
  reportsContainer: {
    gap: Theme.spacing.md,
  },
  reportCard: {
    padding: Theme.spacing.md,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Theme.spacing.sm,
  },
  reportInfo: {
    flex: 1,
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  reportType: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.textSecondary,
  },
  severityBadge: {
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  severityText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
  },
  reportTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
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
  reportBody: {
    marginBottom: Theme.spacing.sm,
  },
  reportDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  reportDetails: {
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
  reportActions: {
    gap: Theme.spacing.sm,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewDetailsText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  actionButtons: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.sm,
    borderWidth: 1,
  },
  resolveButton: {
    backgroundColor: Colors.success + "10",
    borderColor: Colors.success,
  },
  dismissButton: {
    backgroundColor: Colors.error + "10",
    borderColor: Colors.error,
  },
  actionButtonText: {
    fontSize: Theme.typography.sizes.sm,
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