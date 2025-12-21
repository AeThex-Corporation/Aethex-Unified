import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Platform } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Vote, FileText, Users, TrendingUp, CheckCircle, XCircle, Clock, ChevronRight, Shield, Heart, BookOpen, Award } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useAppStore, useTheme } from "@/store/appStore";
import { GlassCard } from "./GlassCard";
import { Spacing, BorderRadius } from "@/constants/theme";
import { createReputationAction } from "@/services/reputationService";

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: "grant" | "policy" | "amendment" | "election";
  status: "active" | "passed" | "rejected" | "pending";
  votesFor: number;
  votesAgainst: number;
  totalVoters: number;
  deadline: string;
  author: string;
  fundingAmount?: number;
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "prop-001",
    title: "Q1 2025 Foundry Scholarship Fund",
    description: "Allocate $50,000 for student scholarships in the Foundry program",
    category: "grant",
    status: "active",
    votesFor: 45,
    votesAgainst: 8,
    totalVoters: 70,
    deadline: "2025-01-15T23:59:00Z",
    author: "Elena Vasquez",
    fundingAmount: 50000,
  },
  {
    id: "prop-002",
    title: "Developer Documentation Grant",
    description: "Fund comprehensive API documentation improvement initiative",
    category: "grant",
    status: "active",
    votesFor: 32,
    votesAgainst: 5,
    totalVoters: 70,
    deadline: "2025-01-20T23:59:00Z",
    author: "Council",
    fundingAmount: 15000,
  },
  {
    id: "prop-003",
    title: "Community Event Sponsorship Policy",
    description: "Establish guidelines for sponsoring community-led events",
    category: "policy",
    status: "pending",
    votesFor: 0,
    votesAgainst: 0,
    totalVoters: 70,
    deadline: "2025-02-01T23:59:00Z",
    author: "Morgan Davis",
  },
  {
    id: "prop-004",
    title: "Open Source Mentorship Program",
    description: "Create structured mentorship connecting Dev veterans with Foundry students",
    category: "grant",
    status: "passed",
    votesFor: 62,
    votesAgainst: 3,
    totalVoters: 70,
    deadline: "2024-12-15T23:59:00Z",
    author: "Elena Vasquez",
    fundingAmount: 25000,
  },
];

const MANIFESTO_SECTIONS = [
  {
    id: "mission",
    title: "Our Mission",
    content: "To empower creators, developers, and learners through an interconnected ecosystem that rewards contribution, fosters innovation, and builds lasting value for all participants.",
  },
  {
    id: "values",
    title: "Core Values",
    content: "Transparency, Collaboration, Merit-Based Recognition, Continuous Learning, and Community-First Decision Making guide every aspect of the AeThex Foundation.",
  },
  {
    id: "governance",
    title: "Governance Model",
    content: "The Foundation operates through a council of elected members who represent the interests of Dev, Studio, and Foundation stakeholders. All major decisions require community voting.",
  },
  {
    id: "funding",
    title: "Funding Allocation",
    content: "Foundation funds are allocated through transparent grant proposals. 40% supports Foundry education, 30% funds Dev ecosystem tools, and 30% goes to community initiatives.",
  },
];

