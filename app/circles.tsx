import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Users, Plus, Lock, Hash } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useCirclesStore } from "@/store/circles-store";
import { FounderCircle } from "@/types";

export default function CirclesScreen() {
  const router = useRouter();
  const { circles, isLoading, error, fetchCircles, joinCircle } = useCirclesStore();

  useEffect(() => {
    fetchCircles();
  }, []);

  const renderCircle = ({ item }: { item: FounderCircle }) => (
    <TouchableOpacity
      onPress={() => router.push(`/circles/${item.id}`)}
    >
      <Card style={styles.circleCard}>
        <View style={styles.circleHeader}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.circleAvatar} />
          ) : (
            <View style={styles.circleAvatarPlaceholder}>
              <Hash size={24} color={Colors.textSecondary} />
            </View>
          )}
          <View style={styles.circleInfo}>
            <View style={styles.circleTitleRow}>
              <Text style={styles.circleName}>{item.name}</Text>
              {item.isPrivate && (
                <Lock size={16} color={Colors.textSecondary} />
              )}
            </View>
            <Text style={styles.memberCount}>
              {item.memberCount} members
            </Text>
          </View>
        </View>

        <Text style={styles.circleDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        <Button
          title={item.isPrivate ? "Request to Join" : "Join Circle"}
          onPress={() => joinCircle(item.id)}
          variant="outline"
          style={styles.joinButton}
        />
      </Card>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading circles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={fetchCircles}
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Founder Circles</Text>
          <Text style={styles.subtitle}>
            Join communities of like-minded founders
          </Text>
        </View>
        <Button
          title="Create"
          onPress={() => router.push("/circles/create")}
          leftIcon={<Plus size={18} color={Colors.card} />}
          gradient
        />
      </View>

      {circles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Users size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Circles Yet</Text>
          <Text style={styles.emptyText}>
            Be the first to create a founder circle and build your community
          </Text>
          <Button
            title="Create Circle"
            onPress={() => router.push("/circles/create")}
            gradient
            style={styles.button}
          />
        </View>
      ) : (
        <FlatList
          data={circles}
          renderItem={renderCircle}
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
  listContent: {
    padding: Theme.spacing.xl,
  },
  circleCard: {
    marginBottom: Theme.spacing.lg,
  },
  circleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  circleAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Theme.spacing.md,
  },
  circleAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  circleInfo: {
    flex: 1,
  },
  circleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  circleName: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginRight: Theme.spacing.sm,
  },
  memberCount: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  circleDescription: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Theme.spacing.md,
  },
  tag: {
    backgroundColor: Colors.secondary + "20",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  tagText: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.secondary,
  },
  joinButton: {
    alignSelf: "flex-start",
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