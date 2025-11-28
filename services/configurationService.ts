import { MarketContext, MemberRole } from "../types/domain";

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
}

export interface MarketConfiguration {
  context: MarketContext;
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

const BUSINESS_CONFIG: MarketConfiguration = {
  context: "business",
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
  },
  features: {
    expenseTracking: true,
    receiptScanning: true,
    approvalWorkflows: true,
    vendorManagement: true,
    bountyMarketplace: true,
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
  },
  features: {
    expenseTracking: false,
    receiptScanning: false,
    approvalWorkflows: true,
    vendorManagement: false,
    bountyMarketplace: false,
    guildChat: true,
    digitalWallet: true,
    skillTree: true,
    complianceMonitoring: true,
    piiDetection: true,
    auditLogging: true,
    guardianNotifications: true,
    gradeTracking: true,
    assignmentManagement: true,
    rosterImport: true,
    ltiIntegration: true,
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

class ConfigurationService {
  private currentConfig: MarketConfiguration = BUSINESS_CONFIG;

  setMarketContext(context: MarketContext): void {
    this.currentConfig = context === "business" ? BUSINESS_CONFIG : EDUCATION_CONFIG;
  }

  getConfig(): MarketConfiguration {
    return this.currentConfig;
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
}

export const configService = new ConfigurationService();
