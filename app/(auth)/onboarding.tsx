import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Animated, FlatList, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuthStore } from '@/store/auth-store';
import { UserProfile, UserRole } from '@/types';

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [step, setStep] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

  // Onboarding data for the user profile
  const [onboardingData, setOnboardingData] = useState<Partial<UserProfile>>({
    name: user?.name || '',
    role: UserRole.FOUNDER,
    bio: '',
    location: '',
    skills: [],
    interests: [],
  });

  const steps = [
    { id: 0, title: 'Welcome', component: WelcomeStep },
    { id: 1, title: 'Personal Details', component: PersonalDetailsStep },
    { id: 2, title: 'Startup Info', component: StartupInfoStep },
    { id: 3, title: 'Goals', component: GoalsStep },
    { id: 4, title: 'Skills', component: SkillsStep },
    { id: 5, title: 'Video Intro', component: VideoIntroStep },
  ];

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      Animated.timing(animation, {
        toValue: -(step + 1) * 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Update profile with onboarding data
      await updateProfile(onboardingData);
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      Animated.timing(animation, {
        toValue: -(step - 1) * 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const updateOnboardingData = (data: Partial<UserProfile>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const renderStep = ({ item }: { item: typeof steps[0] }) => {
    const StepComponent = item.component;
    return (
      <View style={styles.stepContainer}>
        <StepComponent
          data={onboardingData}
          updateData={updateOnboardingData}
          handleNext={handleNext}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {steps.map((s, index) => (
          <View
            key={s.id}
            style={[
              styles.progressDot,
              index <= step ? styles.progressDotActive : null,
            ]}
          />
        ))}
      </View>

      <FlatList
        data={steps}
        renderItem={renderStep}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.flatList}
        initialScrollIndex={step}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
      />

      <View style={styles.navigationContainer}>
        {step > 0 && (
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={styles.backButton}
          />
        )}
        <Button
          title={step === steps.length - 1 ? 'Finish' : 'Next'}
          onPress={handleNext}
          variant="primary"
          style={styles.nextButton}
        />
      </View>
    </View>
  );
}

const WelcomeStep = ({ handleNext }: { handleNext: () => void; data: Partial<UserProfile>; updateData: (data: Partial<UserProfile>) => void }) => {
  return (
    <View style={styles.welcomeContainer}>
      {Platform.OS !== 'web' ? (
        <LottieView
          source={require('../../assets/lottie/welcome-animation.json')} // Updated to relative path
          autoPlay
          loop
          style={styles.animation}
        />
      ) : (
        <Text style={styles.animationFallback}>Welcome Animation</Text>
      )}
      <Text style={styles.welcomeTitle}>Welcome to CoSpark</Text>
      <Text style={styles.welcomeSubtitle}>
        Find your perfect co-founder and build your dream startup.
      </Text>
      <Button
        title="Get Started"
        onPress={handleNext}
        variant="primary"
        style={styles.getStartedButton}
      />
    </View>
  );
};

const PersonalDetailsStep = ({ data, updateData }: { data: Partial<UserProfile>; updateData: (data: Partial<UserProfile>) => void; handleNext: () => void }) => {
  return (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Personal Details</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <Input
        label="Name"
        placeholder="Enter your full name"
        value={data.name || ''}
        onChangeText={text => updateData({ name: text })}
        containerStyle={styles.input}
      />
      <Input
        label="Location"
        placeholder="Where are you based?"
        value={data.location || ''}
        onChangeText={text => updateData({ location: text })}
        containerStyle={styles.input}
      />
      <Input
        label="Bio"
        placeholder="A short bio about yourself"
        multiline
        numberOfLines={4}
        value={data.bio || ''}
        onChangeText={text => updateData({ bio: text })}
        containerStyle={styles.input}
      />
    </ScrollView>
  );
};

const StartupInfoStep = ({ data, updateData }: { data: Partial<UserProfile>; updateData: (data: Partial<UserProfile>) => void; handleNext: () => void }) => {
  return (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Startup Info</Text>
      <Text style={styles.stepSubtitle}>What are you working on?</Text>

      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Your Role</Text>
        <View style={styles.roleButtons}>
          {Object.values(UserRole).map(role => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleButton,
                data.role === role && styles.roleButtonActive,
              ]}
              onPress={() => updateData({ role })}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  data.role === role && styles.roleButtonTextActive,
                ]}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const GoalsStep = ({ data, updateData }: { data: Partial<UserProfile>; updateData: (data: Partial<UserProfile>) => void; handleNext: () => void }) => {
  const interests = ['Tech', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Social Impact'];
  const toggleInterest = (interest: string) => {
    const currentInterests = data.interests || [];
    if (currentInterests.includes(interest)) {
      updateData({ interests: currentInterests.filter(i => i !== interest) });
    } else {
      updateData({ interests: [...currentInterests, interest] });
    }
  };

  return (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Your Goals</Text>
      <Text style={styles.stepSubtitle}>What are you looking to achieve?</Text>

      <Text style={styles.sectionLabel}>Interests</Text>
      <View style={styles.interestsContainer}>
        {interests.map(interest => (
          <TouchableOpacity
            key={interest}
            style={[
              styles.interestPill,
              data.interests?.includes(interest) && styles.interestPillActive,
            ]}
            onPress={() => toggleInterest(interest)}
          >
            <Text
              style={[
                styles.interestText,
                data.interests?.includes(interest) && styles.interestTextActive,
              ]}
            >
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const SkillsStep = ({ data, updateData }: { data: Partial<UserProfile>; updateData: (data: Partial<UserProfile>) => void; handleNext: () => void }) => {
  const skills = ['Product Management', 'Marketing', 'Development', 'Design', 'Finance', 'Operations'];
  const toggleSkill = (skill: string) => {
    const currentSkills = data.skills || [];
    if (currentSkills.includes(skill)) {
      updateData({ skills: currentSkills.filter(s => s !== skill) });
    } else {
      updateData({ skills: [...currentSkills, skill] });
    }
  };

  return (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Skills</Text>
      <Text style={styles.stepSubtitle}>What skills do you bring?</Text>

      <Text style={styles.sectionLabel}>Your Skills</Text>
      <View style={styles.skillsContainer}>
        {skills.map(skill => (
          <TouchableOpacity
            key={skill}
            style={[
              styles.skillPill,
              data.skills?.includes(skill) && styles.skillPillActive,
            ]}
            onPress={() => toggleSkill(skill)}
          >
            <Text
              style={[
                styles.skillText,
                data.skills?.includes(skill) && styles.skillTextActive,
              ]}
            >
              {skill}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const VideoIntroStep = ({ handleNext }: { data: Partial<UserProfile>; updateData: (data: Partial<UserProfile>) => void; handleNext: () => void }) => {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Video Intro</Text>
      <Text style={styles.stepSubtitle}>Record a short intro about yourself (60 sec max)</Text>

      <View style={styles.videoContainer}>
        <Text style={styles.videoPlaceholder}>Video recording feature</Text>
      </View>

      <View style={styles.videoButtons}>
        <Button
          title="Record"
          onPress={() => alert('Video recording not implemented yet')}
          variant="outline"
          style={styles.recordButton}
        />
        <Button
          title="Upload"
          onPress={() => alert('Video upload not implemented yet')}
          variant="outline"
          style={styles.uploadButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Theme.spacing.xl,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray['300'],
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  flatList: {
    flex: 1,
  },
  stepContainer: {
    width: Platform.OS === 'web' ? '100%' : 375, // Approximate iPhone width for consistency
    padding: Theme.spacing.lg,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.primary,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  input: {
    marginBottom: Theme.spacing.md,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
  },
  backButton: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  nextButton: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  animation: {
    width: 300,
    height: 300,
    marginBottom: Theme.spacing.lg,
  },
  animationFallback: {
    width: 300,
    height: 300,
    marginBottom: Theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray['200'],
    borderRadius: Theme.borderRadius.md,
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
  },
  welcomeTitle: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.primary,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: Theme.typography.sizes.lg,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.xl,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.md,
  },
  getStartedButton: {
    width: '80%',
    paddingVertical: Theme.spacing.md,
  },
  roleContainer: {
    marginBottom: Theme.spacing.lg,
  },
  roleLabel: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleButton: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
    width: '48%',
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  roleButtonText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.text,
  },
  roleButtonTextActive: {
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  sectionLabel: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interestPill: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.full,
    marginBottom: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
  },
  interestPillActive: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondaryLight,
  },
  interestText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
  },
  interestTextActive: {
    color: Colors.secondary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skillPill: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.full,
    marginBottom: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
  },
  skillPillActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  skillText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.text,
  },
  skillTextActive: {
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  videoContainer: {
    height: 200,
    backgroundColor: Colors.gray['200'],
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  videoPlaceholder: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
  },
  videoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordButton: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  uploadButton: {
    flex: 1,
  },
});