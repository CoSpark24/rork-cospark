import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { FileText, Download, ExternalLink } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { usePitchDeckStore } from "@/store/pitch-deck-store";
import { generatePitchDeck } from "@/utils/ai-service";

export default function PitchDeckDetailScreen() {
  const { id } = useLocalSearchParams();
  const { pitchDecks, setCurrentDeck, currentDeck } = usePitchDeckStore();
  
  const [deckContent, setDeckContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      setCurrentDeck(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentDeck && !deckContent) {
      generateDeckContent();
    }
  }, [currentDeck]);

  const generateDeckContent = async () => {
    if (!currentDeck) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const content = await generatePitchDeck(currentDeck);
      setDeckContent(content);
    } catch (err) {
      setError("Failed to generate pitch deck content. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    // In a real app, this would download the PDF
    if (currentDeck?.pdfUrl) {
      Linking.openURL(currentDeck.pdfUrl);
    }
  };

  const handleOpenSlides = () => {
    // In a real app, this would open the Google Slides or Canva link
    if (currentDeck?.slidesUrl) {
      Linking.openURL(currentDeck.slidesUrl);
    } else {
      // Fallback to a sample URL
      Linking.openURL("https://docs.google.com/presentation/d/1");
    }
  };

  if (!currentDeck) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading pitch deck...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentDeck.startupName}</Text>
        <Text style={styles.subtitle}>{currentDeck.industry}</Text>
        <Text style={styles.date}>
          Created on {new Date(currentDeck.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Download PDF"
          onPress={handleDownload}
          leftIcon={<Download size={18} color={Colors.primary} />}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Open in Slides"
          onPress={handleOpenSlides}
          leftIcon={<ExternalLink size={18} color={Colors.card} />}
          gradient
          style={styles.actionButton}
        />
      </View>

      {isGenerating ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>
            Generating your pitch deck content...
          </Text>
        </View>
      ) : error ? (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Try Again"
            onPress={generateDeckContent}
            style={styles.retryButton}
          />
        </Card>
      ) : (
        <>
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Problem</Text>
            <Text style={styles.text}>{currentDeck.problem}</Text>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Solution</Text>
            <Text style={styles.text}>{currentDeck.solution}</Text>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Business Model</Text>
            <Text style={styles.text}>{currentDeck.businessModel}</Text>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Market</Text>
            <Text style={styles.text}>{currentDeck.market}</Text>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Team</Text>
            <Text style={styles.text}>{currentDeck.team}</Text>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Traction</Text>
            <Text style={styles.text}>{currentDeck.traction}</Text>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Funding Needs</Text>
            <Text style={styles.text}>{currentDeck.fundingNeeds}</Text>
          </Card>

          {deckContent && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>AI-Generated Pitch Deck</Text>
              <Text style={styles.deckContent}>{deckContent}</Text>
            </Card>
          )}
        </>
      )}
    </ScrollView>
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
    padding: Theme.spacing.xl,
    paddingBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.primary,
    marginBottom: Theme.spacing.sm,
  },
  date: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xl,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
  section: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  text: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  loadingContainer: {
    padding: Theme.spacing.xl,
    alignItems: "center",
  },
  loadingText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
    textAlign: "center",
  },
  errorCard: {
    marginHorizontal: Theme.spacing.xl,
    marginVertical: Theme.spacing.xl,
    alignItems: "center",
  },
  errorText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.error,
    marginBottom: Theme.spacing.md,
    textAlign: "center",
  },
  retryButton: {
    minWidth: 120,
  },
  deckContent: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    lineHeight: 22,
    whiteSpace: Platform.OS === "web" ? "pre-wrap" as any : undefined,
  },
});