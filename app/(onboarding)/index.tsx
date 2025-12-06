import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
  Extrapolate,
  runOnJS,
  FadeIn,
  FadeInUp,
  SlideInUp,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GlassCard } from "@/components/GlassCard";
import { BorderRadius, Spacing } from "@/constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  features: string[];
}

const SLIDES: OnboardingSlide[] = [
  {
    id: "welcome",
    title: "Welcome to AeThex",
    subtitle: "Your Companion for Success",
    description: "One app, two modes. Seamlessly switch between productivity and creativity.",
    icon: "compass",
    color: "#5533FF",
    features: ["Unified Platform", "Smart Adaptation", "Real Progress"],
  },
  {
    id: "day",
    title: "Day Mode",
    subtitle: "Focus & Compliance",
    description: "Track expenses, manage approvals, and stay compliant. Perfect for business hours.",
    icon: "sun",
    color: "#6366F1",
    features: ["Expense Tracking", "Approval Workflows", "Compliance Dashboard"],
  },
  {
    id: "night",
    title: "Night Mode",
    subtitle: "Create & Earn",
    description: "Find gigs, complete bounties, and grow your skills. Your creative side unlocked.",
    icon: "moon",
    color: "#22C55E",
    features: ["Gig Radar", "Skill Tree", "Guild Chat"],
  },
  {
    id: "gamification",
    title: "Level Up",
    subtitle: "Every Action Counts",
    description: "Earn XP, unlock achievements, and track your streak. Progress feels rewarding.",
    icon: "award",
    color: "#F59E0B",
    features: ["XP System", "Achievements", "Daily Quests"],
  },
];

function SlideContent({ slide, index, currentIndex }: { 
  slide: OnboardingSlide; 
  index: number;
  currentIndex: number;
}) {
  const isActive = index === currentIndex;
  const iconScale = useSharedValue(0.8);
  const featuresOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (isActive) {
      iconScale.value = withDelay(200, withSpring(1, { damping: 12 }));
      featuresOpacity.value = withDelay(400, withSpring(1));
    } else {
      iconScale.value = 0.8;
      featuresOpacity.value = 0;
    }
  }, [isActive]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const featuresStyle = useAnimatedStyle(() => ({
    opacity: featuresOpacity.value,
  }));

  return (
    <View style={[styles.slideContent, { width: SCREEN_WIDTH }]}>
      <Animated.View
        style={[
          styles.iconContainer,
          { backgroundColor: `${slide.color}20` },
          iconStyle,
        ]}
      >
        <Feather name={slide.icon} size={64} color={slide.color} />
      </Animated.View>

      <Text style={styles.slideTitle}>{slide.title}</Text>
      <Text style={[styles.slideSubtitle, { color: slide.color }]}>
        {slide.subtitle}
      </Text>
      <Text style={styles.slideDescription}>{slide.description}</Text>

      <Animated.View style={[styles.featuresList, featuresStyle]}>
        {slide.features.map((feature, i) => (
          <View key={i} style={styles.featureItem}>
            <View style={[styles.featureCheck, { backgroundColor: slide.color }]}>
              <Feather name="check" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("aethex_onboarding_complete", "true");
      await AsyncStorage.setItem("@aethex:onboarding_complete", "true");
    } catch (e) {
      console.warn("Failed to save onboarding state:", e);
    }
    setTimeout(() => {
      router.replace("/(auth)/login");
    }, 100);
  };

  const goToSlide = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    translateX.value = withSpring(-index * SCREEN_WIDTH, { damping: 20 });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    completeOnboarding();
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = -currentIndex * SCREEN_WIDTH + e.translationX;
    })
    .onEnd((e) => {
      const velocity = e.velocityX;
      const threshold = SCREEN_WIDTH / 4;

      if (e.translationX < -threshold || velocity < -500) {
        if (currentIndex < SLIDES.length - 1) {
          runOnJS(goToSlide)(currentIndex + 1);
        } else {
          translateX.value = withSpring(-currentIndex * SCREEN_WIDTH);
        }
      } else if (e.translationX > threshold || velocity > 500) {
        if (currentIndex > 0) {
          runOnJS(goToSlide)(currentIndex - 1);
        } else {
          translateX.value = withSpring(0);
        }
      } else {
        translateX.value = withSpring(-currentIndex * SCREEN_WIDTH);
      }
    });

  const slidesStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.slidesContainer, slidesStyle]}>
          {SLIDES.map((slide, index) => (
            <SlideContent
              key={slide.id}
              slide={slide}
              index={index}
              currentIndex={currentIndex}
            />
          ))}
        </Animated.View>
      </GestureDetector>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <Pressable key={index} onPress={() => goToSlide(index)}>
              <Animated.View
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === currentIndex ? "#5533FF" : "#334155",
                    width: index === currentIndex ? 24 : 8,
                  },
                ]}
              />
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          style={[styles.nextButton, { backgroundColor: SLIDES[currentIndex].color }]}
        >
          <Text style={styles.nextText}>
            {currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          </Text>
          <Feather
            name={currentIndex === SLIDES.length - 1 ? "check" : "arrow-right"}
            size={20}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020817",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  skipButton: {
    padding: Spacing.sm,
  },
  skipText: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "500",
  },
  slidesContainer: {
    flex: 1,
    flexDirection: "row",
  },
  slideContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["3xl"],
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#F8FAFC",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  slideSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  slideDescription: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing["2xl"],
  },
  featuresList: {
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  featureCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
