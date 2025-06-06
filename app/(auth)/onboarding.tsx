import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import { UserProfile } from '@/types';

interface WelcomeStepProps {
  handleNext: () => void;
  data: Partial<UserProfile>;
  updateData: (data: Partial<UserProfile>) => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ handleNext, data, updateData }) => {
  return (
    <View style={styles.welcomeContainer}>
      <Image
        source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/startup-4108329-3407649.png' }}
        style={styles.animation}
        resizeMode="contain"
      />
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