import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "milestone" | "streak" | "skill" | "social" | "special";
  xpReward: number;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  isSecret?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: "daily" | "weekly" | "story" | "challenge";
  xpReward: number;
  steps: QuestStep[];
  completedAt?: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface QuestStep {
  id: string;
  description: string;
  isCompleted: boolean;
}

export interface UserProgress {
  level: number;
  currentXP: number;
  totalXP: number;
  streak: number;
  lastActiveDate: string;
  achievements: string[];
  completedQuests: string[];
}

export interface Transaction {
  id: string;
  type: "earning" | "payout" | "bonus" | "transfer";
  amount: number;
  currency: "USD" | "XP" | "CREDITS";
  description: string;
  status: "pending" | "completed" | "failed";
  timestamp: string;
  reference?: string;
}

const XP_PER_LEVEL = 1000;
const LEVEL_MULTIPLIER = 1.2;

function getXPForLevel(level: number): number {
  return Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, level - 1));
}

function getLevelFromXP(totalXP: number): { level: number; currentXP: number; xpForNextLevel: number } {
  let level = 1;
  let xpRemaining = totalXP;
  
  while (xpRemaining >= getXPForLevel(level)) {
    xpRemaining -= getXPForLevel(level);
    level++;
  }
  
  return {
    level,
    currentXP: xpRemaining,
    xpForNextLevel: getXPForLevel(level),
  };
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_login",
    title: "First Steps",
    description: "Log in to AeThex Companion for the first time",
    icon: "star",
    category: "milestone",
    xpReward: 50,
  },
  {
    id: "streak_3",
    title: "On Fire",
    description: "Maintain a 3-day activity streak",
    icon: "flame",
    category: "streak",
    xpReward: 100,
    maxProgress: 3,
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day activity streak",
    icon: "zap",
    category: "streak",
    xpReward: 250,
    maxProgress: 7,
  },
  {
    id: "streak_30",
    title: "Monthly Master",
    description: "Maintain a 30-day activity streak",
    icon: "trophy",
    category: "streak",
    xpReward: 1000,
    maxProgress: 30,
  },
  {
    id: "first_gig",
    title: "Hustler",
    description: "Apply to your first gig",
    icon: "briefcase",
    category: "milestone",
    xpReward: 75,
  },
  {
    id: "gigs_5",
    title: "Gig Machine",
    description: "Apply to 5 gigs",
    icon: "target",
    category: "milestone",
    xpReward: 200,
    maxProgress: 5,
  },
  {
    id: "first_earning",
    title: "Paid",
    description: "Receive your first payment",
    icon: "dollar-sign",
    category: "milestone",
    xpReward: 150,
  },
  {
    id: "earnings_1000",
    title: "Four Figures",
    description: "Earn $1,000 total",
    icon: "trending-up",
    category: "milestone",
    xpReward: 500,
  },
  {
    id: "skill_master",
    title: "Skill Master",
    description: "Unlock 10 skills in your skill tree",
    icon: "award",
    category: "skill",
    xpReward: 300,
    maxProgress: 10,
  },
  {
    id: "guild_member",
    title: "Guild Member",
    description: "Join or create a guild",
    icon: "users",
    category: "social",
    xpReward: 100,
  },
  {
    id: "first_message",
    title: "Connector",
    description: "Send your first guild message",
    icon: "message-circle",
    category: "social",
    xpReward: 25,
  },
  {
    id: "study_complete",
    title: "Scholar",
    description: "Complete your first study quest",
    icon: "book-open",
    category: "milestone",
    xpReward: 100,
  },
  {
    id: "perfect_week",
    title: "Perfect Week",
    description: "Complete all daily quests for 7 days",
    icon: "check-circle",
    category: "special",
    xpReward: 500,
    isSecret: true,
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Complete 10 activities in Night Mode",
    icon: "moon",
    category: "special",
    xpReward: 150,
    maxProgress: 10,
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Log in before 7 AM, 5 times",
    icon: "sunrise",
    category: "special",
    xpReward: 150,
    maxProgress: 5,
    isSecret: true,
  },
];

