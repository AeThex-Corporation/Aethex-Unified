import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  FadeIn,
  SlideInRight,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/store/appStore";
import { Achievement, gamificationService } from "@/services/gamificationService";
import { GlassCard } from "./GlassCard";
import { BorderRadius, Spacing } from "@/constants/theme";

const ICON_MAP: Record<string, keyof typeof Feather.glyphMap> = {
  star: "star",
  flame: "zap",
  zap: "zap",
  trophy: "award",
  briefcase: "briefcase",
  target: "target",
  "dollar-sign": "dollar-sign",
  "trending-up": "trending-up",
  award: "award",
  users: "users",
  "message-circle": "message-circle",
  "book-open": "book-open",
  "check-circle": "check-circle",
  moon: "moon",
  sunrise: "sunrise",
};

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "small" | "medium" | "large";
  showDetails?: boolean;
  index?: number;
}

export function AchievementBadge({
  achievement,
  size = "medium",
  showDetails = false,
  index = 0,
}: AchievementBadgeProps) {
  const theme = useTheme();
  const isUnlocked = !!achievement.unlockedAt;
  const scale = useSharedValue(0.8);
  const glow = useSharedValue(0);

  const dimensions = {
    small: 48,
    medium: 64,
    large: 80,
  }[size];

  const iconSize = {
    small: 20,
    medium: 28,
    large: 36,
  }[size];

  useEffect(() => {
    if (isUnlocked) {
      scale.value = withDelay(
        index * 100,
        withSequence(
          withSpring(1.1, { damping: 10 }),
          withSpring(1, { damping: 15 })
        )
      );
      glow.value = withDelay(
        index * 100 + 200,
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 500 })
        )
      );
    } else {
      scale.value = withDelay(index * 50, withSpring(1));
    }
  }, [isUnlocked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: 1.2 }],
  }));

  const categoryColors: Record<string, string> = {
    milestone: "#6366F1",
    streak: "#F59E0B",
    skill: "#22C55E",
    social: "#EC4899",
    special: "#8B5CF6",
  };

  const color = isUnlocked ? categoryColors[achievement.category] : theme.textSecondary;
  const bgColor = isUnlocked 
    ? `${categoryColors[achievement.category]}20` 
    : theme.secondary;

  return (
    <Animated.View style={[styles.badgeContainer, animatedStyle]}>
      {isUnlocked && (
        <Animated.View
          style={[
            styles.glowEffect,
            { 
              backgroundColor: categoryColors[achievement.category],
              width: dimensions + 8,
              height: dimensions + 8,
              borderRadius: (dimensions + 8) / 2,
            },
            glowStyle,
          ]}
        />
      )}
      <View
        style={[
          styles.badge,
          {
            width: dimensions,
            height: dimensions,
            borderRadius: dimensions / 2,
            backgroundColor: bgColor,
            borderColor: isUnlocked ? color : "transparent",
            borderWidth: isUnlocked ? 2 : 0,
          },
        ]}
      >
        <Feather
          name={ICON_MAP[achievement.icon] || "award"}
          size={iconSize}
          color={color}
        />
      </View>
      {showDetails && (
        <View style={styles.badgeDetails}>
          <Text
            style={[
              styles.badgeTitle,
              { color: isUnlocked ? theme.text : theme.textSecondary },
            ]}
            numberOfLines={1}
          >
            {achievement.title}
          </Text>
          {achievement.maxProgress && !isUnlocked && (
            <View style={styles.progressRow}>
              <View style={[styles.miniProgress, { backgroundColor: theme.secondary }]}>
                <View
                  style={[
                    styles.miniProgressFill,
                    {
                      backgroundColor: color,
                      width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                {achievement.progress || 0}/{achievement.maxProgress}
              </Text>
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
}

interface AchievementListProps {
  filter?: "all" | "unlocked" | "locked";
  limit?: number;
}

export function AchievementList({ filter = "all", limit }: AchievementListProps) {
  const theme = useTheme();
  let achievements = gamificationService.getAchievements();

  if (filter === "unlocked") {
    achievements = achievements.filter(a => a.unlockedAt);
  } else if (filter === "locked") {
    achievements = achievements.filter(a => !a.unlockedAt && !a.isSecret);
  }

  if (limit) {
    achievements = achievements.slice(0, limit);
  }

  return (
    <View style={styles.listContainer}>
      <View style={styles.listHeader}>
        <Text style={[styles.listTitle, { color: theme.text }]}>Achievements</Text>
        <Text style={[styles.listCount, { color: theme.textSecondary }]}>
          {gamificationService.getUnlockedAchievements().length} / {gamificationService.getAchievements().length}
        </Text>
      </View>
      <View style={styles.badgeGrid}>
        {achievements.map((achievement, index) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            size="medium"
            showDetails
            index={index}
          />
        ))}
      </View>
    </View>
  );
}

interface AchievementUnlockToastProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementUnlockToast({
  achievement,
  onDismiss,
}: AchievementUnlockToastProps) {
  const theme = useTheme();
  const categoryColors: Record<string, string> = {
    milestone: "#6366F1",
    streak: "#F59E0B",
    skill: "#22C55E",
    social: "#EC4899",
    special: "#8B5CF6",
  };

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      entering={SlideInRight.springify().damping(15)}
      style={styles.toastContainer}
    >
      <GlassCard style={styles.toast}>
        <View style={styles.toastContent}>
          <View
            style={[
              styles.toastBadge,
              { backgroundColor: `${categoryColors[achievement.category]}20` },
            ]}
          >
            <Feather
              name={ICON_MAP[achievement.icon] || "award"}
              size={24}
              color={categoryColors[achievement.category]}
            />
          </View>
          <View style={styles.toastText}>
            <Text style={[styles.toastLabel, { color: theme.textSecondary }]}>
              Achievement Unlocked!
            </Text>
            <Text style={[styles.toastTitle, { color: theme.text }]}>
              {achievement.title}
            </Text>
            <Text style={[styles.toastXP, { color: categoryColors[achievement.category] }]}>
              +{achievement.xpReward} XP
            </Text>
          </View>
          <Pressable onPress={onDismiss} style={styles.toastDismiss}>
            <Feather name="x" size={20} color={theme.textSecondary} />
          </Pressable>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    alignItems: "center",
    width: 80,
    marginBottom: Spacing.md,
  },
  badge: {
    justifyContent: "center",
    alignItems: "center",
  },
  glowEffect: {
    position: "absolute",
    top: -4,
    left: -4,
  },
  badgeDetails: {
    marginTop: Spacing.xs,
    alignItems: "center",
    width: "100%",
  },
  badgeTitle: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  miniProgress: {
    width: 40,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  miniProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 9,
    fontWeight: "500",
  },
  listContainer: {
    gap: Spacing.md,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  listCount: {
    fontSize: 14,
    fontWeight: "500",
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  toastContainer: {
    position: "absolute",
    top: 60,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1000,
  },
  toast: {
    padding: Spacing.md,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  toastBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  toastText: {
    flex: 1,
  },
  toastLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  toastXP: {
    fontSize: 14,
    fontWeight: "600",
  },
  toastDismiss: {
    padding: 4,
  },
});
