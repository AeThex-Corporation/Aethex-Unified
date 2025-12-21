import React, { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Activity, Users, Code, Palette, Heart, TrendingUp, Zap, Globe, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useAppStore, useTheme } from "@/store/appStore";
import { GlassCard } from "./GlassCard";
import { Spacing, BorderRadius } from "@/constants/theme";
import { EcosystemPillar } from "@/types/domain";
import { ReputationAction } from "@/services/reputationService";

interface PillarHealth {
  pillar: EcosystemPillar;
  status: "healthy" | "warning" | "critical";
  activeUsers: number;
  activeProjects: number;
  weeklyGrowth: number;
  lastActivity: string;
}


interface LiveEvent {
  id: string;
  type: "contribution" | "vote" | "mentorship" | "donation" | "project" | "quest";
  pillar: EcosystemPillar;
  description: string;
  timestamp: string;
  actor: string;
}

function getDerivedPillarHealth(
  reputationScores: Record<EcosystemPillar, number>,
  reputationHistory: ReputationAction[],
  members: number,
  ledgerItemsCount: number,
  eventsCount: number
): PillarHealth[] {
  const getPillarActivity = (pillar: EcosystemPillar) => 
    reputationHistory.filter(a => a.sourcePillar === pillar).length;
  
  const getPillarScore = (pillar: EcosystemPillar) => reputationScores[pillar] || 0;
  
  const getStatus = (score: number, activity: number): "healthy" | "warning" | "critical" => {
    if (score > 1500 && activity >= 1) return "healthy";
    if (score > 500) return "warning";
    return "critical";
  };
  
  const getLastActivity = (pillar: EcosystemPillar) => {
    const pillarEvents = reputationHistory.filter(a => a.sourcePillar === pillar);
    if (pillarEvents.length === 0) return "No recent activity";
    const latest = new Date(pillarEvents[0].timestamp);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - latest.getTime()) / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    return `${Math.floor(diffMins / 60)} hours ago`;
  };

  const pillarMembers = Math.max(1, Math.ceil(members / 3));
  const totalActivity = reputationHistory.length;
  
  return (["dev", "studio", "foundation"] as EcosystemPillar[]).map(pillar => {
    const pillarActivity = getPillarActivity(pillar);
    const pillarShare = totalActivity > 0 ? pillarActivity / totalActivity : 0.33;
    
    return {
      pillar,
      status: getStatus(getPillarScore(pillar), pillarActivity),
      activeUsers: Math.max(1, Math.round(pillarMembers * (1 + pillarShare))),
      activeProjects: Math.max(1, Math.round((ledgerItemsCount / 3) + pillarActivity)),
      weeklyGrowth: pillarActivity > 0 ? Math.round((pillarActivity / Math.max(1, totalActivity)) * 100) : 0,
      lastActivity: getLastActivity(pillar),
    };
  });
}



const PILLAR_CONFIG = {
  dev: { icon: Code, color: "#22c55e", name: "Dev" },
  studio: { icon: Palette, color: "#8b5cf6", name: "Studio" },
  foundation: { icon: Heart, color: "#f59e0b", name: "Foundation" },
};

const STATUS_CONFIG = {
  healthy: { color: "#22c55e", label: "Healthy" },
  warning: { color: "#f59e0b", label: "Warning" },
  critical: { color: "#ef4444", label: "Critical" },
};

const EVENT_TYPE_CONFIG = {
  contribution: { color: "#22c55e", icon: Code },
  vote: { color: "#8b5cf6", icon: Heart },
  mentorship: { color: "#3b82f6", icon: Users },
  donation: { color: "#f59e0b", icon: Heart },
  project: { color: "#06b6d4", icon: Palette },
  quest: { color: "#ec4899", icon: Zap },
};

function OverallHealthIndicator() {
  const theme = useTheme();
  const { reputationScores, reputationHistory, members, ledgerItems, events } = useAppStore();
  const pillarHealth = getDerivedPillarHealth(reputationScores, reputationHistory, members.length, ledgerItems.length, events.length);
  const healthyCount = pillarHealth.filter(p => p.status === "healthy").length;
  const overallStatus = healthyCount === 3 ? "healthy" : healthyCount >= 2 ? "warning" : "critical";
  const statusConfig = STATUS_CONFIG[overallStatus];

  return (
    <Animated.View entering={FadeInUp.duration(500)}>
      <GlassCard style={{ padding: Spacing.lg, marginBottom: Spacing.lg }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ 
            width: 56, 
            height: 56, 
            borderRadius: 28, 
            backgroundColor: `${statusConfig.color}20`,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 3,
            borderColor: statusConfig.color,
          }}>
            <Activity size={28} color={statusConfig.color} />
          </View>
          <View style={{ marginLeft: Spacing.md, flex: 1 }}>
            <Text style={{ fontSize: 14, color: theme.textSecondary }}>Ecosystem Status</Text>
            <Text style={{ fontSize: 24, fontWeight: "700", color: theme.text }}>
              {statusConfig.label}
            </Text>
            <Text style={{ fontSize: 12, color: statusConfig.color }}>
              {healthyCount}/3 pillars operating normally
            </Text>
          </View>
          <View style={{ 
            width: 12, 
            height: 12, 
            borderRadius: 6, 
            backgroundColor: statusConfig.color,
          }} />
        </View>
      </GlassCard>
    </Animated.View>
  );
}

