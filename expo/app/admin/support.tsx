import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import {
  HelpCircle,
  Search,
  Filter,
  MessageSquare,
  CheckCircle,
  X,
  Calendar,
  User,
  Mail,
  Send,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  userName: string;
  userEmail: string;
  userId: string;
  category: "account" | "payment" | "technical" | "feature" | "other";
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  lastUpdated: string;
  responses: Array<{
    id: string;
    message: string;
    isAdmin: boolean;
    timestamp: string;
  }>;
}

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "1",
      subject: "Unable to access my account",
      message: "I'm trying to log in but keep getting an error message saying 'Invalid credentials' even though I'm sure my password is correct. I've tried resetting it twice.",
      userName: "Rahul Sharma",
      userEmail: "rahul@example.com",
      userId: "user123",
      category: "account",
      priority: "high",
      status: "open",
      createdAt: "2024-01-20T10:30:00",
      lastUpdated: "2024-01-20T10:30:00",
      responses: [],
    },
    {
      id: "2",
      subject: "Payment failed but money deducted",
      message: "I tried to upgrade to the Pro plan but got an error. However, my bank shows that the amount was deducted. Please help!",
      userName: "Priya Patel",
      userEmail: "priya@example.com",
      userId: "user456",
      category: "payment",
      priority: "high",
      status: "in-progress",
      createdAt: "2024-01-19T15:45:00",
      lastUpdated: "2024-01-19T16:20:00",
      responses: [
        {
          id: "resp1",
          message: "We're looking into this issue and have contacted our payment processor. We'll get back to you within 24 hours.",
          isAdmin: true,
          timestamp: "2024-01-19T16:20:00",
        },
      ],
    },
    {
      id: "3",
      subject: "Feature request: Calendar integration",
      message: "It would be great if we could integrate Google Calendar for scheduling meetings with potential co-founders. This would make the process much smoother.",
      userName: "Amit Kumar",
      userEmail: "amit@example.com",
      userId: "user789",
      category: "feature",
      priority: "low",
      status: "open",
      createdAt: "2024-01-18T09:15:00",
      lastUpdated: "2024-01-18T09:15:00",
      responses: [],
    },
    {
      id: "4",
      subject: "App crashes when uploading pitch deck",
      message: "Whenever I try to upload my pitch deck PDF (5MB), the app crashes. I've tried multiple times on both WiFi and mobile data.",
      userName: "Sneha Gupta",
      userEmail: "sneha@example.com",
      userId: "user101",
      category: "technical",
      priority: "medium",
      status: "resolved",
      createdAt: "2024-01-17T14:20:00",
      lastUpdated: "2024-01-18T11:30:00",
      responses: [
        {
          id: "resp2",
          message: "Could you please tell us what device and OS version you're using?",
          isAdmin: true,
          timestamp: "2024-01-17T15:10:00",
        },
        {
          id: "resp3",
          message: "I'm using iPhone 12 with iOS 16.2",
          isAdmin: false,
          timestamp: "2024-01-17T16:45:00",
        },
        {
          id: "resp4",
          message: "Thank you for the information. We've identified the issue and deployed a fix. Please update your app to the latest version and try again.",
          isAdmin: true,
          timestamp: "2024-01-18T11:30:00",
        },
      ],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responseText, setResponseText] = useState("");

  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
    setResponseText("");
  };

  const handleSendResponse = () => {
    if (!selectedTicket || !responseText.trim()) {
      return;
    }
    
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        const newResponse = {
          id: `resp${Date.now()}`,
          message: responseText.trim(),
          isAdmin: true,
          timestamp: new Date().toISOString(),
        };
        
        return {
          ...ticket,
          responses: [...ticket.responses, newResponse],
          lastUpdated: new Date().toISOString(),
          status: ticket.status === "open" ? "in-progress" as const : ticket.status,
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    setResponseText("");
    
    // Update the selected ticket
    const updatedTicket = updatedTickets.find(t => t.id === selectedTicket.id);
    if (updatedTicket) {
      setSelectedTicket(updatedTicket);
    }
    
    Alert.alert("Success", "Response sent to user");
  };

  const handleUpdateStatus = (ticketId: string, newStatus: "open" | "in-progress" | "resolved" | "closed") => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: newStatus,
          lastUpdated: new Date().toISOString(),
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    
    // Update the selected ticket if it's the one being modified
    if (selectedTicket && selectedTicket.id === ticketId) {
      const updatedTicket = updatedTickets.find(t => t.id === ticketId);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
    }
    
    Alert.alert("Success", `Ticket status updated to ${newStatus}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
      case "open":
        return Colors.error;
      case "in-progress":
        return Colors.warning;
      case "resolved":
        return Colors.success;
      case "closed":
        return Colors.textSecondary;
      default:
        return Colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "account":
        return <User size={16} color={Colors.primary} />;
      case "payment":
        return <MessageSquare size={16} color={Colors.error} />;
      case "technical":
        return <MessageSquare size={16} color={Colors.warning} />;
      case "feature":
        return <MessageSquare size={16} color={Colors.success} />;
      case "other":
        return <MessageSquare size={16} color={Colors.textSecondary} />;
      default:
        return <MessageSquare size={16} color={Colors.textSecondary} />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || ticket.category === filterCategory;
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Help & Support",
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.text,
        }}
      />

      {!selectedTicket ? (
        <ScrollView style={styles.content}>
          {/* Search and Filters */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search tickets..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.filtersContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Category:</Text>
              <View style={styles.filterButtons}>
                {["all", "account", "payment", "technical", "feature", "other"].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterButton,
                      filterCategory === category && styles.filterButtonActive,
                    ]}
                    onPress={() => setFilterCategory(category)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        filterCategory === category && styles.filterButtonTextActive,
                      ]}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status:</Text>
              <View style={styles.filterButtons}>
                {["all", "open", "in-progress", "resolved", "closed"].map((status) => (
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
              <Text style={styles.filterLabel}>Priority:</Text>
              <View style={styles.filterButtons}>
                {["all", "high", "medium", "low"].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.filterButton,
                      filterPriority === priority && styles.filterButtonActive,
                    ]}
                    onPress={() => setFilterPriority(priority)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        filterPriority === priority && styles.filterButtonTextActive,
                      ]}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Tickets List */}
          <View style={styles.ticketsContainer}>
            {filteredTickets.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                onPress={() => handleSelectTicket(ticket)}
              >
                <Card style={styles.ticketCard}>
                  <View style={styles.ticketHeader}>
                    <View style={styles.ticketInfo}>
                      <View style={styles.categoryRow}>
                        {getCategoryIcon(ticket.category)}
                        <Text style={styles.categoryText}>
                          {ticket.category.toUpperCase()}
                        </Text>
                        <View
                          style={[
                            styles.priorityBadge,
                            { backgroundColor: getPriorityColor(ticket.priority) + "20" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.priorityText,
                              { color: getPriorityColor(ticket.priority) },
                            ]}
                          >
                            {ticket.priority.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.ticketSubject}>{ticket.subject}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(ticket.status) + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(ticket.status) },
                        ]}
                      >
                        {ticket.status.replace("-", " ").toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.ticketPreview}>
                    <Text style={styles.previewText} numberOfLines={2}>
                      {ticket.message}
                    </Text>
                  </View>

                  <View style={styles.ticketFooter}>
                    <View style={styles.userInfo}>
                      <User size={14} color={Colors.textSecondary} />
                      <Text style={styles.userName}>{ticket.userName}</Text>
                    </View>
                    <View style={styles.timeInfo}>
                      <Calendar size={14} color={Colors.textSecondary} />
                      <Text style={styles.timeText}>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.responseCount}>
                      <MessageSquare size={14} color={Colors.textSecondary} />
                      <Text style={styles.countText}>
                        {ticket.responses.length}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {filteredTickets.length === 0 && (
            <Card style={styles.emptyState}>
              <HelpCircle size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyStateText}>No tickets found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search or filters
              </Text>
            </Card>
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToList}
          >
            <Text style={styles.backButtonText}>← Back to all tickets</Text>
          </TouchableOpacity>

          <Card style={styles.ticketDetailCard}>
            <View style={styles.ticketDetailHeader}>
              <Text style={styles.ticketDetailSubject}>{selectedTicket.subject}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(selectedTicket.status) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(selectedTicket.status) },
                  ]}
                >
                  {selectedTicket.status.replace("-", " ").toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.ticketMeta}>
              <View style={styles.metaItem}>
                <User size={16} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{selectedTicket.userName}</Text>
              </View>
              <View style={styles.metaItem}>
                <Mail size={16} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{selectedTicket.userEmail}</Text>
              </View>
              <View style={styles.metaItem}>
                <Calendar size={16} color={Colors.textSecondary} />
                <Text style={styles.metaText}>
                  Created: {formatDate(selectedTicket.createdAt)}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: Colors.primary + "20" },
                  ]}
                >
                  <Text style={[styles.categoryBadgeText, { color: Colors.primary }]}>
                    {selectedTicket.category.toUpperCase()}
                  </Text>
                </View>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(selectedTicket.priority) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      { color: getPriorityColor(selectedTicket.priority) },
                    ]}
                  >
                    {selectedTicket.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.messageContainer}>
              <View style={styles.userMessage}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageSender}>{selectedTicket.userName}</Text>
                  <Text style={styles.messageTime}>
                    {formatDate(selectedTicket.createdAt)}
                  </Text>
                </View>
                <Text style={styles.messageText}>{selectedTicket.message}</Text>
              </View>

              {selectedTicket.responses.map((response) => (
                <View
                  key={response.id}
                  style={[
                    response.isAdmin ? styles.adminMessage : styles.userMessage,
                  ]}
                >
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageSender}>
                      {response.isAdmin ? "Admin Support" : selectedTicket.userName}
                    </Text>
                    <Text style={styles.messageTime}>
                      {formatDate(response.timestamp)}
                    </Text>
                  </View>
                  <Text style={styles.messageText}>{response.message}</Text>
                </View>
              ))}
            </View>

            {selectedTicket.status !== "closed" && (
              <View style={styles.responseForm}>
                <Text style={styles.responseLabel}>Your Response</Text>
                <TextInput
                  style={styles.responseInput}
                  value={responseText}
                  onChangeText={setResponseText}
                  placeholder="Type your response here..."
                  placeholderTextColor={Colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <Button
                  title="Send Response"
                  onPress={handleSendResponse}
                  leftIcon={<Send size={18} color={Colors.white} />}
                  disabled={!responseText.trim()}
                  gradient
                  style={styles.sendButton}
                />
              </View>
            )}

            <View style={styles.statusActions}>
              <Text style={styles.statusActionsLabel}>Update Status:</Text>
              <View style={styles.statusButtons}>
                {["open", "in-progress", "resolved", "closed"].map((status) => {
                  const statusColor = getStatusColor(status);
                  return (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        { backgroundColor: statusColor + "20" },
                        selectedTicket.status === status && styles.statusButtonActive,
                      ]}
                      onPress={() => handleUpdateStatus(selectedTicket.id, status as any)}
                      disabled={selectedTicket.status === status}
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          { color: statusColor },
                          selectedTicket.status === status && styles.statusButtonTextActive,
                        ]}
                      >
                        {status.replace("-", " ").toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Card>
        </ScrollView>
      )}
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
  ticketsContainer: {
    gap: Theme.spacing.md,
  },
  ticketCard: {
    padding: Theme.spacing.md,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Theme.spacing.sm,
  },
  ticketInfo: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  categoryText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  priorityText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
  },
  ticketSubject: {
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
  ticketPreview: {
    marginBottom: Theme.spacing.sm,
  },
  previewText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  userName: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  timeText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  responseCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  countText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
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
  backButton: {
    marginBottom: Theme.spacing.md,
  },
  backButtonText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  ticketDetailCard: {
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  ticketDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  ticketDetailSubject: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  ticketMeta: {
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  metaText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
  },
  metaRow: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  categoryBadgeText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
  },
  messageContainer: {
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  userMessage: {
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.textSecondary,
  },
  adminMessage: {
    backgroundColor: Colors.primary + "10",
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Theme.spacing.sm,
  },
  messageSender: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
  },
  messageTime: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  messageText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  responseForm: {
    marginBottom: Theme.spacing.lg,
  },
  responseLabel: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  responseInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    minHeight: 120,
    marginBottom: Theme.spacing.md,
  },
  sendButton: {
    alignSelf: "flex-end",
    minWidth: 150,
  },
  statusActions: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Theme.spacing.md,
  },
  statusActionsLabel: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  statusButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Theme.spacing.sm,
  },
  statusButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: "transparent",
  },
  statusButtonActive: {
    borderColor: Colors.primary,
  },
  statusButtonText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
  },
  statusButtonTextActive: {
    fontWeight: Theme.typography.weights.bold as any,
  },
});