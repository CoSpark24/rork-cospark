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
  const remainingCount = badges.length > maxVisible ? badges.length - maxVisible : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.badgesContainer}
      >
        {visibleBadges.map((badge) => (
          <View key={badge.id} style={[styles.badge, { borderColor: badge.color ?? Colors.border }]}>
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
    marginVertical: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  badgesContainer: {
    paddingRight: Theme.spacing.md,
  },
  badge: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: Theme.borderRadius.full,
    padding: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    minWidth: 80,
    ...Theme.shadows.small,
  },
  badgeIcon: {
    fontSize: 20,
    marginBottom: Theme.spacing.xs,
  },
  badgeName: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    textAlign: "center",
  },
  moreBadge: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
    justifyContent: "center",
  },
  moreText: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.white,
  },
});