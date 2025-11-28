import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import {
  Home,
  Scan,
  ClipboardList,
  User,
  Rss,
  Wallet,
  Users,
} from "lucide-react-native";
import { useAppStore, useTheme } from "@/store/appStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";

interface TabIconProps {
  icon: React.ReactNode;
  label: string;
  focused: boolean;
  color: string;
}

function TabIcon({ icon, label, focused, color }: TabIconProps) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", gap: 4 }}>
      {icon}
      <Text
        style={{
          fontSize: 10,
          fontWeight: focused ? "600" : "400",
          color,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { mode } = useAppStore();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const dayTabs = [
    { name: "home", label: "Home", icon: Home },
    { name: "scanner", label: "Scan", icon: Scan },
    { name: "actions", label: "Actions", icon: ClipboardList },
    { name: "profile", label: "Profile", icon: User },
  ];

  const nightTabs = [
    { name: "home", label: "Feed", icon: Rss },
    { name: "scanner", label: "Wallet", icon: Wallet },
    { name: "actions", label: "Guild", icon: Users },
    { name: "profile", label: "Profile", icon: User },
  ];

  const tabs = mode === "day" ? dayTabs : nightTabs;

  return (
    <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            color: theme.text,
            fontWeight: "600",
          },
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: mode === "day" ? "#ffffff" : "#13131a",
            borderTopColor: theme.border,
            borderTopWidth: 1,
            height: 60 + insets.bottom,
            paddingTop: 8,
            paddingBottom: insets.bottom,
          },
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: mode === "day" ? "Compliance Dashboard" : "Bounty Feed",
            tabBarIcon: ({ color, focused }) => {
              const IconComponent = tabs[0].icon;
              return (
                <TabIcon
                  icon={<IconComponent size={22} color={color} />}
                  label={tabs[0].label}
                  focused={focused}
                  color={color}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="scanner"
          options={{
            title: mode === "day" ? "Receipt Scanner" : "Digital Wallet",
            tabBarIcon: ({ color, focused }) => {
              const IconComponent = tabs[1].icon;
              return (
                <TabIcon
                  icon={<IconComponent size={22} color={color} />}
                  label={tabs[1].label}
                  focused={focused}
                  color={color}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="actions"
          options={{
            title: mode === "day" ? "Pending Actions" : "Guild Chat",
            tabBarIcon: ({ color, focused }) => {
              const IconComponent = tabs[2].icon;
              return (
                <TabIcon
                  icon={<IconComponent size={22} color={color} />}
                  label={tabs[2].label}
                  focused={focused}
                  color={color}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => {
              const IconComponent = tabs[3].icon;
              return (
                <TabIcon
                  icon={<IconComponent size={22} color={color} />}
                  label={tabs[3].label}
                  focused={focused}
                  color={color}
                />
              );
            },
          }}
        />
      </Tabs>
    </Animated.View>
  );
}
