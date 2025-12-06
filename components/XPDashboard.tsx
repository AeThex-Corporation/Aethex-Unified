import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/store/appStore";
import { gamificationService } from "@/services/gamificationService";
import { GlassCard } from "./GlassCard";
import { BorderRadius, Spacing } from "@/constants/theme";

interface XPDashboardProps {
  compact?: boolean;
  onPress?: () => void;
}

export function XPDashboard({ compact = false, onPress }: XPDashboardProps) {
  const theme = useTheme();
  const levelInfo = gamificationService.getLevelInfo();
  const streak = gamificationService.getStreak();
  
  const progressWidth = useSharedValue(0);
  const levelScale = useSharedValue(0.8);
  const streakBounce = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withDelay(
      300,
      withSpring(levelInfo.progress, { damping: 15, stiffness: 100 })
    );
    levelScale.value = withDelay(
      100,
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    streakBounce.value = withDelay(
      500,
      withSequence(
        withTiming(1.2, { duration: 200 }),
        withSpring(1, { damping: 10 })
      )
    );
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const levelStyle = useAnimatedStyle(() => ({
    transform: [{ scale: levelScale.value }],
  }));

  const streakStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakBounce.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  if (compact) {
    return (
      <Pressable onPress={handlePress}>
        <GlassCard style={styles.compactContainer}>
          <View style={styles.compactContent}>
            <Animated.View style={[styles.levelBadge, levelStyle, { backgroundColor: theme.accent }]}>
              <Text style={styles.levelText}>{levelInfo.level}</Text>
            </Animated.View>
            <View style={styles.compactInfo}>
              <Text style={[styles.xpLabel, { color: theme.textSecondary }]}>
                {levelInfo.currentXP} / {levelInfo.xpForNextLevel} XP
              </Text>
              <View style={[styles.progressTrack, { backgroundColor: theme.secondary }]}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    { backgroundColor: theme.accent },
                    progressStyle,
                  ]}
                />
              </View>
            </View>
            <Animated.View style={[styles.streakBadge, streakStyle]}>
              <Feather name="zap" size={14} color="#F59E0B" />
              <Text style={styles.streakText}>{streak}</Text>
            </Animated.View>
          </View>
        </GlassCard>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress}>
      <GlassCard style={styles.container}>
        <View style={styles.header}>
          <View style={styles.levelSection}>
            <Animated.View style={[styles.levelCircle, levelStyle, { borderColor: theme.accent }]}>
              <Text style={[styles.levelNumber, { color: theme.accent }]}>{levelInfo.level}</Text>
              <Text style={[styles.levelLabel, { color: theme.textSecondary }]}>LEVEL</Text>
            </Animated.View>
          </View>
          
          <View style={styles.xpSection}>
            <View style={styles.xpRow}>
              <Text style={[styles.xpValue, { color: theme.text }]}>
                {levelInfo.currentXP.toLocaleString()}
              </Text>
              <Text style={[styles.xpDivider, { color: theme.textSecondary }]}> / </Text>
              <Text style={[styles.xpMax, { color: theme.textSecondary }]}>
                {levelInfo.xpForNextLevel.toLocaleString()} XP
              </Text>
            </View>
            
            <View style={[styles.progressContainer, { backgroundColor: theme.secondary }]}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { backgroundColor: theme.accent },
                  progressStyle,
                ]}
              />
              <View style={styles.progressGlow} />
            </View>
            
            <Text style={[styles.nextLevel, { color: theme.textSecondary }]}>
              {(levelInfo.xpForNextLevel - levelInfo.currentXP).toLocaleString()} XP to Level {levelInfo.level + 1}
            </Text>
          </View>
        </View>

        <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
          <Animated.View style={[styles.statItem, streakStyle]}>
            <View style={[styles.statIcon, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
              <Feather name="zap" size={16} color="#F59E0B" />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>{streak}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Day Streak</Text>
          </Animated.View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "rgba(34, 197, 94, 0.15)" }]}>
              <Feather name="award" size={16} color="#22C55E" />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {gamificationService.getUnlockedAchievements().length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Achievements</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "rgba(99, 102, 241, 0.15)" }]}>
              <Feather name="target" size={16} color="#6366F1" />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {gamificationService.getProgress().completedQuests.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Quests Done</Text>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  compactContainer: {
    padding: Spacing.md,
  },
  compactContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  levelText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  compactInfo: {
    flex: 1,
    gap: 4,
  },
  xpLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakText: {
    color: "#F59E0B",
    fontWeight: "700",
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  levelSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  levelCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: "800",
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
  },
  xpSection: {
    flex: 1,
    justifyContent: "center",
    gap: Spacing.xs,
  },
  xpRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  xpValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  xpDivider: {
    fontSize: 16,
  },
  xpMax: {
    fontSize: 16,
    fontWeight: "500",
  },
  progressContainer: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  progressGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  nextLevel: {
    fontSize: 12,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
});
