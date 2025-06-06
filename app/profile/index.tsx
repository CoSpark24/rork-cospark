import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import {
  MapPin,
  Briefcase,
  Target,
  Award,
  Edit,
  LogOut,
  Video,
  MapPinned,
  Crown,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useAuthStore } from "@/store/auth-store";
import { SubscriptionPlan } from "@/types";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Mock subscription status - in a real app, this would come from a subscription store
  const subscriptionPlan = SubscriptionPlan.FREE;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <View style={styles.locationContainer}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.location}>{user.location}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <Button
            title="Edit Profile"
            onPress={() => router.push("/profile/edit")}
            variant="outline"
            leftIcon={<Edit size={16} color={Colors.primary} />}
            style={styles.actionButton}
          />
          <Button
            title="Nearby"
            onPress={() => router.push("/nearby-founders")}
            variant="outline"
            leftIcon={<MapPinned size={16} color={Colors.primary} />}
            style={styles.actionButton}
          />
        </View>
        
        {subscriptionPlan === SubscriptionPlan.FREE && (
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => router.push("/subscription")}
          >
            <Crown size={16} color={Colors.card} />
            <Text style={styles.upgradeText}>Upgrade to Pro</Text>
          </TouchableOpacity>
        )}
      </View>

      {user.videoIntro && (
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Intro Video</Text>
            <Video size={18} color={Colors.primary} />
          </View>
          <TouchableOpacity 
            style={styles.videoPreview}
            onPress={() => {
              // In a real app, this would play the video
              alert("Video playback would start here");
            }}
          >
            <View style={styles.playButton}>
              <Text style={styles.playButtonText}>▶</Text>
            </View>
            <Text style={styles.videoText}>Watch my intro video</Text>
          </TouchableOpacity>
        </Card>
      )}

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Startup Idea</Text>
        <Text style={styles.text}>{user.startupIdea}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Vision</Text>
        <Text style={styles.text}>{user.vision}</Text>
      </Card>

      <Card style={styles.section}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Briefcase size={16} color={Colors.primary} />
            <Text style={styles.infoLabel}>Stage</Text>
            <Text style={styles.infoValue}>{user.stage}</Text>
          </View>
          <View style={styles.infoItem}>
            <Award size={16} color={Colors.primary} />
            <Text style={styles.infoLabel}>Funding</Text>
            <Text style={styles.infoValue}>{user.fundingStatus}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsContainer}>
          {user.skills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Looking For</Text>
        <View style={styles.skillsContainer}>
          {user.lookingFor.map((skill, index) => (
            <View key={index} style={styles.lookingForBadge}>
              <Text style={styles.lookingForText}>{skill}</Text>
            </View>
          ))}
        </View>
      </Card>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <LogOut size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: Theme.spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Theme.spacing.md,
  },
  name: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  location: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: "row",
    marginBottom: Theme.spacing.md,
  },
  actionButton: {
    marginHorizontal: Theme.spacing.xs,
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  upgradeText: {
    color: Colors.card,
    fontWeight: Theme.typography.weights.semibold as any,
    marginLeft: Theme.spacing.xs,
  },
  section: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  videoPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "10",
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  playButtonText: {
    color: Colors.card,
    fontSize: Theme.typography.sizes.md,
  },
  videoText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
  },
  bio: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  text: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  infoItem: {
    alignItems: "center",
    padding: Theme.spacing.md,
  },
  infoLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  infoValue: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillBadge: {
    backgroundColor: Colors.primary + "20",
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  skillText: {
    color: Colors.primary,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
  },
  lookingForBadge: {
    backgroundColor: Colors.secondary + "20",
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  lookingForText: {
    color: Colors.secondary,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Theme.spacing.md,
    marginVertical: Theme.spacing.xl,
  },
  logoutText: {
    color: Colors.error,
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
    marginLeft: Theme.spacing.sm,
  },
});