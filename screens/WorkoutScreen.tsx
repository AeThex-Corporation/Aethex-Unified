import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows, ModuleColors } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { FitnessStackParamList } from "@/navigation/FitnessStackNavigator";

type WorkoutScreenProps = NativeStackScreenProps<FitnessStackParamList, "Workout">;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WorkoutScreen({ route, navigation }: WorkoutScreenProps) {
  const { theme } = useTheme();
  const { workout } = route.params;
  const { addWorkout } = useAppStore();
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

  const toggleExercise = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleCompleteWorkout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addWorkout({
      name: workout.name,
      exercises: workout.exercises.map((e, i) => ({
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        completed: completedExercises.has(i),
      })),
      duration: 25,
    });
    navigation.goBack();
  };

  const progress = (completedExercises.size / workout.exercises.length) * 100;

  return (
    <ScreenScrollView>
      <View style={[styles.header, { backgroundColor: ModuleColors.fitness }]}>
        <ThemedText type="h3" style={{ color: "#FFFFFF" }}>
          {workout.name}
        </ThemedText>
        <ThemedText type="body" style={{ color: "rgba(255,255,255,0.85)" }}>
          {workout.exercises.length} exercises
        </ThemedText>
        <View style={[styles.progressBar, { backgroundColor: "rgba(255,255,255,0.3)" }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: "#FFFFFF", width: `${progress}%` },
            ]}
          />
        </View>
        <ThemedText type="small" style={{ color: "rgba(255,255,255,0.8)" }}>
          {completedExercises.size} of {workout.exercises.length} completed
        </ThemedText>
      </View>

      <View style={styles.exercisesList}>
        {workout.exercises.map((exercise, index) => {
          const isCompleted = completedExercises.has(index);
          
          return (
            <Pressable
              key={index}
              onPress={() => toggleExercise(index)}
              style={[
                styles.exerciseCard,
                { backgroundColor: theme.backgroundDefault },
                Shadows.card,
              ]}
            >
              <View
                style={[
                  styles.exerciseNumber,
                  {
                    backgroundColor: isCompleted ? theme.success : ModuleColors.fitness + "20",
                  },
                ]}
              >
                {isCompleted ? (
                  <Feather name="check" size={16} color="#FFFFFF" />
                ) : (
                  <ThemedText type="small" style={{ color: ModuleColors.fitness, fontWeight: "600" }}>
                    {index + 1}
                  </ThemedText>
                )}
              </View>
              <View style={styles.exerciseContent}>
                <ThemedText
                  type="body"
                  style={isCompleted ? styles.completedText : undefined}
                >
                  {exercise.name}
                </ThemedText>
                <View style={styles.exerciseDetails}>
                  <View style={styles.detailItem}>
                    <Feather name="repeat" size={12} color={theme.textSecondary} />
                    <ThemedText type="small" style={{ color: theme.textSecondary }}>
                      {exercise.sets} sets
                    </ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <Feather name="hash" size={12} color={theme.textSecondary} />
                    <ThemedText type="small" style={{ color: theme.textSecondary }}>
                      {exercise.reps}
                    </ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <Feather name="clock" size={12} color={theme.textSecondary} />
                    <ThemedText type="small" style={{ color: theme.textSecondary }}>
                      {exercise.rest} rest
                    </ThemedText>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Button onPress={handleCompleteWorkout}>
        Complete Workout
      </Button>

      <View style={styles.bottomPadding} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginTop: Spacing.sm,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  exercisesList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
  },
  exerciseNumber: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseContent: {
    flex: 1,
    gap: Spacing.sm,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  exerciseDetails: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  bottomPadding: {
    height: Spacing["2xl"],
  },
});
