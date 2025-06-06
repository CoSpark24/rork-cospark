import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Button from "@/components/Button";
import { OnboardingSlide } from "@/types";

const { width, height } = Dimensions.get("window");

const slides: OnboardingSlide[] = [
  {
    id: "1",
    title: "AI-Powered Co-Founder Matching",
    description: "Our intelligent AI analyzes your skills, experience, and vision to find the perfect co-founder who complements your strengths and shares your passion",
    animation: "🧠",
    backgroundColor: Colors.primary,
  },
  {
    id: "2",
    title: "Smart Pitch Deck Creation",
    description: "Create investor-ready pitch decks in minutes using AI-driven insights, industry templates, and real-time feedback to maximize your funding potential",
    animation: "📈",
    backgroundColor: Colors.secondary,
  },
  {
    id: "3",
    title: "Build Your Startup Network",
    description: "Connect with experienced mentors, active investors, and fellow founders to build a powerful ecosystem that accelerates your startup journey",
    animation: "🤝",
    backgroundColor: Colors.accent,
  },
  {
    id: "4",
    title: "Validate Your Ideas with AI",
    description: "Get instant, data-driven feedback on your startup ideas with our AI validation engine that analyzes market potential and competitive landscape",
    animation: "💡",
    backgroundColor: Colors.primary,
  },
  {
    id: "5",
    title: "Crowdfunding & Investment Tools",
    description: "Launch successful campaigns and connect with the right investors using our comprehensive funding toolkit and investor matching platform",
    animation: "💰",
    backgroundColor: Colors.secondary,
  },
];

export default function OnboardingSlidesScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex !== currentIndex) {
      setCurrentIndex(slideIndex);
      animateSlideChange();
    }
  };

  const animateSlideChange = () => {
    // Complex animation sequence for smooth transitions
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous pulse animation for emoji
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  };

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      router.replace("/onboarding");
    }
  };

  const skip = () => {
    router.replace("/onboarding");
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => {
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View key={slide.id} style={[styles.slide, { width }]}>
        <LinearGradient
          colors={[slide.backgroundColor, slide.backgroundColor + "CC", slide.backgroundColor + "99"]}
          style={styles.slideBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <Animated.View
          style={[
            styles.slideContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateX: slideAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.animationContainer,
              {
                transform: [
                  { scale: pulseAnim },
                  { rotate: spin },
                ],
              },
            ]}
          >
            <View style={styles.emojiContainer}>
              <Text style={styles.animationEmoji}>{slide.animation}</Text>
            </View>
            <View style={styles.glowEffect} />
          </Animated.View>
          
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideDescription}>{slide.description}</Text>
          
          {/* Feature highlights */}
          <View style={styles.featuresContainer}>
            {getFeatureHighlights(index).map((feature, idx) => (
              <Animated.View
                key={idx}
                style={[
                  styles.featureItem,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [-30, 0],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>{feature}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </View>
    );
  };

  const getFeatureHighlights = (slideIndex: number) => {
    const features = [
      ["Skills & Experience Analysis", "Industry Compatibility", "Vision Alignment"],
      ["AI-Powered Templates", "Real-time Feedback", "Investor-Ready Format"],
      ["Mentor Connections", "Investor Network", "Founder Community"],
      ["Market Analysis", "Competitive Intelligence", "Success Probability"],
      ["Campaign Management", "Investor Matching", "Funding Analytics"],
    ];
    return features[slideIndex] || [];
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map(renderSlide)}
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
                {
                  transform: [
                    {
                      scale: index === currentIndex ? pulseAnim : 1,
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
        
        <Button
          title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          onPress={goToNext}
          variant="primary"
          fullWidth
          style={styles.nextButton}
        />
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${((currentIndex + 1) / slides.length) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} of {slides.length}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: Theme.spacing.xl,
    zIndex: 10,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: Theme.borderRadius.md,
  },
  skipText: {
    color: Colors.card,
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium as any,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slideBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  slideContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.xl,
  },
  animationContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.xxl,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
    position: "relative",
  },
  emojiContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  glowEffect: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    top: -10,
    left: -10,
  },
  animationEmoji: {
    fontSize: 90,
  },
  slideTitle: {
    fontSize: Theme.typography.sizes.xxxl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.card,
    textAlign: "center",
    marginBottom: Theme.spacing.lg,
    lineHeight: 42,
  },
  slideDescription: {
    fontSize: Theme.typography.sizes.lg,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: Theme.spacing.xl,
  },
  featuresContainer: {
    alignItems: "flex-start",
    gap: Theme.spacing.sm,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  featureText: {
    fontSize: Theme.typography.sizes.sm,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: Theme.typography.weights.medium as any,
  },
  footer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xxl,
    paddingTop: Theme.spacing.lg,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Theme.spacing.xl,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.card,
    width: 24,
  },
  nextButton: {
    backgroundColor: Colors.card,
    marginBottom: Theme.spacing.md,
  },
  progressContainer: {
    alignItems: "center",
    gap: Theme.spacing.sm,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.card,
    borderRadius: 2,
  },
  progressText: {
    fontSize: Theme.typography.sizes.sm,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: Theme.typography.weights.medium as any,
  },
});