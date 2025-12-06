import { configService } from "./configurationService";

export interface Gig {
  id: string;
  title: string;
  client: string;
  reward: number;
  currency: string;
  category: string;
  skills: string[];
  urgency: "normal" | "high" | "urgent";
  postedAt: string;
  deadline: string;
  description: string;
  matchScore: number;
}

export interface Sprint {
  id: string;
  projectName: string;
  dayNumber: number;
  totalDays: number;
  killGatePassed: boolean;
  killGateDay: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "at_risk";
  nextMilestone: string;
  hoursLogged: number;
  hoursTarget: number;
}

export interface PassportSkill {
  id: string;
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  verified: boolean;
}

const MOCK_PASSPORT_SKILLS: PassportSkill[] = [
  { id: "sk1", name: "Synthwave Composer", category: "Audio", level: "advanced", verified: true },
  { id: "sk2", name: "UEFN Scripter", category: "Game Dev", level: "intermediate", verified: true },
  { id: "sk3", name: "React Native", category: "Mobile", level: "expert", verified: true },
  { id: "sk4", name: "Smart Contract", category: "Web3", level: "intermediate", verified: false },
  { id: "sk5", name: "UI/UX Design", category: "Design", level: "advanced", verified: true },
];

const MOCK_GIGS: Gig[] = [
  {
    id: "gig1",
    title: "Synthwave Soundtrack for Indie Game",
    client: "NeonWave Studios",
    reward: 1500,
    currency: "USD",
    category: "Audio",
    skills: ["Synthwave Composer", "Music Production"],
    urgency: "high",
    postedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    description: "Create a 10-track synthwave soundtrack for our upcoming cyberpunk roguelike.",
    matchScore: 95,
  },
  {
    id: "gig2",
    title: "UEFN Creative Map Development",
    client: "Fortnite Creator Collective",
    reward: 2500,
    currency: "USD",
    category: "Game Dev",
    skills: ["UEFN Scripter", "Verse Programming"],
    urgency: "normal",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    description: "Build an interactive adventure map with custom game mechanics.",
    matchScore: 88,
  },
  {
    id: "gig3",
    title: "React Native Fintech App",
    client: "CryptoVault Inc",
    reward: 5000,
    currency: "USD",
    category: "Mobile",
    skills: ["React Native", "TypeScript", "Web3"],
    urgency: "urgent",
    postedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    description: "Develop a mobile wallet app with biometric authentication and DeFi integration.",
    matchScore: 92,
  },
  {
    id: "gig4",
    title: "Smart Contract Security Audit",
    client: "DeFi Protocol DAO",
    reward: 3000,
    currency: "USD",
    category: "Web3",
    skills: ["Smart Contract", "Solidity", "Security"],
    urgency: "high",
    postedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    description: "Audit and verify our new lending protocol smart contracts.",
    matchScore: 75,
  },
  {
    id: "gig5",
    title: "Mobile App UI Redesign",
    client: "FitTrack Health",
    reward: 1800,
    currency: "USD",
    category: "Design",
    skills: ["UI/UX Design", "Figma", "Mobile Design"],
    urgency: "normal",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    description: "Redesign our fitness tracking app with modern iOS/Android design patterns.",
    matchScore: 85,
  },
];

const MOCK_SPRINT: Sprint = {
  id: "sprint1",
  projectName: "AeThex Companion v2.0",
  dayNumber: 12,
  totalDays: 30,
  killGatePassed: true,
  killGateDay: 7,
  startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
  status: "active",
  nextMilestone: "Beta Release",
  hoursLogged: 48,
  hoursTarget: 120,
};

class NexusService {
  private appliedGigs: Set<string> = new Set();
  private skills: PassportSkill[] = MOCK_PASSPORT_SKILLS;

  getPassportSkills(): PassportSkill[] {
    return this.skills;
  }

  getMatchingGigs(): Gig[] {
    const userSkillNames = this.skills.map(s => s.name);
    return MOCK_GIGS
      .filter(gig => gig.skills.some(skill => userSkillNames.includes(skill)))
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  getAllGigs(): Gig[] {
    return MOCK_GIGS.sort((a, b) => b.matchScore - a.matchScore);
  }

  quickApply(gigId: string): { success: boolean; message: string } {
    if (this.appliedGigs.has(gigId)) {
      return { success: false, message: "Already applied to this gig" };
    }
    this.appliedGigs.add(gigId);
    return { success: true, message: "Application sent successfully!" };
  }

  hasApplied(gigId: string): boolean {
    return this.appliedGigs.has(gigId);
  }

  getActiveSprint(): Sprint | null {
    return MOCK_SPRINT;
  }

  getSprintProgress(): { percentage: number; daysRemaining: number; isOnTrack: boolean } {
    const sprint = this.getActiveSprint();
    if (!sprint) return { percentage: 0, daysRemaining: 0, isOnTrack: true };

    const percentage = Math.round((sprint.dayNumber / sprint.totalDays) * 100);
    const daysRemaining = sprint.totalDays - sprint.dayNumber;
    const expectedHours = (sprint.dayNumber / sprint.totalDays) * sprint.hoursTarget;
    const isOnTrack = sprint.hoursLogged >= expectedHours * 0.8;

    return { percentage, daysRemaining, isOnTrack };
  }

  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  getUrgencyColor(urgency: Gig["urgency"]): string {
    switch (urgency) {
      case "urgent": return "#ef4444";
      case "high": return "#f59e0b";
      default: return "#22c55e";
    }
  }
}

export const nexusService = new NexusService();
