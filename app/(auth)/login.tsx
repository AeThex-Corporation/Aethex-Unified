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
import { Shield, Zap, User, Lock } from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAppStore } from "@/store/appStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    const success = await login(username);

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/home");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Invalid Credentials",
        "Use 'admin' for Day Mode or 'creator' for Night Mode"
      );
    }

    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B0A0F",
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
            style={{ alignItems: "center", marginBottom: 48 }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                backgroundColor: "#22c55e",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Shield size={40} color="#0B0A0F" strokeWidth={2.5} />
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
              Your portal to two worlds
            </Text>
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
                backgroundColor: "#22c55e",
                borderRadius: 16,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
                opacity: pressed || isLoading ? 0.8 : 1,
              })}
            >
              <Shield size={20} color="#0B0A0F" />
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "600",
                  color: "#0B0A0F",
                }}
              >
                {isLoading ? "Authenticating..." : "Sign in with AeThex Passport"}
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeIn.delay(400).duration(600)}
            style={{
              marginTop: 32,
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
              Demo Accounts
            </Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable
                onPress={() => setUsername("admin")}
                style={{
                  flex: 1,
                  backgroundColor: "#1e3a8a20",
                  borderWidth: 1,
                  borderColor: "#1e3a8a",
                  borderRadius: 8,
                  padding: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#3b82f6", fontWeight: "600" }}>
                  admin
                </Text>
                <Text style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>
                  Day Mode
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setUsername("creator")}
                style={{
                  flex: 1,
                  backgroundColor: "#22c55e20",
                  borderWidth: 1,
                  borderColor: "#22c55e",
                  borderRadius: 8,
                  padding: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#22c55e", fontWeight: "600" }}>
                  creator
                </Text>
                <Text style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>
                  Night Mode
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
