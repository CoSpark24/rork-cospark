import React from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Button from "@/components/Button";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.primary + "20"]}
        style={styles.background}
      />
      
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🚀</Text>
        </View>
        <Text style={styles.logoText}>CoSpark</Text>
        <Text style={styles.logoSubtext}>Igniting Startup Dreams</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to the Future of Startup Building</Text>
        <Text style={styles.subtitle}>
          Connect with co-founders, create pitch decks, and build your startup community with AI-powered tools
        </Text>
        
        <View style={styles.featureContainer}>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.primary + "20" }]}>
              <Text style={styles.featureEmoji}>🧠</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>AI Matchmaking</Text>
              <Text style={styles.featureDescription}>
                Find co-founders with complementary skills and aligned vision
              </Text>
            </View>
          </View>
          
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.secondary + "20" }]}>
              <Text style={styles.featureEmoji}>🎯</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Pitch Deck Generator</Text>
              <Text style={styles.featureDescription}>
                Create professional pitch decks in minutes with AI
              </Text>
            </View>
          </View>
          
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.accent + "20" }]}>
              <Text style={styles.featureEmoji}>🌟</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Startup Community</Text>
              <Text style={styles.featureDescription}>
                Join circles, attend events, and grow with fellow founders
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => router.push("/signup")}
          variant="primary"
          gradient
          fullWidth
          size="large"
        />
        <Button
          title="Already have an account? Sign In"
          onPress={() => router.push("/login")}
          variant="text"
          fullWidth
          style={styles.loginButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.08,
    marginBottom: Theme.spacing.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary + "30",
  },
  logoEmoji: {
    fontSize: 32,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  logoSubtext: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    textAlign: "center",
    marginBottom: Theme.spacing.md,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Theme.spacing.xl,
    lineHeight: 22,
  },
  featureContainer: {
    marginTop: Theme.spacing.lg,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
    backgroundColor: Colors.card,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  featureDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xxl,
  },
  loginButton: {
    marginTop: Theme.spacing.md,
  },
});