import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { 
  Users, 
  FileText, 
  Zap, 
  MapPin, 
  MessageSquare, 
  Bot, 
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  Lightbulb,
  UserPlus
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import StatsCard from "@/components/StatsCard";
import Button from "@/components/Button";
import GrowthScoreCard from "@/components/GrowthScoreCard";
import BadgesList from "@/components/BadgesList";
import UpcomingMeetings from "@/components/UpcomingMeetings";
import { useAuthStore } from "@/store/auth-store";
import { useMatchesStore } from "@/store/matches-store";
import { usePitchDeckStore } from "@/store/pitch-deck-store";
import { useMessagingStore } from "@/store/messaging-store";
import { useEventsStore } from "@/store/events-store";
import { useMeetingsStore } from "@/store/meetings-store";

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { potentialMatches, connections, fetchMatches } = useMatchesStore();
  const { pitchDecks, fetchPitchDecks } = usePitchDeckStore();
  const { conversations, fetchConversations } = useMessagingStore();
  const { events, fetchEvents } = useEventsStore();
  const { meetings, fetchMeetings, getUpcomingMeetings } = useMeetingsStore();

  useEffect(() => {
    fetchMatches();
    fetchPitchDecks();
    fetchConversations();
    fetchEvents();
    fetchMeetings();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Calculate unread messages count
  const unreadMessages = conversations.reduce(
    (count, conv) => count + conv.unreadCount,
    0
  );

  // Get upcoming events (next 3)
  const upcomingEvents = events
    .filter(event => event.startDate > Date.now())
    .sort((a, b) => a.startDate - b.startDate)
    .slice(0, 3);

  // Get upcoming meetings
  const upcomingMeetings = getUpcomingMeetings().slice(0, 3);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user.name.split(" ")[0]}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.textSecondary} />
            <Text style={styles.location}>{user.location || "Unknown Location"}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.streakContainer}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.streakNumber}>{user.stats?.streakDays || 0}</Text>
          <Text style={styles.streakLabel}>🔥 Day Streak</Text>
        </TouchableOpacity>
      </View>

      {user.badges && user.badges.length > 0 && (
        <View style={styles.badgesSection}>
          <BadgesList badges={user.badges} maxVisible={4} />
        </View>
      )}

      <View style={styles.statsContainer}>
        <StatsCard
          title="Profile Views"
          value={user.stats?.profileViews || 0}
          icon={<Users size={24} color={Colors.primary} />}
          color={Colors.primary}
        />
        <StatsCard
          title="Connections"
          value={connections.length}
          icon={<Zap size={24} color={Colors.secondary} />}
          color={Colors.secondary}
        />
        <StatsCard
          title="Pitch Decks"
          value={pitchDecks.length}
          icon={<FileText size={24} color={Colors.accent} />}
          color={Colors.accent}
        />
      </View>

      {user.stats && (
        <GrowthScoreCard
          score={user.stats.growthScore || 0}
          // Temporary fix: Summing weekly activity array to pass a single number
          // This assumes GrowthScoreCard expects a number for weeklyActivity
          // Update GrowthScoreCard prop type to accept number[] if it's meant to be an array
          weeklyActivity={user.stats.weeklyActivity?.reduce((a, b) => a + b, 0) || 0}
          streakDays={user.stats.streakDays || 0}
        />
      )}

      {upcomingMeetings.length > 0 && (
        <UpcomingMeetings
          meetings={upcomingMeetings}
          onMeetingPress={(meeting) => {
            // Navigate to meeting details or open meeting URL
            console.log("Meeting pressed:", meeting.title);
          }}
        />
      )}

      <Card style={styles.actionCard}>
        <Text style={styles.actionTitle}>Find Your Co-Founder</Text>
        <Text style={styles.actionDescription}>
          We have found {potentialMatches.length} potential co-founders that match your profile
        </Text>
        <Button
          title="Start Matching"
          onPress={() => router.push("/match")}
          gradient
          style={styles.actionButton}
        />
      </Card>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push("/circles")}
          >
            <UserPlus size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Join Circles</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push("/events")}
          >
            <Calendar size={24} color={Colors.secondary} />
            <Text style={styles.quickActionText}>Events</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push("/crowdfunding")}
          >
            <DollarSign size={24} color={Colors.accent} />
            <Text style={styles.quickActionText}>Crowdfunding</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push("/investors")}
          >
            <TrendingUp size={24} color={Colors.success} />
            <Text style={styles.quickActionText}>Investors</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push("/milestones")}
          >
            <Target size={24} color={Colors.warning} />
            <Text style={styles.quickActionText}>Milestones</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push("/idea-validator")}
          >
            <Lightbulb size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Validate Idea</Text>
          </TouchableOpacity>
        </View>
      </View>

      {upcomingEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {upcomingEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => router.push(`/events/${event.id}`)}
              >
                <Text style={styles.eventTitle} numberOfLines={2}>
                  {event.title}
                </Text>
                <Text style={styles.eventDate}>
                  {new Date(event.startDate).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
                <View style={styles.eventTypeBadge}>
                  <Text style={styles.eventTypeText}>{event.type || "General"}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <Card style={styles.actionCard}>
        <Text style={styles.actionTitle}>Ask AI Mentor</Text>
        <Text style={styles.actionDescription}>
          Get personalized advice on your startup journey
        </Text>
        <Button
          title="Chat with AI"
          onPress={() => router.push("/ai-mentor")}
          leftIcon={<Bot size={18} color={Colors.primary} />}
          variant="outline"
          style={styles.actionButton}
        />
      </Card>

      {unreadMessages > 0 && (
        <Card style={styles.notificationCard}>
          <View style={styles.notificationIcon}>
            <MessageSquare size={24} color={Colors.card} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>
              You have {unreadMessages} unread message{unreadMessages > 1 ? 's' : ''}
            </Text>
            <Text style={styles.notificationDescription}>
              Check your messages to respond to your connections
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationAction}
            onPress={() => router.push("/messages")}
          >
            <Text style={styles.notificationActionText}>View</Text>
          </TouchableOpacity>
        </Card>
      )}

      {connections.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Connections</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {connections.map((connection) => (
              <TouchableOpacity
                key={connection.id}
                style={styles.connectionCard}
                onPress={() => {
                  const conversationId = useMessagingStore.getState().startConversation(connection.id);
                  router.push(`/conversation/${conversationId}`);
                }}
              >
                <View style={styles.connectionHeader}>
                  <Text style={styles.connectionName}>{connection.name}</Text>
                  <Text style={styles.connectionMatch}>
                    {connection.matchScore || 0}% Match
                  </Text>
                </View>
                <Text style={styles.connectionSkills}>
                  {connection.skills.slice(0, 2).join(", ")}
                  {connection.skills.length > 2 ? "..." : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  greeting: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Theme.spacing.xs,
  },
  location: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  streakContainer: {
    alignItems: "center",
    backgroundColor: Colors.primary + "10",
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
  },
  streakNumber: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.primary,
  },
  streakLabel: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  badgesSection: {
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  actionCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  actionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  actionDescription: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  actionButton: {
    alignSelf: "flex-start",
  },
  quickActions: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    alignItems: "center",
    width: "48%",
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  quickActionText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    marginTop: Theme.spacing.sm,
    textAlign: "center",
  },
  notificationCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "10",
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  notificationDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  notificationAction: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  notificationActionText: {
    color: Colors.primary,
    fontWeight: Theme.typography.weights.semibold as any,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  eventCard: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginLeft: Theme.spacing.xl,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    width: 180,
    ...Theme.shadows.small,
  },
  eventTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  eventDate: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  eventTypeBadge: {
    backgroundColor: Colors.secondary + "20",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    alignSelf: "flex-start",
  },
  eventTypeText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.secondary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  connectionCard: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginLeft: Theme.spacing.xl,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    width: 200,
    ...Theme.shadows.small,
  },
  connectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.xs,
  },
  connectionName: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  connectionMatch: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.success,
    fontWeight: Theme.typography.weights.medium as any,
  },
  connectionSkills: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
});