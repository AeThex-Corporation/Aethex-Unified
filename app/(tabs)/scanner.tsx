import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import {
  Camera,
  Receipt,
  Clock,
  QrCode,
  BookOpen,
} from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useAppStore, useTheme, useTerminology } from "@/store/appStore";
import { EnhancedPassport } from "@/components/EnhancedPassport";
import { WalletOverview } from "@/components/WalletSection";
import { XPDashboard } from "@/components/XPDashboard";
import { Spacing } from "@/constants/theme";

function DayModeScanner() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { marketContext } = useAppStore();
  const terminology = useTerminology();
  const [isScanning, setIsScanning] = useState(false);

  const isEducation = marketContext === "education";

  const handleScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsScanning(!isScanning);
  };

  const recentItems = isEducation ? [
    { title: "Student Roster Import", amount: "42 records", date: "Today", category: "Sync" },
    { title: "Guardian Verification", amount: "Verified", date: "Yesterday", category: "Compliance" },
    { title: "Grade Export", amount: "Class 5A", date: "Dec 15", category: "Academic" },
    { title: "Attendance Check", amount: "98%", date: "Dec 14", category: "Daily" },
  ] : [
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
          onPress={handleScan}
          style={({ pressed }) => ({
            backgroundColor: isScanning ? "#22c55e" : (isEducation ? "#8b5cf6" : "#1e3a8a"),
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
            {isEducation ? (
              <QrCode size={40} color="#ffffff" />
            ) : (
              <Camera size={40} color="#ffffff" />
            )}
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            {isScanning 
              ? "Scanning..." 
              : isEducation 
                ? "Tap to Scan Student ID" 
                : "Tap to Scan Receipt"
            }
          </Text>
          <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
            {isScanning 
              ? isEducation ? "Point camera at ID badge" : "Point camera at receipt" 
              : isEducation ? "Quick attendance check-in" : "Quick expense capture"
            }
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
        {isEducation ? "Recent Activity" : "Recent Expenses"}
      </Text>

      {recentItems.map((item, index) => (
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
                backgroundColor: isEducation ? "#8b5cf620" : "#1e3a8a20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isEducation ? (
                <BookOpen size={24} color="#8b5cf6" />
              ) : (
                <Receipt size={24} color="#1e3a8a" />
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "500", color: theme.text }}>
                {item.title}
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
                  {item.date}
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
                    {item.category}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={{ fontSize: 17, fontWeight: "600", color: isEducation ? "#8b5cf6" : "#1e3a8a" }}>
              {item.amount}
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
          {isEducation ? "Compliance Summary" : "Monthly Summary"}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "700", color: isEducation ? "#8b5cf6" : "#1e3a8a" }}>
              {isEducation ? "100%" : "$590.49"}
            </Text>
            <Text style={{ fontSize: 13, color: theme.textSecondary }}>
              {isEducation ? "FERPA Compliant" : "Total this month"}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#22c55e" }}>
              {isEducation ? "0" : "4"}
            </Text>
            <Text style={{ fontSize: 13, color: theme.textSecondary }}>
              {isEducation ? "PII Incidents" : "Receipts scanned"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function NightModeWallet() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { marketContext } = useAppStore();

  const isEducation = marketContext === "education";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: insets.bottom + 100,
      }}
    >
      {isEducation ? (
        <>
          <Animated.View entering={FadeIn.duration(600)}>
            <XPDashboard />
          </Animated.View>
          <View style={{ marginTop: Spacing.xl }}>
            <EnhancedPassport />
          </View>
        </>
      ) : (
        <>
          <Animated.View entering={FadeIn.duration(600)}>
            <WalletOverview />
          </Animated.View>
          <View style={{ marginTop: Spacing.xl }}>
            <EnhancedPassport />
          </View>
        </>
      )}
    </ScrollView>
  );
}

export default function ScannerScreen() {
  const { mode } = useAppStore();

  return mode === "day" ? <DayModeScanner /> : <NightModeWallet />;
}
