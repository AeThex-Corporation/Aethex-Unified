import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Users,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Briefcase,
  Shield,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTheme, useTerminology } from "@/store/appStore";
import { Spacing, BorderRadius } from "@/constants/theme";

interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  submittedBy: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  urgency: "normal" | "high" | "urgent";
}

const MOCK_EXPENSES: ExpenseItem[] = [
  { id: "1", title: "Client Dinner - Acme Corp", amount: 245.50, category: "Meals", submittedBy: "Sarah Chen", date: "Today", status: "pending", urgency: "normal" },
  { id: "2", title: "Software License - Figma", amount: 180.00, category: "Software", submittedBy: "Mike Johnson", date: "Yesterday", status: "pending", urgency: "high" },
  { id: "3", title: "Travel - NYC Conference", amount: 1250.00, category: "Travel", submittedBy: "Emily Davis", date: "Dec 4", status: "pending", urgency: "urgent" },
  { id: "4", title: "Office Supplies", amount: 89.99, category: "Supplies", submittedBy: "Alex Kim", date: "Dec 3", status: "approved", urgency: "normal" },
];

const BUDGET_DATA = {
  total: 50000,
  used: 32450,
  pending: 4500,
  categories: [
    { name: "Travel", used: 12500, budget: 15000, color: "#3B82F6" },
    { name: "Software", used: 8200, budget: 10000, color: "#8B5CF6" },
    { name: "Meals", used: 4800, budget: 8000, color: "#22C55E" },
    { name: "Supplies", used: 3200, budget: 5000, color: "#F59E0B" },
  ],
};

