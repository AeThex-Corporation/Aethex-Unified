import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
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

type QuizScreenProps = NativeStackScreenProps<StudyStackParamList, "Quiz">;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function QuizScreen({ route, navigation }: QuizScreenProps) {
  const { theme } = useTheme();
  const { topic, questions } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const currentQuestion = questions[currentIndex];
  const scale = useSharedValue(1);

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === currentQuestion.correct) {
      setScore(score + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
    }
  };

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return {
        backgroundColor: selectedAnswer === index ? ModuleColors.study + "20" : theme.backgroundDefault,
        borderColor: selectedAnswer === index ? ModuleColors.study : theme.border,
      };
    }

    if (index === currentQuestion.correct) {
      return {
        backgroundColor: theme.success + "20",
        borderColor: theme.success,
      };
    }

    if (selectedAnswer === index && index !== currentQuestion.correct) {
      return {
        backgroundColor: theme.error + "20",
        borderColor: theme.error,
      };
    }

    return {
      backgroundColor: theme.backgroundDefault,
      borderColor: theme.border,
    };
  };

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <ThemedView style={[styles.container, { paddingTop: headerHeight + Spacing.xl }]}>
        <View style={styles.completeContainer}>
          <View style={[styles.scoreCircle, { backgroundColor: ModuleColors.study + "20" }]}>
            <ThemedText type="h1" style={{ color: ModuleColors.study }}>
              {percentage}%
            </ThemedText>
          </View>
          <ThemedText type="h3">Quiz Complete!</ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
            You got {score} out of {questions.length} questions correct
          </ThemedText>
          <View style={styles.completeButtons}>
            <Button onPress={() => {
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setShowResult(false);
              setScore(0);
              setIsComplete(false);
            }}>
              Try Again
            </Button>
            <Pressable
              onPress={() => navigation.goBack()}
              style={[styles.secondaryButton, { backgroundColor: theme.backgroundDefault }]}
            >
              <ThemedText type="body">Back to Study</ThemedText>
            </Pressable>
          </View>
        </View>
        <View style={[styles.bottomPadding, { paddingBottom: insets.bottom + Spacing.xl }]} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: headerHeight + Spacing.xl }]}>
      <View style={styles.header}>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          Question {currentIndex + 1} of {questions.length}
        </ThemedText>
        <View style={[styles.scoreBadge, { backgroundColor: ModuleColors.study + "20" }]}>
          <Feather name="check-circle" size={14} color={ModuleColors.study} />
          <ThemedText type="small" style={{ color: ModuleColors.study }}>
            {score}
          </ThemedText>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: ModuleColors.study,
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            },
          ]}
        />
      </View>

      <View style={[styles.questionCard, { backgroundColor: theme.backgroundDefault }, Shadows.card]}>
        <ThemedText type="h4">{currentQuestion.question}</ThemedText>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <Pressable
            key={index}
            onPress={() => handleSelectAnswer(index)}
            disabled={showResult}
            style={[
              styles.optionButton,
              getOptionStyle(index),
              { borderWidth: 2 },
            ]}
          >
            <View style={[styles.optionIndex, { backgroundColor: theme.backgroundSecondary }]}>
              <ThemedText type="small" style={{ fontWeight: "600" }}>
                {String.fromCharCode(65 + index)}
              </ThemedText>
            </View>
            <ThemedText type="body" style={styles.optionText}>{option}</ThemedText>
            {showResult && index === currentQuestion.correct ? (
              <Feather name="check-circle" size={20} color={theme.success} />
            ) : showResult && selectedAnswer === index && index !== currentQuestion.correct ? (
              <Feather name="x-circle" size={20} color={theme.error} />
            ) : null}
          </Pressable>
        ))}
      </View>

      {showResult ? (
        <Button onPress={handleNext}>
          {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
        </Button>
      ) : null}

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
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
  questionCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  optionsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  optionIndex: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
  },
  completeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xl,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  completeButtons: {
    width: "100%",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  secondaryButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomPadding: {
    paddingTop: Spacing.xl,
  },
});
