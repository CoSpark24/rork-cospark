import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { FileText, Plus } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { usePitchDeckStore } from "@/store/pitch-deck-store";
import { PitchDeck } from "@/types";

export default function PitchDecksScreen() {
  const router = useRouter();
  const { pitchDecks, isLoading, error, fetchPitchDecks } = usePitchDeckStore();

  useEffect(() => {
    fetchPitchDecks();
  }, []);

  const renderPitchDeck = ({ item }: { item: PitchDeck }) => (
    <TouchableOpacity
      onPress={() => router.push(`/pitch-deck/${item.id}`)}
    >
      <Card style={styles.deckCard}>
        <View style={styles.deckHeader}>
          <Text style={styles.deckName}>{item.title}</Text>
          <Text style={styles.deckDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.deckIndustry}>{item.tags?.join(", ") || "No tags"}</Text>
        <Text style={styles.deckDescription} numberOfLines={2}>
          {item.description || "No description available"}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading pitch decks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={fetchPitchDecks}
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pitch Decks</Text>
          <Text style={styles.subtitle}>
            Create and manage your startup pitch decks
          </Text>
        </View>
        <Button
          title="Create"
          onPress={() => router.push("/pitch-deck/create")}
          leftIcon={<Plus size={18} color={Colors.card} />}
          gradient
        />
      </View>

      {pitchDecks && pitchDecks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FileText size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Pitch Decks Yet</Text>
          <Text style={styles.emptyText}>
            Create your first pitch deck to showcase your startup to potential
            investors
          </Text>
          <Button
            title="Create Pitch Deck"
            onPress={() => router.push("/pitch-deck/create")}
            gradient
            style={styles.button}
          />
        </View>
      ) : (
        <FlatList
          data={pitchDecks || []}
          renderItem={renderPitchDeck}
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
  deckCard: {
    marginBottom: Theme.spacing.md,
  },
  deckHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.xs,
  },
  deckName: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  deckDate: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.textSecondary,
  },
  deckIndustry: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.primary,
    marginBottom: Theme.spacing.sm,
  },
  deckDescription: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
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