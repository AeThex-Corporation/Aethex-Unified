import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import {
  Sparkles,
  Send,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  ChevronRight,
  X,
  MessageCircle,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useAppStore, useTheme } from "@/store/appStore";
import { Spacing, BorderRadius } from "@/constants/theme";

interface Suggestion {
  id: string;
  type: "action" | "insight" | "warning" | "tip";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionLabel?: string;
}

interface AIMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

function generateContextualSuggestions(marketContext: string, mode: string): Suggestion[] {
  if (marketContext === "education") {
    if (mode === "day") {
      return [
        { id: "1", type: "warning", title: "3 Consent Forms Expiring", description: "Guardian consent for 3 students expires this week. Send renewal reminders now.", priority: "high", actionLabel: "Send Reminders" },
        { id: "2", type: "insight", title: "PII Protection Active", description: "12 personal information attempts blocked this month. Student data is secure.", priority: "medium" },
        { id: "3", type: "action", title: "Review Flagged Content", description: "2 messages flagged for content review in study groups.", priority: "high", actionLabel: "Review Now" },
        { id: "4", type: "tip", title: "Weekly Compliance Report", description: "Generate your weekly FERPA compliance report for district review.", priority: "low", actionLabel: "Generate Report" },
      ];
    } else {
      return [
        { id: "1", type: "insight", title: "Study Streak Active", description: "You're on a 5-day study streak. Keep it up to unlock the Scholar badge.", priority: "medium" },
        { id: "2", type: "action", title: "Complete Daily Quest", description: "Finish your math practice quest to earn 50 XP before midnight.", priority: "high", actionLabel: "Start Quest" },
        { id: "3", type: "tip", title: "Join Study Group", description: "3 classmates are online in Science Study Group. Collaborate for bonus XP.", priority: "low", actionLabel: "Join Group" },
      ];
    }
  } else {
    if (mode === "day") {
      return [
        { id: "1", type: "warning", title: "4 Pending Approvals", description: "Expense reports from your team are awaiting your review.", priority: "high", actionLabel: "Review Now" },
        { id: "2", type: "insight", title: "Budget Alert", description: "Travel category is at 83% of monthly budget. Consider reviewing upcoming trips.", priority: "medium" },
        { id: "3", type: "action", title: "Submit Monthly Report", description: "Your expense summary for December is ready for submission.", priority: "medium", actionLabel: "Submit Report" },
        { id: "4", type: "tip", title: "Optimize Spending", description: "Switch to annual software licenses to save 20% on Software category.", priority: "low" },
      ];
    } else {
      return [
        { id: "1", type: "action", title: "New Gig Match", description: "UI Design project matches 95% of your skills. Apply before 12 others.", priority: "high", actionLabel: "Quick Apply" },
        { id: "2", type: "insight", title: "Sprint Progress", description: "You're ahead of schedule on GameForge Sprint. 18 hours logged vs 15 target.", priority: "medium" },
        { id: "3", type: "tip", title: "Skill Upgrade", description: "Complete React Advanced course to unlock higher-tier gigs.", priority: "low", actionLabel: "Start Course" },
        { id: "4", type: "action", title: "Withdraw Earnings", description: "$250.00 available for withdrawal. Transfer to your bank account.", priority: "medium", actionLabel: "Withdraw" },
      ];
    }
  }
}

