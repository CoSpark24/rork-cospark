import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleGuestAccess = () => {
    router.push('/(tabs)');
  };

  return (
    <LinearGradient
      colors={[Colors.background, Colors.background, Colors.primaryLight + '20']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>CoSpark</Text>
        <Text style={styles.tagline}>Find your perfect co-founder</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80' }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Connect with Co-founders</Text>
        <Text style={styles.description}>
          Join thousands of founders, investors, and mentors building the future together.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Continue as Guest"
            onPress={handleGuestAccess}
            gradient
            fullWidth
            style={styles.button}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Theme.spacing.xxl,
    marginBottom: Theme.spacing.lg,
  },
  logoText: {
    fontSize: 32,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.primary,
  },
  tagline: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  image: {
    width: '90%',
    height: 250,
    borderRadius: Theme.borderRadius.xl,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  button: {
    marginBottom: Theme.spacing.sm,
  },
});