function ProposalCard({ proposal, onVote, hasVoted, userVote }: { proposal: Proposal; onVote: (id: string, vote: "for" | "against") => void; hasVoted?: boolean; userVote?: "for" | "against" }) {
  const theme = useTheme();
  const votingProgress = proposal.totalVoters > 0 ? ((proposal.votesFor + proposal.votesAgainst) / proposal.totalVoters) * 100 : 0;
  const approvalRate = (proposal.votesFor + proposal.votesAgainst) > 0 
    ? (proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100 
    : 0;

  const daysLeft = Math.max(0, Math.ceil((new Date(proposal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const isActive = proposal.status === "active";

  const getCategoryIcon = () => {
    switch (proposal.category) {
      case "grant": return <Heart size={16} color={theme.accent} />;
      case "policy": return <FileText size={16} color={theme.accent} />;
      case "amendment": return <Shield size={16} color={theme.accent} />;
      case "election": return <Users size={16} color={theme.accent} />;
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      active: { bg: "#22c55e20", color: "#22c55e", text: "Active" },
      passed: { bg: "#3b82f620", color: "#3b82f6", text: "Passed" },
      rejected: { bg: "#ef444420", color: "#ef4444", text: "Rejected" },
      pending: { bg: "#f59e0b20", color: "#f59e0b", text: "Pending" },
    };
    const config = statusConfig[proposal.status];
    return (
      <View style={{ backgroundColor: config.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
        <Text style={{ fontSize: 11, fontWeight: "600", color: config.color }}>{config.text}</Text>
      </View>
    );
  };

  const handleVote = (vote: "for" | "against") => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onVote(proposal.id, vote);
  };

  return (
    <GlassCard style={{ padding: Spacing.lg, marginBottom: Spacing.md }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: Spacing.sm }}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          {getCategoryIcon()}
          <Text style={{ fontSize: 11, color: theme.textSecondary, marginLeft: 6, textTransform: "capitalize" }}>
            {proposal.category}
          </Text>
        </View>
        {getStatusBadge()}
      </View>

      <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text, marginBottom: 4 }}>
        {proposal.title}
      </Text>
      <Text style={{ fontSize: 13, color: theme.textSecondary, marginBottom: Spacing.md }}>
        {proposal.description}
      </Text>

      {proposal.fundingAmount ? (
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: Spacing.sm }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: theme.accent }}>
            ${proposal.fundingAmount.toLocaleString()}
          </Text>
          <Text style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 6 }}>requested</Text>
        </View>
      ) : null}

      <View style={{ marginBottom: Spacing.md }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
          <Text style={{ fontSize: 12, color: theme.textSecondary }}>
            {proposal.votesFor + proposal.votesAgainst} of {proposal.totalVoters} voted
          </Text>
          <Text style={{ fontSize: 12, color: approvalRate >= 50 ? "#22c55e" : "#ef4444" }}>
            {approvalRate.toFixed(0)}% approval
          </Text>
        </View>
        <View style={{ height: 6, backgroundColor: theme.secondary, borderRadius: 3, overflow: "hidden" }}>
          <View style={{ height: "100%", width: `${votingProgress}%`, flexDirection: "row" }}>
            <View style={{ flex: proposal.votesFor, backgroundColor: "#22c55e" }} />
            <View style={{ flex: proposal.votesAgainst, backgroundColor: "#ef4444" }} />
          </View>
        </View>
      </View>

      {isActive && !hasVoted ? (
        <View style={{ flexDirection: "row", gap: Spacing.sm }}>
          <Pressable
            onPress={() => handleVote("for")}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#22c55e20",
              paddingVertical: 10,
              borderRadius: BorderRadius.md,
              gap: 6,
            }}
          >
            <CheckCircle size={18} color="#22c55e" />
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#22c55e" }}>Vote For</Text>
          </Pressable>
          <Pressable
            onPress={() => handleVote("against")}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ef444420",
              paddingVertical: 10,
              borderRadius: BorderRadius.md,
              gap: 6,
            }}
          >
            <XCircle size={18} color="#ef4444" />
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ef4444" }}>Vote Against</Text>
          </Pressable>
        </View>
      ) : isActive && hasVoted ? (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: Spacing.sm, backgroundColor: userVote === "for" ? "#22c55e20" : "#ef444420", borderRadius: BorderRadius.md }}>
          {userVote === "for" ? <CheckCircle size={18} color="#22c55e" /> : <XCircle size={18} color="#ef4444" />}
          <Text style={{ fontSize: 14, fontWeight: "600", color: userVote === "for" ? "#22c55e" : "#ef4444", marginLeft: 8 }}>
            You voted {userVote === "for" ? "For" : "Against"}
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, color: theme.textSecondary }}>
            By {proposal.author}
          </Text>
          {isActive ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Clock size={14} color={theme.textSecondary} />
              <Text style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 4 }}>
                {daysLeft} days left
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </GlassCard>
  );
}

function ManifestoSection({ section, index }: { section: typeof MANIFESTO_SECTIONS[0]; index: number }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <Pressable 
        onPress={() => setExpanded(!expanded)}
        style={{ marginBottom: Spacing.sm }}
      >
        <GlassCard style={{ padding: Spacing.md }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <BookOpen size={18} color={theme.accent} />
              <Text style={{ fontSize: 15, fontWeight: "600", color: theme.text, marginLeft: Spacing.sm }}>
                {section.title}
              </Text>
            </View>
            <ChevronRight 
              size={20} 
              color={theme.textSecondary} 
              style={{ transform: [{ rotate: expanded ? "90deg" : "0deg" }] }}
            />
          </View>
          {expanded ? (
            <Animated.View entering={FadeInDown.duration(200)}>
              <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: Spacing.sm, lineHeight: 20 }}>
                {section.content}
              </Text>
            </Animated.View>
          ) : null}
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
}