function PillarHealthCard({ health, index }: { health: PillarHealth; index: number }) {
  const theme = useTheme();
  const pillarConfig = PILLAR_CONFIG[health.pillar];
  const statusConfig = STATUS_CONFIG[health.status];
  const IconComponent = pillarConfig.icon;

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <GlassCard style={{ padding: Spacing.md, marginBottom: Spacing.sm }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: Spacing.sm }}>
          <View style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 20, 
            backgroundColor: `${pillarConfig.color}20`,
            alignItems: "center",
            justifyContent: "center",
          }}>
            <IconComponent size={20} color={pillarConfig.color} />
          </View>
          <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text }}>{pillarConfig.name}</Text>
            <Text style={{ fontSize: 11, color: theme.textSecondary }}>aethex.{health.pillar}</Text>
          </View>
          <View style={{ 
            backgroundColor: `${statusConfig.color}20`,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
          }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusConfig.color, marginRight: 6 }} />
            <Text style={{ fontSize: 11, fontWeight: "600", color: statusConfig.color }}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 11, color: theme.textSecondary }}>Active Users</Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text }}>{health.activeUsers.toLocaleString()}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 11, color: theme.textSecondary }}>Projects</Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text }}>{health.activeProjects}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 11, color: theme.textSecondary }}>Weekly Growth</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {health.weeklyGrowth > 0 ? (
                <ArrowUpRight size={14} color="#22c55e" />
              ) : health.weeklyGrowth < 0 ? (
                <ArrowDownRight size={14} color="#ef4444" />
              ) : (
                <Minus size={14} color={theme.textSecondary} />
              )}
              <Text style={{ 
                fontSize: 16, 
                fontWeight: "700", 
                color: health.weeklyGrowth > 0 ? "#22c55e" : health.weeklyGrowth < 0 ? "#ef4444" : theme.text 
              }}>
                {Math.abs(health.weeklyGrowth)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: Spacing.sm, flexDirection: "row", alignItems: "center" }}>
          <Zap size={12} color={theme.textSecondary} />
          <Text style={{ fontSize: 11, color: theme.textSecondary, marginLeft: 4 }}>
            Last activity: {health.lastActivity}
          </Text>
        </View>
      </GlassCard>
    </Animated.View>
  );
}


function LiveEventItem({ event, index, totalEvents }: { event: LiveEvent; index: number; totalEvents: number }) {
  const theme = useTheme();
  const pillarConfig = PILLAR_CONFIG[event.pillar];
  const eventConfig = EVENT_TYPE_CONFIG[event.type];
  const EventIcon = eventConfig.icon;

  return (
    <Animated.View entering={FadeInDown.delay((index + 7) * 60).duration(400)}>
      <View style={{ 
        flexDirection: "row", 
        alignItems: "center", 
        paddingVertical: Spacing.sm,
        borderBottomWidth: index < totalEvents - 1 ? 1 : 0,
        borderBottomColor: `${theme.textSecondary}20`,
      }}>
        <View style={{ 
          width: 32, 
          height: 32, 
          borderRadius: 16, 
          backgroundColor: `${eventConfig.color}20`,
          alignItems: "center",
          justifyContent: "center",
        }}>
          <EventIcon size={14} color={eventConfig.color} />
        </View>
        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
          <Text style={{ fontSize: 13, color: theme.text }}>{event.description}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
            <Text style={{ fontSize: 11, color: theme.textSecondary }}>{event.actor}</Text>
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: theme.textSecondary, marginHorizontal: 6 }} />
            <Text style={{ fontSize: 11, color: pillarConfig.color }}>{pillarConfig.name}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 10, color: theme.textSecondary }}>{event.timestamp}</Text>
      </View>
    </Animated.View>
  );
}

