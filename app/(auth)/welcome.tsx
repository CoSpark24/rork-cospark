import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';

const { width } = Dimensions.get('window');

const welcomeData = [
  {
    title: 'Custom Solutions',
    description: 'Creating mobile applications for any business need.',
    backgroundColor: Colors.primary,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
  },
  {
    title: 'Design Interfaces',
    description: 'Designing intuitive and engaging experiences for your brand.',
    backgroundColor: Colors.white,
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2340&auto=format&fit=crop',
  },
  {
    title: 'Smart Trading',
    description: 'Innovative tools for managing finances and market insights.',
    backgroundColor: Colors.accent,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2340&auto=format&fit=crop',
  },
];

interface WelcomeStepProps {
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

const WelcomeStep: React.FC<WelcomeStepProps> = ({
  data,
  isActive,
  onSkip,
  onNext,
  isLast,
}) => {
  if (!isActive) return null;

  return (
    <View style={[styles.stepContainer, { backgroundColor: data.backgroundColor }]}>
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
          {welcomeData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: data.backgroundColor === Colors.white ? Colors.primary : Colors.white,
                  opacity: index === welcomeData.indexOf(data) ? 1 : 0.5,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default function Welcome() {
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSkip = async () => {
    await AsyncStorage.setItem('@cospark/has_seen_onboarding', 'true');
    router.replace('/(auth)/login');
  };

  const handleNext = async () => {
    if (currentStep < welcomeData.length - 1) {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      await AsyncStorage.setItem('@cospark/has_seen_onboarding', 'true');
      router.replace('/(auth)/login');
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {welcomeData.map((step, index) => (
        <WelcomeStep
          key={index}
          data={step}
          isActive={currentStep === index}
          onSkip={handleSkip}
          onNext={handleNext}
          isLast={index === welcomeData.length - 1}
        />
      ))}
    </Animated.View>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: Theme.typography.weights.bold as any,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: Theme.typography.sizes.lg,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.lg,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Platform.OS === 'ios' ? 50 : 20,
  },
  skipButton: {
    padding: Theme.spacing.sm,
  },
  skipText: {
    fontSize: Theme.typography.sizes.md,
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.medium,
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