import React, { useState } from "react";
import { View, Text, Pressable, Image, Platform } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Briefcase, Users, TrendingUp, Award, ChevronRight, Star, Clock, Layers, Eye, ExternalLink } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useAppStore, useTheme } from "@/store/appStore";
import { GlassCard } from "./GlassCard";
import { Spacing, BorderRadius } from "@/constants/theme";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  views: number;
  likes: number;
  featured: boolean;
  createdAt: string;
}

interface ClientProject {
  id: string;
  clientName: string;
  projectTitle: string;
  status: "active" | "review" | "completed" | "paused";
  progress: number;
  deadline: string;
  budget: number;
  teamSize: number;
}

const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    id: "portfolio-001",
    title: "Nexus Game UI Kit",
    description: "Complete UI system for mobile gaming",
    category: "UI/UX Design",
    thumbnail: "game-ui",
    views: 1250,
    likes: 89,
    featured: true,
    createdAt: "2024-12-10T00:00:00Z",
  },
  {
    id: "portfolio-002",
    title: "3D Character Models Pack",
    description: "Low-poly character set for indie games",
    category: "3D Modeling",
    thumbnail: "3d-chars",
    views: 890,
    likes: 67,
    featured: false,
    createdAt: "2024-11-28T00:00:00Z",
  },
  {
    id: "portfolio-003",
    title: "Motion Graphics Reel",
    description: "Collection of animated transitions and effects",
    category: "Animation",
    thumbnail: "motion",
    views: 2100,
    likes: 156,
    featured: true,
    createdAt: "2024-12-05T00:00:00Z",
  },
];

const MOCK_CLIENT_PROJECTS: ClientProject[] = [
  {
    id: "client-001",
    clientName: "GameCraft Studios",
    projectTitle: "Mobile RPG UI Overhaul",
    status: "active",
    progress: 65,
    deadline: "2025-01-15T00:00:00Z",
    budget: 15000,
    teamSize: 3,
  },
  {
    id: "client-002",
    clientName: "Indie Collective",
    projectTitle: "Promotional Animation Series",
    status: "review",
    progress: 90,
    deadline: "2025-01-05T00:00:00Z",
    budget: 8000,
    teamSize: 2,
  },
  {
    id: "client-003",
    clientName: "TechStart Inc",
    projectTitle: "App Icon & Brand Assets",
    status: "completed",
    progress: 100,
    deadline: "2024-12-20T00:00:00Z",
    budget: 3500,
    teamSize: 1,
  },
];

