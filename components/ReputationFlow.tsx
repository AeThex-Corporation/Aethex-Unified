import React, { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { TrendingUp, Award, Zap, ArrowRight, Star, Code, Palette, Heart } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useAppStore, useTheme } from "@/store/appStore";
import { GlassCard } from "./GlassCard";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ReputationScore, ReputationAction } from "@/services/reputationService";
import { EcosystemPillar } from "@/types/domain";

const PILLAR_CONFIG = {
  dev: { icon: Code, color: "#22c55e", name: "Dev", domain: "aethex.dev" },
  studio: { icon: Palette, color: "#8b5cf6", name: "Studio", domain: "aethex.studio" },
  foundation: { icon: Heart, color: "#f59e0b", name: "Foundation", domain: "aethex.foundation" },
};

const LEVEL_COLORS = {
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "#ffd700",
  platinum: "#e5e4e2",
  diamond: "#b9f2ff",
};

function ReputationCard({ reputation, index }: { reputation: ReputationScore; index: number }) {
  const theme = useTheme();
  const config = PILLAR_CONFIG[reputation.pillar];
  const levelColor = LEVEL_COLORS[reputation.level];
  const progress = reputation.score / reputation.nextLevelAt;

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <GlassCard style={{ padding: Spacing.md, marginBottom: Spacing.sm }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: Spacing.sm }}>
          <View style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 20, 
            backgroundColor: `${config.color}20`,
            alignItems: "center",
            justifyContent: "center",
          }}>
            <config.icon size={20} color={config.color} />
          </View>
          <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text }}>{config.name}</Text>
            <Text style={{ fontSize: 11, color: theme.textSecondary }}>{config.domain}</Text>
          </View>
          <View style={{ 
            backgroundColor: `${levelColor}30`,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
          }}>
            <Star size={12} color={levelColor} fill={levelColor} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: levelColor, marginLeft: 4, textTransform: "capitalize" }}>
              {reputation.level}
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 6 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontSize: 13, color: theme.textSecondary }}>
              {reputation.score.toLocaleString()} pts
            </Text>
            <Text style={{ fontSize: 13, color: theme.accent }}>
              {reputation.nextLevelAt.toLocaleString()} to next level
            </Text>
          </View>
          <View style={{ height: 6, backgroundColor: theme.secondary, borderRadius: 3, overflow: "hidden" }}>
            <View style={{ 
              height: "100%", 
              width: `${Math.min(progress * 100, 100)}%`, 
              backgroundColor: config.color,
              borderRadius: 3,
            }} />
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

function ReputationHistoryItem({ action, index }: { action: ReputationAction; index: number }) {
  const theme = useTheme();
  const sourceConfig = PILLAR_CONFIG[action.sourcePillar];
  
  const getActionLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      vote_on_proposal: "Voted on Proposal",
      complete_quest: "Completed Quest",
      mentor_student: "Mentored Student",
      contribute_code: "Code Contribution",
      donate: "Made Donation",
      complete_assignment: "Completed Assignment",
      review_portfolio: "Portfolio Review",
      participate_governance: "Governance Activity",
    };
    return labels[actionType] || actionType;
  };

  return (
    <Animated.View entering={FadeInDown.delay((index + 3) * 80).duration(400)}>
      <GlassCard style={{ padding: Spacing.md, marginBottom: Spacing.sm }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ 
            width: 36, 
            height: 36, 
            borderRadius: 18, 
            backgroundColor: `${sourceConfig.color}20`,
            alignItems: "center",
            justifyContent: "center",
          }}>
            <sourceConfig.icon size={16} color={sourceConfig.color} />
          </View>
          <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: theme.text }}>
              {getActionLabel(action.action)}
            </Text>
            <Text style={{ fontSize: 11, color: theme.textSecondary }}>
              From {sourceConfig.name} - {new Date(action.timestamp).toLocaleDateString()}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: theme.accent }}>
              +{action.pointsEarned}
            </Text>
            <Text style={{ fontSize: 10, color: theme.textSecondary }}>base pts</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: Spacing.sm, gap: 8 }}>
          {(["dev", "studio", "foundation"] as EcosystemPillar[]).map((pillar) => {
            const config = PILLAR_CONFIG[pillar];
            const multiplier = action.multipliers[pillar];
            const earned = Math.round(action.pointsEarned * multiplier);
            
            return (
              <View key={pillar} style={{ 
                flex: 1, 
                backgroundColor: `${config.color}10`,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 8,
                alignItems: "center",
              }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: config.color }}>+{earned}</Text>
                <Text style={{ fontSize: 9, color: theme.textSecondary }}>{config.name}</Text>
              </View>
            );
          })}
        </View>
      </GlassCard>
    </Animated.View>
  );
}

