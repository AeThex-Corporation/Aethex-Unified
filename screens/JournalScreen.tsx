import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows, ModuleColors } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { MindfulStackParamList } from "@/navigation/MindfulStackNavigator";

type JournalScreenProps = {
  navigation: NativeStackNavigationProp<MindfulStackParamList, "Journal">;
};

export default function JournalScreen({ navigation }: JournalScreenProps) {
  const { theme } = useTheme();
  const { state } = useAppStore();

  return (
    <ScreenScrollView>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate("JournalEntry", {});
        }}
        style={({ pressed }) => [
          styles.newEntryCard,
          { backgroundColor: ModuleColors.journal, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <View style={styles.newEntryIcon}>
          <Feather name="edit-3" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.newEntryText}>
          <ThemedText type="h4" style={{ color: "#FFFFFF" }}>
            New Journal Entry
          </ThemedText>
          <ThemedText type="small" style={{ color: "rgba(255,255,255,0.8)" }}>
            Express your thoughts and feelings
          </ThemedText>
        </View>
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>

      {state.journalEntries.length > 0 ? (
        <View style={styles.entriesList}>
          {state.journalEntries.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate("JournalEntry", { entryId: entry.id });
              }}
              style={({ pressed }) => [
                styles.entryCard,
                { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
                Shadows.card,
              ]}
            >
              <View style={styles.entryHeader}>
                <ThemedText type="h4" numberOfLines={1}>
                  {entry.title}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {new Date(entry.date).toLocaleDateString()}
                </ThemedText>
              </View>
              <ThemedText
                type="body"
                numberOfLines={2}
                style={{ color: theme.textSecondary }}
              >
                {entry.content}
              </ThemedText>
              {entry.mood ? (
                <View style={[styles.moodTag, { backgroundColor: ModuleColors.mindful + "20" }]}>
                  <ThemedText type="small" style={{ color: ModuleColors.mindful }}>
                    {entry.mood}
                  </ThemedText>
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Feather name="book" size={48} color={theme.textSecondary} />
          <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
            No journal entries yet. Start writing your first one!
          </ThemedText>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  newEntryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  newEntryIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  newEntryText: {
    flex: 1,
    gap: Spacing.xs,
  },
  entriesList: {
    gap: Spacing.md,
  },
  entryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moodTag: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["4xl"],
    gap: Spacing.lg,
  },
  bottomPadding: {
    height: Spacing["2xl"],
  },
});
