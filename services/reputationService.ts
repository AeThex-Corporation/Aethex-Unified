import { EcosystemPillar } from "../types/domain";

type Pillar = EcosystemPillar;

export interface ReputationScore {
  pillar: Pillar;
  score: number;
  level: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  nextLevelAt: number;
}

export interface ReputationAction {
  id: string;
  action: string;
  sourcePillar: Pillar;
  targetPillars: Pillar[];
  pointsEarned: number;
  multipliers: Record<Pillar, number>;
  timestamp: string;
}

export interface CrossPillarBonus {
  trigger: string;
  description: string;
  bonus: number;
  applicablePillars: Pillar[];
}

const LEVEL_THRESHOLDS = {
  bronze: 0,
  silver: 500,
  gold: 1500,
  platinum: 3500,
  diamond: 7500,
};

const DEFAULT_MULTIPLIERS: Record<Pillar, number> = { dev: 0.33, studio: 0.33, foundation: 0.33 };

export type ReputationActionType = 
  | "vote_on_proposal"
  | "contribute_code" 
  | "complete_assignment"
  | "mentor_student"
  | "donate"
  | "complete_quest"
  | "participate_governance"
  | "submit_portfolio"
  | "complete_project"
  | "approve_item"
  | "review_portfolio";

export interface ReputationActionConfig {
  basePoints: number;
  multipliers: Record<Pillar, number>;
  targetPillars: Pillar[];
  defaultSourcePillar: Pillar;
}

export const REPUTATION_ACTION_CONFIGS: Record<ReputationActionType, ReputationActionConfig> = {
  vote_on_proposal: {
    basePoints: 25,
    multipliers: { foundation: 1.0, dev: 0.5, studio: 0.3 },
    targetPillars: ["dev", "studio", "foundation"],
    defaultSourcePillar: "foundation",
  },
  contribute_code: {
    basePoints: 40,
    multipliers: { dev: 1.0, studio: 0.6, foundation: 0.4 },
    targetPillars: ["dev", "studio", "foundation"],
    defaultSourcePillar: "dev",
  },
  complete_assignment: {
    basePoints: 30,
    multipliers: { studio: 1.0, dev: 0.5, foundation: 0.3 },
    targetPillars: ["dev", "studio", "foundation"],
    defaultSourcePillar: "studio",
  },
  mentor_student: {
    basePoints: 50,
    multipliers: { foundation: 1.0, studio: 0.7, dev: 0.5 },
    targetPillars: ["dev", "studio", "foundation"],
    defaultSourcePillar: "foundation",
  },
  donate: {
    basePoints: 35,
    multipliers: { foundation: 1.0, dev: 0.4, studio: 0.4 },
    targetPillars: ["dev", "studio", "foundation"],
    defaultSourcePillar: "foundation",
  },
  complete_quest: {
    basePoints: 20,
    multipliers: { dev: 0.8, studio: 0.6, foundation: 0.4 },
    targetPillars: ["dev", "studio", "foundation"],
    defaultSourcePillar: "dev",
  },
  participate_governance: {
    basePoints: 15,
    multipliers: { foundation: 0.8, dev: 0.6, studio: 0.4 },
    targetPillars: ["dev", "studio", "foundation"],
    defaultSourcePillar: "foundation",
  },
  submit_portfolio: {
    basePoints: 45,
    multipliers: { studio: 1.0, dev: 0.5, foundation: 0.3 },
    targetPillars: ["dev", "studio", "foundation"],
    defaultSourcePillar: "studio",
  },
  complete_project: {
    basePoints: 60,
    multipliers: { studio: 1.0, dev: 0.7, foundation: 0.5 },
    targetPillars: ["dev", "studio", "foundation"],
    defaultSourcePillar: "studio",
  },
  approve_item: {
    basePoints: 10,
    multipliers: { dev: 0.6, studio: 0.4, foundation: 0.8 },
    targetPillars: ["dev", "studio", "foundation"],
    defaultSourcePillar: "dev",
  },
  review_portfolio: {
    basePoints: 30,
    multipliers: { studio: 0.8, dev: 0.6, foundation: 0.4 },
    targetPillars: ["dev", "studio", "foundation"],
    defaultSourcePillar: "studio",
  },
};

