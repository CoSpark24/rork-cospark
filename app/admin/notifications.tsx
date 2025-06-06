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
  Bell,
  Send,
  Users,
  Filter,
  Calendar,
  CheckCircle,
  X,
  Info,
  AlertTriangle,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";

interface NotificationTemplate {
  id: string;
  title: string;
  body: string;
  type: "welcome" | "event" | "match" | "update" | "custom";
}

interface SentNotification {
  id: string;
  title: string;
  body: string;
  sentAt: Date;
  recipients: string;
  status: "sent" | "failed" | "pending";
}

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState<"send" | "history" | "templates">("send");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<"all" | "founders" | "investors" | "mentors" | "pro">("all");
  const [scheduleDate, setScheduleDate] = useState("");
  
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: "1",
      title: "Welcome to CoSpark",
      body: "Thank you for joining CoSpark! We're excited to help you find the perfect co-founder for your startup journey.",
      type: "welcome",
    },
    {
      id: "2",
      title: "New Event: Startup Pitch Day",
      body: "Join us for our monthly Startup Pitch Day this Friday at 3 PM. Connect with investors and get feedback on your pitch!",
      type: "event",
    },
    {
      id: "3",
      title: "You have a new match!",
      body: "Good news! We've found a potential co-founder match for you. Check your matches to connect.",
      type: "match",
    },
    {
      id: "4",
      title: "Platform Update",
      body: "We've added new features to help you build your startup. Check out the AI pitch deck generator!",
      type: "update",
    },
  ]);
  
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([
    {
      id: "1",
      title: "Welcome to CoSpark",
      body: "Thank you for joining CoSpark! We're excited to help you find the perfect co-founder for your startup journey.",
      sentAt: new Date(2024, 0, 15),
      recipients: "All New Users",
      status: "sent",
    },
    {
      id: "2",
      title: "New Feature: AI Mentor",
      body: "We've launched our AI Mentor feature to help guide your startup journey. Try it now!",
      sentAt: new Date(2024, 0, 10),
      recipients: "All Users",
      status: "sent",
    },
    {
      id: "3",
      title: "Upcoming Maintenance",
      body: "CoSpark will be undergoing maintenance on Jan 5th from 2-4 AM IST. Some features may be unavailable during this time.",
      sentAt: new Date(2024, 0, 3),
      recipients: "All Users",
      status: "sent",
    },
  ]);

  const handleSendNotification = () => {
    if (!notificationTitle.trim() || !notificationBody.trim()) {
      Alert.alert("Error", "Please enter both title and body for the notification");
      return;
    }
    
    Alert.alert(
      "Confirm Send",
      `Are you sure you want to send this notification to ${selectedAudience === "all" ? "all users" : selectedAudience}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: () => {
            // In a real app, this would call an API to send the notification
            const newNotification: SentNotification = {
              id: Date.now().toString(),
              title: notificationTitle,
              body: notificationBody,
              sentAt: new Date(),
              recipients: selectedAudience === "all" ? "All Users" : 
                          selectedAudience === "founders" ? "All Founders" :
                          selectedAudience === "investors" ? "All Investors" :
                          selectedAudience === "mentors" ? "All Mentors" : "Pro Users",
              status: "sent",
            };
            
            setSentNotifications([newNotification, ...sentNotifications]);
            setNotificationTitle("");
            setNotificationBody("");
            setSelectedAudience("all");
            setScheduleDate("");
            
            Alert.alert("Success", "Notification sent successfully!");
          },
        },
      ]
    );
  };

  const handleUseTemplate = (template: NotificationTemplate) => {
    setNotificationTitle(template.title);
    setNotificationBody(template.body);
    setActiveTab("send");
  };

  const handleDeleteTemplate = (templateId: string) => {
    Alert.alert(
      "Delete Template",
      "Are you sure you want to delete this template?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTemplates(templates.filter(template => template.id !== templateId));
          },
        },
      ]
    );
  };

  const handleSaveTemplate = () => {
    if (!notificationTitle.trim() || !notificationBody.trim()) {
      Alert.alert("Error", "Please enter both title and body for the template");
      return;
    }
    
    const newTemplate: NotificationTemplate = {
      id: Date.now().toString(),
      title: notificationTitle,
      body: notificationBody,
      type: "custom",
    };
    
    setTemplates([...templates, newTemplate]);
    Alert.alert("Success", "Template saved successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return Colors.success;
      case "failed":
        return Colors.error;
      case "pending":
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "welcome":
        return <Users size={16} color={Colors.primary} />;
      case "event":
        return <Calendar size={16} color={Colors.secondary} />;
      case "match":
        return <CheckCircle size={16} color={Colors.success} />;
      case "update":
        return <Info size={16} color={Colors.info} />;
      case "custom":
        return <Bell size={16} color={Colors.accent} />;
      default:
        return <Bell size={16} color={Colors.textSecondary} />;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Push Notifications",
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.text,
        }}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "send" && styles.activeTab]}
          onPress={() => setActiveTab("send")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "send" && styles.activeTabText,
            ]}
          >
            Send New
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "templates" && styles.activeTab]}
          onPress={() => setActiveTab("templates")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "templates" && styles.activeTabText,
            ]}
          >
            Templates
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "send" && (
          <Card style={styles.sendCard}>
            <Text style={styles.sectionTitle}>Send Push Notification</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notification Title</Text>
              <TextInput
                style={styles.input}
                value={notificationTitle}
                onChangeText={setNotificationTitle}
                placeholder="Enter notification title"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notification Body</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notificationBody}
                onChangeText={setNotificationBody}
                placeholder="Enter notification message"
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Target Audience</Text>
              <View style={styles.audienceOptions}>
                {["all", "founders", "investors", "mentors", "pro"].map((audience) => (
                  <TouchableOpacity
                    key={audience}
                    style={[
                      styles.audienceOption,
                      selectedAudience === audience && styles.selectedAudience,
                    ]}
                    onPress={() => setSelectedAudience(audience as any)}
                  >
                    <Text
                      style={[
                        styles.audienceText,
                        selectedAudience === audience && styles.selectedAudienceText,
                      ]}
                    >
                      {audience.charAt(0).toUpperCase() + audience.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Schedule (Optional)</Text>
              <TextInput
                style={styles.input}
                value={scheduleDate}
                onChangeText={setScheduleDate}
                placeholder="YYYY-MM-DD HH:MM or leave blank to send now"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
            
            <View style={styles.buttonRow}>
              <Button
                title="Send Notification"
                onPress={handleSendNotification}
                leftIcon={<Send size={18} color={Colors.white} />}
                gradient
                style={styles.sendButton}
              />
              
              <Button
                title="Save as Template"
                onPress={handleSaveTemplate}
                variant="outline"
                style={styles.saveButton}
              />
            </View>
            
            <View style={styles.infoBox}>
              <AlertTriangle size={16} color={Colors.warning} />
              <Text style={styles.infoText}>
                Push notifications should be used sparingly. Users may opt out if they receive too many notifications.
              </Text>
            </View>
          </Card>
        )}
        
        {activeTab === "templates" && (
          <View style={styles.templatesContainer}>
            <Text style={styles.sectionTitle}>Notification Templates</Text>
            <Text style={styles.sectionSubtitle}>
              Use these templates to quickly send common notifications
            </Text>
            
            {templates.map((template) => (
              <Card key={template.id} style={styles.templateCard}>
                <View style={styles.templateHeader}>
                  {getTypeIcon(template.type)}
                  <Text style={styles.templateType}>
                    {template.type.toUpperCase()}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTemplate(template.id)}
                  >
                    <X size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.templateTitle}>{template.title}</Text>
                <Text style={styles.templateBody}>{template.body}</Text>
                
                <TouchableOpacity
                  style={styles.useTemplateButton}
                  onPress={() => handleUseTemplate(template)}
                >
                  <Text style={styles.useTemplateText}>Use Template</Text>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}
        
        {activeTab === "history" && (
          <View style={styles.historyContainer}>
            <Text style={styles.sectionTitle}>Notification History</Text>
            <Text style={styles.sectionSubtitle}>
              Review previously sent notifications
            </Text>
            
            {sentNotifications.map((notification) => (
              <Card key={notification.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>
                    {notification.sentAt.toLocaleDateString()}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(notification.status) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(notification.status) },
                      ]}
                    >
                      {notification.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.historyTitle}>{notification.title}</Text>
                <Text style={styles.historyBody}>{notification.body}</Text>
                
                <View style={styles.historyFooter}>
                  <Text style={styles.recipientsText}>
                    Sent to: {notification.recipients}
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={() => {
                      setNotificationTitle(notification.title);
                      setNotificationBody(notification.body);
                      setActiveTab("send");
                    }}
                  >
                    <Text style={styles.resendText}>Resend</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    padding: 4,
    margin: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    alignItems: "center",
    borderRadius: Theme.borderRadius.md,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
  },
  activeTabText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.lg,
  },
  sendCard: {
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  sectionSubtitle: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.lg,
  },
  formGroup: {
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
  },
  textArea: {
    minHeight: 100,
  },
  audienceOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Theme.spacing.xs,
  },
  audienceOption: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Theme.spacing.xs,
  },
  selectedAudience: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  audienceText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
  },
  selectedAudienceText: {
    color: Colors.white,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  sendButton: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  saveButton: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.warning + "10",
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  infoText: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
  },
  templatesContainer: {
    marginBottom: Theme.spacing.lg,
  },
  templateCard: {
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  templateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  templateType: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  deleteButton: {
    marginLeft: "auto",
    padding: Theme.spacing.xs,
  },
  templateTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  templateBody: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  useTemplateButton: {
    alignSelf: "flex-end",
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Colors.primary + "20",
    borderRadius: Theme.borderRadius.md,
  },
  useTemplateText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  historyContainer: {
    marginBottom: Theme.spacing.lg,
  },
  historyCard: {
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  historyDate: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  statusText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
  },
  historyTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  historyBody: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Theme.spacing.sm,
  },
  recipientsText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  resendButton: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    backgroundColor: Colors.primary + "20",
    borderRadius: Theme.borderRadius.sm,
  },
  resendText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
});