import { 
  EcosystemPillar, 
  Grant, 
  PortfolioItem, 
  MentorshipMatch, 
  CrossPillarQuest, 
  EcosystemPulse,
  ReputationScore,
  IPAttributionNode 
} from "../types/domain";

const SAMPLE_GRANTS: Grant[] = [
  {
    id: "grant-1",
    title: "Open Source Game Engine Tools",
    description: "Fund development of modular tools for indie game developers",
    amount: 25000,
    currency: "USD",
    status: "voting",
    proposedBy: "council-member-1",
    proposedAt: "2024-12-01T10:00:00Z",
    votesFor: 42,
    votesAgainst: 8,
    votingEndsAt: "2024-12-31T23:59:59Z",
    ipChain: [
      { id: "ip-1", pillar: "foundation", type: "grant", title: "Grant Proposal", contributor: "Council", timestamp: "2024-12-01T10:00:00Z" },
    ],
    metadata: { category: "tools" },
  },
  {
    id: "grant-2",
    title: "Youth Coding Education Initiative",
    description: "Expand Foundry program to underserved communities",
    amount: 50000,
    currency: "USD",
    status: "approved",
    proposedBy: "council-member-2",
    proposedAt: "2024-11-15T14:00:00Z",
    votesFor: 67,
    votesAgainst: 3,
    executedBy: "dev-team-1",
    ipChain: [
      { id: "ip-2", pillar: "foundation", type: "grant", title: "Grant Approved", contributor: "Council", timestamp: "2024-11-20T12:00:00Z" },
      { id: "ip-3", pillar: "dev", type: "build", title: "Curriculum Platform", contributor: "Dev Team", timestamp: "2024-12-01T09:00:00Z" },
    ],
    metadata: { category: "education" },
  },
  {
    id: "grant-3",
    title: "API Documentation Overhaul",
    description: "Comprehensive rewrite of developer documentation",
    amount: 15000,
    currency: "USD",
    status: "completed",
    proposedBy: "council-member-1",
    proposedAt: "2024-10-01T08:00:00Z",
    votesFor: 55,
    votesAgainst: 5,
    executedBy: "dev-team-2",
    showcasedAt: "2024-12-10T00:00:00Z",
    ipChain: [
      { id: "ip-4", pillar: "foundation", type: "grant", title: "Grant Approved", contributor: "Council", timestamp: "2024-10-05T10:00:00Z" },
      { id: "ip-5", pillar: "dev", type: "build", title: "New Docs Site", contributor: "Tech Writers", timestamp: "2024-11-15T14:00:00Z" },
      { id: "ip-6", pillar: "studio", type: "showcase", title: "Docs Launch", contributor: "Studio Team", timestamp: "2024-12-10T00:00:00Z" },
    ],
    metadata: { category: "documentation" },
  },
];

const SAMPLE_PORTFOLIO: PortfolioItem[] = [
  {
    id: "portfolio-1",
    title: "Warden - Roblox Security Tool",
    description: "Enterprise-grade security monitoring for Roblox experiences",
    category: "tool",
    createdBy: ["foundry-student-1", "foundry-student-2"],
    skills: ["Lua", "Security", "API Design"],
    featured: true,
    metrics: { views: 12500, likes: 890, shares: 234 },
    createdAt: "2024-09-15T00:00:00Z",
  },
  {
    id: "portfolio-2",
    title: "AeThex Companion App",
    description: "Cross-platform mobile companion for the AeThex ecosystem",
    category: "app",
    createdBy: ["dev-team-1"],
    skills: ["React Native", "TypeScript", "Mobile"],
    featured: true,
    grantId: "grant-2",
    metrics: { views: 8900, likes: 567, shares: 145 },
    createdAt: "2024-11-01T00:00:00Z",
  },
  {
    id: "portfolio-3",
    title: "Foundry Learning Platform",
    description: "Interactive coding curriculum for K-12 students",
    category: "app",
    createdBy: ["foundry-student-3", "mentor-1"],
    skills: ["Education", "React", "Gamification"],
    featured: false,
    grantId: "grant-2",
    metrics: { views: 4500, likes: 312, shares: 89 },
    createdAt: "2024-10-20T00:00:00Z",
  },
];

