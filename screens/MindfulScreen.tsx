import React, { useState } from "react";
import { StyleSheet, View, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows, ModuleColors } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { MindfulStackParamList } from "@/navigation/MindfulStackNavigator";

type MindfulScreenProps = {
  navigation: NativeStackNavigationProp<MindfulStackParamList, "Mindful">;
};

const GRATITUDE_PROMPTS = [
  "What made you smile today?",
  "Who are you grateful for?",
  "What simple pleasure did you enjoy?",
  "What challenge helped you grow?",
  "What beauty did you notice today?",
];

export default function MindfulScreen({ navigation }: MindfulScreenProps) {
  const { theme, isDark } = useTheme();
  const { state, addGratitudeEntry } = useAppStore();
  const [gratitudeText, setGratitudeText] = useState("");

  const todayPrompt = GRATITUDE_PROMPTS[new Date().getDay() % GRATITUDE_PROMPTS.length];

  const handleSaveGratitude = () => {
    if (!gratitudeText.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addGratitudeEntry(gratitudeText.trim());
    setGratitudeText("");
  };

  return (
    <ScreenScrollView>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate("Breathing");
        }}
        style={({ pressed }) => [
          styles.breathingCard,
          { backgroundColor: ModuleColors.mindful, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <View style={styles.breathingContent}>
          <View style={styles.breathingIcon}>
            <Feather name="wind" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.breathingText}>
            <ThemedText type="h3" style={{ color: "#FFFFFF" }}>
              Breathing Exercise
            </ThemedText>
            <ThemedText type="body" style={{ color: "rgba(255,255,255,0.85)" }}>
              Take a moment to center yourself
            </ThemedText>
          </View>
        </View>
        <View style={styles.breathingArrow}>
          <Feather name="arrow-right" size={24} color="#FFFFFF" />
        </View>
      </Pressable>

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Daily Gratitude</ThemedText>
      </View>

      <View style={[styles.gratitudeCard, { backgroundColor: theme.backgroundDefault }, Shadows.card]}>
        <ThemedText type="small" style={{ color: ModuleColors.mindful, fontWeight: "600" }}>
          TODAY'S PROMPT
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          {todayPrompt}
        </ThemedText>
        <TextInput
          style={[
            styles.gratitudeInput,
            { backgroundColor: theme.backgroundSecondary, color: theme.text },
          ]}
          value={gratitudeText}
          onChangeText={setGratitudeText}
          placeholder="Write what you're grateful for..."
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          multiline
          textAlignVertical="top"
        />
        <Button onPress={handleSaveGratitude} disabled={!gratitudeText.trim()}>
          Save Entry
        </Button>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Journal</ThemedText>
        <Pressable
          onPress={() => navigation.navigate("Journal")}
          style={styles.viewAllButton}
        >
          <ThemedText type="small" style={{ color: theme.primary }}>
            View all
          </ThemedText>
          <Feather name="chevron-right" size={14} color={theme.primary} />
        </Pressable>
      </View>

      <Pressable
        onPress={() => navigation.navigate("JournalEntry", {})}
        style={({ pressed }) => [
          styles.newJournalCard,
          { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
          Shadows.card,
        ]}
      >
        <View style={[styles.journalIcon, { backgroundColor: ModuleColors.journal + "20" }]}>
          <Feather name="edit-3" size={22} color={ModuleColors.journal} />
        </View>
        <View style={styles.journalContent}>
          <ThemedText type="body">Write a new entry</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Express your thoughts and feelings
          </ThemedText>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </Pressable>

      {state.gratitudeEntries.length > 0 ? (
        <>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4">Recent Gratitude</ThemedText>
          </View>
          <View style={styles.entriesList}>
            {state.gratitudeEntries.slice(0, 3).map((entry) => (
              <View
                key={entry.id}
                style={[styles.entryCard, { backgroundColor: theme.backgroundDefault }, Shadows.card]}
              >
                <ThemedText type="body">{entry.content}</ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {new Date(entry.date).toLocaleDateString()}
                </ThemedText>
              </View>
            ))}
          </View>
        </>
      ) : null}

      <View style={[styles.statsCard, { backgroundColor: theme.backgroundDefault }, Shadows.card]}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: ModuleColors.mindful + "20" }]}>
            <Feather name="heart" size={20} color={ModuleColors.mindful} />
          </View>
          <ThemedText type="h3">{state.gratitudeEntries.length}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Gratitude entries
          </ThemedText>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: ModuleColors.journal + "20" }]}>
            <Feather name="book" size={20} color={ModuleColors.journal} />
          </View>
          <ThemedText type="h3">{state.journalEntries.length}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Journal entries
          </ThemedText>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  breathingCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  breathingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    flex: 1,
  },
  breathingIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  breathingText: {
    flex: 1,
    gap: Spacing.xs,
  },
  breathingArrow: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  gratitudeCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  gratitudeInput: {
    height: 100,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: 16,
  },
  newJournalCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  journalIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  journalContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  entriesList: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  entryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  statsCard: {
    flexDirection: "row",
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.sm,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: 1,
    marginHorizontal: Spacing.lg,
  },
  bottomPadding: {
    height: Spacing["2xl"],
  },
});