const DAILY_QUESTS: Quest[] = [
  {
    id: "daily_login",
    title: "Daily Check-In",
    description: "Start your day with AeThex",
    category: "daily",
    xpReward: 25,
    steps: [{ id: "1", description: "Open the app", isCompleted: false }],
    isActive: true,
  },
  {
    id: "daily_browse",
    title: "Opportunity Scout",
    description: "Browse available gigs",
    category: "daily",
    xpReward: 35,
    steps: [
      { id: "1", description: "View the Gig Radar", isCompleted: false },
      { id: "2", description: "Check 3 gig details", isCompleted: false },
    ],
    isActive: true,
  },
  {
    id: "daily_connect",
    title: "Stay Connected",
    description: "Engage with your guild",
    category: "daily",
    xpReward: 30,
    steps: [{ id: "1", description: "Visit your guild chat", isCompleted: false }],
    isActive: true,
  },
];

const WEEKLY_QUESTS: Quest[] = [
  {
    id: "weekly_apply",
    title: "Active Hunter",
    description: "Apply to 3 gigs this week",
    category: "weekly",
    xpReward: 150,
    steps: [
      { id: "1", description: "Apply to first gig", isCompleted: false },
      { id: "2", description: "Apply to second gig", isCompleted: false },
      { id: "3", description: "Apply to third gig", isCompleted: false },
    ],
    isActive: true,
  },
  {
    id: "weekly_streak",
    title: "Consistent Player",
    description: "Log in every day this week",
    category: "weekly",
    xpReward: 200,
    steps: Array.from({ length: 7 }, (_, i) => ({
      id: String(i + 1),
      description: `Day ${i + 1}`,
      isCompleted: false,
    })),
    isActive: true,
  },
];

