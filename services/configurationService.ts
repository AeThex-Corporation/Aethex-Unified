import { MarketContext, MemberRole, EcosystemPillar } from "../types/domain";

export interface TerminologyDictionary {
  member: string;
  members: string;
  organization: string;
  ledgerItem: string;
  approval: string;
  approver: string;
  dashboard: string;
  compliance: string;
  achievement: string;
  channel: string;
  wallet: string;
  trustScore: string;
  pillarName: string;
  pillarTagline: string;
}

export interface FeatureFlags {
  expenseTracking: boolean;
  receiptScanning: boolean;
  approvalWorkflows: boolean;
  vendorManagement: boolean;
  bountyMarketplace: boolean;
  guildChat: boolean;
  digitalWallet: boolean;
  skillTree: boolean;
  complianceMonitoring: boolean;
  piiDetection: boolean;
  auditLogging: boolean;
  guardianNotifications: boolean;
  gradeTracking: boolean;
  assignmentManagement: boolean;
  rosterImport: boolean;
  ltiIntegration: boolean;
  grantVoting: boolean;
  manifestoAccess: boolean;
  governanceDashboard: boolean;
  portfolioShowcase: boolean;
  mentorshipMatching: boolean;
  crossPillarQuests: boolean;
  ecosystemPulse: boolean;
  ipAttributionChain: boolean;
  reputationFlow: boolean;
  investorView: boolean;
}

export interface PillarConfiguration {
  pillar: EcosystemPillar;
  domain: string;
  displayName: string;
  tagline: string;
  icon: string;
  color: string;
  terminology: TerminologyDictionary;
  features: FeatureFlags;
  roles: {
    dayModeRoles: MemberRole[];
    nightModeRoles: MemberRole[];
  };
  compliance: {
    retentionDays: number;
    requireConsent: boolean;
    blockOnPii: boolean;
    notifyGuardians: boolean;
  };
}

export interface MarketConfiguration {
  context: MarketContext;
  pillar: EcosystemPillar;
  terminology: TerminologyDictionary;
  features: FeatureFlags;
  roles: {
    dayModeRoles: MemberRole[];
    nightModeRoles: MemberRole[];
  };
  compliance: {
    retentionDays: number;
    requireConsent: boolean;
    blockOnPii: boolean;
    notifyGuardians: boolean;
  };
}

const BASE_ECOSYSTEM_FEATURES: FeatureFlags = {
  expenseTracking: false,
  receiptScanning: false,
  approvalWorkflows: false,
  vendorManagement: false,
  bountyMarketplace: false,
  guildChat: true,
  digitalWallet: true,
  skillTree: true,
  complianceMonitoring: true,
  piiDetection: true,
  auditLogging: true,
  guardianNotifications: false,
  gradeTracking: false,
  assignmentManagement: false,
  rosterImport: false,
  ltiIntegration: false,
  grantVoting: false,
  manifestoAccess: true,
  governanceDashboard: false,
  portfolioShowcase: false,
  mentorshipMatching: true,
  crossPillarQuests: true,
  ecosystemPulse: true,
  ipAttributionChain: true,
  reputationFlow: true,
  investorView: false,
};

const DEV_CONFIG: PillarConfiguration = {
  pillar: "dev",
  domain: "aethex.dev",
  displayName: "AeThex Dev",
  tagline: "The Muscle",
  icon: "code",
  color: "#5533FF",
  terminology: {
    member: "Developer",
    members: "Developers",
    organization: "Team",
    ledgerItem: "Gig",
    approval: "Code Review",
    approver: "Lead",
    dashboard: "Dev Dashboard",
    compliance: "API Compliance",
    achievement: "Skill Badge",
    channel: "Forum",
    wallet: "Wallet",
    trustScore: "Dev Score",
    pillarName: "Dev",
    pillarTagline: "Build & Create",
  },
  features: {
    ...BASE_ECOSYSTEM_FEATURES,
    expenseTracking: true,
    approvalWorkflows: true,
    bountyMarketplace: true,
    mentorshipMatching: true,
  },
  roles: {
    dayModeRoles: ["owner", "manager", "developer"],
    nightModeRoles: ["contractor", "api_user", "community_member"],
  },
  compliance: {
    retentionDays: 365 * 7,
    requireConsent: false,
    blockOnPii: false,
    notifyGuardians: false,
  },
};

