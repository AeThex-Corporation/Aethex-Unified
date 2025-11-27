import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MindfulScreen from "@/screens/MindfulScreen";
import BreathingScreen from "@/screens/BreathingScreen";
import JournalScreen from "@/screens/JournalScreen";
import JournalEntryScreen from "@/screens/JournalEntryScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type MindfulStackParamList = {
  Mindful: undefined;
  Breathing: undefined;
  Journal: undefined;
  JournalEntry: { entryId?: string };
};

const Stack = createNativeStackNavigator<MindfulStackParamList>();

export default function MindfulStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Mindful"
        component={MindfulScreen}
        options={{ headerTitle: "Mindful Moments" }}
      />
      <Stack.Screen
        name="Breathing"
        component={BreathingScreen}
        options={{ headerTitle: "Breathing" }}
      />
      <Stack.Screen
        name="Journal"
        component={JournalScreen}
        options={{ headerTitle: "Journal" }}
      />
      <Stack.Screen
        name="JournalEntry"
        component={JournalEntryScreen}
        options={{ headerTitle: "Entry" }}
      />
    </Stack.Navigator>
  );
}
