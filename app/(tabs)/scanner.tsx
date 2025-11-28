import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import {
  Camera,
  Receipt,
  Clock,
  DollarSign,
  QrCode,
  Shield,
  CheckCircle,
  Star,
  Award,
} from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore, useTheme } from "@/store/appStore";
import { useEffect } from "react";

function DayModeScanner() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [isScanning, setIsScanning] = useState(false);

  const recentExpenses = [
    { title: "Office Supplies", amount: "$45.99", date: "Today", category: "Supplies" },
    { title: "Team Lunch", amount: "$156.00", date: "Yesterday", category: "Food" },
    { title: "Software License", amount: "$299.00", date: "Dec 15", category: "Software" },
    { title: "Travel Expense", amount: "$89.50", date: "Dec 14", category: "Travel" },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <Pressable
          onPress={() => setIsScanning(!isScanning)}
          style={({ pressed }) => ({
            backgroundColor: isScanning ? "#22c55e" : "#1e3a8a",
            borderRadius: 24,
            padding: 32,
            alignItems: "center",
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Camera size={40} color="#ffffff" />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            {isScanning ? "Scanning..." : "Tap to Scan Receipt"}
          </Text>
          <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
            {isScanning ? "Point camera at receipt" : "Quick expense capture"}
          </Text>
        </Pressable>
      </Animated.View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: theme.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Recent Expenses
      </Text>

      {recentExpenses.map((expense, index) => (
        <Animated.View
          key={index}
          entering={FadeInDown.delay(100 + index * 50).duration(400)}
        >
          <View
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "#e2e8f0",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: "#1e3a8a20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Receipt size={24} color="#1e3a8a" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "500", color: theme.text }}>
                {expense.title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Clock size={12} color={theme.textSecondary} />
                <Text
                  style={{
                    fontSize: 13,
                    color: theme.textSecondary,
                    marginLeft: 4,
                  }}
                >
                  {expense.date}
                </Text>
                <View
                  style={{
                    backgroundColor: "#e2e8f0",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                >
                  <Text style={{ fontSize: 11, color: theme.textSecondary }}>
                    {expense.category}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={{ fontSize: 17, fontWeight: "600", color: "#1e3a8a" }}>
              {expense.amount}
            </Text>
          </View>
        </Animated.View>
      ))}

      <View
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: 16,
          padding: 20,
          marginTop: 12,
          borderWidth: 1,
          borderColor: "#e2e8f0",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text, marginBottom: 8 }}>
          Monthly Summary
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#1e3a8a" }}>
              $590.49
            </Text>
            <Text style={{ fontSize: 13, color: theme.textSecondary }}>
              Total this month
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#22c55e" }}>
              4
            </Text>
            <Text style={{ fontSize: 13, color: theme.textSecondary }}>
              Receipts scanned
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function NightModeWallet() {
  const theme = useTheme();
  const { user } = useAppStore();
  const insets = useSafeAreaInsets();
  
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: insets.bottom + 100,
        alignItems: "center",
      }}
    >
      <Animated.View
        entering={FadeIn.duration(600)}
        style={{ width: "100%", alignItems: "center" }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              width: 320,
              height: 200,
              borderRadius: 24,
              backgroundColor: "#22c55e",
              top: 20,
            },
            glowStyle,
          ]}
        />

        <View
          style={{
            width: "100%",
            maxWidth: 340,
            backgroundColor: "#1a1a24",
            borderRadius: 24,
            padding: 24,
            borderWidth: 2,
            borderColor: "#22c55e",
            marginTop: 30,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
            <View>
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                AETHEX PASSPORT
              </Text>
              <Text style={{ fontSize: 24, fontWeight: "700", color: theme.text, marginTop: 4 }}>
                {user?.name || "Alex Chen"}
              </Text>
            </View>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#22c55e",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#0B0A0F" }}>
                {user?.avatar || "AC"}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#252530",
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <QrCode size={120} color="#22c55e" />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <CheckCircle size={16} color="#22c55e" />
            <Text style={{ fontSize: 14, color: "#22c55e", fontWeight: "600" }}>
              Verified Architect
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: theme.text,
            marginTop: 32,
            marginBottom: 16,
            alignSelf: "flex-start",
          }}
        >
          Achievements
        </Text>

        <View style={{ width: "100%", flexDirection: "row", gap: 12 }}>
          {[
            { icon: Star, label: "First Bounty", color: "#f59e0b" },
            { icon: Award, label: "Top Earner", color: "#8b5cf6" },
            { icon: Shield, label: "Trusted", color: "#22c55e" },
          ].map((badge, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(200 + index * 100).duration(400)}
              style={{
                flex: 1,
                backgroundColor: "#1a1a24",
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#2d2d3a",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: badge.color + "20",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <badge.icon size={24} color={badge.color} />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.textSecondary,
                  textAlign: "center",
                }}
              >
                {badge.label}
              </Text>
            </Animated.View>
          ))}
        </View>

        <View
          style={{
            width: "100%",
            backgroundColor: "#1a1a24",
            borderRadius: 16,
            padding: 20,
            marginTop: 20,
            borderWidth: 1,
            borderColor: "#2d2d3a",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text, marginBottom: 12 }}>
            Wallet Stats
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: "#22c55e" }}>
                $4,250
              </Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                Total Earned
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: theme.text }}>
                12
              </Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                Bounties Done
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: "#f59e0b" }}>
                4.9
              </Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                Rating
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

export default function ScannerScreen() {
  const { mode } = useAppStore();

  return mode === "day" ? <DayModeScanner /> : <NightModeWallet />;
}
