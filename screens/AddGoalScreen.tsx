import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography, ModuleColors } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { FinanceStackParamList } from "@/navigation/FinanceStackNavigator";

type AddGoalScreenProps = {
  navigation: NativeStackNavigationProp<FinanceStackParamList, "AddGoal">;
};

export default function AddGoalScreen({ navigation }: AddGoalScreenProps) {
  const { theme, isDark } = useTheme();
  const { addFinancialGoal } = useAppStore();
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");

  const handleSave = () => {
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;
    if (!name.trim() || isNaN(target) || target <= 0) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addFinancialGoal({
      name: name.trim(),
      targetAmount: target,
      currentAmount: current,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
    navigation.goBack();
  };

  const isValid = name.trim() && parseFloat(targetAmount) > 0;

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Goal Name
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.backgroundDefault, color: theme.text },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Emergency Fund, Vacation"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          autoFocus
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Target Amount
        </ThemedText>
        <View style={[styles.amountInput, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="h3" style={{ color: theme.textSecondary }}>
            $
          </ThemedText>
          <TextInput
            style={[styles.amountField, { color: theme.text }]}
            value={targetAmount}
            onChangeText={setTargetAmount}
            placeholder="0.00"
            placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Current Savings (optional)
        </ThemedText>
        <View style={[styles.amountInput, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="h3" style={{ color: theme.textSecondary }}>
            $
          </ThemedText>
          <TextInput
            style={[styles.amountField, { color: theme.text }]}
            value={currentAmount}
            onChangeText={setCurrentAmount}
            placeholder="0.00"
            placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {isValid ? (
        <View style={[styles.previewCard, { backgroundColor: ModuleColors.finance + "15" }]}>
          <ThemedText type="body" style={{ color: ModuleColors.finance }}>
            Goal Preview
          </ThemedText>
          <ThemedText type="h4">{name}</ThemedText>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: ModuleColors.finance,
                  width: `${Math.min(((parseFloat(currentAmount) || 0) / parseFloat(targetAmount)) * 100, 100)}%`,
                },
              ]}
            />
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            ${parseFloat(currentAmount) || 0} of ${parseFloat(targetAmount)} saved
          </ThemedText>
        </View>
      ) : null}

      <Button onPress={handleSave} disabled={!isValid}>
        Create Goal
      </Button>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
    opacity: 0.8,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.body.fontSize,
  },
  amountInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    height: 56,
    gap: Spacing.xs,
  },
  amountField: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
  },
  previewCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});
