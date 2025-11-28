export type MarketContext = "business" | "education";
export type AppMode = "day" | "night";

export type MemberRole = 
  | "owner" | "manager" | "employee" | "vendor" | "contractor"
  | "admin" | "teacher" | "student" | "guardian" | "staff";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ComplianceStatus = "ALLOWED" | "FLAGGED" | "BLOCKED" | "QUARANTINED" | "PENDING";

export interface Organization {
  id: string;
  name: string;
  type: "business" | "school" | "district";
  tier: "free" | "pro" | "enterprise";
  settings: {
    marketContext: MarketContext;
    complianceEnabled: boolean;
    piiDetectionEnabled: boolean;
    auditLoggingEnabled: boolean;
  };
}

export interface Member {
  id: string;
  organizationId: string;
  externalId?: string;
  name: string;
  email?: string;
  role: MemberRole;
  avatar?: string;
  status: "active" | "suspended" | "inactive";
  trustScore: number;
  metadata: {
    department?: string;
    gradeLevel?: number;
    hireDate?: string;
    enrollmentDate?: string;
    guardianIds?: string[];
  };
  createdAt: string;
  lastActiveAt: string;
}

export interface LedgerItem {
  id: string;
  organizationId: string;
  memberId: string;
  type: "expense" | "invoice" | "bounty" | "assignment" | "achievement" | "payout";
  title: string;
  description?: string;
  amount?: number;
  currency?: string;
  xpValue?: number;
  status: "pending" | "approved" | "rejected" | "completed" | "overdue";
  category?: string;
  attachments?: string[];
  dueDate?: string;
  metadata: Record<string, unknown>;
  complianceFlags?: ComplianceFlag[];
  createdAt: string;
  updatedAt: string;
}

export interface EngagementEvent {
  id: string;
  organizationId: string;
  memberId: string;
  timestamp: string;
  rawEvent: string;
  context?: string;
  compliance: {
    riskLevel: RiskLevel;
    status: ComplianceStatus;
    piiDetected: boolean;
    triggers: string[];
  };
  gamification: {
    skillNodeId?: string;
    skillName?: string;
    xp: number;
    type: "UNLOCK" | "ACHIEVEMENT" | "QUEST" | "TASK";
    tier: "TIER_1" | "TIER_2" | "TIER_3";
    isUnlocked: boolean;
  };
  metadata: Record<string, unknown>;
}

export interface ComplianceFlag {
  id: string;
  type: "PII" | "POLICY" | "SECURITY" | "CONTENT" | "BEHAVIORAL";
  severity: RiskLevel;
  trigger: string;
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: "allowed" | "blocked" | "quarantined" | "escalated";
}

export interface ComplianceCase {
  id: string;
  organizationId: string;
  memberId: string;
  eventId?: string;
  type: "PII_DETECTION" | "POLICY_VIOLATION" | "SECURITY_INCIDENT" | "CONTENT_FLAG" | "BEHAVIORAL_ALERT";
  severity: RiskLevel;
  status: "open" | "investigating" | "resolved" | "escalated";
  title: string;
  description: string;
  evidence: {
    originalContent?: string;
    redactedContent?: string;
    matchedPatterns?: string[];
    timestamp: string;
  };
  actions: ComplianceAction[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface ComplianceAction {
  id: string;
  type: "review" | "allow" | "block" | "quarantine" | "escalate" | "notify" | "delete";
  performedBy: string;
  performedAt: string;
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  memberId: string;
  timestamp: string;
  action: string;
  resource: string;
  resourceId?: string;
  status: ComplianceStatus;
  riskLevel: RiskLevel;
  flagged: boolean;
  trigger?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  channelId: string;
  content: string;
  timestamp: string;
  isBlocked?: boolean;
  piiRedacted?: boolean;
  redactedContent?: string;
  complianceFlags?: ComplianceFlag[];
}

export interface SkillNode {
  id: string;
  name: string;
  description?: string;
  tier: "TIER_1" | "TIER_2" | "TIER_3";
  category: string;
  xpRequired: number;
  xpReward: number;
  prerequisites?: string[];
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface IntegrationConfig {
  id: string;
  type: "oneroster" | "lti" | "edfi" | "stripe" | "quickbooks";
  status: "connected" | "disconnected" | "pending";
  credentials?: Record<string, string>;
  lastSyncAt?: string;
  metadata?: Record<string, unknown>;
}

export interface ConsentRecord {
  id: string;
  studentId: string;
  guardianId: string;
  guardianName: string;
  guardianEmail: string;
  organizationId: string;
  consentType: "full" | "limited" | "communication_only" | "none" | "pending";
  dataCategories: DataConsentCategory[];
  grantedAt: string;
  expiresAt?: string;
  revokedAt?: string;
  status: "pending" | "granted" | "expired" | "revoked";
  verificationMethod: "email" | "in_person" | "portal";
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

export type DataConsentCategory = 
  | "basic_info"      // Name, grade level
  | "academic"        // Grades, assignments
  | "behavioral"      // Attendance, conduct
  | "communication"   // Chat, messaging
  | "gamification"    // XP, achievements
  | "analytics";      // Usage data

export interface ConsentRequirement {
  category: DataConsentCategory;
  required: boolean;
  description: string;
  ageThreshold?: number; // COPPA: features requiring parental consent if under this age
}
