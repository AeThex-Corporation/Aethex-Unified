import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme, useAppStore } from "@/store/appStore";
import { Quest, gamificationService } from "@/services/gamificationService";
import { GlassCard, GlassContainer } from "./GlassCard";
import { BorderRadius, Spacing } from "@/constants/theme";
import { createReputationAction } from "@/services/reputationService";

interface QuestCardProps {
  quest: Quest;
  onComplete?: (questId: string) => void;
}

export function QuestCard({ quest, onComplete }: QuestCardProps) {
  const theme = useTheme();
  const { addReputationAction, currentPillar } = useAppStore();
  const completedSteps = quest.steps.filter(s => s.isCompleted).length;
  const progress = completedSteps / quest.steps.length;
  const isCompleted = progress === 1;

  const checkScale = useSharedValue(1);

  const categoryColors: Record<string, string> = {
    daily: "#22C55E",
    weekly: "#6366F1",
    story: "#EC4899",
    challenge: "#F59E0B",
  };

  const categoryIcons: Record<string, keyof typeof Feather.glyphMap> = {
    daily: "sun",
    weekly: "calendar",
    story: "book-open",
    challenge: "target",
  };

  const handleComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    checkScale.value = withSequence(
      withSpring(1.3, { damping: 10 }),
      withSpring(1, { damping: 15 })
    );
    onComplete?.(quest.id);
    
    addReputationAction(createReputationAction("complete_quest", currentPillar || "dev", quest.xpReward));
  };

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: `${categoryColors[quest.category]}20` },
          ]}
        >
          <Feather
            name={categoryIcons[quest.category]}
            size={14}
            color={categoryColors[quest.category]}
          />
          <Text style={[styles.categoryText, { color: categoryColors[quest.category] }]}>
            {quest.category.charAt(0).toUpperCase() + quest.category.slice(1)}
          </Text>
        </View>
        <View style={styles.xpBadge}>
          <Feather name="zap" size={12} color="#F59E0B" />
          <Text style={styles.xpText}>+{quest.xpReward} XP</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: theme.text }]}>{quest.title}</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {quest.description}
      </Text>

      <View style={styles.stepsContainer}>
        {quest.steps.map((step, index) => (
          <View key={step.id} style={styles.step}>
            <View
              style={[
                styles.stepCheck,
                {
                  backgroundColor: step.isCompleted
                    ? categoryColors[quest.category]
                    : theme.secondary,
                  borderColor: step.isCompleted
                    ? categoryColors[quest.category]
                    : theme.border,
                },
              ]}
            >
              {step.isCompleted && (
                <Feather name="check" size={10} color="#FFFFFF" />
              )}
            </View>
            <Text
              style={[
                styles.stepText,
                {
                  color: step.isCompleted ? theme.textSecondary : theme.text,
                  textDecorationLine: step.isCompleted ? "line-through" : "none",
                },
              ]}
            >
              {step.description}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.progressSection}>
          <View style={[styles.progressTrack, { backgroundColor: theme.secondary }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: categoryColors[quest.category],
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {completedSteps}/{quest.steps.length}
          </Text>
        </View>

        {!isCompleted && (
          <Pressable
            onPress={handleComplete}
            style={[
              styles.completeButton,
              { backgroundColor: categoryColors[quest.category] },
            ]}
          >
            <Animated.View style={checkStyle}>
              <Feather name="check" size={16} color="#FFFFFF" />
            </Animated.View>
          </Pressable>
        )}
      </View>
    </GlassCard>
  );
}

interface QuestListProps {
  category?: "all" | "daily" | "weekly";
}

export function QuestList({ category = "all" }: QuestListProps) {
  const theme = useTheme();
  const marketContext = useAppStore(state => state.marketContext);
  let quests = gamificationService.getQuests(marketContext);

  if (category !== "all") {
    quests = quests.filter(q => q.category === category);
  }

  return (
    <View style={styles.listContainer}>
      <View style={styles.listHeader}>
        <Text style={[styles.listTitle, { color: theme.text }]}>
          {marketContext === "education" ? "Study Quests" : "Active Quests"}
        </Text>
        <View style={styles.questCount}>
          <Text style={[styles.questCountText, { color: theme.accent }]}>
            {quests.length} Active
          </Text>
        </View>
      </View>
      {quests.map((quest, index) => (
        <Animated.View
          key={quest.id}
          entering={FadeIn.delay(index * 100)}
        >
          <QuestCard quest={quest} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  xpText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  stepsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  stepCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: {
    fontSize: 13,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  progressSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "600",
  },
  completeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    gap: Spacing.md,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  questCount: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questCountText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
