import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { UserProfile } from '@/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Custom Solutions',
    description: 'Creating mobile applications for any business need.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    backgroundColor: Colors.primary,
  },
  {
    title: 'Design Interfaces',
    description: 'Designing intuitive and engaging experiences for your brand.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    backgroundColor: Colors.white,
  },
  {
    title: 'Smart Trading',
    description: 'Innovative tools for managing finances and market insights.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    backgroundColor: Colors.accent,
  },
];

interface OnboardingStepProps {
  data: {
    title: string;
    description: string;
    image: string;
    backgroundColor: string;
  };
  isActive: boolean;
  onSkip: () => void;
  onNext: () => void;
  isLast: boolean;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  data,
  isActive,
  onSkip,
  onNext,
  isLast,
}) => {
  if (!isActive) return null;

  return (
    <View style={[styles.stepContainer, { backgroundColor: data.backgroundColor }]}>
      <Image
        source={{ uri: data.image }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.contentContainer}>
        <Text style={[
          styles.title,
          { color: data.backgroundColor === Colors.white ? Colors.primary : Colors.white }
        ]}>
          {data.title}
        </Text>
        <Text style={[
          styles.description,
          { color: data.backgroundColor === Colors.white ? Colors.textSecondary : Colors.white }
        ]}>
          {data.description}
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={[
            styles.skipText,
            { color: data.backgroundColor === Colors.white ? Colors.textSecondary : Colors.white }
          ]}>
            Skip
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onNext}
          style={[
            styles.nextButton,
            {
              backgroundColor: data.backgroundColor === Colors.white ? Colors.primary : Colors.white,
            },
          ]}
        >
          {isLast ? (
            <Check size={24} color={data.backgroundColor === Colors.white ? Colors.white : Colors.primary} />
          ) : (
            <ChevronRight size={24} color={data.backgroundColor === Colors.white ? Colors.white : Colors.primary} />
          )}
        </TouchableOpacity>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: data.backgroundColor === Colors.white ? Colors.primary : Colors.white,
                  opacity: index === onboardingData.indexOf(data) ? 1 : 0.5,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const handleNext = async () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await updateProfile({ hasCompletedOnboarding: true } as Partial<UserProfile>);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      {onboardingData.map((step, index) => (
        <OnboardingStep
          key={index}
          data={step}
          isActive={currentStep === index}
          onSkip={handleSkip}
          onNext={handleNext}
          isLast={index === onboardingData.length - 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginTop: Theme.spacing.xl,
  },
  contentContainer: {
    alignItems: 'center',
    marginVertical: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: Theme.typography.sizes.md,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Theme.spacing.md,
  },
  skipButton: {
    padding: Theme.spacing.sm,
  },
  skipText: {
    fontSize: Theme.typography.sizes.md,
  },
  nextButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});