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
import { MarketContext } from "@/types/domain";

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

type LoginMethod = null | "passport" | "district";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>(null);
  const { login } = useAppStore();
  const insets = useSafeAreaInsets();

  const handleLogin = async (context: MarketContext) => {
    if (!username.trim()) {
      Alert.alert("Error", "Please enter your username");
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = await login(username, context);

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
      style={{ gap: 16 }}
    >
      <Pressable
        onPress={() => selectMethod("passport")}
        style={({ pressed }) => ({
          backgroundColor: pressed ? "#4422EE" : "#5533FF",
          borderRadius: 20,
          padding: 24,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          ...getShadowStyle("#5533FF", 4, 12, 0.3),
        })}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Shield size={28} color="#FFFFFF" strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#FFFFFF",
              marginBottom: 4,
            }}
          >
            Sign In with AeThex Passport
          </Text>
          <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
            For creators, contractors, and staff
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => selectMethod("district")}
        style={({ pressed }) => ({
          backgroundColor: pressed ? "#1a1a24" : "#1E293B",
          borderRadius: 20,
          padding: 24,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          borderWidth: 2,
          borderColor: "#334155",
        })}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: "#334155",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GraduationCap size={28} color="#94a3b8" strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#F8FAFC",
              marginBottom: 4,
            }}
          >
            Sign In with District Credentials
          </Text>
          <Text style={{ fontSize: 14, color: "#94a3b8" }}>
            For students and school administrators
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
        Choose how you connect to AeThex
      </Text>
    </Animated.View>
  );

  const renderPassportLogin = () => (
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
            backgroundColor: "#5533FF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Shield size={22} color="#FFFFFF" />
        </View>
        <View>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#F8FAFC" }}>
            AeThex Passport
          </Text>
          <Text style={{ fontSize: 13, color: "#94a3b8" }}>
            Creator and Staff Access
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
        onPress={() => handleLogin("business")}
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
          ...getShadowStyle("#5533FF", 0, 20, 0.4),
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
          <Pressable
            onPress={() => setUsername("admin")}
            style={{
              flex: 1,
              backgroundColor: "#5533FF20",
              borderWidth: 1,
              borderColor: "#5533FF",
              borderRadius: 8,
              padding: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#5533FF", fontWeight: "600" }}>admin</Text>
            <Text style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>
              Owner / Day Mode
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setUsername("creator")}
            style={{
              flex: 1,
              backgroundColor: "#5533FF20",
              borderWidth: 1,
              borderColor: "#5533FF",
              borderRadius: 8,
              padding: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#5533FF", fontWeight: "600" }}>creator</Text>
            <Text style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>
              Contractor / Night Mode
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );

  const renderDistrictLogin = () => (
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
            backgroundColor: "#334155",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GraduationCap size={22} color="#94a3b8" />
        </View>
        <View>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#F8FAFC" }}>
            District Credentials
          </Text>
          <Text style={{ fontSize: 13, color: "#94a3b8" }}>
            Student and Admin Access
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
          <Building2 size={20} color="#94a3b8" />
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Student or staff ID"
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
        onPress={() => handleLogin("education")}
        disabled={isLoading}
        style={({ pressed }) => ({
          backgroundColor: "#334155",
          borderRadius: 16,
          height: 56,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          opacity: pressed || isLoading ? 0.8 : 1,
          borderWidth: 2,
          borderColor: "#475569",
        })}
      >
        <GraduationCap size={20} color="#F8FAFC" />
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
          <Pressable
            onPress={() => setUsername("teacher")}
            style={{
              flex: 1,
              backgroundColor: "#33415520",
              borderWidth: 1,
              borderColor: "#475569",
              borderRadius: 8,
              padding: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#94a3b8", fontWeight: "600" }}>teacher</Text>
            <Text style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>
              Educator / Day Mode
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setUsername("student")}
            style={{
              flex: 1,
              backgroundColor: "#33415520",
              borderWidth: 1,
              borderColor: "#475569",
              borderRadius: 8,
              padding: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#94a3b8", fontWeight: "600" }}>student</Text>
            <Text style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>
              Student / Night Mode
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );

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
          {loginMethod === null && renderMethodSelection()}
          {loginMethod === "passport" && renderPassportLogin()}
          {loginMethod === "district" && renderDistrictLogin()}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