const STUDIO_CONFIG: PillarConfiguration = {
  pillar: "studio",
  domain: "aethex.studio",
  displayName: "AeThex Studio",
  tagline: "The Face",
  icon: "palette",
  color: "#22C55E",
  terminology: {
    member: "Creator",
    members: "Creators",
    organization: "Studio",
    ledgerItem: "Project",
    approval: "Review",
    approver: "Mentor",
    dashboard: "Foundry Dashboard",
    compliance: "Content Compliance",
    achievement: "Portfolio Piece",
    channel: "Studio Channel",
    wallet: "Creator Wallet",
    trustScore: "Portfolio Score",
    pillarName: "Studio",
    pillarTagline: "Learn & Showcase",
  },
  features: {
    ...BASE_ECOSYSTEM_FEATURES,
    portfolioShowcase: true,
    gradeTracking: true,
    assignmentManagement: true,
    guardianNotifications: true,
    investorView: true,
    mentorshipMatching: true,
  },
  roles: {
    dayModeRoles: ["admin", "teacher", "client", "investor"],
    nightModeRoles: ["foundry_student", "student"],
  },
  compliance: {
    retentionDays: 365,
    requireConsent: true,
    blockOnPii: true,
    notifyGuardians: true,
  },
};

const FOUNDATION_CONFIG: PillarConfiguration = {
  pillar: "foundation",
  domain: "aethex.foundation",
  displayName: "AeThex Foundation",
  tagline: "The Soul",
  icon: "heart",
  color: "#F59E0B",
  terminology: {
    member: "Council Member",
    members: "Council",
    organization: "Foundation",
    ledgerItem: "Grant",
    approval: "Vote",
    approver: "Council",
    dashboard: "Governance Dashboard",
    compliance: "Grant Compliance",
    achievement: "Governance Badge",
    channel: "Council Chamber",
    wallet: "Foundation Wallet",
    trustScore: "Governance Score",
    pillarName: "Foundation",
    pillarTagline: "Govern & Fund",
  },
  features: {
    ...BASE_ECOSYSTEM_FEATURES,
    grantVoting: true,
    governanceDashboard: true,
    manifestoAccess: true,
    ipAttributionChain: true,
  },
  roles: {
    dayModeRoles: ["council_member", "admin"],
    nightModeRoles: ["donor", "voter"],
  },
  compliance: {
    retentionDays: 365 * 10,
    requireConsent: false,
    blockOnPii: true,
    notifyGuardians: false,
  },
};

const BUSINESS_CONFIG: MarketConfiguration = {
  context: "business",
  pillar: "dev",
  terminology: {
    member: "Team Member",
    members: "Team Members",
    organization: "Company",
    ledgerItem: "Expense",
    approval: "Approval",
    approver: "Manager",
    dashboard: "Compliance Dashboard",
    compliance: "Compliance",
    achievement: "Milestone",
    channel: "Team Channel",
    wallet: "Wallet",
    trustScore: "Vendor Rating",
    pillarName: "Dev",
    pillarTagline: "Build & Create",
  },
  features: {
    ...BASE_ECOSYSTEM_FEATURES,
    expenseTracking: true,
    receiptScanning: true,
    approvalWorkflows: true,
    vendorManagement: true,
    bountyMarketplace: true,
  },
  roles: {
    dayModeRoles: ["owner", "manager", "employee"],
    nightModeRoles: ["contractor", "vendor"],
  },
  compliance: {
    retentionDays: 365 * 7,
    requireConsent: false,
    blockOnPii: false,
    notifyGuardians: false,
  },
};

