import { View, Text, ScrollView, Pressable, Switch, Alert, Platform } from "react-native";
import {
  User,
  Moon,
  Sun,
  LogOut,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Zap,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeIn, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAppStore, useTheme } from "@/store/appStore";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  delay: number;
}

function MenuItem({ icon, title, subtitle, onPress, rightElement, delay }: MenuItemProps) {
  const theme = useTheme();
  const { mode } = useAppStore();

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor: mode === "day" ? "#f8fafc" : "#1a1a24",
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: mode === "day" ? "#e2e8f0" : "#2d2d3a",
          flexDirection: "row",
          alignItems: "center",
          opacity: pressed && onPress ? 0.8 : 1,
        })}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: mode === "day" ? "#1e3a8a20" : "#22c55e20",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: theme.text }}>
            {title}
          </Text>
          {subtitle && (
            <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>
              {subtitle}
            </Text>
          )}
        </View>
        {rightElement || <ChevronRight size={20} color={theme.textSecondary} />}
      </Pressable>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const { mode, user, toggleMode, logout } = useAppStore();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const handleToggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    toggleMode();
  };

  const performLogout = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    logout();
    router.replace("/(auth)/login");
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to sign out?");
      if (confirmed) {
        performLogout();
      }
    } else {
      Alert.alert(
        "Sign Out",
        "Are you sure you want to sign out?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign Out",
            style: "destructive",
            onPress: performLogout,
          },
        ]
      );
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
    >
      <Animated.View
        entering={ZoomIn.duration(400)}
        style={{
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: mode === "day" ? "#1e3a8a" : "#22c55e",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: mode === "day" ? "#ffffff" : "#0B0A0F",
            }}
          >
            {user?.avatar || "??"}
          </Text>
        </View>
        <Text style={{ fontSize: 24, fontWeight: "700", color: theme.text }}>
          {user?.name || "Unknown User"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
            backgroundColor: mode === "day" ? "#1e3a8a20" : "#22c55e20",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          {mode === "day" ? (
            <Shield size={14} color={theme.accent} />
          ) : (
            <Zap size={14} color={theme.accent} />
          )}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: theme.accent,
              marginLeft: 6,
            }}
          >
            {user?.role || "User"}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(200).duration(400)}
        style={{
          backgroundColor: mode === "day" ? "#1e3a8a" : "#22c55e",
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {mode === "day" ? (
              <Sun size={24} color="#ffffff" />
            ) : (
              <Moon size={24} color="#0B0A0F" />
            )}
            <View style={{ marginLeft: 12 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: mode === "day" ? "#ffffff" : "#0B0A0F",
                }}
              >
                {mode === "day" ? "Day Mode" : "Night Mode"}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: mode === "day" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)",
                }}
              >
                {mode === "day" ? "Enterprise Interface" : "Creator Interface"}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={handleToggleMode}
            style={({ pressed }) => ({
              backgroundColor: mode === "day" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: mode === "day" ? "#ffffff" : "#0B0A0F",
              }}
            >
              Switch View
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: theme.textSecondary,
          marginBottom: 12,
          marginLeft: 4,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Settings
      </Text>

      <MenuItem
        icon={<Bell size={22} color={theme.accent} />}
        title="Notifications"
        subtitle="Manage your alerts"
        delay={300}
      />
      <MenuItem
        icon={<Settings size={22} color={theme.accent} />}
        title="Preferences"
        subtitle="App settings and display"
        delay={350}
      />
      <MenuItem
        icon={<Shield size={22} color={theme.accent} />}
        title="Privacy & Security"
        subtitle="Account protection"
        delay={400}
      />
      <MenuItem
        icon={<HelpCircle size={22} color={theme.accent} />}
        title="Help & Support"
        subtitle="Get help with the app"
        delay={450}
      />

      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: theme.textSecondary,
          marginBottom: 12,
          marginTop: 12,
          marginLeft: 4,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Account
      </Text>

      <MenuItem
        icon={<LogOut size={22} color="#ef4444" />}
        title="Sign Out"
        subtitle="Sign out of your account"
        onPress={handleLogout}
        delay={500}
        rightElement={null}
      />

      <Animated.View
        entering={FadeIn.delay(600).duration(400)}
        style={{ alignItems: "center", marginTop: 24 }}
      >
        <Text style={{ fontSize: 13, color: theme.textSecondary }}>
          AeThex Companion v1.0.0
        </Text>
      </Animated.View>
    </ScrollView>
  );
}
