import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { LoginCredentials, AuthMethod } from '@/types';

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    const credentials: LoginCredentials = {
      email,
      password,
      method: AuthMethod.EMAIL,
      name,
    };
    
    await signup(credentials);
    // If signup is successful, the auth store will handle navigation
  };

  const navigateToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.formContainer}>
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            containerStyle={styles.inputContainer}
          />

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
            placeholder="Create a password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            containerStyle={styles.inputContainer}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Sign Up"
            onPress={handleSignup}
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading || !email || !password || !name || password !== confirmPassword}
            style={styles.signupButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Button
              title="Log In"
              onPress={navigateToLogin}
              variant="text"
              style={styles.loginButton}
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
  signupButton: {
    marginTop: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.lg,
  },
  loginText: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
  },
  loginButton: {
    paddingHorizontal: Theme.spacing.sm,
  },
  errorText: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.error,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
});