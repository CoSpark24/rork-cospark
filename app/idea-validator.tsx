import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Lightbulb, TrendingUp, Users, AlertCircle } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useIdeaValidatorStore } from "@/store/idea-validator-store";

export default function IdeaValidatorScreen() {
  const [idea, setIdea] = useState("");
  const { validations, isLoading, error, validateIdea } = useIdeaValidatorStore();
  const latestValidation = validations[0];

  const handleValidate = () => {
    if (idea.trim()) {
      validateIdea(idea.trim());
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.warning;
    return Colors.error;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Idea Validator</Text>
        <Text style={styles.subtitle}>
          Get AI-powered analysis of your startup idea
        </Text>
      </View>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>Describe Your Startup Idea</Text>
        <TextInput
          style={styles.textInput}
          value={idea}
          onChangeText={setIdea}
          placeholder="Describe your startup idea in detail. Include the problem you're solving, your solution, target market, and business model..."
          placeholderTextColor={Colors.textSecondary}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <Button
          title="Validate Idea"
          onPress={handleValidate}
          loading={isLoading}
          disabled={!idea.trim() || isLoading}
          gradient
          fullWidth
          style={styles.validateButton}
        />
      </Card>

      {error && (
        <Card style={styles.errorCard}>
          <View style={styles.errorHeader}>
            <AlertCircle size={20} color={Colors.error} />
            <Text style={styles.errorTitle}>Validation Failed</Text>
          </View>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      )}

      {isLoading && (
        <Card style={styles.loadingCard}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>
            AI is analyzing your idea...
          </Text>
        </Card>
      )}

      {latestValidation && !isLoading && (
        <View style={styles.resultsContainer}>
          <Card style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreTitle}>Viability Score</Text>
              <View 
                style={[
                  styles.scoreCircle, 
                  { borderColor: getScoreColor(latestValidation.score) }
                ]}
              >
                <Text 
                  style={[
                    styles.scoreValue, 
                    { color: getScoreColor(latestValidation.score) }
                  ]}
                >
                  {latestValidation.score}
                </Text>
              </View>
            </View>
            <Text style={styles.reasoning}>
              {latestValidation.reasoning}
            </Text>
          </Card>

          <Card style={styles.analysisCard}>
            <View style={styles.analysisSection}>
              <View style={styles.analysisSectionHeader}>
                <TrendingUp size={20} color={Colors.primary} />
                <Text style={styles.analysisSectionTitle}>Market Size</Text>
              </View>
              <Text style={styles.analysisText}>
                {latestValidation.marketSize}
              </Text>
            </View>

            <View style={styles.analysisSection}>
              <View style={styles.analysisSectionHeader}>
                <Users size={20} color={Colors.secondary} />
                <Text style={styles.analysisSectionTitle}>Competition</Text>
              </View>
              <Text style={styles.analysisText}>
                {latestValidation.competition}
              </Text>
            </View>

            <View style={styles.analysisSection}>
              <View style={styles.analysisSectionHeader}>
                <Lightbulb size={20} color={Colors.accent} />
                <Text style={styles.analysisSectionTitle}>Viability</Text>
              </View>
              <Text style={styles.analysisText}>
                {latestValidation.viability}
              </Text>
            </View>
          </Card>

          <Card style={styles.suggestionsCard}>
            <Text style={styles.suggestionsTitle}>AI Suggestions</Text>
            {latestValidation.suggestions.map((suggestion, index) => (
              <View key={index} style={styles.suggestion}>
                <Text style={styles.suggestionBullet}>•</Text>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </View>
            ))}
          </Card>
        </View>
      )}

      {validations.length > 1 && (
        <Card style={styles.historyCard}>
          <Text style={styles.historyTitle}>Previous Validations</Text>
          {validations.slice(1, 4).map((validation) => (
            <View key={validation.id} style={styles.historyItem}>
              <Text style={styles.historyIdea} numberOfLines={1}>
                {validation.idea}
              </Text>
              <View style={styles.historyScore}>
                <Text 
                  style={[
                    styles.historyScoreText,
                    { color: getScoreColor(validation.score) }
                  ]}
                >
                  {validation.score}
                </Text>
              </View>
            </View>
          ))}
        </Card>
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
  inputCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  inputLabel: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    minHeight: 120,
    marginBottom: Theme.spacing.md,
  },
  validateButton: {
    marginTop: Theme.spacing.sm,
  },
  errorCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
    backgroundColor: Colors.error + "10",
    borderColor: Colors.error,
    borderWidth: 1,
  },
  errorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  errorTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.error,
    marginLeft: Theme.spacing.sm,
  },
  errorText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.error,
  },
  loadingCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
    alignItems: "center",
    paddingVertical: Theme.spacing.xl,
  },
  loadingText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
  },
  resultsContainer: {
    marginHorizontal: Theme.spacing.xl,
  },
  scoreCard: {
    marginBottom: Theme.spacing.lg,
    alignItems: "center",
  },
  scoreHeader: {
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  scoreTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  scoreValue: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: Theme.typography.weights.bold as any,
  },
  reasoning: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    textAlign: "center",
  },
  analysisCard: {
    marginBottom: Theme.spacing.lg,
  },
  analysisSection: {
    marginBottom: Theme.spacing.lg,
  },
  analysisSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  analysisSectionTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginLeft: Theme.spacing.sm,
  },
  analysisText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  suggestionsCard: {
    marginBottom: Theme.spacing.lg,
  },
  suggestionsTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  suggestion: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Theme.spacing.sm,
  },
  suggestionBullet: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.primary,
    marginRight: Theme.spacing.sm,
    fontWeight: Theme.typography.weights.bold as any,
  },
  suggestionText: {
    flex: 1,
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  historyCard: {
    marginBottom: Theme.spacing.xl,
  },
  historyTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyIdea: {
    flex: 1,
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginRight: Theme.spacing.md,
  },
  historyScore: {
    width: 40,
    alignItems: "center",
  },
  historyScoreText: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
  },
});