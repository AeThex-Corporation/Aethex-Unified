import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StudyScreen from "@/screens/StudyScreen";
import FlashcardsScreen from "@/screens/FlashcardsScreen";
import QuizScreen from "@/screens/QuizScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type StudyStackParamList = {
  Study: undefined;
  Flashcards: { topic: string; cards: Array<{ question: string; answer: string }> };
  Quiz: { topic: string; questions: Array<{ question: string; options: string[]; correct: number }> };
};

const Stack = createNativeStackNavigator<StudyStackParamList>();

export default function StudyStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Study"
        component={StudyScreen}
        options={{ headerTitle: "AI Study Buddy" }}
      />
      <Stack.Screen
        name="Flashcards"
        component={FlashcardsScreen}
        options={{ headerTitle: "Flashcards" }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ headerTitle: "Quiz" }}
      />
    </Stack.Navigator>
  );
}