export function EcosystemPulseDashboard() {
  const theme = useTheme();
  const { members, ledgerItems, events, reputationHistory, reputationScores } = useAppStore();
  const [activeTab, setActiveTab] = useState<"health" | "activity">("health");
  
  const totalActiveUsers = members.length;
  const totalProjects = ledgerItems.filter(l => l.status === "pending" || l.status === "approved").length;
  const totalReputation = Object.values(reputationScores).reduce((a, b) => a + b, 0);
  
  type TrendType = "up" | "down" | "neutral";
  const dynamicMetrics: { label: string; value: string; trend: TrendType; change: string }[] = [
    { label: "Active Members", value: totalActiveUsers.toString(), trend: "up", change: "+3" },
    { label: "Cross-Pillar Actions", value: reputationHistory.length.toString(), trend: "up", change: `+${Math.min(reputationHistory.length, 5)}` },
    { label: "Total Reputation", value: totalReputation.toLocaleString(), trend: "up", change: "+245" },
    { label: "Active Items", value: totalProjects.toString(), trend: "neutral", change: "0" },
  ];
  
  const liveEventsFromHistory: LiveEvent[] = reputationHistory.slice(0, 6).map((action, index) => {
    const typeMap: Record<string, LiveEvent["type"]> = {
      vote_on_proposal: "vote",
      complete_quest: "quest",
      mentor_student: "mentorship",
      donate: "donation",
      contribute_code: "contribution",
      complete_assignment: "project",
    };
    const actionLabels: Record<string, string> = {
      vote_on_proposal: "Voted on proposal",
      complete_quest: "Completed a quest",
      mentor_student: "Mentored a student",
      donate: "Made a donation",
      contribute_code: "Code contribution",
      complete_assignment: "Completed assignment",
    };
    return {
      id: action.id,
      type: typeMap[action.action] || "contribution",
      pillar: action.sourcePillar,
      description: actionLabels[action.action] || action.action,
      timestamp: new Date(action.timestamp).toLocaleTimeString(),
      actor: "Community Member",
    };
  });

  return (
    <View>
      <OverallHealthIndicator />

      <View style={{ flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.lg }}>
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") Haptics.selectionAsync();
            setActiveTab("health");
          }}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: BorderRadius.md,
            backgroundColor: activeTab === "health" ? theme.accent : theme.secondary,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: activeTab === "health" ? "#fff" : theme.textSecondary }}>
            Pillar Health
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") Haptics.selectionAsync();
            setActiveTab("activity");
          }}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: BorderRadius.md,
            backgroundColor: activeTab === "activity" ? theme.accent : theme.secondary,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: activeTab === "activity" ? "#fff" : theme.textSecondary }}>
            Live Activity
          </Text>
        </Pressable>
      </View>

      {activeTab === "health" ? (
        <View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, marginBottom: Spacing.lg }}>
            {dynamicMetrics.map((metric, index) => (
              <Animated.View key={metric.label} entering={FadeInDown.delay((index + 3) * 80).duration(400)} style={{ width: "48%" }}>
                <GlassCard style={{ padding: Spacing.md }}>
                  <Text style={{ fontSize: 11, color: theme.textSecondary }}>{metric.label}</Text>
                  <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 4 }}>
                    <Text style={{ fontSize: 20, fontWeight: "700", color: theme.text }}>{metric.value}</Text>
                    <View style={{ 
                      flexDirection: "row", 
                      alignItems: "center", 
                      marginLeft: 8, 
                      marginBottom: 2,
                      backgroundColor: metric.trend === "up" ? "#22c55e20" : metric.trend === "down" ? "#ef444420" : "#6b728020",
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 8,
                    }}>
                      {metric.trend === "up" ? (
                        <ArrowUpRight size={10} color="#22c55e" />
                      ) : metric.trend === "down" ? (
                        <ArrowDownRight size={10} color="#ef4444" />
                      ) : (
                        <Minus size={10} color="#6b7280" />
                      )}
                      <Text style={{ 
                        fontSize: 10, 
                        color: metric.trend === "up" ? "#22c55e" : metric.trend === "down" ? "#ef4444" : "#6b7280",
                        marginLeft: 2,
                      }}>
                        {metric.change}
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
          </View>

          <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginBottom: Spacing.md }}>
            Pillar Status
          </Text>

          {getDerivedPillarHealth(reputationScores, reputationHistory, members.length, ledgerItems.length, events.length).map((health, index) => (
            <PillarHealthCard key={health.pillar} health={health} index={index} />
          ))}
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginBottom: Spacing.md }}>
            Recent Ecosystem Activity
          </Text>

          <GlassCard style={{ padding: Spacing.md }}>
            {liveEventsFromHistory.length > 0 ? (
              liveEventsFromHistory.map((event, index) => (
                <LiveEventItem key={event.id} event={event} index={index} totalEvents={liveEventsFromHistory.length} />
              ))
            ) : (
              <View style={{ alignItems: "center", paddingVertical: Spacing.lg }}>
                <Activity size={32} color={theme.textSecondary} />
                <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: Spacing.sm }}>
                  No recent activity
                </Text>
                <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>
                  Actions will appear here as you use the app
                </Text>
              </View>
            )}
          </GlassCard>
        </View>
      )}
    </View>
  );
}
