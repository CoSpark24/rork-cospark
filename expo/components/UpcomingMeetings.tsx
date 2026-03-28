import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Calendar, Clock, Video, MapPin, Users } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "./Card";
import { Meeting } from "@/types";

type UpcomingMeetingsProps = {
  meetings: Meeting[];
  onMeetingPress?: (meeting: Meeting) => void;
};

export default function UpcomingMeetings({ meetings, onMeetingPress }: UpcomingMeetingsProps) {
  if (meetings.length === 0) {
    return null;
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Calendar size={20} color={Colors.primary} />
        <Text style={styles.title}>Upcoming Meetings</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {meetings.map((meeting) => (
          <TouchableOpacity
            key={meeting.id}
            style={styles.meetingCard}
            onPress={() => onMeetingPress?.(meeting)}
          >
            <View style={styles.meetingHeader}>
              <Text style={styles.meetingTitle} numberOfLines={1}>
                {meeting.title}
              </Text>
              <View style={styles.meetingType}>
                {meeting.type === "video" ? (
                  <Video size={14} color={Colors.primary} />
                ) : meeting.type === "in-person" ? (
                  <MapPin size={14} color={Colors.secondary} />
                ) : (
                  <Users size={14} color={Colors.accent} />
                )}
              </View>
            </View>

            <View style={styles.meetingDetails}>
              <View style={styles.meetingDetail}>
                <Clock size={12} color={Colors.textSecondary} />
                <Text style={styles.meetingDetailText}>
                  {formatDate(meeting.startTime)} at {formatTime(meeting.startTime)}
                </Text>
              </View>

              <Text style={styles.participantName} numberOfLines={1}>
                {meeting.participants[0]?.name || "Unknown"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginLeft: Theme.spacing.sm,
  },
  meetingCard: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginRight: Theme.spacing.md,
    width: 200,
    ...Theme.shadows.small,
  },
  meetingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Theme.spacing.sm,
  },
  meetingTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  meetingType: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  meetingDetails: {
    gap: Theme.spacing.xs,
  },
  meetingDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  meetingDetailText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  participantName: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
    fontWeight: Theme.typography.weights.medium as any,
  },
});