import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows, ModuleColors } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { HabitsStackParamList } from "@/navigation/HabitsStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HabitItemProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  isCompleted: boolean;
  onToggle: () => void;
}

function HabitItem({ name, icon, color, streak, isCompleted, onToggle }: HabitItemProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(isCompleted ? 1 : 0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withSpring(0.95, { damping: 15, stiffness: 200 }),
      withSpring(1, { damping: 15, stiffness: 150 })
    );
    checkScale.value = withSpring(isCompleted ? 0 : 1, { damping: 15, stiffness: 150 });
    onToggle();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.habitItem,
        { backgroundColor: theme.backgroundDefault },
        Shadows.card,
        animatedStyle,
      ]}
    >
      <View style={[styles.habitIcon, { backgroundColor: color + "20" }]}>
        <Feather name={icon as keyof typeof Feather.glyphMap} size={22} color={color} />
      </View>
      <View style={styles.habitContent}>
        <ThemedText type="body" style={isCompleted ? styles.completedText : undefined}>
          {name}
        </ThemedText>
        <View style={styles.streakRow}>
          <Feather name="zap" size={12} color={theme.accent} />
          <ThemedText type="small" style={{ color: theme.accent }}>
            {streak} day streak
          </ThemedText>
        </View>
      </View>
      <View
        style={[
          styles.checkbox,
          {
            borderColor: isCompleted ? theme.success : theme.border,
            backgroundColor: isCompleted ? theme.success : "transparent",
          },
        ]}
      >
        <Animated.View style={checkAnimatedStyle}>
          <Feather name="check" size={16} color="#FFFFFF" />
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
}

interface MoodButtonProps {
  value: number;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  color: string;
}

function MoodButton({ icon, label, isSelected, onSelect, color }: MoodButtonProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.moodButton,
        {
          backgroundColor: isSelected ? color + "20" : theme.backgroundSecondary,
          borderColor: isSelected ? color : "transparent",
          borderWidth: 2,
        },
      ]}
    >
      <Feather name={icon} size={24} color={isSelected ? color : theme.textSecondary} />
      <ThemedText
        type="small"
        style={{ color: isSelected ? color : theme.textSecondary }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

type HabitsScreenProps = {
  navigation: NativeStackNavigationProp<HabitsStackParamList, "Habits">;
};

export default function HabitsScreen({ navigation }: HabitsScreenProps) {
  const { theme } = useTheme();
  const { state, toggleHabit } = useAppStore();
  const today = new Date().toISOString().split("T")[0];

  const latestMood = state.moodEntries[0];

  return (
    <ScreenScrollView>
      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Today's Habits</ThemedText>
        <Pressable
          onPress={() => navigation.navigate("AddHabit")}
          style={[styles.addButton, { backgroundColor: theme.primary }]}
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.habitsList}>
        {state.habits.map((habit) => (
          <HabitItem
            key={habit.id}
            id={habit.id}
            name={habit.name}
            icon={habit.icon}
            color={habit.color}
            streak={habit.streak}
            isCompleted={habit.completedDates.includes(today)}
            onToggle={() => toggleHabit(habit.id)}
          />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">How are you feeling?</ThemedText>
        <Pressable
          onPress={() => navigation.navigate("MoodLog")}
          style={[styles.viewAllButton]}
        >
          <ThemedText type="small" style={{ color: theme.primary }}>
            Log mood
          </ThemedText>
          <Feather name="chevron-right" size={16} color={theme.primary} />
        </Pressable>
      </View>

      <View style={styles.moodGrid}>
        <MoodButton
          value={5}
          icon="smile"
          label="Great"
          color={theme.success}
          isSelected={latestMood?.mood === 5}
          onSelect={() => navigation.navigate("MoodLog")}
        />
        <MoodButton
          value={4}
          icon="meh"
          label="Good"
          color={ModuleColors.mindful}
          isSelected={latestMood?.mood === 4}
          onSelect={() => navigation.navigate("MoodLog")}
        />
        <MoodButton
          value={3}
          icon="minus"
          label="Okay"
          color={theme.accent}
          isSelected={latestMood?.mood === 3}
          onSelect={() => navigation.navigate("MoodLog")}
        />
        <MoodButton
          value={2}
          icon="frown"
          label="Low"
          color={theme.warning}
          isSelected={latestMood?.mood === 2}
          onSelect={() => navigation.navigate("MoodLog")}
        />
        <MoodButton
          value={1}
          icon="cloud-rain"
          label="Bad"
          color={theme.error}
          isSelected={latestMood?.mood === 1}
          onSelect={() => navigation.navigate("MoodLog")}
        />
      </View>

      {state.moodEntries.length > 0 ? (
        <View style={[styles.latestMoodCard, { backgroundColor: theme.backgroundDefault }, Shadows.card]}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Latest mood entry
          </ThemedText>
          <ThemedText type="body">
            {latestMood?.note || "No note added"}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {new Date(latestMood?.date).toLocaleDateString()}
          </ThemedText>
        </View>
      ) : null}

      <View style={styles.bottomPadding} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  habitsList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
  },
  habitIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  habitContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
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
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  latestMoodCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  bottomPadding: {
    height: Spacing["2xl"],
  },
});
