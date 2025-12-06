import { View, Text, ScrollView } from "react-native";
import { Zap } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore, useTheme } from "@/store/appStore";
import SprintCountdown from "@/components/SprintCountdown";
import GigRadar from "@/components/GigRadar";
import { XPDashboard } from "@/components/XPDashboard";
import { AchievementList } from "@/components/AchievementCard";
import { QuestList } from "@/components/QuestCard";
import { GlassCard } from "@/components/GlassCard";
import { StudentDashboard } from "@/components/StudentNightMode";
import { BusinessDashboard } from "@/components/BusinessDashboard";
import { K12AdminDashboard } from "@/components/K12AdminDashboard";
import { Spacing } from "@/constants/theme";

function DayModeHome() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { marketContext } = useAppStore();

  const isEducation = marketContext === "education";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
    >
      {isEducation ? <K12AdminDashboard /> : <BusinessDashboard />}
    </ScrollView>
  );
}

function NightModeHome() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { marketContext, events } = useAppStore();

  const isEducation = marketContext === "education";

  if (isEducation) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
      >
        <StudentDashboard />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
    >
      <XPDashboard />
      
      <View style={{ marginTop: Spacing.xl }}>
        <SprintCountdown />
      </View>
      
      <View style={{ marginTop: Spacing.lg }}>
        <GigRadar />
      </View>

      <View style={{ marginTop: Spacing.xl }}>
        <QuestList category="daily" />
      </View>

      <View style={{ marginTop: Spacing.xl }}>
        <AchievementList filter="unlocked" limit={6} />
      </View>

      {events.filter(e => e.gamification.isUnlocked).length > 0 && (
        <>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: theme.text,
              marginTop: 24,
              marginBottom: 16,
            }}
          >
            Recent Activity
          </Text>

          {events
            .filter(e => e.gamification.isUnlocked)
            .slice(0, 3)
            .map((event, index) => (
              <Animated.View 
                key={event.id} 
                entering={FadeInDown.delay(400 + index * 50).duration(400)}
              >
                <GlassCard style={{ padding: 16, marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "#22c55e20",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Zap size={20} color="#22c55e" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ fontSize: 15, fontWeight: "600", color: theme.text }}>
                        {event.gamification.skillName}
                      </Text>
                      <Text style={{ fontSize: 13, color: theme.textSecondary }}>
                        +{event.gamification.xp} XP - {event.gamification.tier.replace("_", " ")}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#22c55e20",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: "#22c55e", fontWeight: "600" }}>
                        UNLOCKED
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
        </>
      )}
    </ScrollView>
  );
}

export default function HomeScreen() {
  const { mode } = useAppStore();

  return mode === "day" ? <DayModeHome /> : <NightModeHome />;
}
