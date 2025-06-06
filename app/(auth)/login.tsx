import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { LoginCredentials, AuthMethod } from '@/types';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const credentials: LoginCredentials = {
      email,
      password,
      method: AuthMethod.EMAIL,
    };
    await login(credentials);
    // If login is successful, the auth store will handle navigation via onAuthStateChanged in splash.tsx
  };

  const navigateToSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.formContainer}>
          <Input
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            containerStyle={styles.inputContainer}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Log In"
            onPress={handleLogin}
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading || !email || !password}
            style={styles.loginButton}
          />

          <Text style={styles.forgotPassword}>Forgot Password?</Text>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <Button
              title="Sign Up"
              onPress={navigateToSignup}
              variant="text"
              style={styles.signupButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: Theme.spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.primary,
    marginBottom: Theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Theme.typography.sizes.lg,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.xl,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: Theme.spacing.md,
  },
  loginButton: {
    marginTop: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  forgotPassword: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.primary,
    textAlign: 'right',
    marginTop: Theme.spacing.sm,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.lg,
  },
  signupText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
  },
  signupButton: {
    paddingHorizontal: Theme.spacing.sm,
  },
  errorText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.error,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
});