const STUDY_QUESTS: Quest[] = [
  {
    id: "study_math",
    title: "Math Champion",
    description: "Complete today's math exercises",
    category: "daily",
    xpReward: 50,
    steps: [
      { id: "1", description: "Solve 5 problems", isCompleted: false },
      { id: "2", description: "Review mistakes", isCompleted: false },
    ],
    isActive: true,
  },
  {
    id: "study_reading",
    title: "Reading Quest",
    description: "Complete your reading assignment",
    category: "daily",
    xpReward: 45,
    steps: [
      { id: "1", description: "Read for 20 minutes", isCompleted: false },
      { id: "2", description: "Answer comprehension questions", isCompleted: false },
    ],
    isActive: true,
  },
  {
    id: "study_science",
    title: "Science Explorer",
    description: "Complete the science module",
    category: "weekly",
    xpReward: 100,
    steps: [
      { id: "1", description: "Watch the video lesson", isCompleted: false },
      { id: "2", description: "Complete the lab simulation", isCompleted: false },
      { id: "3", description: "Pass the quiz", isCompleted: false },
    ],
    isActive: true,
  },
  {
    id: "study_group",
    title: "Study Buddy",
    description: "Collaborate with classmates",
    category: "weekly",
    xpReward: 75,
    steps: [
      { id: "1", description: "Join a study group", isCompleted: false },
      { id: "2", description: "Help a peer", isCompleted: false },
    ],
    isActive: true,
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-1",
    type: "earning",
    amount: 500,
    currency: "USD",
    description: "Logo Design - TechStartup Inc",
    status: "completed",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    reference: "GIG-001",
  },
  {
    id: "txn-2",
    type: "earning",
    amount: 1200,
    currency: "USD",
    description: "Website Redesign - Local Cafe",
    status: "completed",
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    reference: "GIG-002",
  },
  {
    id: "txn-3",
    type: "payout",
    amount: 1500,
    currency: "USD",
    description: "Withdrawal to Bank ****4521",
    status: "completed",
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "txn-4",
    type: "bonus",
    amount: 50,
    currency: "USD",
    description: "Referral Bonus - New Creator",
    status: "completed",
    timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: "txn-5",
    type: "earning",
    amount: 350,
    currency: "USD",
    description: "Social Media Graphics Pack",
    status: "pending",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    reference: "GIG-003",
  },
  {
    id: "txn-6",
    type: "bonus",
    amount: 250,
    currency: "XP",
    description: "Achievement Unlocked: Week Warrior",
    status: "completed",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

class GamificationService {
  private userProgress: UserProgress = {
    level: 1,
    currentXP: 0,
    totalXP: 750,
    streak: 5,
    lastActiveDate: new Date().toISOString().split("T")[0],
    achievements: ["first_login", "streak_3"],
    completedQuests: ["daily_login"],
  };

  private transactions: Transaction[] = [...MOCK_TRANSACTIONS];

  async loadProgress(): Promise<UserProgress> {
    try {
      const saved = await AsyncStorage.getItem("aethex_progress");
      if (saved) {
        this.userProgress = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load progress:", e);
    }
    return this.userProgress;
  }

  async saveProgress(): Promise<void> {
    try {
      await AsyncStorage.setItem("aethex_progress", JSON.stringify(this.userProgress));
    } catch (e) {
      console.error("Failed to save progress:", e);
    }
  }

  getProgress(): UserProgress {
    return this.userProgress;
  }

  getLevelInfo(): { level: number; currentXP: number; xpForNextLevel: number; progress: number } {
    const info = getLevelFromXP(this.userProgress.totalXP);
    return {
      ...info,
      progress: info.currentXP / info.xpForNextLevel,
    };
  }

  addXP(amount: number): { newXP: number; leveledUp: boolean; newLevel?: number } {
    const oldLevel = getLevelFromXP(this.userProgress.totalXP).level;
    this.userProgress.totalXP += amount;
    this.userProgress.currentXP += amount;
    const newLevel = getLevelFromXP(this.userProgress.totalXP).level;
    
    this.saveProgress();
    
    return {
      newXP: this.userProgress.totalXP,
      leveledUp: newLevel > oldLevel,
      newLevel: newLevel > oldLevel ? newLevel : undefined,
    };
  }

  getAchievements(): Achievement[] {
    return ACHIEVEMENTS.map(a => ({
      ...a,
      unlockedAt: this.userProgress.achievements.includes(a.id) 
        ? new Date().toISOString() 
        : undefined,
      progress: a.maxProgress ? Math.min(
        this.userProgress.streak,
        a.maxProgress
      ) : undefined,
    }));
  }

  getUnlockedAchievements(): Achievement[] {
    return this.getAchievements().filter(a => a.unlockedAt);
  }

  getLockedAchievements(): Achievement[] {
    return this.getAchievements().filter(a => !a.unlockedAt && !a.isSecret);
  }

  unlockAchievement(id: string): Achievement | null {
    if (this.userProgress.achievements.includes(id)) return null;
    
    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    if (!achievement) return null;
    
    this.userProgress.achievements.push(id);
    this.addXP(achievement.xpReward);
    
    return achievement;
  }

  getQuests(context: "business" | "education"): Quest[] {
    if (context === "education") {
      return [...STUDY_QUESTS].map(q => ({
        ...q,
        steps: q.steps.map(s => ({ ...s })),
      }));
    }
    return [...DAILY_QUESTS, ...WEEKLY_QUESTS].map(q => ({
      ...q,
      steps: q.steps.map(s => ({ ...s })),
    }));
  }

  completeQuestStep(questId: string, stepId: string): boolean {
    return true;
  }

  getStreak(): number {
    return this.userProgress.streak;
  }

  updateStreak(): number {
    const today = new Date().toISOString().split("T")[0];
    const lastActive = this.userProgress.lastActiveDate;
    
    if (lastActive === today) {
      return this.userProgress.streak;
    }
    
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (lastActive === yesterday) {
      this.userProgress.streak++;
    } else {
      this.userProgress.streak = 1;
    }
    
    this.userProgress.lastActiveDate = today;
    this.saveProgress();
    
    return this.userProgress.streak;
  }

  getTransactions(): Transaction[] {
    return this.transactions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getBalance(): { available: number; pending: number; totalEarnings: number } {
    const completed = this.transactions
      .filter(t => t.status === "completed" && t.currency === "USD");
    
    const earnings = completed
      .filter(t => t.type === "earning" || t.type === "bonus")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const payouts = completed
      .filter(t => t.type === "payout")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pending = this.transactions
      .filter(t => t.status === "pending" && t.currency === "USD")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      available: earnings - payouts,
      pending,
      totalEarnings: earnings,
    };
  }
}

export const gamificationService = new GamificationService();
