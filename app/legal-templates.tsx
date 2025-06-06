import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Scale, Download, ExternalLink, FileText, Users, Shield } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useLegalTemplatesStore } from "@/store/legal-templates-store";

export default function LegalTemplatesScreen() {
  const { templates, categories, fetchTemplates } = useLegalTemplatesStore();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Incorporation":
        return <FileText size={24} color={Colors.primary} />;
      case "Employment":
        return <Users size={24} color={Colors.secondary} />;
      case "Intellectual Property":
        return <Shield size={24} color={Colors.accent} />;
      case "Funding":
        return <Scale size={24} color={Colors.success} />;
      default:
        return <FileText size={24} color={Colors.textSecondary} />;
    }
  };

  const handleDownload = (template: any) => {
    if (template.downloadUrl) {
      Linking.openURL(template.downloadUrl);
    } else {
      // Fallback to a sample document
      Linking.openURL("https://docs.google.com/document/d/1");
    }
  };

  const handlePreview = (template: any) => {
    if (template.previewUrl) {
      Linking.openURL(template.previewUrl);
    } else {
      // Fallback to a sample document
      Linking.openURL("https://docs.google.com/document/d/1");
    }
  };

  const renderTemplate = (template: any) => (
    <Card key={template.id} style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <View style={styles.templateInfo}>
          <Text style={styles.templateTitle}>{template.title}</Text>
          <Text style={styles.templateDescription}>{template.description}</Text>
          <View style={styles.templateMeta}>
            <Text style={styles.templateType}>{template.type}</Text>
            {template.isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>PRO</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.templateActions}>
        <Button
          title="Preview"
          onPress={() => handlePreview(template)}
          leftIcon={<ExternalLink size={16} color={Colors.primary} />}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Download"
          onPress={() => handleDownload(template)}
          leftIcon={<Download size={16} color={Colors.card} />}
          gradient
          style={styles.actionButton}
        />
      </View>

      {template.keyPoints && (
        <View style={styles.keyPointsContainer}>
          <Text style={styles.keyPointsTitle}>Key Points:</Text>
          {template.keyPoints.map((point: string, index: number) => (
            <Text key={index} style={styles.keyPoint}>
              • {point}
            </Text>
          ))}
        </View>
      )}
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Legal Templates</Text>
        <Text style={styles.subtitle}>
          Essential legal documents and templates for your startup
        </Text>
      </View>

      <Card style={styles.disclaimerCard}>
        <View style={styles.disclaimerHeader}>
          <Scale size={24} color={Colors.warning} />
          <Text style={styles.disclaimerTitle}>Legal Disclaimer</Text>
        </View>
        <Text style={styles.disclaimerText}>
          These templates are for informational purposes only and do not constitute legal advice. 
          Please consult with a qualified attorney before using any legal documents.
        </Text>
      </Card>

      {categories.map((category) => (
        <View key={category} style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            {getCategoryIcon(category)}
            <Text style={styles.categoryTitle}>{category}</Text>
          </View>
          
          {templates
            .filter((template) => template.category === category)
            .map(renderTemplate)}
        </View>
      ))}

      <Card style={styles.helpCard}>
        <Text style={styles.helpTitle}>Need Legal Help?</Text>
        <Text style={styles.helpText}>
          Connect with startup-friendly lawyers in our network for personalized legal advice.
        </Text>
        <Button
          title="Find Legal Partners"
          onPress={() => Linking.openURL("https://example.com/legal-partners")}
          gradient
          style={styles.helpButton}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.textSecondary,
  },
  disclaimerCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
    backgroundColor: Colors.warning + "10",
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  disclaimerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  disclaimerTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginLeft: Theme.spacing.sm,
  },
  disclaimerText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  categorySection: {
    marginBottom: Theme.spacing.lg,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  categoryTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginLeft: Theme.spacing.sm,
  },
  templateCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  templateHeader: {
    marginBottom: Theme.spacing.md,
  },
  templateInfo: {
    flex: 1,
  },
  templateTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  templateDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  templateMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  templateType: {
    fontSize: Theme.typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  premiumBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    marginLeft: Theme.spacing.sm,
  },
  premiumText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.card,
  },
  templateActions: {
    flexDirection: "row",
    marginBottom: Theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
  keyPointsContainer: {
    backgroundColor: Colors.background,
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  keyPointsTitle: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  keyPoint: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  helpCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
    backgroundColor: Colors.primary + "10",
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    alignItems: "center",
  },
  helpTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  helpText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Theme.spacing.md,
  },
  helpButton: {
    minWidth: 200,
  },
});