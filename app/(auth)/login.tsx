import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const handleGuestLogin = async () => {
    // Simple guest login without credentials
    await login({
      email: 'guest@example.com',
      password: 'guest123',
      method: 'guest'
    });
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to CoSpark</Text>
        <Text style={styles.subtitle}>
          Continue as a guest to explore the app
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Continue as Guest"
          onPress={handleGuestLogin}
          fullWidth
          gradient
          style={styles.button}
        />
        
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Theme.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: Theme.spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: Theme.spacing.lg,
  },
  button: {
    marginBottom: Theme.spacing.md,
  },
  backButton: {
    alignItems: 'center',
    padding: Theme.spacing.sm,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
  },
});