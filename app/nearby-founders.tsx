import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import { MapPin } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { MatchProfile } from "@/types";
import { matchProfiles } from "@/mocks/users";

interface FounderItem extends MatchProfile {
  distance: number;
}

export default function NearbyFoundersScreen() {
  const [nearbyFounders, setNearbyFounders] = useState<FounderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNearbyFounders();
  }, []);

  const fetchNearbyFounders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock nearby founders with distances
      const foundersWithDistance: FounderItem[] = matchProfiles
        .filter(profile => profile.location.includes("Bangalore"))
        .map(profile => ({
          ...profile,
          distance: Math.floor(Math.random() * 20) + 1, // Random distance 1-20km
        }))
        .sort((a, b) => a.distance - b.distance);
      
      setNearbyFounders(foundersWithDistance);
    } catch (err) {
      setError("Failed to load nearby founders");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFounderItem = ({ item }: { item: FounderItem }) => (
    <Card style={styles.founderCard}>
      <View style={styles.founderHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.distance}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.distanceText}>{item.distance}km away</Text>
        </View>
      </View>
      <Text style={styles.bio} numberOfLines={2}>
        {item.bio}
      </Text>
      <View style={styles.skillsContainer}>
        {item.skills.slice(0, 3).map((skill: string, index: number) => (
          <View key={index} style={styles.skillBadge}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.matchScore}>
        {item.matchScore}% Match
      </Text>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Finding nearby founders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={fetchNearbyFounders}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Founders</Text>
        <Text style={styles.subtitle}>
          Connect with co-founders in your area
        </Text>
      </View>

      {nearbyFounders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MapPin size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Nearby Founders</Text>
          <Text style={styles.emptyText}>
            We could not find any founders in your immediate area. Try expanding your search or check back later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={nearbyFounders}
          renderItem={renderFounderItem}
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
  listContent: {
    padding: Theme.spacing.xl,
  },
  founderCard: {
    marginBottom: Theme.spacing.md,
  },
  founderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  name: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  distance: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  bio: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Theme.spacing.sm,
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
  },
  matchScore: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.success,
    fontWeight: Theme.typography.weights.semibold as any,
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
  retryButton: {
    minWidth: 200,
  },
});