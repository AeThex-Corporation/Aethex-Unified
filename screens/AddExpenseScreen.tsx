import React, { useState } from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { FinanceStackParamList } from "@/navigation/FinanceStackNavigator";

const CATEGORIES = [
  { name: "Food", icon: "coffee", color: "#F59E0B" },
  { name: "Entertainment", icon: "film", color: "#EC4899" },
  { name: "Utilities", icon: "zap", color: "#6366F1" },
  { name: "Transport", icon: "truck", color: "#10B981" },
  { name: "Shopping", icon: "shopping-bag", color: "#8B5CF6" },
  { name: "Health", icon: "heart", color: "#EF4444" },
  { name: "Other", icon: "more-horizontal", color: "#64748B" },
];

type AddExpenseScreenProps = {
  navigation: NativeStackNavigationProp<FinanceStackParamList, "AddExpense">;
};

export default function AddExpenseScreen({ navigation }: AddExpenseScreenProps) {
  const { theme, isDark } = useTheme();
  const { addExpense } = useAppStore();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Food");

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addExpense({
      amount: numAmount,
      category: selectedCategory,
      description: description.trim() || selectedCategory,
    });
    navigation.goBack();
  };

  const isValid = parseFloat(amount) > 0;

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Amount
        </ThemedText>
        <View style={[styles.amountInput, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="h2" style={{ color: theme.textSecondary }}>
            $
          </ThemedText>
          <TextInput
            style={[styles.amountField, { color: theme.text }]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
            keyboardType="decimal-pad"
            autoFocus
          />
        </View>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Description (optional)
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.backgroundDefault, color: theme.text },
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder="What was this for?"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Category
        </ThemedText>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.name}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(cat.name);
              }}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    selectedCategory === cat.name ? cat.color + "20" : theme.backgroundSecondary,
                  borderColor: selectedCategory === cat.name ? cat.color : "transparent",
                  borderWidth: 2,
                },
              ]}
            >
              <Feather
                name={cat.icon as keyof typeof Feather.glyphMap}
                size={20}
                color={selectedCategory === cat.name ? cat.color : theme.textSecondary}
              />
              <ThemedText
                type="small"
                style={{
                  color: selectedCategory === cat.name ? cat.color : theme.textSecondary,
                }}
              >
                {cat.name}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <Button onPress={handleSave} disabled={!isValid}>
        Add Expense
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
  amountInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    height: 72,
    gap: Spacing.xs,
  },
  amountField: {
    flex: 1,
    fontSize: 36,
    fontWeight: "600",
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.body.fontSize,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
});