const EDUCATION_CONFIG: MarketConfiguration = {
  context: "education",
  pillar: "studio",
  terminology: {
    member: "Student",
    members: "Students",
    organization: "School",
    ledgerItem: "Assignment",
    approval: "Review",
    approver: "Teacher",
    dashboard: "Activity Monitor",
    compliance: "Safety & Compliance",
    achievement: "Skill Badge",
    channel: "Class Channel",
    wallet: "Digital Passport",
    trustScore: "Trust Score",
    pillarName: "Studio",
    pillarTagline: "Learn & Showcase",
  },
  features: {
    ...BASE_ECOSYSTEM_FEATURES,
    approvalWorkflows: true,
    guardianNotifications: true,
    gradeTracking: true,
    assignmentManagement: true,
    rosterImport: true,
    ltiIntegration: true,
    portfolioShowcase: true,
  },
  roles: {
    dayModeRoles: ["admin", "teacher", "staff"],
    nightModeRoles: ["student"],
  },
  compliance: {
    retentionDays: 365,
    requireConsent: true,
    blockOnPii: true,
    notifyGuardians: true,
  },
};

const PILLAR_CONFIGS: Record<EcosystemPillar, PillarConfiguration> = {
  dev: DEV_CONFIG,
  studio: STUDIO_CONFIG,
  foundation: FOUNDATION_CONFIG,
};

class ConfigurationService {
  private currentConfig: MarketConfiguration = BUSINESS_CONFIG;
  private currentPillar: EcosystemPillar = "dev";

  setMarketContext(context: MarketContext): void {
    this.currentConfig = context === "business" ? BUSINESS_CONFIG : EDUCATION_CONFIG;
    this.currentPillar = this.currentConfig.pillar;
  }

  setPillar(pillar: EcosystemPillar): void {
    this.currentPillar = pillar;
    const pillarConfig = PILLAR_CONFIGS[pillar];
    
    // Merge pillar config into market config format
    this.currentConfig = {
      context: pillar === "studio" ? "education" : "business",
      pillar,
      terminology: pillarConfig.terminology,
      features: pillarConfig.features,
      roles: pillarConfig.roles,
      compliance: pillarConfig.compliance,
    };
  }

  getConfig(): MarketConfiguration {
    return this.currentConfig;
  }

  getPillarConfig(pillar?: EcosystemPillar): PillarConfiguration {
    return PILLAR_CONFIGS[pillar || this.currentPillar];
  }

  getCurrentPillar(): EcosystemPillar {
    return this.currentPillar;
  }

  getAllPillars(): PillarConfiguration[] {
    return Object.values(PILLAR_CONFIGS);
  }

  getTerminology(): TerminologyDictionary {
    return this.currentConfig.terminology;
  }

  getFeatures(): FeatureFlags {
    return this.currentConfig.features;
  }

  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.currentConfig.features[feature];
  }

  getTerm(key: keyof TerminologyDictionary): string {
    return this.currentConfig.terminology[key];
  }

  getComplianceSettings() {
    return this.currentConfig.compliance;
  }

  getRolesForMode(mode: "day" | "night"): MemberRole[] {
    return mode === "day" 
      ? this.currentConfig.roles.dayModeRoles 
      : this.currentConfig.roles.nightModeRoles;
  }

  getPillarColor(pillar?: EcosystemPillar): string {
    return PILLAR_CONFIGS[pillar || this.currentPillar].color;
  }

  getPillarDomain(pillar?: EcosystemPillar): string {
    return PILLAR_CONFIGS[pillar || this.currentPillar].domain;
  }
}

export const configService = new ConfigurationService();
export { PILLAR_CONFIGS, DEV_CONFIG, STUDIO_CONFIG, FOUNDATION_CONFIG };