function CrossPillarFlowDiagram() {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(200).duration(500)}>
      <GlassCard style={{ padding: Spacing.lg, marginBottom: Spacing.lg }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: theme.text, marginBottom: Spacing.md, textAlign: "center" }}>
          How Reputation Flows
        </Text>
        
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
          {(["dev", "studio", "foundation"] as EcosystemPillar[]).map((pillar, index) => {
            const config = PILLAR_CONFIG[pillar];
            return (
              <View key={pillar} style={{ alignItems: "center" }}>
                <View style={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: 25, 
                  backgroundColor: `${config.color}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: config.color,
                }}>
                  <config.icon size={24} color={config.color} />
                </View>
                <Text style={{ fontSize: 11, color: theme.text, marginTop: 6, fontWeight: "500" }}>
                  {config.name}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={{ 
          position: "absolute", 
          top: "50%", 
          left: "33%", 
          right: "33%",
          flexDirection: "row",
          justifyContent: "center",
        }}>
          <Zap size={16} color={theme.accent} style={{ opacity: 0.6 }} />
        </View>

        <Text style={{ fontSize: 11, color: theme.textSecondary, textAlign: "center", marginTop: Spacing.md }}>
          Actions in any pillar earn reputation across the ecosystem
        </Text>
      </GlassCard>
    </Animated.View>
  );
}

export function ReputationFlowDashboard() {
  const theme = useTheme();
  const { getReputationScores, reputationScores, reputationHistory } = useAppStore();
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");
  
  const repScores = getReputationScores();
  const totalReputation = Object.values(reputationScores).reduce((a, b) => a + b, 0);

  return (
    <View>
      <Animated.View entering={FadeInUp.duration(500)}>
        <GlassCard style={{ padding: Spacing.lg, marginBottom: Spacing.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: Spacing.sm }}>
            <View style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 22, 
              backgroundColor: `${theme.accent}20`,
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Award size={24} color={theme.accent} />
            </View>
            <View style={{ marginLeft: Spacing.md }}>
              <Text style={{ fontSize: 14, color: theme.textSecondary }}>Total Ecosystem Reputation</Text>
              <Text style={{ fontSize: 28, fontWeight: "700", color: theme.text }}>
                {totalReputation.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TrendingUp size={16} color="#22c55e" />
            <Text style={{ fontSize: 13, color: "#22c55e", marginLeft: 4 }}>
              +245 this week across all pillars
            </Text>
          </View>
        </GlassCard>
      </Animated.View>

      <View style={{ flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.lg }}>
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") Haptics.selectionAsync();
            setActiveTab("overview");
          }}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: BorderRadius.md,
            backgroundColor: activeTab === "overview" ? theme.accent : theme.secondary,
            alignItems: "center",
          }}
        >
          <Text style={{ 
            fontSize: 14, 
            fontWeight: "600", 
            color: activeTab === "overview" ? "#fff" : theme.textSecondary 
          }}>
            Overview
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") Haptics.selectionAsync();
            setActiveTab("history");
          }}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: BorderRadius.md,
            backgroundColor: activeTab === "history" ? theme.accent : theme.secondary,
            alignItems: "center",
          }}
        >
          <Text style={{ 
            fontSize: 14, 
            fontWeight: "600", 
            color: activeTab === "history" ? "#fff" : theme.textSecondary 
          }}>
            History
          </Text>
        </Pressable>
      </View>

      {activeTab === "overview" ? (
        <View>
          <CrossPillarFlowDiagram />
          
          <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginBottom: Spacing.md }}>
            Pillar Standings
          </Text>
          
          {repScores.map((rep, index) => (
            <ReputationCard key={rep.pillar} reputation={rep} index={index} />
          ))}
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginBottom: Spacing.md }}>
            Recent Reputation Gains
          </Text>
          
          {reputationHistory.length > 0 ? (
            reputationHistory.map((action, index) => (
              <ReputationHistoryItem key={action.id} action={action} index={index} />
            ))
          ) : (
            <GlassCard style={{ padding: Spacing.lg, alignItems: "center" }}>
              <Star size={32} color={theme.textSecondary} style={{ marginBottom: 12 }} />
              <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text, marginBottom: 4 }}>
                No reputation history yet
              </Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary, textAlign: "center" }}>
                Start earning by voting, completing quests, or approving items across pillars
              </Text>
            </GlassCard>
          )}
        </View>
      )}
    </View>
  );
}
