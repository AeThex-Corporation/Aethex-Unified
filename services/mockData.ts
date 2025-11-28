import { 
  Member, 
  Organization, 
  LedgerItem, 
  EngagementEvent, 
  AuditLogEntry,
  SkillNode,
  ChatMessage 
} from "../types/domain";

export const BUSINESS_ORGANIZATION: Organization = {
  id: "org-biz-001",
  name: "TechStart Inc.",
  type: "business",
  tier: "pro",
  settings: {
    marketContext: "business",
    complianceEnabled: true,
    piiDetectionEnabled: true,
    auditLoggingEnabled: true,
  },
};

export const EDUCATION_ORGANIZATION: Organization = {
  id: "org-edu-001",
  name: "Lincoln High School",
  type: "school",
  tier: "enterprise",
  settings: {
    marketContext: "education",
    complianceEnabled: true,
    piiDetectionEnabled: true,
    auditLoggingEnabled: true,
  },
};

export const BUSINESS_MEMBERS: Member[] = [
  {
    id: "member-biz-001",
    organizationId: "org-biz-001",
    name: "Sarah Mitchell",
    email: "sarah@techstart.com",
    role: "owner",
    avatar: "SM",
    status: "active",
    trustScore: 100,
    metadata: { department: "Executive", hireDate: "2020-01-15" },
    createdAt: "2020-01-15T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-biz-002",
    organizationId: "org-biz-001",
    name: "James Chen",
    email: "james@techstart.com",
    role: "manager",
    avatar: "JC",
    status: "active",
    trustScore: 95,
    metadata: { department: "Engineering", hireDate: "2021-03-01" },
    createdAt: "2021-03-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-biz-003",
    organizationId: "org-biz-001",
    name: "Alex Rivera",
    email: "alex@techstart.com",
    role: "employee",
    avatar: "AR",
    status: "active",
    trustScore: 88,
    metadata: { department: "Engineering", hireDate: "2022-06-15" },
    createdAt: "2022-06-15T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-biz-004",
    organizationId: "org-biz-001",
    name: "DevCraft Solutions",
    email: "billing@devcraft.io",
    role: "vendor",
    avatar: "DC",
    status: "active",
    trustScore: 92,
    metadata: { department: "External" },
    createdAt: "2023-01-10T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
];

export const EDUCATION_MEMBERS: Member[] = [
  {
    id: "member-edu-001",
    organizationId: "org-edu-001",
    name: "Dr. Patricia Williams",
    email: "p.williams@lincoln.edu",
    role: "admin",
    avatar: "PW",
    status: "active",
    trustScore: 100,
    metadata: { department: "Administration", hireDate: "2015-08-01" },
    createdAt: "2015-08-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-edu-002",
    organizationId: "org-edu-001",
    name: "Mr. David Ross",
    email: "d.ross@lincoln.edu",
    role: "teacher",
    avatar: "DR",
    status: "active",
    trustScore: 100,
    metadata: { department: "Computer Science", hireDate: "2018-08-15" },
    createdAt: "2018-08-15T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-edu-003",
    organizationId: "org-edu-001",
    externalId: "884-291-AX",
    name: "Alex Chen",
    email: "alex.chen@student.lincoln.edu",
    role: "student",
    avatar: "AC",
    status: "active",
    trustScore: 85,
    metadata: { gradeLevel: 11, enrollmentDate: "2023-09-01" },
    createdAt: "2023-09-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-edu-004",
    organizationId: "org-edu-001",
    externalId: "772-102-BB",
    name: "Sarah Johnson",
    email: "sarah.j@student.lincoln.edu",
    role: "student",
    avatar: "SJ",
    status: "active",
    trustScore: 92,
    metadata: { gradeLevel: 10, enrollmentDate: "2023-09-01" },
    createdAt: "2023-09-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-edu-005",
    organizationId: "org-edu-001",
    externalId: "991-332-CC",
    name: "Michael Torres",
    email: "m.torres@student.lincoln.edu",
    role: "student",
    avatar: "MT",
    status: "suspended",
    trustScore: 45,
    metadata: { gradeLevel: 12, enrollmentDate: "2022-09-01" },
    createdAt: "2022-09-01T00:00:00Z",
    lastActiveAt: "2024-11-10T00:00:00Z",
  },
];

export const BUSINESS_LEDGER_ITEMS: LedgerItem[] = [
  {
    id: "ledger-biz-001",
    organizationId: "org-biz-001",
    memberId: "member-biz-003",
    type: "expense",
    title: "Cloud Infrastructure - November",
    description: "AWS and GCP monthly charges",
    amount: 2450.00,
    currency: "USD",
    status: "pending",
    category: "Technology",
    createdAt: "2024-11-20T10:30:00Z",
    updatedAt: "2024-11-20T10:30:00Z",
    metadata: { vendor: "Amazon Web Services", receiptId: "rcpt-001" },
  },
  {
    id: "ledger-biz-002",
    organizationId: "org-biz-001",
    memberId: "member-biz-002",
    type: "expense",
    title: "Team Lunch - Q4 Planning",
    description: "Quarterly planning session catering",
    amount: 385.50,
    currency: "USD",
    status: "approved",
    category: "Meals & Entertainment",
    createdAt: "2024-11-18T14:00:00Z",
    updatedAt: "2024-11-19T09:00:00Z",
    metadata: { vendor: "Local Eats Catering", participants: 12 },
  },
  {
    id: "ledger-biz-003",
    organizationId: "org-biz-001",
    memberId: "member-biz-004",
    type: "bounty",
    title: "API Integration Module",
    description: "Build payment gateway integration",
    amount: 3500.00,
    currency: "USD",
    xpValue: 500,
    status: "pending",
    category: "Development",
    dueDate: "2024-12-15T00:00:00Z",
    createdAt: "2024-11-15T00:00:00Z",
    updatedAt: "2024-11-15T00:00:00Z",
    metadata: { skillRequired: "Backend", estimatedHours: 40 },
  },
  {
    id: "ledger-biz-004",
    organizationId: "org-biz-001",
    memberId: "member-biz-003",
    type: "payout",
    title: "Freelance Project Completion",
    description: "Mobile app redesign project payout",
    amount: 2200.00,
    currency: "USD",
    xpValue: 350,
    status: "completed",
    category: "Freelance",
    createdAt: "2024-11-10T00:00:00Z",
    updatedAt: "2024-11-12T00:00:00Z",
    metadata: { projectId: "proj-mobile-001" },
  },
];

export const EDUCATION_LEDGER_ITEMS: LedgerItem[] = [
  {
    id: "ledger-edu-001",
    organizationId: "org-edu-001",
    memberId: "member-edu-003",
    type: "assignment",
    title: "Python Module 1: Basics",
    description: "Introduction to Python programming fundamentals",
    xpValue: 50,
    status: "completed",
    category: "Computer Science",
    dueDate: "2024-11-15T23:59:00Z",
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-14T16:30:00Z",
    metadata: { score: 95, maxScore: 100, submittedAt: "2024-11-14T16:30:00Z" },
  },
  {
    id: "ledger-edu-002",
    organizationId: "org-edu-001",
    memberId: "member-edu-003",
    type: "assignment",
    title: "Network Security Fundamentals",
    description: "Understanding basic network security concepts",
    xpValue: 75,
    status: "pending",
    category: "Computer Science",
    dueDate: "2024-12-01T23:59:00Z",
    createdAt: "2024-11-20T00:00:00Z",
    updatedAt: "2024-11-20T00:00:00Z",
    metadata: { instructorId: "member-edu-002" },
  },
  {
    id: "ledger-edu-003",
    organizationId: "org-edu-001",
    memberId: "member-edu-004",
    type: "achievement",
    title: "Perfect Attendance - November",
    description: "No absences for the entire month",
    xpValue: 25,
    status: "completed",
    category: "Attendance",
    createdAt: "2024-11-28T00:00:00Z",
    updatedAt: "2024-11-28T00:00:00Z",
    metadata: { badgeId: "badge-attendance-gold" },
  },
];

export const DUAL_EVENTS: EngagementEvent[] = [
  {
    id: "event-001",
    organizationId: "org-edu-001",
    memberId: "member-edu-003",
    timestamp: new Date(Date.now() - 10000000).toISOString(),
    rawEvent: "Completed Python Module 1",
    context: "AP Computer Science",
    compliance: { riskLevel: "LOW", status: "ALLOWED", piiDetected: false, triggers: [] },
    gamification: { skillNodeId: "node-py-1", skillName: "Python Initiate", xp: 50, type: "UNLOCK", tier: "TIER_1", isUnlocked: true },
    metadata: { duration: "45 mins", score: 95 },
  },
  {
    id: "event-002",
    organizationId: "org-edu-001",
    memberId: "member-edu-003",
    timestamp: new Date(Date.now() - 8000000).toISOString(),
    rawEvent: "Accessed Internal Network Port 8080",
    context: "Lab Session",
    compliance: { riskLevel: "MEDIUM", status: "FLAGGED", piiDetected: false, triggers: ["Unusual network activity"] },
    gamification: { skillNodeId: "node-net-1", skillName: "Port Scanner", xp: 20, type: "ACHIEVEMENT", tier: "TIER_2", isUnlocked: true },
    metadata: { ipAddress: "192.168.1.105" },
  },
  {
    id: "event-003",
    organizationId: "org-edu-001",
    memberId: "member-edu-003",
    timestamp: new Date(Date.now() - 6000000).toISOString(),
    rawEvent: "Attempted PII Share in Chat",
    context: "Class Discussion",
    compliance: { riskLevel: "HIGH", status: "BLOCKED", piiDetected: true, triggers: ["SSN pattern detected"] },
    gamification: { skillNodeId: "node-sec-1", skillName: "OpSec Failure", xp: 0, type: "QUEST", tier: "TIER_1", isUnlocked: false },
    metadata: { blockedContent: "XXX-XX-XXXX" },
  },
  {
    id: "event-004",
    organizationId: "org-edu-001",
    memberId: "member-edu-003",
    timestamp: new Date(Date.now() - 4000000).toISOString(),
    rawEvent: "Submitted 3D Asset: Cyber_Blade.obj",
    context: "Digital Arts",
    compliance: { riskLevel: "LOW", status: "ALLOWED", piiDetected: false, triggers: [] },
    gamification: { skillNodeId: "node-art-1", skillName: "Polygon Weaver", xp: 100, type: "UNLOCK", tier: "TIER_3", isUnlocked: true },
    metadata: { fileSize: "2.4MB", polygonCount: 15000 },
  },
  {
    id: "event-005",
    organizationId: "org-edu-001",
    memberId: "member-edu-003",
    timestamp: new Date(Date.now() - 2000000).toISOString(),
    rawEvent: "Executed Shell Script: auto_run.sh",
    context: "Lab Session",
    compliance: { riskLevel: "MEDIUM", status: "FLAGGED", piiDetected: false, triggers: ["Script execution"] },
    gamification: { skillNodeId: "node-bash-1", skillName: "Bash Automator", xp: 75, type: "UNLOCK", tier: "TIER_2", isUnlocked: true },
    metadata: { scriptHash: "a7f3b2c1" },
  },
  {
    id: "event-006",
    organizationId: "org-biz-001",
    memberId: "member-biz-003",
    timestamp: new Date(Date.now() - 1000000).toISOString(),
    rawEvent: "Submitted Expense Report",
    context: "Finance",
    compliance: { riskLevel: "LOW", status: "ALLOWED", piiDetected: false, triggers: [] },
    gamification: { skillNodeId: "node-fin-1", skillName: "Expense Tracker", xp: 10, type: "TASK", tier: "TIER_1", isUnlocked: true },
    metadata: { amount: 2450.00, category: "Technology" },
  },
];

export const SKILL_NODES: SkillNode[] = [
  { id: "node-py-1", name: "Python Initiate", description: "Complete Python basics", tier: "TIER_1", category: "Programming", xpRequired: 0, xpReward: 50, isUnlocked: true, unlockedAt: "2024-11-14T00:00:00Z" },
  { id: "node-py-2", name: "Python Adept", description: "Master Python functions", tier: "TIER_2", category: "Programming", xpRequired: 100, xpReward: 100, prerequisites: ["node-py-1"], isUnlocked: false },
  { id: "node-py-3", name: "Python Master", description: "Build complex applications", tier: "TIER_3", category: "Programming", xpRequired: 300, xpReward: 200, prerequisites: ["node-py-2"], isUnlocked: false },
  { id: "node-net-1", name: "Port Scanner", description: "Understand network ports", tier: "TIER_2", category: "Security", xpRequired: 50, xpReward: 20, isUnlocked: true },
  { id: "node-sec-1", name: "OpSec Basics", description: "Learn operational security", tier: "TIER_1", category: "Security", xpRequired: 0, xpReward: 25, isUnlocked: false },
  { id: "node-art-1", name: "Polygon Weaver", description: "Create 3D assets", tier: "TIER_3", category: "Creative", xpRequired: 200, xpReward: 100, isUnlocked: true },
  { id: "node-bash-1", name: "Bash Automator", description: "Automate with shell scripts", tier: "TIER_2", category: "DevOps", xpRequired: 75, xpReward: 75, isUnlocked: true },
  { id: "node-fin-1", name: "Expense Tracker", description: "Submit expense reports", tier: "TIER_1", category: "Business", xpRequired: 0, xpReward: 10, isUnlocked: true },
];

export const AUDIT_LOG_ENTRIES: AuditLogEntry[] = [
  { id: "log-001", organizationId: "org-edu-001", memberId: "member-edu-003", timestamp: "2024-11-28T10:42:00Z", action: "Prompt Submission", resource: "chat", status: "BLOCKED", riskLevel: "HIGH", flagged: true, trigger: "PII Detected: SSN Pattern" },
  { id: "log-002", organizationId: "org-edu-001", memberId: "member-edu-004", timestamp: "2024-11-28T10:40:00Z", action: "Assignment Submit", resource: "assignments", status: "ALLOWED", riskLevel: "LOW", flagged: false },
  { id: "log-003", organizationId: "org-edu-001", memberId: "member-edu-005", timestamp: "2024-11-28T10:38:00Z", action: "Chat Message", resource: "chat", status: "FLAGGED", riskLevel: "MEDIUM", flagged: true, trigger: "Keyword: 'Proxy'" },
  { id: "log-004", organizationId: "org-biz-001", memberId: "member-biz-003", timestamp: "2024-11-28T10:35:00Z", action: "Expense Submit", resource: "expenses", status: "ALLOWED", riskLevel: "LOW", flagged: false },
  { id: "log-005", organizationId: "org-edu-001", memberId: "member-edu-003", timestamp: "2024-11-28T10:30:00Z", action: "File Upload", resource: "files", status: "ALLOWED", riskLevel: "LOW", flagged: false },
  { id: "log-006", organizationId: "org-biz-001", memberId: "member-biz-002", timestamp: "2024-11-28T10:28:00Z", action: "Approval Grant", resource: "approvals", status: "ALLOWED", riskLevel: "LOW", flagged: false },
  { id: "log-007", organizationId: "org-edu-001", memberId: "member-edu-003", timestamp: "2024-11-28T10:25:00Z", action: "Script Execution", resource: "lab", status: "FLAGGED", riskLevel: "MEDIUM", flagged: true, trigger: "Infinite Loop Detected" },
  { id: "log-008", organizationId: "org-biz-001", memberId: "member-biz-004", timestamp: "2024-11-28T10:22:00Z", action: "Invoice Submit", resource: "invoices", status: "PENDING", riskLevel: "LOW", flagged: false },
];

export const SAMPLE_CHAT_MESSAGES: ChatMessage[] = [
  { id: "msg-001", senderId: "member-edu-002", senderName: "Mr. Ross", channelId: "class-cs101", content: "Welcome to today's session on network security.", timestamp: "2024-11-28T09:00:00Z" },
  { id: "msg-002", senderId: "member-edu-003", senderName: "Alex Chen", channelId: "class-cs101", content: "Quick question about port scanning - is it legal?", timestamp: "2024-11-28T09:05:00Z" },
  { id: "msg-003", senderId: "member-edu-002", senderName: "Mr. Ross", channelId: "class-cs101", content: "Great question! Only on systems you own or have permission to test.", timestamp: "2024-11-28T09:06:00Z" },
  { id: "msg-004", senderId: "member-edu-004", senderName: "Sarah Johnson", channelId: "class-cs101", content: "I finished the Python module - got 95%!", timestamp: "2024-11-28T09:10:00Z" },
];

export function getMembersForContext(context: "business" | "education"): Member[] {
  return context === "business" ? BUSINESS_MEMBERS : EDUCATION_MEMBERS;
}

export function getLedgerItemsForContext(context: "business" | "education"): LedgerItem[] {
  return context === "business" ? BUSINESS_LEDGER_ITEMS : EDUCATION_LEDGER_ITEMS;
}

export function getOrganizationForContext(context: "business" | "education"): Organization {
  return context === "business" ? BUSINESS_ORGANIZATION : EDUCATION_ORGANIZATION;
}

export function getEventsForContext(context: "business" | "education"): EngagementEvent[] {
  const orgId = context === "business" ? "org-biz-001" : "org-edu-001";
  return DUAL_EVENTS.filter(e => e.organizationId === orgId);
}

export function getAuditLogsForContext(context: "business" | "education"): AuditLogEntry[] {
  const orgId = context === "business" ? "org-biz-001" : "org-edu-001";
  return AUDIT_LOG_ENTRIES.filter(e => e.organizationId === orgId);
}
