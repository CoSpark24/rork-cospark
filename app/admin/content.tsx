import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from "react-native";
import { Stack } from "expo-router";
import { 
  MessageSquare, 
  Search, 
  Filter,
  Flag,
  CheckCircle,
  X,
  Eye,
  Calendar,
  User
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";

interface ReportedContent {
  id: string;
  type: "post" | "comment" | "message" | "profile";
  content: string;
  authorName: string;
  authorId: string;
  reportedBy: string;
  reportReason: string;
  reportDate: string;
  status: "pending" | "approved" | "removed";
  severity: "low" | "medium" | "high";
  imageUrl?: string;
}

export default function AdminContent() {
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([
    {
      id: "1",
      type: "post",
      content: "This is a potentially inappropriate post that has been reported by multiple users for containing spam content.",
      authorName: "John Doe",
      authorId: "user123",
      reportedBy: "Jane Smith",
      reportReason: "Spam content",
      reportDate: "2024-01-20",
      status: "pending",
      severity: "high",
      imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop",
    },
    {
      id: "2",
      type: "comment",
      content: "Inappropriate comment with offensive language",
      authorName: "Bad User",
      authorId: "user456",
      reportedBy: "Good User",
      reportReason: "Offensive language",
      reportDate: "2024-01-19",
      status: "pending",
      severity: "medium",
    },
    {
      id: "3",
      type: "message",
      content: "Suspicious message trying to get personal information",
      authorName: "Suspicious Account",
      authorId: "user789",
      reportedBy: "Careful User",
      reportReason: "Privacy violation",
      reportDate: "2024-01-18",
      status: "pending",
      severity: "high",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("pending");

  const handleApproveContent = (contentId: string) => {
    setReportedContent(prev => 
      prev.map(content => 
        content.id === contentId 
          ? { ...content, status: "approved" as const }
          : content
      )
    );
    Alert.alert("Success", "Content has been approved");
  };

  const handleRemoveContent = (contentId: string) => {
    Alert.alert(
      "Remove Content",
      "Are you sure you want to remove this content?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setReportedContent(prev => 
              prev.map(content => 
                content.id === contentId 
                  ? { ...content, status: "removed" as const }
                  : content
              )
            );
            Alert.alert("Success", "Content has been removed");
          },
        },
      ]
    );
  };

  const handleViewFullContent = (content: ReportedContent) => {
    Alert.alert(
      "Full Content",
      content.content,
      [{ text: "Close", style: "cancel" }]
    );
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
      case "approved":
        return Colors.success;
      case "removed":
        return Colors.error;
      case "pending":
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "post":
        return <MessageSquare size={16} color={Colors.primary} />;
      case "comment":
        return <MessageSquare size={16} color={Colors.secondary} />;
      case "message":
        return <MessageSquare size={16} color={Colors.accent} />;
      case "profile":
        return <User size={16} color={Colors.warning} />;
      default:
        return <MessageSquare size={16} color={Colors.textSecondary} />;
    }
  };

  const filteredContent = reportedContent.filter(content => {
    const matchesSearch = content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.reportReason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || content.type === filterType;
    const matchesStatus = filterStatus === "all" || content.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Content Moderation",
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
              placeholder="Search content, authors, reasons..."
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
              {["all", "post", "comment", "message", "profile"].map((type) => (
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
              {["all", "pending", "approved", "removed"].map((status) => (
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

        {/* Content List */}
        <View style={styles.contentContainer}>
          {filteredContent.map((content) => (
            <Card key={content.id} style={styles.contentCard}>
              <View style={styles.contentHeader}>
                <View style={styles.contentInfo}>
                  <View style={styles.typeRow}>
                    {getTypeIcon(content.type)}
                    <Text style={styles.contentType}>
                      {content.type.toUpperCase()}
                    </Text>
                    <View
                      style={[
                        styles.severityBadge,
                        { backgroundColor: getSeverityColor(content.severity) + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.severityText,
                          { color: getSeverityColor(content.severity) },
                        ]}
                      >
                        {content.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.authorName}>By: {content.authorName}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(content.status) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(content.status) },
                    ]}
                  >
                    {content.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              {content.imageUrl && (
                <Image source={{ uri: content.imageUrl }} style={styles.contentImage} />
              )}

              <View style={styles.contentBody}>
                <Text style={styles.contentText} numberOfLines={3}>
                  {content.content}
                </Text>
                <TouchableOpacity
                  style={styles.viewFullButton}
                  onPress={() => handleViewFullContent(content)}
                >
                  <Eye size={14} color={Colors.primary} />
                  <Text style={styles.viewFullText}>View Full</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.reportInfo}>
                <View style={styles.reportItem}>
                  <Flag size={14} color={Colors.error} />
                  <Text style={styles.reportText}>
                    Reported by: {content.reportedBy}
                  </Text>
                </View>
                <View style={styles.reportItem}>
                  <Text style={styles.reportReason}>
                    Reason: {content.reportReason}
                  </Text>
                </View>
                <View style={styles.reportItem}>
                  <Calendar size={14} color={Colors.textSecondary} />
                  <Text style={styles.reportDate}>
                    {new Date(content.reportDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {content.status === "pending" && (
                <View style={styles.contentActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleApproveContent(content.id)}
                  >
                    <CheckCircle size={16} color={Colors.success} />
                    <Text style={[styles.actionButtonText, { color: Colors.success }]}>
                      Approve
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={() => handleRemoveContent(content.id)}
                  >
                    <X size={16} color={Colors.error} />
                    <Text style={[styles.actionButtonText, { color: Colors.error }]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Card>
          ))}
        </View>

        {filteredContent.length === 0 && (
          <Card style={styles.emptyState}>
            <MessageSquare size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyStateText}>No content found</Text>
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
    color: Colors.card,
  },
  contentContainer: {
    gap: Theme.spacing.md,
  },
  contentCard: {
    padding: Theme.spacing.md,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Theme.spacing.sm,
  },
  contentInfo: {
    flex: 1,
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  contentType: {
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
  authorName: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
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
  contentImage: {
    width: "100%",
    height: 150,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
  },
  contentBody: {
    marginBottom: Theme.spacing.sm,
  },
  contentText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: Theme.spacing.xs,
  },
  viewFullButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  viewFullText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  reportInfo: {
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  reportText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  reportReason: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.error,
    fontWeight: Theme.typography.weights.medium as any,
  },
  reportDate: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  contentActions: {
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
  approveButton: {
    backgroundColor: Colors.success + "10",
    borderColor: Colors.success,
  },
  removeButton: {
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