const SAMPLE_MENTORSHIPS: MentorshipMatch[] = [
  {
    id: "mentor-1",
    mentorId: "dev-veteran-1",
    mentorName: "Alex Chen",
    menteeId: "foundry-student-1",
    menteeName: "Jordan Smith",
    skillFocus: ["Game Development", "Lua", "API Design"],
    status: "active",
    sessionsCompleted: 8,
    nextSessionAt: "2024-12-22T15:00:00Z",
    xpEarned: 2400,
    createdAt: "2024-10-01T00:00:00Z",
  },
  {
    id: "mentor-2",
    mentorId: "dev-veteran-2",
    mentorName: "Sam Rivera",
    menteeId: "foundry-student-2",
    menteeName: "Casey Williams",
    skillFocus: ["Mobile Development", "React Native", "TypeScript"],
    status: "active",
    sessionsCompleted: 5,
    nextSessionAt: "2024-12-23T14:00:00Z",
    xpEarned: 1500,
    createdAt: "2024-10-15T00:00:00Z",
  },
];

const SAMPLE_CROSS_PILLAR_QUESTS: CrossPillarQuest[] = [
  {
    id: "quest-1",
    title: "Full Circle Contributor",
    description: "Experience the complete AeThex journey from idea to showcase",
    pillars: ["foundation", "dev", "studio"],
    steps: [
      { id: "step-1", pillar: "foundation", action: "vote", description: "Vote on a grant proposal", completed: true, completedAt: "2024-12-10T00:00:00Z" },
      { id: "step-2", pillar: "dev", action: "contribute", description: "Contribute code to a grant project", completed: true, completedAt: "2024-12-15T00:00:00Z" },
      { id: "step-3", pillar: "studio", action: "showcase", description: "Add the project to your portfolio", completed: false },
    ],
    xpReward: 5000,
    reputationReward: [
      { pillar: "foundation", amount: 100 },
      { pillar: "dev", amount: 150 },
      { pillar: "studio", amount: 100 },
    ],
    difficulty: "advanced",
    status: "in_progress",
    completedSteps: 2,
  },
  {
    id: "quest-2",
    title: "Mentor Bridge",
    description: "Connect dev experience with foundry learning",
    pillars: ["dev", "studio"],
    steps: [
      { id: "step-4", pillar: "dev", action: "mentor", description: "Complete 3 mentorship sessions", completed: false },
      { id: "step-5", pillar: "studio", action: "guide", description: "Help a student publish their first portfolio piece", completed: false },
    ],
    xpReward: 3000,
    reputationReward: [
      { pillar: "dev", amount: 200 },
      { pillar: "studio", amount: 150 },
    ],
    difficulty: "intermediate",
    status: "available",
    completedSteps: 0,
  },
  {
    id: "quest-3",
    title: "Community Champion",
    description: "Make your voice heard in ecosystem governance",
    pillars: ["foundation"],
    steps: [
      { id: "step-6", pillar: "foundation", action: "propose", description: "Submit a grant proposal", completed: false },
      { id: "step-7", pillar: "foundation", action: "vote", description: "Vote on 5 different proposals", completed: false },
      { id: "step-8", pillar: "foundation", action: "discuss", description: "Participate in council discussion", completed: false },
    ],
    xpReward: 2500,
    reputationReward: [
      { pillar: "foundation", amount: 300 },
    ],
    difficulty: "beginner",
    status: "available",
    completedSteps: 0,
  },
];

const SAMPLE_PULSE: EcosystemPulse = {
  timestamp: new Date().toISOString(),
  dev: {
    activeGigs: 47,
    apiUptime: 99.97,
    forumPosts: 1284,
    activeDevelopers: 892,
  },
  studio: {
    foundryStudents: 1247,
    portfolioItems: 456,
    activeClients: 23,
    projectsInProgress: 89,
  },
  foundation: {
    activeGrants: 12,
    totalDonated: 485000,
    pendingVotes: 3,
    councilMembers: 15,
  },
  overall: {
    totalMembers: 2456,
    weeklyActiveUsers: 1834,
    crossPillarQuests: 156,
    mentorshipMatches: 78,
  },
};

class EcosystemService {
  private reputationScores: Map<string, ReputationScore[]> = new Map();
  private grants: Grant[] = SAMPLE_GRANTS;
  private portfolio: PortfolioItem[] = SAMPLE_PORTFOLIO;
  private mentorships: MentorshipMatch[] = SAMPLE_MENTORSHIPS;
  private quests: CrossPillarQuest[] = SAMPLE_CROSS_PILLAR_QUESTS;

  getGrants(status?: Grant["status"]): Grant[] {
    if (status) {
      return this.grants.filter(g => g.status === status);
    }
    return this.grants;
  }

  getGrantById(id: string): Grant | undefined {
    return this.grants.find(g => g.id === id);
  }

  voteOnGrant(grantId: string, vote: "for" | "against"): void {
    const grant = this.grants.find(g => g.id === grantId);
    if (grant && grant.status === "voting") {
      if (vote === "for") {
        grant.votesFor++;
      } else {
        grant.votesAgainst++;
      }
    }
  }

