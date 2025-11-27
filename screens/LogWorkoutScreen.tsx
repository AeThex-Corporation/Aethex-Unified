import React, { useState } from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography, ModuleColors, Shadows } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { FitnessStackParamList } from "@/navigation/FitnessStackNavigator";

type LogWorkoutScreenProps = {
  navigation: NativeStackNavigationProp<FitnessStackParamList, "LogWorkout">;
};

interface ExerciseInput {
  name: string;
  sets: string;
  reps: string;
}

export default function LogWorkoutScreen({ navigation }: LogWorkoutScreenProps) {
  const { theme, isDark } = useTheme();
  const { addWorkout } = useAppStore();
  const [workoutName, setWorkoutName] = useState("");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState<ExerciseInput[]>([
    { name: "", sets: "", reps: "" },
  ]);

  const addExercise = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExercises([...exercises, { name: "", sets: "", reps: "" }]);
  };

  const updateExercise = (index: number, field: keyof ExerciseInput, value: string) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!workoutName.trim() || !duration) return;
    
    const validExercises = exercises.filter((e) => e.name.trim());
    if (validExercises.length === 0) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addWorkout({
      name: workoutName.trim(),
      exercises: validExercises.map((e) => ({
        name: e.name.trim(),
        sets: parseInt(e.sets) || 1,
        reps: e.reps || "10",
        completed: true,
      })),
      duration: parseInt(duration) || 30,
    });
    navigation.goBack();
  };

  const isValid = workoutName.trim() && duration && exercises.some((e) => e.name.trim());

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Workout Name
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.backgroundDefault, color: theme.text },
          ]}
          value={workoutName}
          onChangeText={setWorkoutName}
          placeholder="e.g., Morning Cardio"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Duration (minutes)
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.backgroundDefault, color: theme.text },
          ]}
          value={duration}
          onChangeText={setDuration}
          placeholder="30"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.exercisesSection}>
        <View style={styles.exercisesHeader}>
          <ThemedText type="h4">Exercises</ThemedText>
          <Pressable
            onPress={addExercise}
            style={[styles.addButton, { backgroundColor: ModuleColors.fitness }]}
          >
            <Feather name="plus" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        {exercises.map((exercise, index) => (
          <View
            key={index}
            style={[styles.exerciseCard, { backgroundColor: theme.backgroundDefault }, Shadows.card]}
          >
            <View style={styles.exerciseHeader}>
              <ThemedText type="small" style={{ color: ModuleColors.fitness, fontWeight: "600" }}>
                Exercise {index + 1}
              </ThemedText>
              {exercises.length > 1 ? (
                <Pressable onPress={() => removeExercise(index)}>
                  <Feather name="x" size={18} color={theme.error} />
                </Pressable>
              ) : null}
            </View>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.backgroundSecondary, color: theme.text },
              ]}
              value={exercise.name}
              onChangeText={(v) => updateExercise(index, "name", v)}
              placeholder="Exercise name"
              placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
            />
            <View style={styles.exerciseRow}>
              <View style={styles.exerciseField}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Sets
                </ThemedText>
                <TextInput
                  style={[
                    styles.smallInput,
                    { backgroundColor: theme.backgroundSecondary, color: theme.text },
                  ]}
                  value={exercise.sets}
                  onChangeText={(v) => updateExercise(index, "sets", v)}
                  placeholder="3"
                  placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.exerciseField}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Reps
                </ThemedText>
                <TextInput
                  style={[
                    styles.smallInput,
                    { backgroundColor: theme.backgroundSecondary, color: theme.text },
                  ]}
                  value={exercise.reps}
                  onChangeText={(v) => updateExercise(index, "reps", v)}
                  placeholder="10"
                  placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      <Button onPress={handleSave} disabled={!isValid}>
        Log Workout
      </Button>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
    opacity: 0.8,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.body.fontSize,
  },
  exercisesSection: {
    marginBottom: Spacing.xl,
  },
  exercisesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  exerciseField: {
    flex: 1,
    gap: Spacing.xs,
  },
  smallInput: {
    height: 44,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.body.fontSize,
  },
});
