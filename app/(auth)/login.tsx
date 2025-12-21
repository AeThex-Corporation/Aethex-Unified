import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { 
  Shield, 
  User, 
  Lock, 
  Building2, 
  GraduationCap,
  ArrowLeft,
  Fingerprint,
} from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAppStore } from "@/store/appStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MarketContext, EcosystemPillar } from "@/types/domain";
import { Code, Heart } from "lucide-react-native";

const getShadowStyle = (color: string, offset = 4, radius = 16, opacity = 0.4) => {
  if (Platform.OS === "web") {
    return {
      boxShadow: `0px ${offset}px ${radius}px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`,
    };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: offset },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: 8,
  };
};

type LoginMethod = null | "passport" | "foundry" | "council";

const PILLAR_CONFIG: Record<Exclude<LoginMethod, null>, { 
  pillar: EcosystemPillar; 
  title: string; 
  subtitle: string; 
  color: string;
  demoHint: string;
}> = {
  passport: { 
    pillar: "dev", 
    title: "AeThex Passport", 
    subtitle: "Developers & Creators",
    color: "#5533FF",
    demoHint: "Try: dev, admin, or community"
  },
  foundry: { 
    pillar: "studio", 
    title: "Foundry Portal", 
    subtitle: "Students & Mentors",
    color: "#22C55E",
    demoHint: "Try: student, mentor, or client"
  },
  council: { 
    pillar: "foundation", 
    title: "Council Chamber", 
    subtitle: "Governance & Donors",
    color: "#F59E0B",
    demoHint: "Try: council, donor, or voter"
  },
};

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>(null);
  const { loginWithPillar } = useAppStore();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!username.trim() || !loginMethod) {
      Alert.alert("Error", "Please enter your username");
      return;
    }

    const config = PILLAR_CONFIG[loginMethod];
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = await loginWithPillar(username, config.pillar);

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/home");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Invalid Credentials", "Please check your login details");
    }

    setIsLoading(false);
  };

  const selectMethod = (method: LoginMethod) => {
    setLoginMethod(method);
    setUsername("");
    setPassword("");
    Haptics.selectionAsync();
  };

  const renderMethodSelection = () => (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(200)}
      style={{ gap: 12 }}
    >
      <Pressable
        onPress={() => selectMethod("passport")}
        style={({ pressed }) => ({
          backgroundColor: pressed ? "#4422EE" : "#5533FF",
          borderRadius: 20,
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          ...getShadowStyle("#5533FF", 4, 12, 0.3),
        })}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Code size={24} color="#FFFFFF" strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: "#FFFFFF",
              marginBottom: 2,
            }}
          >
            AeThex Passport
          </Text>
          <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
            Developers, API users & community
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => selectMethod("foundry")}
        style={({ pressed }) => ({
          backgroundColor: pressed ? "#16A34A" : "#22C55E",
          borderRadius: 20,
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          ...getShadowStyle("#22C55E", 4, 12, 0.3),
        })}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GraduationCap size={24} color="#FFFFFF" strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: "#FFFFFF",
              marginBottom: 2,
            }}
          >
            Foundry Portal
          </Text>
          <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
            Students, clients & investors
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => selectMethod("council")}
        style={({ pressed }) => ({
          backgroundColor: pressed ? "#D97706" : "#F59E0B",
          borderRadius: 20,
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          ...getShadowStyle("#F59E0B", 4, 12, 0.3),
        })}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Heart size={24} color="#FFFFFF" strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: "#FFFFFF",
              marginBottom: 2,
            }}
          >
            Council Chamber
          </Text>
          <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
            Governance, donors & voters
          </Text>
        </View>
      </Pressable>

      <Text
        style={{
          fontSize: 13,
          color: "#64748b",
          textAlign: "center",
          marginTop: 8,
        }}
      >
        Choose your AeThex pillar
      </Text>
    </Animated.View>
  );

  const getIconForMethod = (method: Exclude<LoginMethod, null>) => {
    switch (method) {
      case "passport": return <Code size={22} color="#FFFFFF" />;
      case "foundry": return <GraduationCap size={22} color="#FFFFFF" />;
      case "council": return <Heart size={22} color="#FFFFFF" />;
    }
  };

  const getDemoAccounts = (method: Exclude<LoginMethod, null>): [string, string][] => {
    switch (method) {
      case "passport": return [["admin", "Day Mode"], ["dev", "Night Mode"]];
      case "foundry": return [["mentor", "Day Mode"], ["student", "Night Mode"]];
      case "council": return [["council", "Day Mode"], ["donor", "Night Mode"]];
    }
  };

  const renderPillarLogin = () => {
    if (!loginMethod) return null;
    const config = PILLAR_CONFIG[loginMethod];
    const demoAccounts = getDemoAccounts(loginMethod);

    return (
      <Animated.View
        entering={SlideInRight.duration(300)}
        exiting={SlideOutLeft.duration(200)}
        style={{ gap: 16 }}
      >
        <Pressable
          onPress={() => selectMethod(null)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <ArrowLeft size={20} color="#94a3b8" />
          <Text style={{ color: "#94a3b8", fontSize: 15 }}>Back</Text>
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: config.color,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {getIconForMethod(loginMethod)}
          </View>
          <View>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#F8FAFC" }}>
              {config.title}
            </Text>
            <Text style={{ fontSize: 13, color: "#94a3b8" }}>
              {config.subtitle}
            </Text>
          </View>
        </View>

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
              placeholder="Username or email"
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
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
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
            backgroundColor: config.color,
            borderRadius: 16,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
            opacity: pressed || isLoading ? 0.8 : 1,
            ...getShadowStyle(config.color, 0, 20, 0.4),
          })}
        >
          <Fingerprint size={20} color="#F8FAFC" />
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              color: "#F8FAFC",
            }}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </Text>
        </Pressable>

        <View
          style={{
            backgroundColor: "#1a1a24",
            borderRadius: 12,
            padding: 16,
            marginTop: 8,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: "#64748b",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Demo Accounts
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {demoAccounts.map(([name, desc]) => (
              <Pressable
                key={name}
                onPress={() => setUsername(name)}
                style={{
                  flex: 1,
                  backgroundColor: `${config.color}20`,
                  borderWidth: 1,
                  borderColor: config.color,
                  borderRadius: 8,
                  padding: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: config.color, fontWeight: "600" }}>{name}</Text>
                <Text style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>
                  {desc}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#020817",
        }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          entering={FadeInUp.delay(100).duration(600)}
          style={{ alignItems: "center", marginBottom: 40 }}
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
              ...getShadowStyle("#5533FF", 4, 16, 0.4),
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
            Compliance meets creation
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          {loginMethod === null ? renderMethodSelection() : renderPillarLogin()}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