function SuggestionCard({ suggestion, onAction }: { suggestion: Suggestion; onAction?: () => void }) {
  const theme = useTheme();
  const { mode } = useAppStore();

  const typeConfig = {
    action: { icon: <Zap size={16} color="#3B82F6" />, color: "#3B82F6", bg: "#DBEAFE" },
    insight: { icon: <TrendingUp size={16} color="#22C55E" />, color: "#22C55E", bg: "#DCFCE7" },
    warning: { icon: <AlertCircle size={16} color="#F59E0B" />, color: "#F59E0B", bg: "#FEF3C7" },
    tip: { icon: <Lightbulb size={16} color="#8B5CF6" />, color: "#8B5CF6", bg: "#EDE9FE" },
  };

  const config = typeConfig[suggestion.type];

  return (
    <View style={[styles.suggestionCard, { 
      backgroundColor: mode === "day" ? theme.card : "#1E293B",
      borderColor: mode === "day" ? theme.border : "#334155",
    }]}>
      <View style={styles.suggestionHeader}>
        <View style={[styles.typeIcon, { backgroundColor: config.bg }]}>
          {config.icon}
        </View>
        <View style={styles.suggestionContent}>
          <Text style={[styles.suggestionTitle, { color: theme.text }]}>{suggestion.title}</Text>
          <Text style={[styles.suggestionDesc, { color: theme.textSecondary }]}>{suggestion.description}</Text>
        </View>
        {suggestion.priority === "high" && (
          <View style={styles.priorityDot} />
        )}
      </View>
      {suggestion.actionLabel && (
        <Pressable 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onAction?.();
          }}
          style={[styles.actionButton, { backgroundColor: config.color }]}
        >
          <Text style={styles.actionText}>{suggestion.actionLabel}</Text>
          <ChevronRight size={14} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  );
}

function PulsingDot() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.dotContainer}>
      <Animated.View style={[styles.pulsingRing, animatedStyle]} />
      <View style={styles.solidDot} />
    </View>
  );
}

export function AIAssistantWidget({ compact = false }: { compact?: boolean }) {
  const theme = useTheme();
  const { marketContext, mode } = useAppStore();
  const [suggestions] = useState(() => generateContextualSuggestions(marketContext, mode));

  if (compact) {
    return (
      <Animated.View entering={FadeInDown.duration(400)}>
        <View style={[styles.compactWidget, { 
          backgroundColor: mode === "day" ? "#F8FAFC" : "#1E293B",
          borderColor: mode === "day" ? "#E2E8F0" : "#334155",
        }]}>
          <View style={styles.compactHeader}>
            <Sparkles size={18} color="#5533FF" />
            <Text style={[styles.compactTitle, { color: theme.text }]}>AI Insights</Text>
            <PulsingDot />
          </View>
          <Text style={[styles.compactHint, { color: theme.textSecondary }]}>
            {suggestions.filter(s => s.priority === "high").length} high-priority actions
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <View style={[styles.header, { 
          backgroundColor: mode === "day" ? "#5533FF" : "#1E293B",
          borderColor: mode === "day" ? "transparent" : "#5533FF",
          borderWidth: mode === "day" ? 0 : 1,
        }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={[styles.sparkleIcon, { backgroundColor: mode === "day" ? "rgba(255,255,255,0.2)" : "#5533FF20" }]}>
                <Sparkles size={20} color={mode === "day" ? "#FFFFFF" : "#5533FF"} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: mode === "day" ? "#FFFFFF" : theme.text }]}>
                  AeThex Assistant
                </Text>
                <Text style={[styles.headerSubtitle, { color: mode === "day" ? "rgba(255,255,255,0.8)" : theme.textSecondary }]}>
                  Smart suggestions for you
                </Text>
              </View>
            </View>
            <PulsingDot />
          </View>
        </View>
      </Animated.View>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        Recommended Actions
      </Text>

      {suggestions.map((suggestion, index) => (
        <Animated.View key={suggestion.id} entering={FadeInDown.delay(100 + index * 50).duration(400)}>
          <SuggestionCard suggestion={suggestion} />
        </Animated.View>
      ))}
    </View>
  );
}

export function AIAssistantFAB({ onPress }: { onPress: () => void }) {
  const { mode } = useAppStore();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  return (
    <Animated.View style={[styles.fab, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        style={[styles.fabButton, { backgroundColor: "#5533FF" }]}
      >
        <Sparkles size={24} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  header: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  sparkleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  dotContainer: {
    width: 12,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pulsingRing: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
  },
  solidDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: Spacing.sm,
  },
  suggestionCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  suggestionDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
    gap: 4,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  compactWidget: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  compactHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  compactHint: {
    fontSize: 12,
    marginLeft: 26,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5533FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default AIAssistantWidget;
