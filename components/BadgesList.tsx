import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import { Badge } from "@/types";

type BadgesListProps = {
  badges: Badge[];
  maxVisible?: number;
};

export default function BadgesList({ badges, maxVisible = 3 }: BadgesListProps) {
  const visibleBadges = badges.slice(0, maxVisible);
  const remainingCount = badges.length - maxVisible;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.badgesContainer}
      >
        {visibleBadges.map((badge) => (
          <View key={badge.id} style={[styles.badge, { borderColor: badge.color }]}>
            <Text style={styles.badgeIcon}>{badge.icon}</Text>
            <Text style={styles.badgeName} numberOfLines={1}>
              {badge.name}
            </Text>
          </View>
        ))}
        {remainingCount > 0 && (
          <View style={[styles.badge, styles.moreBadge]}>
            <Text style={styles.moreText}>+{remainingCount}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  badgesContainer: {
    flexDirection: "row",
  },
  badge: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    padding: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    alignItems: "center",
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  badgeIcon: {
    fontSize: 20,
    marginBottom: Theme.spacing.xs,
  },
  badgeName: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.text,
    textAlign: "center",
    fontWeight: Theme.typography.weights.medium as any,
  },
  moreBadge: {
    borderColor: Colors.border,
    justifyContent: "center",
  },
  moreText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Theme.typography.weights.medium as any,
  },
});