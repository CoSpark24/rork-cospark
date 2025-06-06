import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { MapPin, Briefcase, Target, Award } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAuthStore } from "@/store/auth-store";
import { FundingStatus, StartupStage, UserRole } from "@/types";
import { skillCategories } from "@/mocks/skills";

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateProfile, isLoading } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: UserRole.FOUNDER,
    location: "",
    startupIdea: "",
    vision: "",
    stage: StartupStage.IDEATION,
    fundingStatus: FundingStatus.BOOTSTRAPPED,
    skills: [] as string[],
    lookingFor: [] as string[],
    bio: "",
    investmentFocus: [] as string[],
    mentoringAreas: [] as string[],
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      handleChange(
        "skills",
        formData.skills.filter((s) => s !== skill)
      );
    } else {
      handleChange("skills", [...formData.skills, skill]);
    }
  };

  const toggleLookingFor = (skill: string) => {
    if (formData.lookingFor.includes(skill)) {
      handleChange(
        "lookingFor",
        formData.lookingFor.filter((s) => s !== skill)
      );
    } else {
      handleChange("lookingFor", [...formData.lookingFor, skill]);
    }
  };

  const toggleInvestmentFocus = (focus: string) => {
    if (formData.investmentFocus.includes(focus)) {
      handleChange(
        "investmentFocus",
        formData.investmentFocus.filter((f) => f !== focus)
      );
    } else {
      handleChange("investmentFocus", [...formData.investmentFocus, focus]);
    }
  };

  const toggleMentoringAreas = (area: string) => {
    if (formData.mentoringAreas.includes(area)) {
      handleChange(
        "mentoringAreas",
        formData.mentoringAreas.filter((a) => a !== area)
      );
    } else {
      handleChange("mentoringAreas", [...formData.mentoringAreas, area]);
    }
  };

  const handleNext = () => {
    if (step < totalSteps()) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    await updateProfile(formData);
    router.replace("/(tabs)");
  };

  const totalSteps = () => {
    return formData.role === UserRole.FOUNDER || formData.role === UserRole.CO_FOUNDER ? 5 : 4;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.stepTitle}>What's Your Role?</Text>
            <Text style={styles.stepDescription}>
              Select your primary role in the startup ecosystem
            </Text>
            
            <View style={styles.optionsContainer}>
              {Object.values(UserRole).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.optionButton,
                    formData.role === role && styles.selectedOption,
                  ]}
                  onPress={() => handleChange("role", role)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.role === role && styles.selectedOptionText,
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.stepTitle}>Basic Information</Text>
            <Text style={styles.stepDescription}>
              Let's start with some basic information about you
            </Text>
            
            <Input
              label="Location"
              placeholder="e.g., Bangalore, India"
              value={formData.location}
              onChangeText={(text) => handleChange("location", text)}
              leftIcon={<MapPin size={20} color={Colors.textSecondary} />}
            />
            
            {formData.role === UserRole.FOUNDER || formData.role === UserRole.CO_FOUNDER ? (
              <>
                <Input
                  label="Startup Idea"
                  placeholder="Briefly describe your startup idea"
                  value={formData.startupIdea}
                  onChangeText={(text) => handleChange("startupIdea", text)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
                
                <Input
                  label="Vision"
                  placeholder="What's your vision for this startup?"
                  value={formData.vision}
                  onChangeText={(text) => handleChange("vision", text)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </>
            ) : (
              <Input
                label="Bio"
                placeholder="Tell others about yourself"
                value={formData.bio}
                onChangeText={(text) => handleChange("bio", text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            )}
          </>
        );
      case 3:
        return (
          formData.role === UserRole.FOUNDER || formData.role === UserRole.CO_FOUNDER ? (
            <>
              <Text style={styles.stepTitle}>Startup Details</Text>
              <Text style={styles.stepDescription}>
                Tell us more about your startup's current stage
              </Text>
              
              <Text style={styles.label}>Startup Stage</Text>
              <View style={styles.optionsContainer}>
                {Object.values(StartupStage).map((stage) => (
                  <TouchableOpacity
                    key={stage}
                    style={[
                      styles.optionButton,
                      formData.stage === stage && styles.selectedOption,
                    ]}
                    onPress={() => handleChange("stage", stage)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        formData.stage === stage && styles.selectedOptionText,
                      ]}
                    >
                      {stage}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.label}>Funding Status</Text>
              <View style={styles.optionsContainer}>
                {Object.values(FundingStatus).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.optionButton,
                      formData.fundingStatus === status && styles.selectedOption,
                    ]}
                    onPress={() => handleChange("fundingStatus", status)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        formData.fundingStatus === status &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Input
                label="Bio"
                placeholder="Tell potential co-founders about yourself"
                value={formData.bio}
                onChangeText={(text) => handleChange("bio", text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </>
          ) : formData.role === UserRole.INVESTOR ? (
            <>
              <Text style={styles.stepTitle}>Investment Focus</Text>
              <Text style={styles.stepDescription}>
                What types of startups are you interested in investing in?
              </Text>
              
              <View style={styles.skillCategory}>
                <Text style={styles.categoryTitle}>Industry Focus</Text>
                <View style={styles.skillsContainer}>
                  {["Technology", "Healthcare", "FinTech", "EdTech", "Consumer", "SaaS", "AI/ML"].map((focus) => (
                    <TouchableOpacity
                      key={focus}
                      style={[
                        styles.skillButton,
                        formData.investmentFocus.includes(focus) && styles.selectedSkill,
                      ]}
                      onPress={() => toggleInvestmentFocus(focus)}
                    >
                      <Text
                        style={[
                          styles.skillText,
                          formData.investmentFocus.includes(focus) &&
                            styles.selectedSkillText,
                        ]}
                      >
                        {focus}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.stepTitle}>Mentoring Areas</Text>
              <Text style={styles.stepDescription}>
                What areas can you provide mentorship in?
              </Text>
              
              <View style={styles.skillCategory}>
                <Text style={styles.categoryTitle}>Expertise Areas</Text>
                <View style={styles.skillsContainer}>
                  {["Product Strategy", "Fundraising", "Marketing", "Technology", "Operations", "Team Building"].map((area) => (
                    <TouchableOpacity
                      key={area}
                      style={[
                        styles.skillButton,
                        formData.mentoringAreas.includes(area) && styles.selectedSkill,
                      ]}
                      onPress={() => toggleMentoringAreas(area)}
                    >
                      <Text
                        style={[
                          styles.skillText,
                          formData.mentoringAreas.includes(area) &&
                            styles.selectedSkillText,
                        ]}
                      >
                        {area}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )
        );
      case 4:
        return (
          formData.role === UserRole.FOUNDER || formData.role === UserRole.CO_FOUNDER ? (
            <>
              <Text style={styles.stepTitle}>Your Skills</Text>
              <Text style={styles.stepDescription}>
                Select the skills you bring to the table
              </Text>
              
              {skillCategories.map((category) => (
                <View key={category.name} style={styles.skillCategory}>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  <View style={styles.skillsContainer}>
                    {category.skills.map((skill) => (
                      <TouchableOpacity
                        key={skill}
                        style={[
                          styles.skillButton,
                          formData.skills.includes(skill) && styles.selectedSkill,
                        ]}
                        onPress={() => toggleSkill(skill)}
                      >
                        <Text
                          style={[
                            styles.skillText,
                            formData.skills.includes(skill) &&
                              styles.selectedSkillText,
                          ]}
                        >
                          {skill}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text style={styles.stepTitle}>Final Details</Text>
              <Text style={styles.stepDescription}>
                Any additional information you'd like to share?
              </Text>
              
              <Input
                label="Additional Info"
                placeholder="Anything else you'd like to add..."
                value={formData.bio}
                onChangeText={(text) => handleChange("bio", text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </>
          )
        );
      case 5:
        return (
          <>
            <Text style={styles.stepTitle}>Looking For</Text>
            <Text style={styles.stepDescription}>
              Select the skills you're looking for in a co-founder
            </Text>
            
            {skillCategories.map((category) => (
              <View key={category.name} style={styles.skillCategory}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <View style={styles.skillsContainer}>
                  {category.skills.map((skill) => (
                    <TouchableOpacity
                      key={skill}
                      style={[
                        styles.lookingForButton,
                        formData.lookingFor.includes(skill) &&
                          styles.selectedLookingFor,
                      ]}
                      onPress={() => toggleLookingFor(skill)}
                    >
                      <Text
                        style={[
                          styles.lookingForText,
                          formData.lookingFor.includes(skill) &&
                            styles.selectedLookingForText,
                        ]}
                      >
                        {skill}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps() }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              index < step ? styles.progressStepActive : {},
            ]}
          />
        ))}
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {renderStep()}
      </ScrollView>
      
      <View style={styles.footer}>
        {step > 1 && (
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={styles.backButton}
          />
        )}
        <Button
          title={step === totalSteps() ? "Finish" : "Next"}
          onPress={handleNext}
          loading={step === totalSteps() && isLoading}
          gradient={step === totalSteps()}
          style={styles.nextButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  progressContainer: {
    flexDirection: "row",
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.md,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.spacing.xl,
  },
  stepTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  stepDescription: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.lg,
  },
  label: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Theme.spacing.md,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    color: Colors.text,
    fontSize: Theme.typography.sizes.sm,
  },
  selectedOptionText: {
    color: Colors.card,
    fontWeight: Theme.typography.weights.medium as any,
  },
  skillCategory: {
    marginBottom: Theme.spacing.lg,
  },
  categoryTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillButton: {
    borderWidth: 1,
    borderColor: Colors.primary + "50",
    backgroundColor: Colors.primary + "10",
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  selectedSkill: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  skillText: {
    color: Colors.primary,
    fontSize: Theme.typography.sizes.sm,
  },
  selectedSkillText: {
    color: Colors.card,
    fontWeight: Theme.typography.weights.medium as any,
  },
  lookingForButton: {
    borderWidth: 1,
    borderColor: Colors.secondary + "50",
    backgroundColor: Colors.secondary + "10",
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  selectedLookingFor: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  lookingForText: {
    color: Colors.secondary,
    fontSize: Theme.typography.sizes.sm,
  },
  selectedLookingForText: {
    color: Colors.card,
    fontWeight: Theme.typography.weights.medium as any,
  },
  footer: {
    flexDirection: "row",
    padding: Theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  backButton: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  nextButton: {
    flex: 2,
    marginLeft: Theme.spacing.sm,
  },
});