function MetricCard({ 
  icon, 
  title, 
  value, 
  change, 
  changeType, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  change?: string;
  changeType?: "up" | "down";
  delay: number;
}) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={styles.metricIcon}>{icon}</View>
      <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.metricTitle, { color: theme.textSecondary }]}>{title}</Text>
      {change && (
        <View style={styles.changeRow}>
          {changeType === "up" ? (
            <ArrowUpRight size={12} color="#22C55E" />
          ) : (
            <ArrowDownRight size={12} color="#EF4444" />
          )}
          <Text style={{ fontSize: 11, color: changeType === "up" ? "#22C55E" : "#EF4444" }}>
            {change}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

function BudgetProgress({ category, delay }: { category: typeof BUDGET_DATA.categories[0]; delay: number }) {
  const theme = useTheme();
  const percentage = Math.round((category.used / category.budget) * 100);
  const isOverBudget = percentage > 90;

  return (
    <Animated.View
      entering={FadeInRight.delay(delay).duration(400)}
      style={styles.budgetRow}
    >
      <View style={styles.budgetInfo}>
        <View style={[styles.budgetDot, { backgroundColor: category.color }]} />
        <Text style={[styles.budgetName, { color: theme.text }]}>{category.name}</Text>
      </View>
      <View style={styles.budgetBarContainer}>
        <View style={[styles.budgetBar, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.budgetFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: isOverBudget ? "#EF4444" : category.color,
              },
            ]}
          />
        </View>
      </View>
      <Text style={[styles.budgetPercent, { color: isOverBudget ? "#EF4444" : theme.textSecondary }]}>
        {percentage}%
      </Text>
    </Animated.View>
  );
}

function ExpenseCard({ expense, onApprove, onReject }: { 
  expense: ExpenseItem; 
  onApprove: () => void;
  onReject: () => void;
}) {
  const theme = useTheme();

  const urgencyColors = {
    normal: "#3B82F6",
    high: "#F59E0B",
    urgent: "#EF4444",
  };

  return (
    <View style={[styles.expenseCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.expenseHeader}>
        <View style={styles.expenseInfo}>
          <Text style={[styles.expenseTitle, { color: theme.text }]}>{expense.title}</Text>
          <Text style={[styles.expenseSubmitter, { color: theme.textSecondary }]}>
            {expense.submittedBy} - {expense.date}
          </Text>
        </View>
        <View style={styles.expenseAmountContainer}>
          <Text style={[styles.expenseAmount, { color: theme.text }]}>
            ${expense.amount.toFixed(2)}
          </Text>
          {expense.urgency !== "normal" && (
            <View style={[styles.urgencyBadge, { backgroundColor: urgencyColors[expense.urgency] + "20" }]}>
              <Text style={{ fontSize: 10, color: urgencyColors[expense.urgency], fontWeight: "600" }}>
                {expense.urgency.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </View>
      {expense.status === "pending" && (
        <View style={styles.expenseActions}>
          <Pressable
            onPress={onReject}
            style={[styles.actionButton, styles.rejectButton]}
          >
            <XCircle size={16} color="#EF4444" />
            <Text style={styles.rejectText}>Reject</Text>
          </Pressable>
          <Pressable
            onPress={onApprove}
            style={[styles.actionButton, styles.approveButton]}
          >
            <CheckCircle size={16} color="#FFFFFF" />
            <Text style={styles.approveText}>Approve</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export function BusinessDashboard() {
  const theme = useTheme();
  const terminology = useTerminology();
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);

  const pendingCount = expenses.filter(e => e.status === "pending").length;
  const pendingTotal = expenses.filter(e => e.status === "pending").reduce((sum, e) => sum + e.amount, 0);

  const handleApprove = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: "approved" as const } : e));
  };

  const handleReject = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: "rejected" as const } : e));
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)} style={[styles.summaryCard, { backgroundColor: "#1E3A8A" }]}>
        <View style={styles.summaryHeader}>
          <Shield size={24} color="#FFFFFF" />
          <Text style={styles.summaryTitle}>Monthly Overview</Text>
        </View>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Budget Used</Text>
            <Text style={styles.summaryValue}>
              ${BUDGET_DATA.used.toLocaleString()} / ${BUDGET_DATA.total.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summaryPending}>${pendingTotal.toFixed(2)}</Text>
          </View>
        </View>
        <View style={[styles.overallProgress, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
          <View
            style={[
              styles.overallFill,
              { width: `${(BUDGET_DATA.used / BUDGET_DATA.total) * 100}%` },
            ]}
          />
        </View>
      </Animated.View>

      <View style={styles.metricsRow}>
        <MetricCard
          icon={<Clock size={20} color="#F59E0B" />}
          title="Pending"
          value={pendingCount.toString()}
          delay={100}
        />
        <MetricCard
          icon={<CheckCircle size={20} color="#22C55E" />}
          title="Approved"
          value="24"
          change="+12%"
          changeType="up"
          delay={150}
        />
        <MetricCard
          icon={<Users size={20} color="#3B82F6" />}
          title="Active"
          value="8"
          delay={200}
        />
      </View>

      <Animated.View entering={FadeInDown.delay(250).duration(400)}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Budget by Category</Text>
        <View style={[styles.budgetCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {BUDGET_DATA.categories.map((cat, index) => (
            <BudgetProgress key={cat.name} category={cat} delay={300 + index * 50} />
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(400)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Pending Approvals</Text>
          <Pressable>
            <Text style={{ color: "#5533FF", fontWeight: "600" }}>View All</Text>
          </Pressable>
        </View>
        {expenses.filter(e => e.status === "pending").map((expense, index) => (
          <Animated.View key={expense.id} entering={FadeInDown.delay(450 + index * 50).duration(400)}>
            <ExpenseCard
              expense={expense}
              onApprove={() => handleApprove(expense.id)}
              onReject={() => handleReject(expense.id)}
            />
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  summaryCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  summaryRight: {
    alignItems: "flex-end",
  },
  summaryPending: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FCD34D",
  },
  overallProgress: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  overallFill: {
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 4,
  },
  metricsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  metricCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  metricIcon: {
    marginBottom: Spacing.sm,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  metricTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  budgetCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  budgetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  budgetInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    width: 80,
  },
  budgetDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  budgetName: {
    fontSize: 13,
    fontWeight: "500",
  },
  budgetBarContainer: {
    flex: 1,
  },
  budgetBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  budgetFill: {
    height: "100%",
    borderRadius: 3,
  },
  budgetPercent: {
    fontSize: 12,
    fontWeight: "600",
    width: 36,
    textAlign: "right",
  },
  expenseCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  expenseSubmitter: {
    fontSize: 13,
  },
  expenseAmountContainer: {
    alignItems: "flex-end",
  },
  expenseAmount: {
    fontSize: 17,
    fontWeight: "700",
  },
  urgencyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  expenseActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  rejectButton: {
    backgroundColor: "#FEE2E2",
  },
  approveButton: {
    backgroundColor: "#22C55E",
  },
  rejectText: {
    color: "#EF4444",
    fontWeight: "600",
  },
  approveText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default BusinessDashboard;
