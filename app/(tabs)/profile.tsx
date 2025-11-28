import { View, Text, ScrollView, Pressable, Alert, Platform } from "react-native";
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
  Building2,
  GraduationCap,
  Globe,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeIn, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAppStore, useTheme, useTerminology } from "@/store/appStore";
import { ConsentStatus } from "@/components/GuardianConsentBanner";

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
            backgroundColor: "#5533FF20",
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
        {rightElement !== null && (rightElement || <ChevronRight size={20} color={theme.textSecondary} />)}
      </Pressable>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const { mode, currentMember, marketContext, organization, toggleMode, logout, getTotalXP } = useAppStore();
  const theme = useTheme();
  const terminology = useTerminology();
  const insets = useSafeAreaInsets();
  const totalXP = getTotalXP();

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

  const isEducation = marketContext === "education";
  const avatar = currentMember?.avatar || currentMember?.name?.split(" ").map(n => n[0]).join("") || "??";

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
            backgroundColor: "#5533FF",
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
            {avatar}
          </Text>
        </View>
        <Text style={{ fontSize: 24, fontWeight: "700", color: theme.text }}>
          {currentMember?.name || "Unknown User"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
            backgroundColor: mode === "day" ? (isEducation ? "#8b5cf620" : "#1e3a8a20") : "#22c55e20",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          {mode === "day" ? (
            isEducation ? <GraduationCap size={14} color={theme.accent} /> : <Shield size={14} color={theme.accent} />
          ) : (
            <Zap size={14} color={theme.accent} />
          )}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: theme.accent,
              marginLeft: 6,
              textTransform: "capitalize",
            }}
          >
            {currentMember?.role || "User"}
          </Text>
        </View>

        {mode === "night" && totalXP > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
              backgroundColor: "#5533FF20",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#5533FF40",
            }}
          >
            <Zap size={16} color="#5533FF" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#5533FF",
                marginLeft: 6,
              }}
            >
              {totalXP} XP
            </Text>
          </View>
        )}
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(100).duration(400)}
        style={{
          backgroundColor: "#5533FF20",
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#5533FF40",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {isEducation ? (
          <GraduationCap size={20} color={theme.accent} />
        ) : (
          <Building2 size={20} color={theme.accent} />
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text }}>
            {organization?.name || terminology.organization}
          </Text>
          <Text style={{ fontSize: 12, color: theme.textSecondary }}>
            {isEducation ? "K-12 Education Mode" : "Small Business Mode"}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#5533FF",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
          }}
        >
          <Text style={{ fontSize: 10, color: "#ffffff", fontWeight: "600" }}>
            {organization?.tier?.toUpperCase() || "PRO"}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(200).duration(400)}
        style={{
          backgroundColor: "#5533FF",
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
                {mode === "day" 
                  ? (isEducation ? "Admin Interface" : "Enterprise Interface")
                  : (isEducation ? "Student Interface" : "Creator Interface")
                }
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

      {isEducation && currentMember?.role === "student" && (
        <>
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
            Guardian Consent
          </Text>
          <Animated.View
            entering={FadeIn.delay(250).duration(400)}
            style={{
              backgroundColor: mode === "day" ? "#f8fafc" : "#1a1a24",
              borderRadius: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: mode === "day" ? "#e2e8f0" : "#2d2d3a",
            }}
          >
            <ConsentStatus studentId={currentMember.id} />
          </Animated.View>
        </>
      )}

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
        title={isEducation ? "Compliance Settings" : "Privacy & Security"}
        subtitle={isEducation ? "FERPA and safety settings" : "Account protection"}
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
        <Text style={{ fontSize: 11, color: theme.textSecondary, marginTop: 4 }}>
          {isEducation ? "FERPA & COPPA Compliant" : "Enterprise Ready"}
        </Text>
      </Animated.View>
    </ScrollView>
  );
}
