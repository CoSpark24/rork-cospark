import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import { UserProfile } from '@/types';

const WelcomeStep = ({ handleNext, data, updateData }: { handleNext: () => void; data: Partial<UserProfile>; updateData: (data: Partial<UserProfile>) => void }) => {
  return (
    <View style={styles.welcomeContainer}>
      {Platform.OS !== 'web' ? (
        <LottieView
          source={{ uri: 'https://assets10.lottiefiles.com/packages/lf20_vf8bnx.json' }}
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

export default WelcomeStep;

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Colors.background,
  },
  animation: {
    width: 300,
    height: 300,
    marginBottom: Theme.spacing.lg,
  },
  animationFallback: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.lg,
  },
  welcomeTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.md,
  },
  getStartedButton: {
    marginTop: Theme.spacing.md,
    width: '80%',
  },
});