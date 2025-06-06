import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Stack } from "expo-router";
import {
  Settings,
  Bell,
  Shield,
  DollarSign,
  Globe,
  MessageSquare,
  Save,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function AdminSettings() {
  // General Settings
  const [darkMode, setDarkMode] = useState(false);
  const [enableAnalytics, setEnableAnalytics] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Notification Settings
  const [enablePushNotifications, setEnablePushNotifications] = useState(true);
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);
  const [notifyNewUsers, setNotifyNewUsers] = useState(true);
  const [notifyReports, setNotifyReports] = useState(true);

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [passwordMinLength, setPasswordMinLength] = useState("8");
  const [sessionTimeout, setSessionTimeout] = useState("30");

  // Payment Settings
  const [enableRazorpay, setEnableRazorpay] = useState(true);
  const [enableStripe, setEnableStripe] = useState(true);
  const [testMode, setTestMode] = useState(true);

  // Content Settings
  const [autoModeration, setAutoModeration] = useState(true);
  const [profanityFilter, setProfanityFilter] = useState(true);
  const [maxUploadSize, setMaxUploadSize] = useState("10");
  const [allowedFileTypes, setAllowedFileTypes] = useState("pdf,doc,docx,ppt,pptx,jpg,png");

  const handleSaveSettings = () => {
    Alert.alert("Success", "Settings saved successfully!");
  };

  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            // Reset all settings to default
            setDarkMode(false);
            setEnableAnalytics(true);
            setDebugMode(false);
            setMaintenanceMode(false);
            setEnablePushNotifications(true);
            setEnableEmailNotifications(true);
            setNotifyNewUsers(true);
            setNotifyReports(true);
            setTwoFactorAuth(false);
            setRequireEmailVerification(true);
            setPasswordMinLength("8");
            setSessionTimeout("30");
            setEnableRazorpay(true);
            setEnableStripe(true);
            setTestMode(true);
            setAutoModeration(true);
            setProfanityFilter(true);
            setMaxUploadSize("10");
            setAllowedFileTypes("pdf,doc,docx,ppt,pptx,jpg,png");
            
            Alert.alert("Success", "Settings reset to default!");
          },
        },
      ]
    );
  };

  const renderSettingSwitch = (
    value: boolean,
    onValueChange: (value: boolean) => void,
    title: string,
    description: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.gray300, true: Colors.primaryLight }}
        thumbColor={value ? Colors.primary : Colors.gray100}
      />
    </View>
  );

  const renderSettingInput = (
    value: string,
    onChangeText: (text: string) => void,
    title: string,
    description: string,
    keyboardType: "default" | "numeric" = "default",
    placeholder: string = ""
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <TextInput
        style={styles.settingInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Platform Settings",
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.text,
        }}
      />

      <ScrollView style={styles.content}>
        {/* General Settings */}
        <Card style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <Settings size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>General Settings</Text>
          </View>

          {renderSettingSwitch(
            darkMode,
            setDarkMode,
            "Dark Mode",
            "Enable dark mode for admin panel"
          )}

          {renderSettingSwitch(
            enableAnalytics,
            setEnableAnalytics,
            "Analytics Tracking",
            "Collect usage data for platform insights"
          )}

          {renderSettingSwitch(
            debugMode,
            setDebugMode,
            "Debug Mode",
            "Enable detailed logging for troubleshooting"
          )}

          {renderSettingSwitch(
            maintenanceMode,
            setMaintenanceMode,
            "Maintenance Mode",
            "Take the platform offline for maintenance"
          )}
        </Card>

        {/* Notification Settings */}
        <Card style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <Bell size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Notification Settings</Text>
          </View>

          {renderSettingSwitch(
            enablePushNotifications,
            setEnablePushNotifications,
            "Push Notifications",
            "Enable push notifications for mobile users"
          )}

          {renderSettingSwitch(
            enableEmailNotifications,
            setEnableEmailNotifications,
            "Email Notifications",
            "Send email notifications to users"
          )}

          {renderSettingSwitch(
            notifyNewUsers,
            setNotifyNewUsers,
            "New User Alerts",
            "Get notified when new users register"
          )}

          {renderSettingSwitch(
            notifyReports,
            setNotifyReports,
            "Content Report Alerts",
            "Get notified when content is reported"
          )}
        </Card>

        {/* Security Settings */}
        <Card style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <Shield size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Security Settings</Text>
          </View>

          {renderSettingSwitch(
            twoFactorAuth,
            setTwoFactorAuth,
            "Two-Factor Authentication",
            "Require 2FA for admin accounts"
          )}

          {renderSettingSwitch(
            requireEmailVerification,
            setRequireEmailVerification,
            "Email Verification",
            "Require email verification for new accounts"
          )}

          {renderSettingInput(
            passwordMinLength,
            setPasswordMinLength,
            "Minimum Password Length",
            "Set minimum character requirement for passwords",
            "numeric",
            "8"
          )}

          {renderSettingInput(
            sessionTimeout,
            setSessionTimeout,
            "Session Timeout (minutes)",
            "Set admin session timeout duration",
            "numeric",
            "30"
          )}
        </Card>

        {/* Payment Settings */}
        <Card style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <DollarSign size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Payment Settings</Text>
          </View>

          {renderSettingSwitch(
            enableRazorpay,
            setEnableRazorpay,
            "Razorpay Integration",
            "Enable Razorpay for Indian users"
          )}

          {renderSettingSwitch(
            enableStripe,
            setEnableStripe,
            "Stripe Integration",
            "Enable Stripe for international users"
          )}

          {renderSettingSwitch(
            testMode,
            setTestMode,
            "Test Mode",
            "Use test credentials for payment gateways"
          )}
        </Card>

        {/* Content Settings */}
        <Card style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <MessageSquare size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Content Settings</Text>
          </View>

          {renderSettingSwitch(
            autoModeration,
            setAutoModeration,
            "Auto Moderation",
            "Automatically filter potentially harmful content"
          )}

          {renderSettingSwitch(
            profanityFilter,
            setProfanityFilter,
            "Profanity Filter",
            "Filter out profanity in user content"
          )}

          {renderSettingInput(
            maxUploadSize,
            setMaxUploadSize,
            "Max Upload Size (MB)",
            "Set maximum file upload size",
            "numeric",
            "10"
          )}

          {renderSettingInput(
            allowedFileTypes,
            setAllowedFileTypes,
            "Allowed File Types",
            "Comma-separated list of allowed file extensions",
            "default",
            "pdf,doc,docx,ppt,pptx,jpg,png"
          )}
        </Card>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save Settings"
            onPress={handleSaveSettings}
            leftIcon={<Save size={20} color={Colors.white} />}
            gradient
            fullWidth
            style={styles.saveButton}
          />
          
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetSettings}
          >
            <Text style={styles.resetButtonText}>Reset to Default</Text>
          </TouchableOpacity>
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
  settingsCard: {
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  cardTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginLeft: Theme.spacing.sm,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  settingTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  settingDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  settingInput: {
    width: 100,
    padding: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.sm,
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
  },
  buttonContainer: {
    marginBottom: Theme.spacing.xl,
  },
  saveButton: {
    marginBottom: Theme.spacing.md,
  },
  resetButton: {
    alignItems: "center",
    padding: Theme.spacing.sm,
  },
  resetButtonText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.error,
    fontWeight: Theme.typography.weights.medium as any,
  },
});