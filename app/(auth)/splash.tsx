import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const animateSequence = () => {
      // Logo animation
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Tagline animation after logo
        Animated.parallel([
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(taglineTranslateY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Navigate to onboarding after animations
          setTimeout(() => {
            router.replace("/onboarding-slides");
          }, 1500);
        });
      });
    };

    animateSequence();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.background}
      />
      
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🚀</Text>
          </View>
          <Text style={styles.logoText}>CoSpark</Text>
        </Animated.View>
        
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslateY }],
            },
          ]}
        >
          <Text style={styles.tagline}>
            Igniting Startup Dreams
          </Text>
          <Text style={styles.subTagline}>
            AI-Powered Co-founder Matching
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Theme.spacing.xl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoIcon: {
    fontSize: 48,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "800",
    color: Colors.card,
    letterSpacing: 2,
  },
  taglineContainer: {
    alignItems: "center",
  },
  tagline: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.card,
    textAlign: "center",
    marginBottom: Theme.spacing.sm,
  },
  subTagline: {
    fontSize: Theme.typography.sizes.md,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
});