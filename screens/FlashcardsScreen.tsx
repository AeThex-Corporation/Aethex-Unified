import React, { useState } from "react";
import { StyleSheet, View, Pressable, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows, ModuleColors } from "@/constants/theme";
import { StudyStackParamList } from "@/navigation/StudyStackNavigator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";

const { width } = Dimensions.get("window");

type FlashcardsScreenProps = NativeStackScreenProps<StudyStackParamList, "Flashcards">;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FlashcardsScreen({ route, navigation }: FlashcardsScreenProps) {
  const { theme } = useTheme();
  const { topic, cards } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipProgress = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFlipped(!isFlipped);
    flipProgress.value = withSpring(isFlipped ? 0 : 1, { damping: 15, stiffness: 100 });
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipProgress.value = 0;
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      flipProgress.value = 0;
    }
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [0, 180], Extrapolation.CLAMP);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity: interpolate(flipProgress.value, [0, 0.5, 1], [1, 0, 0], Extrapolation.CLAMP),
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [180, 360], Extrapolation.CLAMP);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity: interpolate(flipProgress.value, [0, 0.5, 1], [0, 0, 1], Extrapolation.CLAMP),
    };
  });

  return (
    <ThemedView style={[styles.container, { paddingTop: headerHeight + Spacing.xl }]}>
      <View style={styles.header}>
        <ThemedText type="h4">{topic}</ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          Card {currentIndex + 1} of {cards.length}
        </ThemedText>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: ModuleColors.study,
              width: `${((currentIndex + 1) / cards.length) * 100}%`,
            },
          ]}
        />
      </View>

      <View style={styles.cardContainer}>
        <AnimatedPressable onPress={handleFlip} style={[styles.card, frontAnimatedStyle]}>
          <View style={[styles.cardInner, { backgroundColor: theme.backgroundDefault }, Shadows.cardHover]}>
            <ThemedText type="small" style={{ color: ModuleColors.study }}>
              QUESTION
            </ThemedText>
            <ThemedText type="h3" style={styles.cardText}>
              {currentCard.question}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Tap to reveal answer
            </ThemedText>
          </View>
        </AnimatedPressable>

        <AnimatedPressable onPress={handleFlip} style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <View style={[styles.cardInner, { backgroundColor: ModuleColors.study }, Shadows.cardHover]}>
            <ThemedText type="small" style={{ color: "rgba(255,255,255,0.8)" }}>
              ANSWER
            </ThemedText>
            <ThemedText type="h3" style={[styles.cardText, { color: "#FFFFFF" }]}>
              {currentCard.answer}
            </ThemedText>
            <ThemedText type="small" style={{ color: "rgba(255,255,255,0.7)" }}>
              Tap to see question
            </ThemedText>
          </View>
        </AnimatedPressable>
      </View>

      <View style={styles.navigation}>
        <Pressable
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          style={[
            styles.navButton,
            { backgroundColor: theme.backgroundDefault, opacity: currentIndex === 0 ? 0.5 : 1 },
          ]}
        >
          <Feather name="chevron-left" size={24} color={theme.text} />
        </Pressable>

        <Pressable
          onPress={handleFlip}
          style={[styles.flipButton, { backgroundColor: ModuleColors.study }]}
        >
          <Feather name="refresh-cw" size={20} color="#FFFFFF" />
          <ThemedText type="body" style={{ color: "#FFFFFF" }}>
            Flip
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={handleNext}
          disabled={currentIndex === cards.length - 1}
          style={[
            styles.navButton,
            { backgroundColor: theme.backgroundDefault, opacity: currentIndex === cards.length - 1 ? 0.5 : 1 },
          ]}
        >
          <Feather name="chevron-right" size={24} color={theme.text} />
        </Pressable>
      </View>

      <View style={[styles.bottomPadding, { paddingBottom: insets.bottom + Spacing.xl }]} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderRadius: 2,
    marginBottom: Spacing.xl,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: width - Spacing.xl * 2,
    height: 300,
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    position: "absolute",
  },
  cardInner: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
  },
  cardText: {
    textAlign: "center",
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
    marginTop: Spacing.xl,
  },
  navButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  bottomPadding: {
    paddingTop: Spacing.xl,
  },
});
