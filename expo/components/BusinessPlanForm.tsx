import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ChevronDown, ChevronUp, Save, Wand2 } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Card from "./Card";
import Input from "./Input";
import Button from "./Button";
import { BusinessPlanData, Industry, StartupStage } from "@/types";
import { generateBusinessPlanSection } from "@/utils/ai-service";

type BusinessPlanFormProps = {
  initialData?: Partial<BusinessPlanData>;
  onSave: (data: BusinessPlanData) => void;
  isLoading?: boolean;
};

const businessPlanFields: (keyof BusinessPlanData)[] = [
  "companyName",
  "executiveSummary",
  "companyDescription",
  "marketAnalysis",
  "organizationManagement",
  "serviceProductLine",
  "marketingSales",
  "fundingRequest",
  "financialProjections",
  "appendix",
];

const fieldLabels: Record<keyof BusinessPlanData, string> = {
  companyName: "Company Name",
  executiveSummary: "Executive Summary",
  companyDescription: "Company Description",
  marketAnalysis: "Market Analysis",
  organizationManagement: "Organization & Management",
  serviceProductLine: "Service or Product Line",
  marketingSales: "Marketing & Sales",
  fundingRequest: "Funding Request",
  financialProjections: "Financial Projections",
  appendix: "Appendix",
  industry: "Industry",
  stage: "Stage",
};

const fieldDescriptions: Record<keyof BusinessPlanData, string> = {
  companyName: "The legal name of your company",
  executiveSummary: "A brief overview of your business plan",
  companyDescription: "Detailed description of your company and what it does",
  marketAnalysis: "Analysis of your target market and competition",
  organizationManagement: "Your company's organizational structure and management team",
  serviceProductLine: "Description of your products or services",
  marketingSales: "Your marketing and sales strategy",
  fundingRequest: "How much funding you need and how you'll use it",
  financialProjections: "Financial forecasts for the next 3-5 years",
  appendix: "Supporting documents and additional information",
  industry: "The industry your business operates in",
  stage: "Current stage of your startup",
};

export default function BusinessPlanForm({
  initialData,
  onSave,
  isLoading = false,
}: BusinessPlanFormProps) {
  const [formData, setFormData] = useState<BusinessPlanData>({
    companyName: "",
    executiveSummary: "",
    companyDescription: "",
    marketAnalysis: "",
    organizationManagement: "",
    serviceProductLine: "",
    marketingSales: "",
    fundingRequest: "",
    financialProjections: "",
    appendix: "",
    industry: Industry.TECHNOLOGY,
    stage: StartupStage.IDEATION,
    ...initialData,
  });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["companyName", "executiveSummary"])
  );
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);

  const toggleSection = (field: keyof BusinessPlanData) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(field)) {
        newSet.delete(field);
      } else {
        newSet.add(field);
      }
      return newSet;
    });
  };

  const updateField = (field: keyof BusinessPlanData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSection = async (field: keyof BusinessPlanData) => {
    if (!formData.companyName) {
      Alert.alert("Error", "Please enter your company name first");
      return;
    }

    setGeneratingSection(field);
    try {
      const content = await generateBusinessPlanSection(field, formData);
      updateField(field, content);
    } catch (error) {
      Alert.alert("Error", "Failed to generate content. Please try again.");
    } finally {
      setGeneratingSection(null);
    }
  };

  const handleSave = () => {
    if (!formData.companyName.trim()) {
      Alert.alert("Error", "Please enter your company name");
      return;
    }

    onSave(formData);
  };

  const renderField = (field: keyof BusinessPlanData) => {
    const isExpanded = expandedSections.has(field);
    const isGenerating = generatingSection === field;

    if (field === "industry" || field === "stage") {
      return null; // These are handled separately
    }

    return (
      <Card key={field} style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(field)}
        >
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{fieldLabels[field]}</Text>
            <Text style={styles.sectionDescription}>
              {fieldDescriptions[field]}
            </Text>
          </View>
          {isExpanded ? (
            <ChevronUp size={20} color={Colors.textSecondary} />
          ) : (
            <ChevronDown size={20} color={Colors.textSecondary} />
          )}
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.sectionContent}>
            <View style={styles.inputContainer}>
              <Input
                value={formData[field] as string}
                onChangeText={(value) => updateField(field, value)}
                placeholder={`Enter ${fieldLabels[field].toLowerCase()}...`}
                multiline
                numberOfLines={field === "companyName" ? 1 : 4}
                style={styles.input}
              />
              {field !== "companyName" && (
                <Button
                  title={isGenerating ? "Generating..." : "Generate with AI"}
                  onPress={() => generateSection(field)}
                  leftIcon={<Wand2 size={16} color={Colors.primary} />}
                  variant="outline"
                  style={styles.generateButton}
                  disabled={isGenerating || !formData.companyName}
                />
              )}
            </View>
          </View>
        )}
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Business Plan</Text>
        <Text style={styles.subtitle}>
          Create a comprehensive business plan for your startup
        </Text>
      </View>

      <Card style={styles.metadataCard}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Industry</Text>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerText}>{formData.industry}</Text>
            </View>
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Stage</Text>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerText}>{formData.stage}</Text>
            </View>
          </View>
        </View>
      </Card>

      {businessPlanFields.map((field) => renderField(field))}

      <View style={styles.footer}>
        <Button
          title="Save Business Plan"
          onPress={handleSave}
          leftIcon={<Save size={18} color={Colors.card} />}
          gradient
          style={styles.saveButton}
          disabled={isLoading}
        />
      </View>
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
    paddingBottom: Theme.spacing.lg,
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
  metadataCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: Theme.spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  pickerContainer: {
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
  },
  sectionCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
    padding: 0,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Theme.spacing.md,
    backgroundColor: Colors.card,
  },
  sectionTitleContainer: {
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  sectionDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  sectionContent: {
    padding: Theme.spacing.md,
    backgroundColor: Colors.background,
  },
  inputContainer: {
    gap: Theme.spacing.md,
  },
  input: {
    minHeight: 100,
  },
  generateButton: {
    alignSelf: "flex-start",
  },
  footer: {
    padding: Theme.spacing.xl,
  },
  saveButton: {
    width: "100%",
  },
});