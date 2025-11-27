import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FinanceScreen from "@/screens/FinanceScreen";
import AddExpenseScreen from "@/screens/AddExpenseScreen";
import AddGoalScreen from "@/screens/AddGoalScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type FinanceStackParamList = {
  Finance: undefined;
  AddExpense: undefined;
  AddGoal: undefined;
};

const Stack = createNativeStackNavigator<FinanceStackParamList>();

export default function FinanceStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Finance"
        component={FinanceScreen}
        options={{ headerTitle: "Finance Coach" }}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ headerTitle: "Add Expense" }}
      />
      <Stack.Screen
        name="AddGoal"
        component={AddGoalScreen}
        options={{ headerTitle: "New Goal" }}
      />
    </Stack.Navigator>
  );
}
