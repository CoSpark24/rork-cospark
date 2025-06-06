import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Calendar, Clock, MapPin, Users, Plus, Video, DollarSign, MessageCircle, TrendingUp } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useEventsStore } from "@/store/events-store";
import { Event } from "@/types";

export default function EventsScreen() {
  const router = useRouter();
  const { events, isLoading, error, fetchEvents, rsvpToEvent, submitQuestion } = useEventsStore();
  const [filter, setFilter] = useState<"all" | "upcoming" | "live" | "past">("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const getTimeUntilEvent = (startTime: number) => {
    const now = Date.now();
    const diff = startTime - now;
    
    if (diff < 0) return "Event started";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const isEventLive = (event: Event) => {
    const now = Date.now();
    return now >= event.startTime && now <= event.endTime;
  };

  const handleRSVP = (eventId: string) => {
    rsvpToEvent(eventId, "going");
    Alert.alert("Success", "You have successfully RSVP'd to this event!");
  };

  const handleAskQuestion = (eventId: string) => {
    Alert.prompt(
      "Ask a Question",
      "What would you like to ask during the live Q&A?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: (question) => {
            if (question?.trim()) {
              submitQuestion(eventId, question.trim());
              Alert.alert("Success", "Your question has been submitted!");
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const renderEvent = ({ item }: { item: Event }) => {
    const isLive = isEventLive(item);
    const timeUntil = getTimeUntilEvent(item.startTime);
    
    return (
      <Card style={styles.eventCard}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.eventImage} />
        )}
        
        {isLive && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
        
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <View style={styles.eventTypeBadge}>
              <Text style={styles.eventTypeText}>{item.type}</Text>
            </View>
          </View>

          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.eventDetails}>
            <View style={styles.eventDetail}>
              <Clock size={16} color={Colors.textSecondary} />
              <Text style={styles.eventDetailText}>
                {isLive ? "Live now" : timeUntil}
              </Text>
            </View>

            <View style={styles.eventDetail}>
              {item.isOnline ? (
                <Video size={16} color={Colors.textSecondary} />
              ) : (
                <MapPin size={16} color={Colors.textSecondary} />
              )}
              <Text style={styles.eventDetailText}>
                {item.isOnline ? "Online Event" : item.location}
              </Text>
            </View>

            <View style={styles.eventDetail}>
              <Users size={16} color={Colors.textSecondary} />
              <Text style={styles.eventDetailText}>
                {item.attendeeCount} attending
                {item.maxAttendees && ` / ${item.maxAttendees} max`}
              </Text>
            </View>

            {item.isTicketed && item.price && (
              <View style={styles.eventDetail}>
                <DollarSign size={16} color={Colors.secondary} />
                <Text style={[styles.eventDetailText, { color: Colors.secondary }]}>
                  {item.currency || "₹"}{item.price}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.eventActions}>
            {isLive ? (
              <>
                <Button
                  title="Join Live"
                  onPress={() => router.push(`/events/${item.id}/live`)}
                  gradient
                  style={styles.joinButton}
                />
                {item.liveQAEnabled && (
                  <Button
                    title="Ask Q&A"
                    onPress={() => handleAskQuestion(item.id)}
                    leftIcon={<MessageCircle size={16} color={Colors.primary} />}
                    variant="outline"
                    style={styles.qaButton}
                  />
                )}
              </>
            ) : (
              <>
                <Button
                  title="RSVP"
                  onPress={() => handleRSVP(item.id)}
                  variant="outline"
                  style={styles.rsvpButton}
                />
                <Button
                  title="View Details"
                  onPress={() => router.push(`/events/${item.id}`)}
                  gradient
                  style={styles.detailsButton}
                />
              </>
            )}
          </View>

          {item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Card>
    );
  };

  const filteredEvents = events.filter(event => {
    const now = Date.now();
    switch (filter) {
      case "upcoming":
        return event.startTime > now;
      case "live":
        return isEventLive(event);
      case "past":
        return event.endTime < now;
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={fetchEvents}
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Startup Events</Text>
          <Text style={styles.subtitle}>
            Join webinars, AMAs, and networking events
          </Text>
        </View>
        <Button
          title="Create"
          onPress={() => router.push("/events/create")}
          leftIcon={<Plus size={18} color={Colors.card} />}
          gradient
        />
      </View>

      <View style={styles.filterContainer}>
        {["all", "upcoming", "live", "past"].map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterType as any)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === filterType && styles.filterButtonTextActive,
              ]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Calendar size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Events Found</Text>
          <Text style={styles.emptyText}>
            {filter === "all" 
              ? "Be the first to create an event for the startup community"
              : `No ${filter} events at the moment`
            }
          </Text>
          {filter === "all" && (
            <Button
              title="Create Event"
              onPress={() => router.push("/events/create")}
              gradient
              style={styles.button}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  filterButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginRight: Theme.spacing.sm,
    backgroundColor: Colors.card,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  filterButtonTextActive: {
    color: Colors.card,
  },
  listContent: {
    padding: Theme.spacing.xl,
  },
  eventCard: {
    marginBottom: Theme.spacing.lg,
    padding: 0,
    overflow: "hidden",
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  liveIndicator: {
    position: "absolute",
    top: Theme.spacing.md,
    right: Theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.error,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.card,
    marginRight: Theme.spacing.xs,
  },
  liveText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.card,
    fontWeight: Theme.typography.weights.bold as any,
  },
  eventContent: {
    padding: Theme.spacing.md,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Theme.spacing.sm,
  },
  eventTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  eventTypeBadge: {
    backgroundColor: Colors.secondary + "20",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  eventTypeText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.secondary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  eventDescription: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  eventDetails: {
    marginBottom: Theme.spacing.md,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.xs,
  },
  eventDetailText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginLeft: Theme.spacing.sm,
  },
  eventActions: {
    flexDirection: "row",
    marginBottom: Theme.spacing.sm,
  },
  rsvpButton: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  detailsButton: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
  },
  joinButton: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  qaButton: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  tagText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
  },
  emptyText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Theme.spacing.xl,
    maxWidth: "80%",
  },
  loadingText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
  },
  errorText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.error,
    marginBottom: Theme.spacing.md,
    textAlign: "center",
  },
  button: {
    minWidth: 200,
  },
});