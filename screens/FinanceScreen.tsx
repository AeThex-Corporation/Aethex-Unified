import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows, ModuleColors } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { FinanceStackParamList } from "@/navigation/FinanceStackNavigator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CATEGORY_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  Food: "coffee",
  Entertainment: "film",
  Utilities: "zap",
  Transport: "truck",
  Shopping: "shopping-bag",
  Health: "heart",
  Other: "more-horizontal",
};

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#F59E0B",
  Entertainment: "#EC4899",
  Utilities: "#6366F1",
  Transport: "#10B981",
  Shopping: "#8B5CF6",
  Health: "#EF4444",
  Other: "#64748B",
};

type FinanceScreenProps = {
  navigation: NativeStackNavigationProp<FinanceStackParamList, "Finance">;
};

export default function FinanceScreen({ navigation }: FinanceScreenProps) {
  const { theme } = useTheme();
  const { state } = useAppStore();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const categoryTotals = state.expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const aiTips = [
    "Consider setting a weekly budget for entertainment to save more.",
    "Your grocery spending is on track this month!",
    "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
  ];

  return (
    <ScreenScrollView>
      <View style={[styles.summaryCard, { backgroundColor: ModuleColors.finance }]}>
        <View style={styles.summaryHeader}>
          <ThemedText type="small" style={{ color: "rgba(255,255,255,0.8)" }}>
            Total Spending
          </ThemedText>
          <ThemedText type="small" style={{ color: "rgba(255,255,255,0.8)" }}>
            This Month
          </ThemedText>
        </View>
        <ThemedText type="h1" style={{ color: "#FFFFFF" }}>
          ${totalExpenses.toFixed(2)}
        </ThemedText>
        <View style={styles.expenseBreakdown}>
          {sortedCategories.map(([category, amount]) => (
            <View key={category} style={styles.categoryPill}>
              <Feather
                name={CATEGORY_ICONS[category] || "circle"}
                size={12}
                color="#FFFFFF"
              />
              <ThemedText type="small" style={{ color: "#FFFFFF" }}>
                {category}: ${amount.toFixed(0)}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Financial Goals</ThemedText>
        <Pressable
          onPress={() => navigation.navigate("AddGoal")}
          style={[styles.addButton, { backgroundColor: theme.primary }]}
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.goalsList}>
        {state.financialGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <View
              key={goal.id}
              style={[styles.goalCard, { backgroundColor: theme.backgroundDefault }, Shadows.card]}
            >
              <View style={styles.goalHeader}>
                <ThemedText type="body">{goal.name}</ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {progress.toFixed(0)}%
                </ThemedText>
              </View>
              <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: ModuleColors.finance, width: `${Math.min(progress, 100)}%` },
                  ]}
                />
              </View>
              <View style={styles.goalFooter}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  ${goal.currentAmount.toFixed(0)} of ${goal.targetAmount.toFixed(0)}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Due: {new Date(goal.deadline).toLocaleDateString()}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Recent Expenses</ThemedText>
        <Pressable onPress={() => navigation.navigate("AddExpense")} style={styles.viewAllButton}>
          <ThemedText type="small" style={{ color: theme.primary }}>
            Add new
          </ThemedText>
          <Feather name="plus" size={14} color={theme.primary} />
        </Pressable>
      </View>

      <View style={styles.expensesList}>
        {state.expenses.slice(0, 5).map((expense) => (
          <View
            key={expense.id}
            style={[styles.expenseItem, { backgroundColor: theme.backgroundDefault }, Shadows.card]}
          >
            <View
              style={[
                styles.expenseIcon,
                { backgroundColor: (CATEGORY_COLORS[expense.category] || "#64748B") + "20" },
              ]}
            >
              <Feather
                name={CATEGORY_ICONS[expense.category] || "circle"}
                size={20}
                color={CATEGORY_COLORS[expense.category] || "#64748B"}
              />
            </View>
            <View style={styles.expenseContent}>
              <ThemedText type="body">{expense.description}</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {expense.category}
              </ThemedText>
            </View>
            <ThemedText type="h4" style={{ color: theme.error }}>
              -${expense.amount.toFixed(2)}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={[styles.aiTipCard, { backgroundColor: theme.backgroundDefault }, Shadows.card]}>
        <View style={[styles.aiIcon, { backgroundColor: ModuleColors.finance + "20" }]}>
          <Feather name="cpu" size={20} color={ModuleColors.finance} />
        </View>
        <View style={styles.aiContent}>
          <ThemedText type="small" style={{ color: ModuleColors.finance, fontWeight: "600" }}>
            AI TIP
          </ThemedText>
          <ThemedText type="body">
            {aiTips[new Date().getDay() % aiTips.length]}
          </ThemedText>
        </View>
      </View>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate("AddExpense");
        }}
        style={[
          styles.fab,
          { backgroundColor: ModuleColors.finance, bottom: tabBarHeight + Spacing.xl },
          Shadows.fab,
        ]}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>

      <View style={styles.bottomPadding} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  expenseBreakdown: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  goalsList: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  goalCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expensesList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  expenseIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  expenseContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  aiTipCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  aiContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  fab: {
    position: "absolute",
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomPadding: {
    height: Spacing["5xl"],
  },
});
