import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography, ModuleColors } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { MindfulStackParamList } from "@/navigation/MindfulStackNavigator";

type JournalEntryScreenProps = NativeStackScreenProps<MindfulStackParamList, "JournalEntry">;

const MOODS = ["peaceful", "grateful", "hopeful", "reflective", "inspired", "anxious", "sad"];

export default function JournalEntryScreen({ route, navigation }: JournalEntryScreenProps) {
  const { theme, isDark } = useTheme();
  const { state, addJournalEntry } = useAppStore();
  const { entryId } = route.params;

  const existingEntry = entryId ? state.journalEntries.find((e) => e.id === entryId) : null;

  const [title, setTitle] = useState(existingEntry?.title || "");
  const [content, setContent] = useState(existingEntry?.content || "");
  const [mood, setMood] = useState(existingEntry?.mood || "");

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addJournalEntry({
      title: title.trim(),
      content: content.trim(),
      mood,
    });
    navigation.goBack();
  };

  const isValid = title.trim() && content.trim();
  const isViewMode = !!existingEntry;

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Title
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.backgroundDefault, color: theme.text },
          ]}
          value={title}
          onChangeText={setTitle}
          placeholder="Give your entry a title..."
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          editable={!isViewMode}
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          How are you feeling?
        </ThemedText>
        <View style={styles.moodGrid}>
          {MOODS.map((m) => (
            <Pressable
              key={m}
              onPress={() => {
                if (!isViewMode) {
                  Haptics.selectionAsync();
                  setMood(mood === m ? "" : m);
                }
              }}
              disabled={isViewMode}
              style={[
                styles.moodButton,
                {
                  backgroundColor: mood === m ? ModuleColors.mindful + "20" : theme.backgroundSecondary,
                  borderColor: mood === m ? ModuleColors.mindful : "transparent",
                  borderWidth: 2,
                },
              ]}
            >
              <ThemedText
                type="small"
                style={{
                  color: mood === m ? ModuleColors.mindful : theme.textSecondary,
                  textTransform: "capitalize",
                }}
              >
                {m}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Your thoughts
        </ThemedText>
        <TextInput
          style={[
            styles.textArea,
            { backgroundColor: theme.backgroundDefault, color: theme.text },
          ]}
          value={content}
          onChangeText={setContent}
          placeholder="Write freely... what's on your mind?"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          multiline
          textAlignVertical="top"
          editable={!isViewMode}
        />
      </View>

      {!isViewMode ? (
        <Button onPress={handleSave} disabled={!isValid}>
          Save Entry
        </Button>
      ) : (
        <View style={[styles.dateCard, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="calendar" size={16} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Written on {new Date(existingEntry.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </ThemedText>
        </View>
      )}
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
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  moodButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  textArea: {
    height: 200,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: Typography.body.fontSize,
  },
  dateCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
});