function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
  const theme = useTheme();

  const getCategoryColor = () => {
    switch (item.category) {
      case "UI/UX Design": return "#8b5cf6";
      case "3D Modeling": return "#06b6d4";
      case "Animation": return "#f59e0b";
      default: return theme.accent;
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <GlassCard style={{ padding: Spacing.md, marginBottom: Spacing.sm }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ 
            width: 80, 
            height: 80, 
            borderRadius: BorderRadius.md, 
            backgroundColor: `${getCategoryColor()}20`,
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Layers size={32} color={getCategoryColor()} />
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: theme.text, flex: 1 }}>
                {item.title}
              </Text>
              {item.featured ? (
                <View style={{ backgroundColor: "#f59e0b20", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                </View>
              ) : null}
            </View>
            <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
              {item.description}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Eye size={14} color={theme.textSecondary} />
                <Text style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 4 }}>
                  {item.views.toLocaleString()}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Star size={14} color={theme.textSecondary} />
                <Text style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 4 }}>
                  {item.likes}
                </Text>
              </View>
              <View style={{ backgroundColor: `${getCategoryColor()}20`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                <Text style={{ fontSize: 10, color: getCategoryColor(), fontWeight: "500" }}>
                  {item.category}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

function ClientProjectCard({ project, index }: { project: ClientProject; index: number }) {
  const theme = useTheme();

  const getStatusConfig = () => {
    switch (project.status) {
      case "active": return { bg: "#22c55e20", color: "#22c55e", text: "Active" };
      case "review": return { bg: "#f59e0b20", color: "#f59e0b", text: "In Review" };
      case "completed": return { bg: "#3b82f620", color: "#3b82f6", text: "Completed" };
      case "paused": return { bg: "#6b728020", color: "#6b7280", text: "Paused" };
    }
  };

  const status = getStatusConfig();
  const daysLeft = Math.max(0, Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <GlassCard style={{ padding: Spacing.md, marginBottom: Spacing.sm }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: Spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: theme.text }}>{project.projectTitle}</Text>
            <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>{project.clientName}</Text>
          </View>
          <View style={{ backgroundColor: status.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: status.color }}>{status.text}</Text>
          </View>
        </View>

        <View style={{ marginBottom: Spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontSize: 12, color: theme.textSecondary }}>Progress</Text>
            <Text style={{ fontSize: 12, color: theme.accent, fontWeight: "600" }}>{project.progress}%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: theme.secondary, borderRadius: 3, overflow: "hidden" }}>
            <View style={{ height: "100%", width: `${project.progress}%`, backgroundColor: theme.accent, borderRadius: 3 }} />
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Clock size={14} color={theme.textSecondary} />
            <Text style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 4 }}>
              {daysLeft > 0 ? `${daysLeft} days left` : "Due today"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Users size={14} color={theme.textSecondary} />
            <Text style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 4 }}>{project.teamSize} members</Text>
          </View>
          <Text style={{ fontSize: 12, color: theme.accent, fontWeight: "600" }}>${project.budget.toLocaleString()}</Text>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

function InvestorMetrics() {
  const theme = useTheme();

  const metrics = [
    { label: "Portfolio Value", value: "$125K", change: "+12%", icon: TrendingUp },
    { label: "Active Projects", value: "8", change: "+2", icon: Briefcase },
    { label: "Talent Pool", value: "45", change: "+5", icon: Users },
    { label: "Completion Rate", value: "94%", change: "+3%", icon: Award },
  ];

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginBottom: Spacing.md }}>
        Investment Overview
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm }}>
        {metrics.map((metric, index) => (
          <Animated.View key={metric.label} entering={FadeInUp.delay(index * 50).duration(400)} style={{ width: "48%" }}>
            <GlassCard style={{ padding: Spacing.md }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: `${theme.accent}20`, alignItems: "center", justifyContent: "center" }}>
                  <metric.icon size={16} color={theme.accent} />
                </View>
              </View>
              <Text style={{ fontSize: 22, fontWeight: "700", color: theme.text }}>{metric.value}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: theme.textSecondary }}>{metric.label}</Text>
                <View style={{ backgroundColor: "#22c55e20", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginLeft: 8 }}>
                  <Text style={{ fontSize: 10, color: "#22c55e", fontWeight: "600" }}>{metric.change}</Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

