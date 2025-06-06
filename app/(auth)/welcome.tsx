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

const { width } = Dimensions.get('window');

// Updated colors to match the screenshot exactly
const Colors = {
  primary: '#4361EE',
  white: '#FFFFFF',
  accent: '#F4A261',
};

const welcomeData = [
  {
    title: 'Custom\nSolutions',
    description: 'Creating mobile applications for\nany business need.',
    backgroundColor: Colors.primary,
  },
  {
    title: 'Design\nInterfaces',
    description: 'Designing intuitive and engaging\nexperiences for your brand.',
    backgroundColor: Colors.white,
  },
  {
    title: 'Smart\nTrading',
    description: 'Innovative tools for managing\nfinances and market insights.',
    backgroundColor: Colors.accent,
  },
];

interface WelcomeStepProps {
  data: {
    title: string;
    description: string;
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
          { color: data.backgroundColor === Colors.white ? Colors.primary : Colors.white }
        ]}>
          {data.description}
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={[
            styles.skipText,
            { color: data.backgroundColor === Colors.white ? Colors.primary : Colors.white }
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
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 48,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: Platform.OS === 'ios' ? 50 : 20,
  },
  skipButton: {
    padding: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});