import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeInDown,
  FadeIn,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/store/appStore";
import { Transaction, gamificationService } from "@/services/gamificationService";
import { GlassCard } from "./GlassCard";
import { BorderRadius, Spacing } from "@/constants/theme";

interface BalanceCardProps {
  onWithdraw?: () => void;
}

export function BalanceCard({ onWithdraw }: BalanceCardProps) {
  const theme = useTheme();
  const balance = gamificationService.getBalance();
  
  const availableScale = useSharedValue(0.9);
  const pendingFade = useSharedValue(0);

  useEffect(() => {
    availableScale.value = withDelay(200, withSpring(1, { damping: 12 }));
    pendingFade.value = withDelay(400, withSpring(1));
  }, []);

  const availableStyle = useAnimatedStyle(() => ({
    transform: [{ scale: availableScale.value }],
    opacity: availableScale.value,
  }));

  const pendingStyle = useAnimatedStyle(() => ({
    opacity: pendingFade.value,
  }));

  const handleWithdraw = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onWithdraw?.();
  };

  return (
    <GlassCard style={styles.balanceCard}>
      <View style={styles.balanceHeader}>
        <View style={styles.walletIcon}>
          <Feather name="credit-card" size={20} color={theme.accent} />
        </View>
        <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
          Available Balance
        </Text>
      </View>

      <Animated.View style={availableStyle}>
        <Text style={[styles.balanceAmount, { color: theme.text }]}>
          ${balance.available.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </Text>
      </Animated.View>

      <Animated.View style={[styles.pendingRow, pendingStyle]}>
        <View style={styles.pendingItem}>
          <Feather name="clock" size={14} color="#F59E0B" />
          <Text style={[styles.pendingText, { color: theme.textSecondary }]}>
            ${balance.pending.toLocaleString()} pending
          </Text>
        </View>
        <View style={styles.pendingItem}>
          <Feather name="trending-up" size={14} color="#22C55E" />
          <Text style={[styles.pendingText, { color: theme.textSecondary }]}>
            ${balance.totalEarnings.toLocaleString()} total earned
          </Text>
        </View>
      </Animated.View>

      <View style={styles.balanceActions}>
        <Pressable
          onPress={handleWithdraw}
          style={[styles.withdrawButton, { backgroundColor: theme.accent }]}
        >
          <Feather name="arrow-up-right" size={18} color="#FFFFFF" />
          <Text style={styles.withdrawText}>Withdraw</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.secondary }]}
        >
          <Feather name="plus" size={18} color={theme.text} />
        </Pressable>
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.secondary }]}
        >
          <Feather name="send" size={18} color={theme.text} />
        </Pressable>
      </View>
    </GlassCard>
  );
}

interface TransactionItemProps {
  transaction: Transaction;
  index: number;
}

function TransactionItem({ transaction, index }: TransactionItemProps) {
  const theme = useTheme();

  const typeConfig: Record<string, { icon: keyof typeof Feather.glyphMap; color: string; prefix: string }> = {
    earning: { icon: "arrow-down-left", color: "#22C55E", prefix: "+" },
    payout: { icon: "arrow-up-right", color: "#EF4444", prefix: "-" },
    bonus: { icon: "gift", color: "#F59E0B", prefix: "+" },
    transfer: { icon: "repeat", color: "#6366F1", prefix: "" },
  };

  const config = typeConfig[transaction.type];
  const formattedDate = new Date(transaction.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={[styles.transactionItem, { borderBottomColor: theme.border }]}
    >
      <View
        style={[
          styles.transactionIcon,
          { backgroundColor: `${config.color}20` },
        ]}
      >
        <Feather name={config.icon} size={18} color={config.color} />
      </View>

      <View style={styles.transactionInfo}>
        <Text style={[styles.transactionTitle, { color: theme.text }]} numberOfLines={1}>
          {transaction.description}
        </Text>
        <View style={styles.transactionMeta}>
          <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>
            {formattedDate}
          </Text>
          {transaction.status === "pending" && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>Pending</Text>
            </View>
          )}
        </View>
      </View>

      <Text
        style={[
          styles.transactionAmount,
          { color: transaction.type === "payout" ? "#EF4444" : "#22C55E" },
        ]}
      >
        {config.prefix}
        {transaction.currency === "XP" 
          ? `${transaction.amount} XP`
          : `$${transaction.amount.toLocaleString()}`}
      </Text>
    </Animated.View>
  );
}

export function TransactionHistory() {
  const theme = useTheme();
  const transactions = gamificationService.getTransactions();

  return (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: theme.text }]}>
          Transaction History
        </Text>
        <Pressable>
          <Text style={[styles.viewAllText, { color: theme.accent }]}>
            View All
          </Text>
        </Pressable>
      </View>

      <GlassCard style={styles.transactionList}>
        {transactions.slice(0, 6).map((transaction, index) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            index={index}
          />
        ))}
      </GlassCard>
    </View>
  );
}

export function WalletOverview() {
  return (
    <View style={styles.overviewContainer}>
      <BalanceCard />
      <TransactionHistory />
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    padding: Spacing.xl,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: Spacing.md,
  },
  pendingRow: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  pendingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pendingText: {
    fontSize: 13,
    fontWeight: "500",
  },
  balanceActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  withdrawButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  withdrawText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  historyContainer: {
    marginTop: Spacing.xl,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  transactionList: {
    padding: 0,
    overflow: "hidden",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  transactionDate: {
    fontSize: 12,
  },
  pendingBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#F59E0B",
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "700",
  },
  overviewContainer: {
    gap: Spacing.md,
  },
});
