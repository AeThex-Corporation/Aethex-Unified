import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import DashboardStackNavigator from "@/navigation/DashboardStackNavigator";
import HabitsStackNavigator from "@/navigation/HabitsStackNavigator";
import StudyStackNavigator from "@/navigation/StudyStackNavigator";
import FinanceStackNavigator from "@/navigation/FinanceStackNavigator";
import MindfulStackNavigator from "@/navigation/MindfulStackNavigator";
import FitnessStackNavigator from "@/navigation/FitnessStackNavigator";
import { useTheme } from "@/hooks/useTheme";

export type MainTabParamList = {
  DashboardTab: undefined;
  HabitsTab: undefined;
  StudyTab: undefined;
  FinanceTab: undefined;
  MindfulTab: undefined;
  FitnessTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStackNavigator}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="HabitsTab"
        component={HabitsStackNavigator}
        options={{
          title: "Habits",
          tabBarIcon: ({ color, size }) => (
            <Feather name="check-square" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StudyTab"
        component={StudyStackNavigator}
        options={{
          title: "Study",
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FinanceTab"
        component={FinanceStackNavigator}
        options={{
          title: "Finance",
          tabBarIcon: ({ color, size }) => (
            <Feather name="dollar-sign" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MindfulTab"
        component={MindfulStackNavigator}
        options={{
          title: "Mindful",
          tabBarIcon: ({ color, size }) => (
            <Feather name="heart" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FitnessTab"
        component={FitnessStackNavigator}
        options={{
          title: "Fitness",
          tabBarIcon: ({ color, size }) => (
            <Feather name="activity" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
