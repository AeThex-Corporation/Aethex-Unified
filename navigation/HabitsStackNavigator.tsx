import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HabitsScreen from "@/screens/HabitsScreen";
import AddHabitScreen from "@/screens/AddHabitScreen";
import MoodLogScreen from "@/screens/MoodLogScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type HabitsStackParamList = {
  Habits: undefined;
  AddHabit: undefined;
  MoodLog: undefined;
};

const Stack = createNativeStackNavigator<HabitsStackParamList>();

export default function HabitsStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Habits"
        component={HabitsScreen}
        options={{ headerTitle: "Habits & Mood" }}
      />
      <Stack.Screen
        name="AddHabit"
        component={AddHabitScreen}
        options={{ headerTitle: "New Habit" }}
      />
      <Stack.Screen
        name="MoodLog"
        component={MoodLogScreen}
        options={{ headerTitle: "Log Mood" }}
      />
    </Stack.Navigator>
  );
}
