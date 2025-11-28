import { View, Text, ScrollView, Pressable } from "react-native";
import {
  Shield,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  Zap,
  DollarSign,
  Gamepad2,
  Music,
  Code,
  ArrowRight,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore, useTheme } from "@/store/appStore";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  delay: number;
}

function StatCard({ icon, title, value, subtitle, color, delay }: StatCardProps) {
  const theme = useTheme();
  const { mode } = useAppStore();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={{
        flex: 1,
        backgroundColor: mode === "day" ? "#f8fafc" : "#1a1a24",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: mode === "day" ? "#e2e8f0" : "#2d2d3a",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: color + "20",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: theme.text,
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text }}>
        {title}
      </Text>
      <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
        {subtitle}
      </Text>
    </Animated.View>
  );
}

interface BountyCardProps {
  icon: React.ReactNode;
  title: string;
  reward: string;
  category: string;
  urgency: string;
  color: string;
  delay: number;
}

function BountyCard({
  icon,
  title,
  reward,
  category,
  urgency,
  color,
  delay,
}: BountyCardProps) {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: "#1a1a24",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "#2d2d3a",
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: color + "20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: theme.text,
                marginBottom: 4,
              }}
            >
              {title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={{
                  backgroundColor: color + "20",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text style={{ fontSize: 12, color }}>{category}</Text>
              </View>
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                {urgency}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#22c55e",
              }}
            >
              {reward}
            </Text>
            <ArrowRight size={16} color={theme.textSecondary} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function DayModeHome() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <View
          style={{
            backgroundColor: "#1e3a8a",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Shield size={24} color="#ffffff" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#ffffff",
                marginLeft: 10,
              }}
            >
              System Status
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: "#bfdbfe" }}>
            All systems operational. No critical alerts in the last 24 hours.
          </Text>
        </View>
      </Animated.View>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
        <StatCard
          icon={<Shield size={20} color="#1e3a8a" />}
          title="PII Incidents"
          value="0"
          subtitle="Blocked this week"
          color="#1e3a8a"
          delay={100}
        />
        <StatCard
          icon={<Users size={20} color="#22c55e" />}
          title="Active Users"
          value="2,847"
          subtitle="Online now"
          color="#22c55e"
          delay={150}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
        <StatCard
          icon={<Activity size={20} color="#3b82f6" />}
          title="System Health"
          value="99.9%"
          subtitle="Uptime this month"
          color="#3b82f6"
          delay={200}
        />
        <StatCard
          icon={<AlertTriangle size={20} color="#f59e0b" />}
          title="Pending"
          value="3"
          subtitle="Approvals needed"
          color="#f59e0b"
          delay={250}
        />
      </View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: theme.text,
          marginBottom: 16,
        }}
      >
        Recent Activity
      </Text>

      {[
        { title: "New student enrollment", time: "2 min ago", type: "info" },
        { title: "Expense report submitted", time: "15 min ago", type: "success" },
        { title: "System update available", time: "1 hour ago", type: "warning" },
      ].map((item, index) => (
        <Animated.View
          key={index}
          entering={FadeInDown.delay(300 + index * 50).duration(400)}
        >
          <View
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: 12,
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
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  item.type === "info"
                    ? "#3b82f6"
                    : item.type === "success"
                    ? "#22c55e"
                    : "#f59e0b",
                marginRight: 12,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "500", color: theme.text }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 13, color: theme.textSecondary }}>
                {item.time}
              </Text>
            </View>
          </View>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

function NightModeHome() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <View
          style={{
            backgroundColor: "#22c55e",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Zap size={24} color="#0B0A0F" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#0B0A0F",
                marginLeft: 10,
              }}
            >
              Hot Bounties
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: "#0B0A0F" }}>
            12 new opportunities posted in the last 24 hours
          </Text>
        </View>
      </Animated.View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: theme.text,
          marginBottom: 16,
        }}
      >
        Available Bounties
      </Text>

      <View style={{ gap: 12 }}>
        <BountyCard
          icon={<Music size={24} color="#ec4899" />}
          title="Synthwave Track Production"
          reward="$500"
          category="Audio"
          urgency="Due in 3 days"
          color="#ec4899"
          delay={100}
        />
        <BountyCard
          icon={<Gamepad2 size={24} color="#8b5cf6" />}
          title="GameForge Sprint Update"
          reward="$1,200"
          category="Game Dev"
          urgency="Due in 1 week"
          color="#8b5cf6"
          delay={150}
        />
        <BountyCard
          icon={<Code size={24} color="#22c55e" />}
          title="Smart Contract Audit"
          reward="$2,000"
          category="Web3"
          urgency="Urgent"
          color="#22c55e"
          delay={200}
        />
        <BountyCard
          icon={<TrendingUp size={24} color="#f59e0b" />}
          title="Data Visualization Dashboard"
          reward="$800"
          category="Frontend"
          urgency="Due in 5 days"
          color="#f59e0b"
          delay={250}
        />
      </View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: theme.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Your Active Bounties
      </Text>

      <Animated.View entering={FadeInDown.delay(300).duration(400)}>
        <View
          style={{
            backgroundColor: "#1a1a24",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#22c55e",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Code size={20} color="#22c55e" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: theme.text,
                marginLeft: 8,
              }}
            >
              API Integration Module
            </Text>
          </View>
          <View
            style={{
              height: 6,
              backgroundColor: "#2d2d3a",
              borderRadius: 3,
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: "65%",
                height: "100%",
                backgroundColor: "#22c55e",
                borderRadius: 3,
              }}
            />
          </View>
          <Text style={{ fontSize: 13, color: theme.textSecondary }}>
            65% complete - 2 days remaining
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

export default function HomeScreen() {
  const { mode } = useAppStore();

  return mode === "day" ? <DayModeHome /> : <NightModeHome />;
}
