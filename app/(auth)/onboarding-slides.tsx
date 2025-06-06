import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  ColorValue,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, Users, Rocket, Briefcase, Target } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import Button from '@/components/Button';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: [string, string] | [string, string, string]; // Fixed type to match LinearGradient requirements
}

export default function OnboardingSlides() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: 'Find Your Co-founder',
      description: 'Connect with like-minded founders based on skills, interests, and vision. Our AI matching algorithm helps you find the perfect partner for your startup journey.',
      icon: <Users size={80} color={Colors.white} />,
      gradient: [Colors.primary, Colors.primaryLight],
    },
    {
      id: '2',
      title: 'Build Your Startup',
      description: 'Access powerful tools to develop your idea, create pitch decks, and validate your business model. Get guidance at every step of your startup journey.',
      icon: <Rocket size={80} color={Colors.white} />,
      gradient: [Colors.secondary, Colors.secondaryLight],
    },
    {
      id: '3',
      title: 'Connect with Investors',
      description: 'Showcase your startup to our network of investors. Get funding opportunities and mentorship to take your business to the next level.',
      icon: <Briefcase size={80} color={Colors.white} />,
      gradient: [Colors.accent, Colors.accentLight],
    },
    {
      id: '4',
      title: 'Achieve Your Goals',
      description: 'Track your progress, celebrate milestones, and grow your startup with our supportive community of founders, investors, and mentors.',
      icon: <Target size={80} color={Colors.white} />,
      gradient: [Colors.primary, Colors.secondary],
    },
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace('/signup');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    router.replace('/signup');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={styles.slideContainer}>
        <LinearGradient
          colors={item.gradient}
          style={styles.iconContainer}
        >
          {item.icon}
        </LinearGradient>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { width: dotWidth, opacity },
                currentIndex === index && styles.activeDot,
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipButton}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      />

      {renderDots()}

      <View style={styles.footer}>
        {currentIndex > 0 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePrev}
          >
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        )}

        <Button
          title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          gradient
          rightIcon={currentIndex < slides.length - 1 ? <ChevronRight size={20} color={Colors.white} /> : undefined}
          style={styles.nextButton}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: Theme.spacing.lg,
  },
  skipButton: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.primary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  slideContainer: {
    width,
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Theme.spacing.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Theme.spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xl,
  },
  navButton: {
    padding: Theme.spacing.sm,
    marginRight: Theme.spacing.md,
  },
  nextButton: {
    flex: 1,
    maxWidth: 200,
  },
});