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
  GraduationCap,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore, useTheme, useTerminology, useFeatures } from "@/store/appStore";

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

interface ItemCardProps {
  icon: React.ReactNode;
  title: string;
  reward?: string;
  category: string;
  status: string;
  color: string;
  delay: number;
}

function ItemCard({
  icon,
  title,
  reward,
  category,
  status,
  color,
  delay,
}: ItemCardProps) {
  const theme = useTheme();
  const { mode } = useAppStore();

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: mode === "day" ? "#f8fafc" : "#1a1a24",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: mode === "day" ? "#e2e8f0" : "#2d2d3a",
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
                {status}
              </Text>
            </View>
          </View>
          {reward ? (
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
          ) : (
            <ArrowRight size={16} color={theme.textSecondary} />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

function DayModeHome() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { marketContext, auditLogs, ledgerItems, members, getComplianceStats } = useAppStore();
  const terminology = useTerminology();
  const features = useFeatures();
  
  const stats = getComplianceStats();
  const pendingItems = ledgerItems.filter(item => item.status === "pending");
  const activeMembers = members.filter(m => m.status === "active");

  const isEducation = marketContext === "education";

  const recentActivity = isEducation ? [
    { title: "Student roster synced", time: "2 min ago", type: "info" },
    { title: "Assignment graded", time: "15 min ago", type: "success" },
    { title: "PII attempt blocked", time: "1 hour ago", type: "warning" },
  ] : [
    { title: "New expense submitted", time: "2 min ago", type: "info" },
    { title: "Expense report approved", time: "15 min ago", type: "success" },
    { title: "System update available", time: "1 hour ago", type: "warning" },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <View
          style={{
            backgroundColor: isEducation ? "#8b5cf6" : "#1e3a8a",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            {isEducation ? (
              <GraduationCap size={24} color="#ffffff" />
            ) : (
              <Shield size={24} color="#ffffff" />
            )}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#ffffff",
                marginLeft: 10,
              }}
            >
              {isEducation ? "Safety & Compliance" : "System Status"}
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: "#bfdbfe" }}>
            {stats.blockedCount === 0 
              ? isEducation 
                ? "All students protected. No safety incidents today."
                : "All systems operational. No critical alerts."
              : `${stats.blockedCount} incidents blocked. ${stats.flaggedCount} items flagged for review.`
            }
          </Text>
        </View>
      </Animated.View>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
        <StatCard
          icon={<Shield size={20} color={isEducation ? "#8b5cf6" : "#1e3a8a"} />}
          title={isEducation ? "PII Blocked" : "Blocked"}
          value={stats.blockedCount.toString()}
          subtitle="This week"
          color={isEducation ? "#8b5cf6" : "#1e3a8a"}
          delay={100}
        />
        <StatCard
          icon={<Users size={20} color="#22c55e" />}
          title={`Active ${terminology.members}`}
          value={activeMembers.length.toString()}
          subtitle="Online now"
          color="#22c55e"
          delay={150}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
        <StatCard
          icon={<Activity size={20} color="#3b82f6" />}
          title={features.auditLoggingEnabled ? "Audit Events" : "Activity"}
          value={auditLogs.length.toString()}
          subtitle="Total logged"
          color="#3b82f6"
          delay={200}
        />
        <StatCard
          icon={<AlertTriangle size={20} color="#f59e0b" />}
          title="Pending"
          value={pendingItems.length.toString()}
          subtitle={`${terminology.approval}s needed`}
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

      {recentActivity.map((item, index) => (
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

      {features.complianceMonitoring && stats.flaggedCount > 0 && (
        <>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: theme.text,
              marginTop: 12,
              marginBottom: 16,
            }}
          >
            Flagged for Review
          </Text>
          {auditLogs.filter(l => l.flagged).slice(0, 3).map((log, index) => (
            <Animated.View
              key={log.id}
              entering={FadeInDown.delay(400 + index * 50).duration(400)}
            >
              <View
                style={{
                  backgroundColor: "#fef3c7",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: "#fcd34d",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <AlertTriangle size={20} color="#f59e0b" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 15, fontWeight: "500", color: "#92400e" }}>
                    {log.action}
                  </Text>
                  <Text style={{ fontSize: 13, color: "#b45309" }}>
                    {log.trigger || "Needs review"}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

function NightModeHome() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { marketContext, ledgerItems, events, getTotalXP, skillNodes } = useAppStore();
  const terminology = useTerminology();
  const features = useFeatures();

  const isEducation = marketContext === "education";
  const totalXP = getTotalXP();
  const unlockedSkills = skillNodes.filter(s => s.isUnlocked).length;

  const bounties = ledgerItems.filter(item => 
    item.type === "bounty" || item.type === "assignment"
  );

  const activeBounties = bounties.filter(item => item.status === "pending");

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
              {isEducation ? "Skill Progress" : "Hot Bounties"}
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: "#0B0A0F" }}>
            {isEducation 
              ? `${totalXP} XP earned - ${unlockedSkills} skills unlocked`
              : `${activeBounties.length} active opportunities available`
            }
          </Text>
        </View>
      </Animated.View>

      {features.skillTree && (
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
          <StatCard
            icon={<Zap size={20} color="#22c55e" />}
            title="Total XP"
            value={totalXP.toString()}
            subtitle="Earned"
            color="#22c55e"
            delay={100}
          />
          <StatCard
            icon={<CheckCircle size={20} color="#8b5cf6" />}
            title="Skills"
            value={`${unlockedSkills}/${skillNodes.length}`}
            subtitle="Unlocked"
            color="#8b5cf6"
            delay={150}
          />
        </View>
      )}

      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: theme.text,
          marginBottom: 16,
        }}
      >
        {isEducation ? "Active Assignments" : "Available Bounties"}
      </Text>

      <View style={{ gap: 12 }}>
        {isEducation ? (
          <>
            <ItemCard
              icon={<BookOpen size={24} color="#8b5cf6" />}
              title="Network Security Fundamentals"
              category="Computer Science"
              status="Due in 3 days"
              color="#8b5cf6"
              delay={200}
            />
            <ItemCard
              icon={<Code size={24} color="#22c55e" />}
              title="Python Data Structures"
              category="Programming"
              status="Due in 1 week"
              color="#22c55e"
              delay={250}
            />
          </>
        ) : (
          <>
            <ItemCard
              icon={<Music size={24} color="#ec4899" />}
              title="Synthwave Track Production"
              reward="$500"
              category="Audio"
              status="Due in 3 days"
              color="#ec4899"
              delay={200}
            />
            <ItemCard
              icon={<Gamepad2 size={24} color="#8b5cf6" />}
              title="GameForge Sprint Update"
              reward="$1,200"
              category="Game Dev"
              status="Due in 1 week"
              color="#8b5cf6"
              delay={250}
            />
            <ItemCard
              icon={<Code size={24} color="#22c55e" />}
              title="Smart Contract Audit"
              reward="$2,000"
              category="Web3"
              status="Urgent"
              color="#22c55e"
              delay={300}
            />
            <ItemCard
              icon={<TrendingUp size={24} color="#f59e0b" />}
              title="Data Visualization Dashboard"
              reward="$800"
              category="Frontend"
              status="Due in 5 days"
              color="#f59e0b"
              delay={350}
            />
          </>
        )}
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
            Recent Achievements
          </Text>

          {events
            .filter(e => e.gamification.isUnlocked)
            .slice(0, 3)
            .map((event, index) => (
              <Animated.View 
                key={event.id} 
                entering={FadeInDown.delay(400 + index * 50).duration(400)}
              >
                <View
                  style={{
                    backgroundColor: "#1a1a24",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: "#22c55e40",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
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
