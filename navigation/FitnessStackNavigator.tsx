import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FitnessScreen from "@/screens/FitnessScreen";
import WorkoutScreen from "@/screens/WorkoutScreen";
import LogWorkoutScreen from "@/screens/LogWorkoutScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type FitnessStackParamList = {
  Fitness: undefined;
  Workout: { workout: { name: string; exercises: Array<{ name: string; sets: number; reps: string; rest: string }> } };
  LogWorkout: undefined;
};

const Stack = createNativeStackNavigator<FitnessStackParamList>();

export default function FitnessStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Fitness"
        component={FitnessScreen}
        options={{ headerTitle: "Fitness" }}
      />
      <Stack.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{ headerTitle: "Workout" }}
      />
      <Stack.Screen
        name="LogWorkout"
        component={LogWorkoutScreen}
        options={{ headerTitle: "Log Workout" }}
      />
    </Stack.Navigator>
  );
}
