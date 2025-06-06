import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseConfig';

const ONBOARDING_KEY = '@cospark/has_seen_onboarding';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
        
        if (!hasSeenOnboarding) {
          router.replace('/(auth)/welcome');
          return;
        }

        // Check auth state after confirming onboarding status
        onAuthStateChanged(auth, (user) => {
          if (user) {
            router.replace('/(tabs)');
          } else {
            router.replace('/(auth)/login');
          }
        });
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        router.replace('/(auth)/welcome');
      }
    };

    checkOnboardingStatus();
  }, []);

  return (
    <LinearGradient
      colors={['#4361EE', '#4895EF']}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});