function GovernanceMetrics() {
  const theme = useTheme();
  const { ledgerItems, members, events } = useAppStore();

  const metrics = [
    { label: "Active Proposals", value: MOCK_PROPOSALS.filter(p => p.status === "active").length, icon: Vote },
    { label: "Council Members", value: members.filter(m => m.role === "council_member").length, icon: Users },
    { label: "Total Donors", value: members.filter(m => m.role === "donor").length, icon: Heart },
    { label: "Funds Distributed", value: "$125K", icon: TrendingUp },
  ];

  return (
    <Animated.View entering={FadeInUp.duration(500)}>
      <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginBottom: Spacing.md }}>
        Governance Overview
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm }}>
        {metrics.map((metric, index) => (
          <GlassCard key={index} style={{ width: "48%", padding: Spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: `${theme.accent}20`, alignItems: "center", justifyContent: "center" }}>
                <metric.icon size={16} color={theme.accent} />
              </View>
            </View>
            <Text style={{ fontSize: 24, fontWeight: "700", color: theme.text }}>{metric.value}</Text>
            <Text style={{ fontSize: 12, color: theme.textSecondary }}>{metric.label}</Text>
          </GlassCard>
        ))}
      </View>
    </Animated.View>
  );
}

export function FoundationDayDashboard() {
  const theme = useTheme();
  const { addReputationAction } = useAppStore();
  const [activeTab, setActiveTab] = useState<"proposals" | "manifesto">("proposals");
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [userVotes, setUserVotes] = useState<Record<string, "for" | "against">>({});

  const handleVote = (proposalId: string, vote: "for" | "against") => {
    if (userVotes[proposalId]) return;
    
    setUserVotes(prev => ({ ...prev, [proposalId]: vote }));
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          votesFor: vote === "for" ? p.votesFor + 1 : p.votesFor,
          votesAgainst: vote === "against" ? p.votesAgainst + 1 : p.votesAgainst,
        };
      }
      return p;
    }));
    
    addReputationAction(createReputationAction("vote_on_proposal", "foundation"));
  };

  const hasVoted = (proposalId: string) => !!userVotes[proposalId];

  return (
    <View>
      <GovernanceMetrics />

      <View style={{ flexDirection: "row", marginTop: Spacing.xl, marginBottom: Spacing.md }}>
        <Pressable
          onPress={() => setActiveTab("proposals")}
          style={{
            flex: 1,
            paddingVertical: Spacing.sm,
            alignItems: "center",
            borderBottomWidth: 2,
            borderBottomColor: activeTab === "proposals" ? theme.accent : "transparent",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: activeTab === "proposals" ? "600" : "400", color: activeTab === "proposals" ? theme.accent : theme.textSecondary }}>
            Proposals
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("manifesto")}
          style={{
            flex: 1,
            paddingVertical: Spacing.sm,
            alignItems: "center",
            borderBottomWidth: 2,
            borderBottomColor: activeTab === "manifesto" ? theme.accent : "transparent",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: activeTab === "manifesto" ? "600" : "400", color: activeTab === "manifesto" ? theme.accent : theme.textSecondary }}>
            Manifesto
          </Text>
        </Pressable>
      </View>

      {activeTab === "proposals" ? (
        <View>
          {proposals.map((proposal, index) => (
            <Animated.View key={proposal.id} entering={FadeInDown.delay(index * 100).duration(400)}>
              <ProposalCard 
                proposal={proposal} 
                onVote={handleVote} 
                hasVoted={hasVoted(proposal.id)}
                userVote={userVotes[proposal.id]}
              />
            </Animated.View>
          ))}
        </View>
      ) : (
        <View>
          {MANIFESTO_SECTIONS.map((section, index) => (
            <ManifestoSection key={section.id} section={section} index={index} />
          ))}
        </View>
      )}
    </View>
  );
}

interface VoteHistoryItem {
  proposalId: string;
  proposalTitle: string;
  vote: "for" | "against";
  outcome: "passed" | "rejected" | "pending";
  date: string;
}

const MOCK_VOTE_HISTORY: VoteHistoryItem[] = [
  { proposalId: "prop-004", proposalTitle: "Open Source Mentorship Program", vote: "for", outcome: "passed", date: "2024-12-15" },
  { proposalId: "prop-003", proposalTitle: "Community Event Policy", vote: "for", outcome: "pending", date: "2024-12-12" },
  { proposalId: "prop-002", proposalTitle: "Documentation Grant", vote: "for", outcome: "pending", date: "2024-12-10" },
];

