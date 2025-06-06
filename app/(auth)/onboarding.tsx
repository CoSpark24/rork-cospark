import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { UserRole } from '@/types';

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | string>(user?.role || UserRole.FOUNDER);
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [location, setLocation] = useState<string>(user?.location || '');
  
  const skillOptions = [
    'Software Development', 'UI/UX Design', 'Marketing', 'Sales', 
    'Business Development', 'Product Management', 'Finance', 'Operations',
    'Data Science', 'AI/ML', 'Blockchain', 'Hardware', 'Legal', 'HR'
  ];
  
  const interestOptions = [
    'SaaS', 'Fintech', 'Healthtech', 'Edtech', 'E-commerce', 'Marketplace',
    'AI/ML', 'Blockchain', 'IoT', 'Mobile Apps', 'Enterprise Software',
    'Consumer Products', 'Social Impact', 'Sustainability', 'Gaming'
  ];
  
  const roleOptions = [
    { value: UserRole.FOUNDER, label: 'Founder', description: 'I have an idea and looking for co-founders' },
    { value: UserRole.INVESTOR, label: 'Investor', description: 'I want to invest in startups' },
    { value: UserRole.MENTOR, label: 'Mentor', description: 'I want to mentor founders' }
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await updateProfile({
        role,
        skills,
        interests,
        bio,
        location,
      });
      
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      if (skills.length < 5) {
        setSkills([...skills, skill]);
      } else {
        Alert.alert('Limit Reached', 'You can select up to 5 skills.');
      }
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      if (interests.length < 5) {
        setInterests([...interests, interest]);
      } else {
        Alert.alert('Limit Reached', 'You can select up to 5 interests.');
      }
    }
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {[1, 2, 3, 4].map((s) => (
          <View
            key={s}
            style={[
              styles.stepDot,
              s === step && styles.activeStepDot,
              s < step && styles.completedStepDot,
            ]}
          >
            {s < step && <Check size={12} color={Colors.white} />}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Help us personalize your experience
        </Text>
        {renderStepIndicator()}
      </View>

      <ScrollView style={styles.content}>
        {step === 1 && (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>What best describes you?</Text>
            <Text style={styles.stepDescription}>
              This helps us match you with the right people
            </Text>

            <View style={styles.roleOptions}>
              {roleOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.roleOption,
                    role === option.value && styles.selectedRoleOption,
                  ]}
                  onPress={() => setRole(option.value)}
                >
                  <View style={styles.roleHeader}>
                    <Text style={styles.roleLabel}>{option.label}</Text>
                    {role === option.value && (
                      <View style={styles.checkmark}>
                        <Check size={16} color={Colors.white} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.roleDescription}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>Select your skills</Text>
            <Text style={styles.stepDescription}>
              Choose up to 5 skills that best represent your expertise
            </Text>

            <View style={styles.tagsContainer}>
              {skillOptions.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.tag,
                    skills.includes(skill) && styles.selectedTag,
                  ]}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      skills.includes(skill) && styles.selectedTagText,
                    ]}
                  >
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.selectedCount}>
              {skills.length}/5 skills selected
            </Text>
          </View>
        )}

        {step === 3 && (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>Select your interests</Text>
            <Text style={styles.stepDescription}>
              Choose up to 5 areas that you're interested in
            </Text>

            <View style={styles.tagsContainer}>
              {interestOptions.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.tag,
                    interests.includes(interest) && styles.selectedTag,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      interests.includes(interest) && styles.selectedTagText,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.selectedCount}>
              {interests.length}/5 interests selected
            </Text>
          </View>
        )}

        {step === 4 && (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>
            <Text style={styles.stepDescription}>
              Share a brief bio and your location
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Bio</Text>
              <TextInput
                style={styles.textArea}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about your background, experience, and what you're looking for..."
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="City, Country"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <ChevronLeft size={24} color={Colors.text} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <Button
          title={step === 4 ? "Complete" : "Next"}
          onPress={handleNext}
          gradient
          rightIcon={step < 4 ? <ChevronRight size={20} color={Colors.white} /> : undefined}
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
  header: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.lg,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepDot: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  completedStepDot: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.xl,
  },
  step: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  stepDescription: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.xl,
  },
  roleOptions: {
    gap: Theme.spacing.md,
  },
  roleOption: {
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedRoleOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  roleLabel: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleDescription: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  tag: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedTag: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
  },
  selectedTagText: {
    color: Colors.white,
  },
  selectedCount: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.sm,
  },
  inputGroup: {
    marginBottom: Theme.spacing.lg,
  },
  inputLabel: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
  },
  textArea: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    minHeight: 120,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
    marginLeft: Theme.spacing.xs,
  },
  nextButton: {
    minWidth: 120,
  },
});