export function StudioDayDashboard() {
  const theme = useTheme();
  const { currentMember } = useAppStore();
  const isInvestor = currentMember?.role === "investor";
  const isClient = currentMember?.role === "client";

  if (isInvestor) {
    return (
      <View>
        <InvestorMetrics />
        <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginTop: Spacing.xl, marginBottom: Spacing.md }}>
          Active Portfolio
        </Text>
        {MOCK_CLIENT_PROJECTS.filter(p => p.status !== "completed").map((project, index) => (
          <ClientProjectCard key={project.id} project={project} index={index} />
        ))}
      </View>
    );
  }

  if (isClient) {
    return (
      <View>
        <Animated.View entering={FadeInUp.duration(500)}>
          <GlassCard style={{ padding: Spacing.lg, marginBottom: Spacing.lg }}>
            <Text style={{ fontSize: 14, color: theme.textSecondary }}>Welcome,</Text>
            <Text style={{ fontSize: 22, fontWeight: "700", color: theme.text }}>{currentMember?.name || "Client"}</Text>
            <Text style={{ fontSize: 14, color: theme.accent, marginTop: 4 }}>Studio Client</Text>
          </GlassCard>
        </Animated.View>

        <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginBottom: Spacing.md }}>
          Your Projects
        </Text>
        {MOCK_CLIENT_PROJECTS.map((project, index) => (
          <ClientProjectCard key={project.id} project={project} index={index} />
        ))}
      </View>
    );
  }

  return (
    <View>
      <Animated.View entering={FadeInUp.duration(500)}>
        <GlassCard style={{ padding: Spacing.lg, marginBottom: Spacing.lg }}>
          <Text style={{ fontSize: 14, color: theme.textSecondary }}>Studio Dashboard</Text>
          <Text style={{ fontSize: 22, fontWeight: "700", color: theme.text }}>Foundry Overview</Text>
        </GlassCard>
      </Animated.View>

      <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginBottom: Spacing.md }}>
        Active Client Projects
      </Text>
      {MOCK_CLIENT_PROJECTS.filter(p => p.status !== "completed").map((project, index) => (
        <ClientProjectCard key={project.id} project={project} index={index} />
      ))}
    </View>
  );
}

export function StudioNightDashboard() {
  const theme = useTheme();
  const { currentMember, ledgerItems } = useAppStore();

  const studentStats = [
    { label: "Portfolio Views", value: "4,250", trend: "+320 this week" },
    { label: "Projects Completed", value: "12", trend: "2 in progress" },
    { label: "Skill Level", value: "Advanced", trend: "85% to Expert" },
  ];

  return (
    <View>
      <Animated.View entering={FadeInUp.duration(500)}>
        <GlassCard style={{ padding: Spacing.lg, marginBottom: Spacing.lg }}>
          <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 4 }}>Welcome back,</Text>
          <Text style={{ fontSize: 22, fontWeight: "700", color: theme.text }}>
            {currentMember?.name || "Student"}
          </Text>
          <Text style={{ fontSize: 14, color: theme.accent, marginTop: 4 }}>
            Foundry Student
          </Text>
        </GlassCard>
      </Animated.View>

      <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginBottom: Spacing.md }}>
        Your Progress
      </Text>

      {studentStats.map((stat, index) => (
        <Animated.View key={stat.label} entering={FadeInDown.delay(index * 100).duration(400)}>
          <GlassCard style={{ padding: Spacing.md, marginBottom: Spacing.sm }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={{ fontSize: 13, color: theme.textSecondary }}>{stat.label}</Text>
                <Text style={{ fontSize: 24, fontWeight: "700", color: theme.text, marginTop: 2 }}>{stat.value}</Text>
              </View>
              <View style={{ backgroundColor: "#22c55e20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontSize: 12, color: "#22c55e" }}>{stat.trend}</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      ))}

      <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginTop: Spacing.xl, marginBottom: Spacing.md }}>
        Your Portfolio
      </Text>

      {MOCK_PORTFOLIO.map((item, index) => (
        <PortfolioCard key={item.id} item={item} index={index + 3} />
      ))}

      <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginTop: Spacing.xl, marginBottom: Spacing.md }}>
        Current Assignments
      </Text>

      {ledgerItems.filter(item => item.status === "pending").slice(0, 3).map((item, index) => (
        <Animated.View key={item.id} entering={FadeInDown.delay((index + 6) * 100).duration(400)}>
          <GlassCard style={{ padding: Spacing.md, marginBottom: Spacing.sm }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "500", color: theme.text }}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                  Due: {new Date(item.dueDate || "").toLocaleDateString()}
                </Text>
              </View>
              <View style={{ backgroundColor: "#f59e0b20", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontSize: 11, color: "#f59e0b", fontWeight: "600" }}>+{item.xpValue || 0} XP</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      ))}
    </View>
  );
}
