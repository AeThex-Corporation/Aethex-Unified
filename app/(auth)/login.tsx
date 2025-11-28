import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Shield, Zap, User, Lock, Building2, GraduationCap } from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAppStore } from "@/store/appStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MarketContext } from "@/types/domain";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContext, setSelectedContext] = useState<MarketContext>("business");
  const { login } = useAppStore();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a username");
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = await login(username, selectedContext);

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/home");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Invalid Credentials",
        selectedContext === "business"
          ? "Use 'admin' for Day Mode or 'creator' for Night Mode"
          : "Use 'teacher' for Day Mode or 'student' for Night Mode"
      );
    }

    setIsLoading(false);
  };

  const contextOptions = [
    {
      id: "business" as MarketContext,
      label: "Small Business",
      icon: Building2,
      color: "#5533FF",
      description: "Expenses, Approvals, Bounties",
    },
    {
      id: "education" as MarketContext,
      label: "K-12 Education",
      icon: GraduationCap,
      color: "#7755FF",
      description: "Compliance, Rostering, Safety",
    },
  ];

  const demoAccounts = selectedContext === "business"
    ? [
        { username: "admin", label: "Owner", mode: "Day Mode", color: "#5533FF" },
        { username: "creator", label: "Contractor", mode: "Night Mode", color: "#5533FF" },
      ]
    : [
        { username: "teacher", label: "Teacher", mode: "Day Mode", color: "#5533FF" },
        { username: "student", label: "Student", mode: "Night Mode", color: "#5533FF" },
      ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#020817",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          <Animated.View
            entering={FadeInUp.delay(100).duration(600)}
            style={{ alignItems: "center", marginBottom: 32 }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                backgroundColor: "#5533FF",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Shield size={40} color="#F8FAFC" strokeWidth={2.5} />
            </View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#f8fafc",
                marginBottom: 8,
              }}
            >
              AeThex Companion
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#94a3b8",
                textAlign: "center",
              }}
            >
              Dual-mode compliance platform
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(600)}
            style={{ marginBottom: 20 }}
          >
            <Text
              style={{
                fontSize: 13,
                color: "#64748b",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Select Mode
            </Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              {contextOptions.map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    setSelectedContext(option.id);
                    setUsername("");
                    Haptics.selectionAsync();
                  }}
                  style={{
                    flex: 1,
                    backgroundColor:
                      selectedContext === option.id
                        ? `${option.color}20`
                        : "#1a1a24",
                    borderWidth: 2,
                    borderColor:
                      selectedContext === option.id
                        ? option.color
                        : "#2d2d3a",
                    borderRadius: 12,
                    padding: 16,
                    alignItems: "center",
                  }}
                >
                  <option.icon
                    size={24}
                    color={
                      selectedContext === option.id
                        ? option.color
                        : "#64748b"
                    }
                  />
                  <Text
                    style={{
                      color:
                        selectedContext === option.id
                          ? option.color
                          : "#94a3b8",
                      fontWeight: "600",
                      fontSize: 14,
                      marginTop: 8,
                    }}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={{
                      color: "#64748b",
                      fontSize: 11,
                      marginTop: 4,
                      textAlign: "center",
                    }}
                  >
                    {option.description}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            style={{ gap: 16 }}
          >
            <View
              style={{
                backgroundColor: "#1a1a24",
                borderRadius: 16,
                padding: 20,
                gap: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#252530",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  height: 56,
                }}
              >
                <User size={20} color="#94a3b8" />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Username"
                  placeholderTextColor="#64748b"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 16,
                    color: "#f8fafc",
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#252530",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  height: 56,
                }}
              >
                <Lock size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Password (any)"
                  placeholderTextColor="#64748b"
                  secureTextEntry
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 16,
                    color: "#f8fafc",
                  }}
                />
              </View>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => ({
                backgroundColor: "#5533FF",
                borderRadius: 16,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
                opacity: pressed || isLoading ? 0.8 : 1,
                shadowColor: "#5533FF",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
              })}
            >
              <Shield size={20} color="#F8FAFC" />
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "600",
                  color: "#F8FAFC",
                }}
              >
                {isLoading ? "Authenticating..." : "Sign in with AeThex Passport"}
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeIn.delay(400).duration(600)}
            style={{
              marginTop: 24,
              padding: 16,
              backgroundColor: "#1a1a24",
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#94a3b8",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Demo Accounts ({selectedContext === "business" ? "Business" : "Education"})
            </Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              {demoAccounts.map((account) => (
                <Pressable
                  key={account.username}
                  onPress={() => setUsername(account.username)}
                  style={{
                    flex: 1,
                    backgroundColor: `${account.color}20`,
                    borderWidth: 1,
                    borderColor: account.color,
                    borderRadius: 8,
                    padding: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: account.color, fontWeight: "600" }}>
                    {account.username}
                  </Text>
                  <Text style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>
                    {account.label}
                  </Text>
                  <Text style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>
                    {account.mode}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
