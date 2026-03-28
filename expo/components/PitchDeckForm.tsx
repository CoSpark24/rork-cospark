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
import { PitchDeckData, Industry, StartupStage } from "@/types";
import { generatePitchDeckSlide } from "@/utils/ai-service";

type PitchDeckFormProps = {
  initialData?: Partial<PitchDeckData>;
  onSave: (data: PitchDeckData) => void;
  isLoading?: boolean;
};

const pitchDeckFields: (keyof PitchDeckData)[] = [
  "companyName",
  "tagline",
  "problem",
  "solution",
  "marketSize",
  "businessModel",
  "competition",
  "traction",
  "team",
  "financials",
  "funding",
  "useOfFunds",
];

const fieldLabels: Record<keyof PitchDeckData, string> = {
  companyName: "Company Name",
  tagline: "Tagline",
  problem: "Problem",
  solution: "Solution",
  marketSize: "Market Size",
  businessModel: "Business Model",
  competition: "Competition",
  traction: "Traction",
  team: "Team",
  financials: "Financials",
  funding: "Funding Ask",
  useOfFunds: "Use of Funds",
  industry: "Industry",
  stage: "Stage",
};

const fieldDescriptions: Record<keyof PitchDeckData, string> = {
  companyName: "The name of your company",
  tagline: "A catchy one-liner that describes your company",
  problem: "What problem are you solving?",
  solution: "How does your product solve this problem?",
  marketSize: "How big is the market opportunity?",
  businessModel: "How do you make money?",
  competition: "Who are your competitors and how are you different?",
  traction: "What progress have you made so far?",
  team: "Who are the key team members?",
  financials: "Key financial metrics and projections",
  funding: "How much money are you raising?",
  useOfFunds: "How will you use the funding?",
  industry: "What industry are you in?",
  stage: "What stage is your startup at?",
};

export default function PitchDeckForm({
  initialData,
  onSave,
  isLoading = false,
}: PitchDeckFormProps) {
  const [formData, setFormData] = useState<PitchDeckData>({
    companyName: "",
    tagline: "",
    problem: "",
    solution: "",
    marketSize: "",
    businessModel: "",
    competition: "",
    traction: "",
    team: "",
    financials: "",
    funding: "",
    useOfFunds: "",
    industry: Industry.TECHNOLOGY,
    stage: StartupStage.IDEATION,
    ...initialData,
  });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["companyName", "tagline", "problem"])
  );
  const [generatingSlide, setGeneratingSlide] = useState<string | null>(null);

  const toggleSection = (field: keyof PitchDeckData) => {
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

  const updateField = (field: keyof PitchDeckData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlide = async (field: keyof PitchDeckData) => {
    if (!formData.companyName) {
      Alert.alert("Error", "Please enter your company name first");
      return;
    }

    setGeneratingSlide(field);
    try {
      const content = await generatePitchDeckSlide(field, formData);
      updateField(field, content);
    } catch (error) {
      Alert.alert("Error", "Failed to generate content. Please try again.");
    } finally {
      setGeneratingSlide(null);
    }
  };

  const handleSave = () => {
    if (!formData.companyName.trim()) {
      Alert.alert("Error", "Please enter your company name");
      return;
    }

    onSave(formData);
  };

  const renderField = (field: keyof PitchDeckData) => {
    const isExpanded = expandedSections.has(field);
    const isGenerating = generatingSlide === field;

    if (field === "industry" || field === "stage") {
      return null; // These are handled separately
    }

    return (
      <Card key={field} style={styles.slideCard}>
        <TouchableOpacity
          style={styles.slideHeader}
          onPress={() => toggleSection(field)}
        >
          <View style={styles.slideTitleContainer}>
            <Text style={styles.slideTitle}>{fieldLabels[field]}</Text>
            <Text style={styles.slideDescription}>
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
          <View style={styles.slideContent}>
            <View style={styles.inputContainer}>
              <Input
                value={formData[field] as string}
                onChangeText={(value) => updateField(field, value)}
                placeholder={`Enter ${fieldLabels[field].toLowerCase()}...`}
                multiline={field !== "companyName" && field !== "tagline"}
                numberOfLines={
                  field === "companyName" || field === "tagline" ? 1 : 4
                }
                style={styles.input}
              />
              {field !== "companyName" && (
                <Button
                  title={isGenerating ? "Generating..." : "Generate with AI"}
                  onPress={() => generateSlide(field)}
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
        <Text style={styles.title}>Pitch Deck</Text>
        <Text style={styles.subtitle}>
          Create a compelling pitch deck for your startup
        </Text>
      </View>

      <Card style={styles.metadataCard}>
        <Text style={styles.slideTitle}>Basic Information</Text>
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

      {pitchDeckFields.map((field) => renderField(field))}

      <View style={styles.footer}>
        <Button
          title="Save Pitch Deck"
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
  slideCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
    padding: 0,
    overflow: "hidden",
  },
  slideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Theme.spacing.md,
    backgroundColor: Colors.card,
  },
  slideTitleContainer: {
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  slideTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  slideDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
  },
  slideContent: {
    padding: Theme.spacing.md,
    backgroundColor: Colors.background,
  },
  inputContainer: {
    gap: Theme.spacing.md,
  },
  input: {
    minHeight: 80,
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