  getPortfolio(featured?: boolean): PortfolioItem[] {
    if (featured !== undefined) {
      return this.portfolio.filter(p => p.featured === featured);
    }
    return this.portfolio;
  }

  getPortfolioByCreator(creatorId: string): PortfolioItem[] {
    return this.portfolio.filter(p => p.createdBy.includes(creatorId));
  }

  getMentorships(status?: MentorshipMatch["status"]): MentorshipMatch[] {
    if (status) {
      return this.mentorships.filter(m => m.status === status);
    }
    return this.mentorships;
  }

  getMentorshipsByMentor(mentorId: string): MentorshipMatch[] {
    return this.mentorships.filter(m => m.mentorId === mentorId);
  }

  getMentorshipsByMentee(menteeId: string): MentorshipMatch[] {
    return this.mentorships.filter(m => m.menteeId === menteeId);
  }

  getQuests(status?: CrossPillarQuest["status"]): CrossPillarQuest[] {
    if (status) {
      return this.quests.filter(q => q.status === status);
    }
    return this.quests;
  }

  getQuestsByPillar(pillar: EcosystemPillar): CrossPillarQuest[] {
    return this.quests.filter(q => q.pillars.includes(pillar));
  }

  completeQuestStep(questId: string, stepId: string): void {
    const quest = this.quests.find(q => q.id === questId);
    if (quest) {
      const step = quest.steps.find(s => s.id === stepId);
      if (step && !step.completed) {
        step.completed = true;
        step.completedAt = new Date().toISOString();
        quest.completedSteps++;
        
        if (quest.completedSteps === quest.steps.length) {
          quest.status = "completed";
        } else if (quest.status === "available") {
          quest.status = "in_progress";
        }
      }
    }
  }

  getEcosystemPulse(): EcosystemPulse {
    return {
      ...SAMPLE_PULSE,
      timestamp: new Date().toISOString(),
    };
  }

  getReputationScores(memberId: string): ReputationScore[] {
    return this.reputationScores.get(memberId) || [
      { pillar: "dev", score: 750, level: 3, contributions: 45, lastUpdated: new Date().toISOString() },
      { pillar: "studio", score: 320, level: 2, contributions: 12, lastUpdated: new Date().toISOString() },
      { pillar: "foundation", score: 180, level: 1, contributions: 8, lastUpdated: new Date().toISOString() },
    ];
  }

  getTotalReputation(memberId: string): number {
    const scores = this.getReputationScores(memberId);
    return scores.reduce((total, s) => total + s.score, 0);
  }

  addReputationPoints(memberId: string, pillar: EcosystemPillar, points: number): void {
    let scores = this.reputationScores.get(memberId);
    if (!scores) {
      scores = [
        { pillar: "dev", score: 0, level: 1, contributions: 0, lastUpdated: new Date().toISOString() },
        { pillar: "studio", score: 0, level: 1, contributions: 0, lastUpdated: new Date().toISOString() },
        { pillar: "foundation", score: 0, level: 1, contributions: 0, lastUpdated: new Date().toISOString() },
      ];
      this.reputationScores.set(memberId, scores);
    }
    
    const pillarScore = scores.find(s => s.pillar === pillar);
    if (pillarScore) {
      pillarScore.score += points;
      pillarScore.contributions++;
      pillarScore.level = Math.floor(pillarScore.score / 500) + 1;
      pillarScore.lastUpdated = new Date().toISOString();
    }
  }

  getIPChain(grantId: string): IPAttributionNode[] {
    const grant = this.grants.find(g => g.id === grantId);
    return grant?.ipChain || [];
  }

  getManifesto(): { title: string; sections: { heading: string; content: string }[] } {
    return {
      title: "The AeThex Manifesto",
      sections: [
        {
          heading: "Our Mission",
          content: "To democratize creation and empower the next generation of builders through accessible technology, education, and community governance.",
        },
        {
          heading: "The Three Pillars",
          content: "Dev builds the tools. Studio nurtures the talent. Foundation steers the vision. Together, they form an ecosystem where innovation flows freely from idea to impact.",
        },
        {
          heading: "Open Governance",
          content: "Every voice matters. Council members and donors shape the direction through transparent voting. Grant funds flow to projects that serve the community.",
        },
        {
          heading: "Skill Over Credentials",
          content: "Your Passport reflects what you can do, not where you went to school. Build, learn, contribute - your reputation speaks for itself.",
        },
        {
          heading: "The Foundry Promise",
          content: "Every student who enters the Foundry leaves with real skills, a portfolio of work, and connections to mentors who believe in their potential.",
        },
      ],
    };
  }
}

export const ecosystemService = new EcosystemService();