export function createReputationAction(
  actionType: ReputationActionType,
  overrideSourcePillar?: Pillar,
  overridePoints?: number
): ReputationAction {
  const config = REPUTATION_ACTION_CONFIGS[actionType];
  return {
    id: `rep-${actionType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    action: actionType,
    sourcePillar: overrideSourcePillar || config.defaultSourcePillar,
    targetPillars: config.targetPillars,
    pointsEarned: overridePoints || config.basePoints,
    multipliers: config.multipliers,
    timestamp: new Date().toISOString(),
  };
}

const CROSS_PILLAR_BONUSES: CrossPillarBonus[] = [
  {
    trigger: "multi_pillar_activity",
    description: "Active in 2+ pillars this week",
    bonus: 50,
    applicablePillars: ["dev", "studio", "foundation"],
  },
  {
    trigger: "ecosystem_champion",
    description: "Gold+ status in all 3 pillars",
    bonus: 200,
    applicablePillars: ["dev", "studio", "foundation"],
  },
  {
    trigger: "mentor_to_dev",
    description: "Studio mentor helped a Dev contributor",
    bonus: 75,
    applicablePillars: ["dev", "studio"],
  },
  {
    trigger: "funded_to_built",
    description: "Foundation grant resulted in shipped feature",
    bonus: 150,
    applicablePillars: ["dev", "foundation"],
  },
];

function getLevel(score: number): "bronze" | "silver" | "gold" | "platinum" | "diamond" {
  if (score >= LEVEL_THRESHOLDS.diamond) return "diamond";
  if (score >= LEVEL_THRESHOLDS.platinum) return "platinum";
  if (score >= LEVEL_THRESHOLDS.gold) return "gold";
  if (score >= LEVEL_THRESHOLDS.silver) return "silver";
  return "bronze";
}

function getNextLevelThreshold(currentLevel: string): number {
  switch (currentLevel) {
    case "bronze": return LEVEL_THRESHOLDS.silver;
    case "silver": return LEVEL_THRESHOLDS.gold;
    case "gold": return LEVEL_THRESHOLDS.platinum;
    case "platinum": return LEVEL_THRESHOLDS.diamond;
    default: return LEVEL_THRESHOLDS.diamond + 5000;
  }
}

export function calculateReputationFromAction(
  actionType: string,
  basePoints: number,
  sourcePillar: Pillar
): ReputationAction {
  const config = REPUTATION_ACTION_CONFIGS[actionType as ReputationActionType];
  const multipliers = config?.multipliers || DEFAULT_MULTIPLIERS;
  const targetPillars: Pillar[] = config?.targetPillars || ["dev", "studio", "foundation"];

  return {
    id: `rep-${actionType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    action: actionType,
    sourcePillar,
    targetPillars,
    pointsEarned: basePoints,
    multipliers,
    timestamp: new Date().toISOString(),
  };
}

export function applyReputationToScores(
  currentScores: Record<Pillar, number>,
  action: ReputationAction
): Record<Pillar, number> {
  const newScores = { ...currentScores };

  action.targetPillars.forEach((pillar) => {
    const multiplier = action.multipliers[pillar] || 0.5;
    const pointsToAdd = Math.round(action.pointsEarned * multiplier);
    newScores[pillar] = (newScores[pillar] || 0) + pointsToAdd;
  });

  return newScores;
}

export function getReputationScores(scores: Record<Pillar, number>): ReputationScore[] {
  return (["dev", "studio", "foundation"] as Pillar[]).map((pillar) => {
    const score = scores[pillar] || 0;
    const level = getLevel(score);
    return {
      pillar,
      score,
      level,
      nextLevelAt: getNextLevelThreshold(level),
    };
  });
}

export function checkCrossPillarBonuses(
  scores: Record<Pillar, number>,
  recentActivity: Record<Pillar, boolean>
): CrossPillarBonus[] {
  const earnedBonuses: CrossPillarBonus[] = [];

  const activePillars = Object.values(recentActivity).filter(Boolean).length;
  if (activePillars >= 2) {
    const bonus = CROSS_PILLAR_BONUSES.find((b) => b.trigger === "multi_pillar_activity");
    if (bonus) earnedBonuses.push(bonus);
  }

  const allGoldPlus = (["dev", "studio", "foundation"] as Pillar[]).every(
    (p) => getLevel(scores[p] || 0) !== "bronze" && getLevel(scores[p] || 0) !== "silver"
  );
  if (allGoldPlus) {
    const bonus = CROSS_PILLAR_BONUSES.find((b) => b.trigger === "ecosystem_champion");
    if (bonus) earnedBonuses.push(bonus);
  }

  return earnedBonuses;
}

export const MOCK_REPUTATION_HISTORY: ReputationAction[] = [
  {
    id: "rep-001",
    action: "vote_on_proposal",
    sourcePillar: "foundation",
    targetPillars: ["dev", "studio", "foundation"],
    pointsEarned: 25,
    multipliers: { dev: 0.5, studio: 0.3, foundation: 1.0 },
    timestamp: "2024-12-20T14:30:00Z",
  },
  {
    id: "rep-002",
    action: "complete_quest",
    sourcePillar: "dev",
    targetPillars: ["dev", "studio", "foundation"],
    pointsEarned: 50,
    multipliers: { dev: 1.0, studio: 0.6, foundation: 0.4 },
    timestamp: "2024-12-19T10:15:00Z",
  },
  {
    id: "rep-003",
    action: "mentor_student",
    sourcePillar: "studio",
    targetPillars: ["dev", "studio", "foundation"],
    pointsEarned: 75,
    multipliers: { dev: 0.8, studio: 1.0, foundation: 0.5 },
    timestamp: "2024-12-18T16:45:00Z",
  },
  {
    id: "rep-004",
    action: "donate",
    sourcePillar: "foundation",
    targetPillars: ["dev", "studio", "foundation"],
    pointsEarned: 100,
    multipliers: { dev: 0.3, studio: 0.5, foundation: 1.0 },
    timestamp: "2024-12-17T09:00:00Z",
  },
];

export const MOCK_USER_SCORES: Record<Pillar, number> = {
  dev: 1850,
  studio: 920,
  foundation: 2100,
};