export function FoundationNightDashboard() {
  const theme = useTheme();
  const { currentMember } = useAppStore();
  const isDonor = currentMember?.role === "donor";

  const donorStats = [
    { label: "Total Contributed", value: "$2,500", trend: "+$500 this month", icon: Heart },
    { label: "Proposals Voted", value: "12", trend: "2 pending", icon: Vote },
    { label: "Impact Score", value: "850", trend: "Top 10%", icon: TrendingUp },
    { label: "Students Supported", value: "8", trend: "+3 this quarter", icon: Users },
  ];

  const voterStats = [
    { label: "Votes Cast", value: "24", trend: "3 this month", icon: Vote },
    { label: "Participation Rate", value: "92%", trend: "Above average", icon: TrendingUp },
    { label: "Community Rank", value: "#45", trend: "Up 12 spots", icon: Award },
  ];

  const stats = isDonor ? donorStats : voterStats;

  return (
    <View>
      <Animated.View entering={FadeInUp.duration(500)}>
        <GlassCard style={{ padding: Spacing.lg, marginBottom: Spacing.lg }}>
          <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 4 }}>Welcome back,</Text>
          <Text style={{ fontSize: 22, fontWeight: "700", color: theme.text }}>
            {currentMember?.name || "Supporter"}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
            <View style={{ backgroundColor: `${theme.accent}20`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ fontSize: 12, color: theme.accent, fontWeight: "600" }}>
                {isDonor ? "Foundation Donor" : "Community Voter"}
              </Text>
            </View>
            <View style={{ backgroundColor: "#22c55e20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 8 }}>
              <Text style={{ fontSize: 12, color: "#22c55e", fontWeight: "600" }}>Active Member</Text>
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginBottom: Spacing.md }}>
        {isDonor ? "Your Impact" : "Voting Stats"}
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, marginBottom: Spacing.lg }}>
        {stats.map((stat, index) => (
          <Animated.View key={stat.label} entering={FadeInDown.delay(index * 100).duration(400)} style={{ width: "48%" }}>
            <GlassCard style={{ padding: Spacing.md }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: `${theme.accent}20`, alignItems: "center", justifyContent: "center" }}>
                  <stat.icon size={16} color={theme.accent} />
                </View>
              </View>
              <Text style={{ fontSize: 22, fontWeight: "700", color: theme.text }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: theme.textSecondary }}>{stat.label}</Text>
              <View style={{ backgroundColor: "#22c55e20", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, alignSelf: "flex-start", marginTop: 4 }}>
                <Text style={{ fontSize: 10, color: "#22c55e" }}>{stat.trend}</Text>
              </View>
            </GlassCard>
          </Animated.View>
        ))}
      </View>

      <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginBottom: Spacing.md }}>
        Your Vote History
      </Text>

      {MOCK_VOTE_HISTORY.map((vote, index) => (
        <Animated.View key={vote.proposalId} entering={FadeInDown.delay((index + 4) * 100).duration(400)}>
          <GlassCard style={{ padding: Spacing.md, marginBottom: Spacing.sm }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "500", color: theme.text }}>{vote.proposalTitle}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: vote.vote === "for" ? "#22c55e20" : "#ef444420", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                    {vote.vote === "for" ? <CheckCircle size={12} color="#22c55e" /> : <XCircle size={12} color="#ef4444" />}
                    <Text style={{ fontSize: 11, color: vote.vote === "for" ? "#22c55e" : "#ef4444", marginLeft: 4, fontWeight: "600" }}>
                      Voted {vote.vote === "for" ? "For" : "Against"}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, color: theme.textSecondary }}>{vote.date}</Text>
                </View>
              </View>
              <View style={{ 
                backgroundColor: vote.outcome === "passed" ? "#22c55e20" : vote.outcome === "rejected" ? "#ef444420" : "#f59e0b20",
                paddingHorizontal: 8, 
                paddingVertical: 4, 
                borderRadius: 12 
              }}>
                <Text style={{ 
                  fontSize: 11, 
                  fontWeight: "600", 
                  color: vote.outcome === "passed" ? "#22c55e" : vote.outcome === "rejected" ? "#ef4444" : "#f59e0b" 
                }}>
                  {vote.outcome === "passed" ? "Passed" : vote.outcome === "rejected" ? "Rejected" : "Pending"}
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      ))}

      <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text, marginTop: Spacing.xl, marginBottom: Spacing.md }}>
        Active Proposals
      </Text>

      {MOCK_PROPOSALS.filter(p => p.status === "active").slice(0, 2).map((proposal, index) => (
        <Animated.View key={proposal.id} entering={FadeInDown.delay((index + 7) * 100).duration(400)}>
          <GlassCard style={{ padding: Spacing.md, marginBottom: Spacing.sm }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "500", color: theme.text }}>{proposal.title}</Text>
                <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                  {proposal.votesFor + proposal.votesAgainst} of {proposal.totalVoters} voted
                </Text>
              </View>
              <View style={{ backgroundColor: "#22c55e20", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontSize: 11, color: "#22c55e", fontWeight: "600" }}>Vote Now</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      ))}
    </View>
  );
}
