import React from "react";
import { StyleSheet, View, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows, ModuleColors } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { DashboardStackParamList } from "@/navigation/DashboardStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ModuleCardProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
  streak?: number;
}

function ModuleCard({ icon, title, subtitle, color, onPress, streak }: ModuleCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.moduleCard,
        { backgroundColor: theme.backgroundDefault },
        Shadows.card,
        animatedStyle,
      ]}
    >
      <View style={[styles.moduleIconContainer, { backgroundColor: color + "20" }]}>
        <Feather name={icon} size={24} color={color} />
      </View>
      <View style={styles.moduleContent}>
        <ThemedText type="h4">{title}</ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {subtitle}
        </ThemedText>
      </View>
      {streak !== undefined && streak > 0 ? (
        <View style={[styles.streakBadge, { backgroundColor: theme.accent + "20" }]}>
          <Feather name="zap" size={12} color={theme.accent} />
          <ThemedText type="small" style={{ color: theme.accent, fontWeight: "600" }}>
            {streak}
          </ThemedText>
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

interface StatCardProps {
  value: string | number;
  label: string;
  color: string;
  icon: keyof typeof Feather.glyphMap;
}

function StatCard({ value, label, color, icon }: StatCardProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }, Shadows.card]}>
      <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <ThemedText type="h3" style={{ color }}>{value}</ThemedText>
      <ThemedText type="small" style={{ color: theme.textSecondary }}>{label}</ThemedText>
    </View>
  );
}

interface BadgeItemProps {
  name: string;
  tier: "bronze" | "silver" | "gold";
  icon: string;
}

function BadgeItem({ name, tier, icon }: BadgeItemProps) {
  const { theme } = useTheme();
  const tierColors = {
    bronze: "#CD7F32",
    silver: "#C0C0C0",
    gold: "#FFD700",
  };

  return (
    <View style={[styles.badgeItem, { backgroundColor: theme.backgroundDefault }, Shadows.card]}>
      <View style={[styles.badgeIcon, { backgroundColor: tierColors[tier] + "30" }]}>
        <Feather name={icon as keyof typeof Feather.glyphMap} size={20} color={tierColors[tier]} />
      </View>
      <ThemedText type="small" numberOfLines={1} style={styles.badgeName}>{name}</ThemedText>
    </View>
  );
}

export default function DashboardScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<DashboardStackParamList>>();
  const { state } = useAppStore();
  const rootNavigation = useNavigation<any>();

  const totalStreak = Object.values(state.streaks).reduce((a, b) => a + b, 0);
  const todayHabitsCompleted = state.habits.filter(
    (h) => h.completedDates.includes(new Date().toISOString().split("T")[0])
  ).length;

  const motivationalQuotes = [
    "Every day is a new opportunity to grow.",
    "Small steps lead to big changes.",
    "Your potential is limitless.",
    "Progress, not perfection.",
    "Be the change you wish to see.",
  ];
  const todayQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  return (
    <ScreenScrollView>
      <View style={[styles.welcomeCard, { backgroundColor: theme.primary }]}>
        <View style={styles.welcomeContent}>
          <ThemedText type="h3" style={styles.welcomeTitle}>
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}
          </ThemedText>
          <ThemedText type="body" style={styles.welcomeQuote}>
            {todayQuote}
          </ThemedText>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Settings")}
          style={styles.settingsButton}
        >
          <Feather name="settings" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <StatCard value={totalStreak} label="Total Streaks" color={theme.accent} icon="zap" />
        <StatCard value={state.totalPoints} label="Points" color={theme.primary} icon="star" />
        <StatCard value={state.badges.length} label="Badges" color={theme.success} icon="award" />
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Your Modules</ThemedText>
      </View>

      <View style={styles.modulesGrid}>
        <ModuleCard
          icon="check-square"
          title="Habits"
          subtitle={`${todayHabitsCompleted}/${state.habits.length} today`}
          color={ModuleColors.habits}
          streak={state.streaks.habits}
          onPress={() => rootNavigation.navigate("HabitsTab")}
        />
        <ModuleCard
          icon="book-open"
          title="Study"
          subtitle={`${state.studySets.length} study sets`}
          color={ModuleColors.study}
          streak={state.streaks.study}
          onPress={() => rootNavigation.navigate("StudyTab")}
        />
        <ModuleCard
          icon="dollar-sign"
          title="Finance"
          subtitle={`${state.expenses.length} expenses logged`}
          color={ModuleColors.finance}
          streak={state.streaks.finance}
          onPress={() => rootNavigation.navigate("FinanceTab")}
        />
        <ModuleCard
          icon="heart"
          title="Mindful"
          subtitle={`${state.gratitudeEntries.length} gratitude entries`}
          color={ModuleColors.mindful}
          streak={state.streaks.mindful}
          onPress={() => rootNavigation.navigate("MindfulTab")}
        />
        <ModuleCard
          icon="activity"
          title="Fitness"
          subtitle={`${state.workouts.length} workouts`}
          color={ModuleColors.fitness}
          streak={state.streaks.fitness}
          onPress={() => rootNavigation.navigate("FitnessTab")}
        />
      </View>

      {state.badges.length > 0 ? (
        <>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4">Recent Achievements</ThemedText>
          </View>
          <View style={styles.badgesRow}>
            {state.badges.slice(0, 4).map((badge) => (
              <BadgeItem
                key={badge.id}
                name={badge.name}
                tier={badge.tier}
                icon={badge.icon}
              />
            ))}
          </View>
        </>
      ) : null}

      <View style={styles.bottomPadding} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    color: "#FFFFFF",
    marginBottom: Spacing.xs,
  },
  welcomeQuote: {
    color: "rgba(255,255,255,0.85)",
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.xs,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  modulesGrid: {
    gap: Spacing.md,
  },
  moduleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
  },
  moduleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  moduleContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgesRow: {
    flexDirection: "row",
    gap: Spacing.md,
    flexWrap: "wrap",
  },
  badgeItem: {
    width: "47%",
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeName: {
    textAlign: "center",
  },
  bottomPadding: {
    height: Spacing["2xl"],
  },
});
