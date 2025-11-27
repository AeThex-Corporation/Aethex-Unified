import React, { useState } from "react";
import { StyleSheet, View, Pressable, TextInput, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows, ModuleColors, Typography } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { FitnessStackParamList } from "@/navigation/FitnessStackNavigator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

type FitnessScreenProps = {
  navigation: NativeStackNavigationProp<FitnessStackParamList, "Fitness">;
};

const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const WORKOUT_GOALS = ["Strength", "Cardio", "Flexibility", "Full Body"];

const SAMPLE_WORKOUT = {
  name: "Full Body Power",
  exercises: [
    { name: "Jumping Jacks", sets: 3, reps: "30 sec", rest: "15 sec" },
    { name: "Push-ups", sets: 3, reps: "10-15", rest: "30 sec" },
    { name: "Bodyweight Squats", sets: 3, reps: "15", rest: "30 sec" },
    { name: "Plank", sets: 3, reps: "30 sec", rest: "15 sec" },
    { name: "Lunges", sets: 3, reps: "10 each", rest: "30 sec" },
    { name: "Mountain Climbers", sets: 3, reps: "30 sec", rest: "15 sec" },
  ],
};

export default function FitnessScreen({ navigation }: FitnessScreenProps) {
  const { theme, isDark } = useTheme();
  const { state } = useAppStore();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [fitnessLevel, setFitnessLevel] = useState("Beginner");
  const [goal, setGoal] = useState("Full Body");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsGenerating(false);
    navigation.navigate("Workout", { workout: SAMPLE_WORKOUT });
  };

  const totalWorkouts = state.workouts.length;
  const totalMinutes = state.workouts.reduce((sum, w) => sum + w.duration, 0);

  return (
    <ScreenScrollView>
      <View style={[styles.statsRow, { backgroundColor: ModuleColors.fitness }]}>
        <View style={styles.statItem}>
          <Feather name="activity" size={24} color="#FFFFFF" />
          <ThemedText type="h2" style={{ color: "#FFFFFF" }}>
            {totalWorkouts}
          </ThemedText>
          <ThemedText type="small" style={{ color: "rgba(255,255,255,0.8)" }}>
            Workouts
          </ThemedText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
        <View style={styles.statItem}>
          <Feather name="clock" size={24} color="#FFFFFF" />
          <ThemedText type="h2" style={{ color: "#FFFFFF" }}>
            {totalMinutes}
          </ThemedText>
          <ThemedText type="small" style={{ color: "rgba(255,255,255,0.8)" }}>
            Minutes
          </ThemedText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
        <View style={styles.statItem}>
          <Feather name="zap" size={24} color="#FFFFFF" />
          <ThemedText type="h2" style={{ color: "#FFFFFF" }}>
            {state.streaks.fitness}
          </ThemedText>
          <ThemedText type="small" style={{ color: "rgba(255,255,255,0.8)" }}>
            Day Streak
          </ThemedText>
        </View>
      </View>

      <View style={[styles.generateCard, { backgroundColor: theme.backgroundDefault }, Shadows.card]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: ModuleColors.fitness + "20" }]}>
            <Feather name="cpu" size={24} color={ModuleColors.fitness} />
          </View>
          <View style={styles.headerText}>
            <ThemedText type="h4">AI Workout Generator</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Get a personalized workout plan
            </ThemedText>
          </View>
        </View>

        <View style={styles.field}>
          <ThemedText type="small" style={styles.label}>
            Fitness Level
          </ThemedText>
          <View style={styles.optionsRow}>
            {FITNESS_LEVELS.map((level) => (
              <Pressable
                key={level}
                onPress={() => {
                  Haptics.selectionAsync();
                  setFitnessLevel(level);
                }}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: fitnessLevel === level ? ModuleColors.fitness + "20" : theme.backgroundSecondary,
                    borderColor: fitnessLevel === level ? ModuleColors.fitness : "transparent",
                    borderWidth: 2,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{ color: fitnessLevel === level ? ModuleColors.fitness : theme.textSecondary }}
                >
                  {level}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <ThemedText type="small" style={styles.label}>
            Goal
          </ThemedText>
          <View style={styles.optionsRow}>
            {WORKOUT_GOALS.map((g) => (
              <Pressable
                key={g}
                onPress={() => {
                  Haptics.selectionAsync();
                  setGoal(g);
                }}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: goal === g ? ModuleColors.fitness + "20" : theme.backgroundSecondary,
                    borderColor: goal === g ? ModuleColors.fitness : "transparent",
                    borderWidth: 2,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{ color: goal === g ? ModuleColors.fitness : theme.textSecondary }}
                >
                  {g}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <Button onPress={handleGenerateWorkout} disabled={isGenerating}>
          {isGenerating ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <ThemedText type="body" style={{ color: "#FFFFFF" }}>
                Generating...
              </ThemedText>
            </View>
          ) : (
            "Generate Workout"
          )}
        </Button>
      </View>

      {state.workouts.length > 0 ? (
        <>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4">Recent Workouts</ThemedText>
          </View>
          <View style={styles.workoutsList}>
            {state.workouts.slice(0, 3).map((workout) => (
              <View
                key={workout.id}
                style={[styles.workoutCard, { backgroundColor: theme.backgroundDefault }, Shadows.card]}
              >
                <View style={[styles.workoutIcon, { backgroundColor: ModuleColors.fitness + "20" }]}>
                  <Feather name="activity" size={20} color={ModuleColors.fitness} />
                </View>
                <View style={styles.workoutContent}>
                  <ThemedText type="body">{workout.name}</ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {workout.exercises.length} exercises - {workout.duration} min
                  </ThemedText>
                </View>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {new Date(workout.date).toLocaleDateString()}
                </ThemedText>
              </View>
            ))}
          </View>
        </>
      ) : null}

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate("LogWorkout");
        }}
        style={[
          styles.fab,
          { backgroundColor: ModuleColors.fitness, bottom: tabBarHeight + Spacing.xl },
          Shadows.fab,
        ]}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>

      <View style={styles.bottomPadding} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
  },
  statDivider: {
    width: 1,
    marginHorizontal: Spacing.md,
  },
  generateCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    gap: Spacing.xs,
  },
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontWeight: "600",
    opacity: 0.8,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  optionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  sectionHeader: {
    marginBottom: Spacing.lg,
  },
  workoutsList: {
    gap: Spacing.md,
  },
  workoutCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
  },
  workoutIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  workoutContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  fab: {
    position: "absolute",
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomPadding: {
    height: Spacing["5xl"],
  },
});
