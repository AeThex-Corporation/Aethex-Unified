import React, { useState } from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography, ModuleColors } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { HabitsStackParamList } from "@/navigation/HabitsStackNavigator";

const MOODS = [
  { value: 5, icon: "smile", label: "Great", color: "#22C55E" },
  { value: 4, icon: "meh", label: "Good", color: "#A78BFA" },
  { value: 3, icon: "minus", label: "Okay", color: "#F59E0B" },
  { value: 2, icon: "frown", label: "Low", color: "#FB923C" },
  { value: 1, icon: "cloud-rain", label: "Bad", color: "#EF4444" },
];

type MoodLogScreenProps = {
  navigation: NativeStackNavigationProp<HabitsStackParamList, "MoodLog">;
};

export default function MoodLogScreen({ navigation }: MoodLogScreenProps) {
  const { theme, isDark } = useTheme();
  const { addMoodEntry } = useAppStore();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (selectedMood === null) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addMoodEntry({
      mood: selectedMood,
      note: note.trim(),
    });
    navigation.goBack();
  };

  const selectedMoodData = MOODS.find(m => m.value === selectedMood);

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.header}>
        <ThemedText type="h3">How are you feeling?</ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          Take a moment to check in with yourself
        </ThemedText>
      </View>

      <View style={styles.moodGrid}>
        {MOODS.map((mood) => (
          <Pressable
            key={mood.value}
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedMood(mood.value);
            }}
            style={[
              styles.moodButton,
              {
                backgroundColor:
                  selectedMood === mood.value ? mood.color + "20" : theme.backgroundSecondary,
                borderColor: selectedMood === mood.value ? mood.color : "transparent",
                borderWidth: 2,
              },
            ]}
          >
            <Feather
              name={mood.icon as keyof typeof Feather.glyphMap}
              size={32}
              color={selectedMood === mood.value ? mood.color : theme.textSecondary}
            />
            <ThemedText
              type="small"
              style={{
                color: selectedMood === mood.value ? mood.color : theme.textSecondary,
                fontWeight: selectedMood === mood.value ? "600" : "400",
              }}
            >
              {mood.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Add a note (optional)
        </ThemedText>
        <TextInput
          style={[
            styles.textArea,
            { backgroundColor: theme.backgroundDefault, color: theme.text },
          ]}
          value={note}
          onChangeText={setNote}
          placeholder="What's on your mind?"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          multiline
          textAlignVertical="top"
        />
      </View>

      {selectedMoodData ? (
        <View style={[styles.summaryCard, { backgroundColor: selectedMoodData.color + "15" }]}>
          <Feather
            name={selectedMoodData.icon as keyof typeof Feather.glyphMap}
            size={24}
            color={selectedMoodData.color}
          />
          <View style={styles.summaryText}>
            <ThemedText type="body" style={{ color: selectedMoodData.color }}>
              Feeling {selectedMoodData.label.toLowerCase()}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </ThemedText>
          </View>
        </View>
      ) : null}

      <Button onPress={handleSave} disabled={selectedMood === null}>
        Log Mood
      </Button>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  moodGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  moodButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  field: {
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
    opacity: 0.8,
  },
  textArea: {
    height: 120,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: Typography.body.fontSize,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  summaryText: {
    gap: Spacing.xs,
  },
});
