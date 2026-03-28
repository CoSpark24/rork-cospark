import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { FileText, Download, ExternalLink } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useBusinessPlanStore } from "@/store/business-plan-store";
import { generateBusinessPlan } from "@/utils/ai-service";

export default function BusinessPlanDetailScreen() {
  const { id } = useLocalSearchParams();
  const { businessPlans, setCurrentPlan, currentPlan } = useBusinessPlanStore();
  
  const [planContent, setPlanContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      setCurrentPlan(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentPlan && !planContent) {
      generatePlanContent();
    }
  }, [currentPlan]);

  const generatePlanContent = async () => {
    if (!currentPlan) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const content = await generateBusinessPlan(currentPlan);
      setPlanContent(content);
    } catch (err) {
      setError("Failed to generate business plan content. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (currentPlan?.pdfUrl) {
      Linking.openURL(currentPlan.pdfUrl);
    }
  };

  const handleOpenDoc = () => {
    if (currentPlan?.docUrl) {
      Linking.openURL(currentPlan.docUrl);
    } else {
      Linking.openURL("https://docs.google.com/document/d/1");
    }
  };

  if (!currentPlan) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading business plan...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentPlan.businessName}</Text>
        <Text style={styles.subtitle}>{currentPlan.industry}</Text>
        <Text style={styles.date}>
          Created on {new Date(currentPlan.createdAt).toLocaleDateString()}
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
          title="Open in Docs"
          onPress={handleOpenDoc}
          leftIcon={<ExternalLink size={18} color={Colors.card} />}
          gradient
          style={styles.actionButton}
        />
      </View>

      {isGenerating ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>
            Generating your business plan...
          </Text>
        </View>
      ) : error ? (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Try Again"
            onPress={generatePlanContent}
            style={styles.retryButton}
          />
        </Card>
      ) : (
        <>
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <Text style={styles.text}>{currentPlan.executiveSummary}</Text>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Business Description</Text>
            <Text style={styles.text}>{currentPlan.businessDescription}</Text>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Market Analysis</Text>
            <Text style={styles.text}>{currentPlan.marketAnalysis}</Text>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Products & Services</Text>
            <Text style={styles.text}>{currentPlan.productsServices}</Text>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Marketing Strategy</Text>
            <Text style={styles.text}>{currentPlan.marketingStrategy}</Text>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Operations Plan</Text>
            <Text style={styles.text}>{currentPlan.operationsPlan}</Text>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Projections</Text>
            <Text style={styles.text}>{currentPlan.financialProjections}</Text>
          </Card>

          {planContent && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>AI-Generated Business Plan</Text>
              <Text style={styles.planContent}>{planContent}</Text>
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
  planContent: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
});