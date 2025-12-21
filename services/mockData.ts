import { 
  Member, 
  Organization, 
  LedgerItem, 
  EngagementEvent, 
  AuditLogEntry,
  SkillNode,
  ChatMessage,
  EcosystemPillar,
  MarketContext
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

export const FOUNDATION_ORGANIZATION: Organization = {
  id: "org-foundation-001",
  name: "AeThex Foundation",
  type: "business",
  tier: "enterprise",
  settings: {
    marketContext: "business",
    complianceEnabled: true,
    piiDetectionEnabled: true,
    auditLoggingEnabled: true,
  },
};

export const FOUNDATION_MEMBERS: Member[] = [
  {
    id: "member-council-001",
    organizationId: "org-foundation-001",
    name: "Elena Vasquez",
    email: "elena@aethex.foundation",
    role: "council_member",
    avatar: "EV",
    status: "active",
    trustScore: 100,
    metadata: { department: "Council", hireDate: "2022-01-01" },
    createdAt: "2022-01-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-council-002",
    organizationId: "org-foundation-001",
    name: "Marcus Thompson",
    email: "marcus@aethex.foundation",
    role: "council_member",
    avatar: "MT",
    status: "active",
    trustScore: 95,
    metadata: { department: "Council", hireDate: "2022-03-15" },
    createdAt: "2022-03-15T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-donor-001",
    organizationId: "org-foundation-001",
    name: "Horizon Ventures",
    email: "giving@horizonvc.com",
    role: "donor",
    avatar: "HV",
    status: "active",
    trustScore: 90,
    metadata: { department: "Donors" },
    createdAt: "2023-06-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-voter-001",
    organizationId: "org-foundation-001",
    name: "Community Voter",
    email: "voter@community.com",
    role: "voter",
    avatar: "CV",
    status: "active",
    trustScore: 75,
    metadata: { department: "Community" },
    createdAt: "2024-01-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
];

export const FOUNDATION_LEDGER_ITEMS: LedgerItem[] = [
  {
    id: "ledger-found-001",
    organizationId: "org-foundation-001",
    memberId: "member-council-001",
    type: "bounty",
    title: "Open Source Game Engine Tools",
    description: "Grant proposal for indie developer tools",
    amount: 25000,
    currency: "USD",
    status: "pending",
    category: "Grants",
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
    metadata: { votesFor: 42, votesAgainst: 8, type: "grant" },
  },
  {
    id: "ledger-found-002",
    organizationId: "org-foundation-001",
    memberId: "member-council-002",
    type: "bounty",
    title: "Youth Coding Education Initiative",
    description: "Expand Foundry to underserved communities",
    amount: 50000,
    currency: "USD",
    status: "approved",
    category: "Grants",
    createdAt: "2024-11-15T14:00:00Z",
    updatedAt: "2024-11-20T12:00:00Z",
    metadata: { votesFor: 67, votesAgainst: 3, type: "grant" },
  },
];

export const DEV_ORGANIZATION: Organization = {
  id: "org-dev-001",
  name: "AeThex Dev",
  type: "business",
  tier: "enterprise",
  settings: {
    marketContext: "business",
    complianceEnabled: true,
    piiDetectionEnabled: false,
    auditLoggingEnabled: true,
  },
};

export const DEV_MEMBERS: Member[] = [
  {
    id: "member-dev-001",
    organizationId: "org-dev-001",
    name: "Alex Chen",
    email: "alex@aethex.dev",
    role: "developer",
    avatar: "AC",
    status: "active",
    trustScore: 92,
    metadata: { department: "Core Team", hireDate: "2022-06-01" },
    createdAt: "2022-06-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-dev-002",
    organizationId: "org-dev-001",
    name: "Sam Rivera",
    email: "sam@aethex.dev",
    role: "developer",
    avatar: "SR",
    status: "active",
    trustScore: 88,
    metadata: { department: "API Team", hireDate: "2023-01-15" },
    createdAt: "2023-01-15T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-api-001",
    organizationId: "org-dev-001",
    name: "API Partner Co.",
    email: "dev@partner.io",
    role: "api_user",
    avatar: "AP",
    status: "active",
    trustScore: 85,
    metadata: { department: "External" },
    createdAt: "2024-03-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-community-001",
    organizationId: "org-dev-001",
    name: "Jordan Lee",
    email: "jordan@community.dev",
    role: "community_member",
    avatar: "JL",
    status: "active",
    trustScore: 78,
    metadata: { department: "Community" },
    createdAt: "2024-06-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
];

export const DEV_LEDGER_ITEMS: LedgerItem[] = [
  {
    id: "ledger-dev-001",
    organizationId: "org-dev-001",
    memberId: "member-dev-001",
    type: "bounty",
    title: "SDK v2.0 TypeScript Rewrite",
    description: "Complete TypeScript rewrite of JavaScript SDK",
    amount: 5000,
    currency: "USD",
    xpValue: 750,
    status: "pending",
    category: "Development",
    dueDate: "2025-01-15T00:00:00Z",
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    metadata: { skillRequired: "TypeScript", estimatedHours: 60 },
  },
  {
    id: "ledger-dev-002",
    organizationId: "org-dev-001",
    memberId: "member-api-001",
    type: "expense",
    title: "API Infrastructure - December",
    description: "Cloud hosting and CDN costs",
    amount: 3200,
    currency: "USD",
    status: "approved",
    category: "Infrastructure",
    createdAt: "2024-12-15T00:00:00Z",
    updatedAt: "2024-12-18T00:00:00Z",
    metadata: { vendor: "Cloudflare", type: "recurring" },
  },
  {
    id: "ledger-dev-003",
    organizationId: "org-dev-001",
    memberId: "member-community-001",
    type: "bounty",
    title: "Documentation Improvements",
    description: "Improve API docs with examples",
    amount: 800,
    currency: "USD",
    xpValue: 200,
    status: "completed",
    category: "Documentation",
    createdAt: "2024-11-20T00:00:00Z",
    updatedAt: "2024-12-10T00:00:00Z",
    metadata: { type: "community_contribution" },
  },
];

export const STUDIO_ORGANIZATION: Organization = {
  id: "org-studio-001",
  name: "AeThex Studio",
  type: "school",
  tier: "enterprise",
  settings: {
    marketContext: "education",
    complianceEnabled: true,
    piiDetectionEnabled: true,
    auditLoggingEnabled: true,
  },
};

export const STUDIO_MEMBERS: Member[] = [
  {
    id: "member-studio-001",
    organizationId: "org-studio-001",
    name: "Casey Williams",
    email: "casey@foundry.studio",
    role: "foundry_student",
    avatar: "CW",
    status: "active",
    trustScore: 85,
    metadata: { gradeLevel: 11, enrollmentDate: "2024-01-15" },
    createdAt: "2024-01-15T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-studio-002",
    organizationId: "org-studio-001",
    name: "Taylor Brooks",
    email: "taylor@foundry.studio",
    role: "foundry_student",
    avatar: "TB",
    status: "active",
    trustScore: 90,
    metadata: { gradeLevel: 12, enrollmentDate: "2023-09-01" },
    createdAt: "2023-09-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-client-001",
    organizationId: "org-studio-001",
    name: "GameCraft Studios",
    email: "projects@gamecraft.io",
    role: "client",
    avatar: "GC",
    status: "active",
    trustScore: 92,
    metadata: { department: "Clients" },
    createdAt: "2024-02-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "member-investor-001",
    organizationId: "org-studio-001",
    name: "Venture Partners",
    email: "invest@venturep.com",
    role: "investor",
    avatar: "VP",
    status: "active",
    trustScore: 95,
    metadata: { department: "Investors" },
    createdAt: "2023-10-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
];

export const STUDIO_LEDGER_ITEMS: LedgerItem[] = [
  {
    id: "ledger-studio-001",
    organizationId: "org-studio-001",
    memberId: "member-studio-001",
    type: "assignment",
    title: "GameCraft Client Project - UI Design",
    description: "Design game UI mockups for client review",
    xpValue: 150,
    status: "pending",
    category: "Design",
    dueDate: "2025-01-10T23:59:00Z",
    createdAt: "2024-12-15T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
    metadata: { clientId: "member-client-001", projectPhase: "design" },
  },
  {
    id: "ledger-studio-002",
    organizationId: "org-studio-001",
    memberId: "member-studio-002",
    type: "assignment",
    title: "3D Asset Creation Sprint",
    description: "Create character models for GameCraft project",
    xpValue: 200,
    status: "completed",
    category: "3D Modeling",
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-14T00:00:00Z",
    metadata: { score: 92, maxScore: 100, submittedAt: "2024-12-14T16:30:00Z" },
  },
  {
    id: "ledger-studio-003",
    organizationId: "org-studio-001",
    memberId: "member-studio-001",
    type: "achievement",
    title: "Portfolio Showcase Ready",
    description: "Completed portfolio for investor demo",
    xpValue: 100,
    status: "completed",
    category: "Portfolio",
    createdAt: "2024-12-18T00:00:00Z",
    updatedAt: "2024-12-18T00:00:00Z",
    metadata: { badgeId: "badge-portfolio-gold" },
  },
];

export function getMembersForContext(context: MarketContext): Member[] {
  return context === "business" ? BUSINESS_MEMBERS : EDUCATION_MEMBERS;
}

export function getMembersForPillar(pillar: EcosystemPillar): Member[] {
  switch (pillar) {
    case "dev":
      return DEV_MEMBERS;
    case "studio":
      return STUDIO_MEMBERS;
    case "foundation":
      return FOUNDATION_MEMBERS;
    default:
      return DEV_MEMBERS;
  }
}

export function getLedgerItemsForContext(context: MarketContext): LedgerItem[] {
  return context === "business" ? BUSINESS_LEDGER_ITEMS : EDUCATION_LEDGER_ITEMS;
}

export function getLedgerItemsForPillar(pillar: EcosystemPillar): LedgerItem[] {
  switch (pillar) {
    case "dev":
      return DEV_LEDGER_ITEMS;
    case "studio":
      return STUDIO_LEDGER_ITEMS;
    case "foundation":
      return FOUNDATION_LEDGER_ITEMS;
    default:
      return DEV_LEDGER_ITEMS;
  }
}

export function getOrganizationForContext(context: MarketContext): Organization {
  return context === "business" ? BUSINESS_ORGANIZATION : EDUCATION_ORGANIZATION;
}

export function getOrganizationForPillar(pillar: EcosystemPillar): Organization {
  switch (pillar) {
    case "dev":
      return DEV_ORGANIZATION;
    case "studio":
      return STUDIO_ORGANIZATION;
    case "foundation":
      return FOUNDATION_ORGANIZATION;
    default:
      return DEV_ORGANIZATION;
  }
}

export const DEV_EVENTS: EngagementEvent[] = [
  {
    id: "event-dev-001",
    organizationId: "org-dev-001",
    memberId: "member-dev-001",
    type: "bounty_completed",
    category: "development",
    title: "SDK v2.0 Milestone Reached",
    description: "TypeScript rewrite 50% complete",
    xpEarned: 200,
    metadata: { bountyId: "ledger-dev-001", progress: 50 },
    createdAt: "2024-12-18T14:30:00Z",
  },
  {
    id: "event-dev-002",
    organizationId: "org-dev-001",
    memberId: "member-community-001",
    type: "contribution",
    category: "documentation",
    title: "API Docs Updated",
    description: "Added 15 new code examples",
    xpEarned: 100,
    metadata: { pagesUpdated: 15 },
    createdAt: "2024-12-17T10:00:00Z",
  },
  {
    id: "event-dev-003",
    organizationId: "org-dev-001",
    memberId: "member-api-001",
    type: "integration",
    category: "api",
    title: "New API Integration Live",
    description: "Partner integration completed",
    xpEarned: 150,
    metadata: { endpoints: 5 },
    createdAt: "2024-12-16T16:45:00Z",
  },
];

export const STUDIO_EVENTS: EngagementEvent[] = [
  {
    id: "event-studio-001",
    organizationId: "org-studio-001",
    memberId: "member-studio-001",
    type: "assignment_submitted",
    category: "project",
    title: "UI Mockups Submitted",
    description: "GameCraft client project designs ready for review",
    xpEarned: 100,
    metadata: { projectId: "ledger-studio-001", reviewStatus: "pending" },
    createdAt: "2024-12-19T11:00:00Z",
  },
  {
    id: "event-studio-002",
    organizationId: "org-studio-001",
    memberId: "member-studio-002",
    type: "skill_unlocked",
    category: "learning",
    title: "3D Modeling Expert Badge",
    description: "Achieved mastery level in Blender",
    xpEarned: 250,
    metadata: { skillId: "3d-modeling", level: "expert" },
    createdAt: "2024-12-18T15:30:00Z",
  },
  {
    id: "event-studio-003",
    organizationId: "org-studio-001",
    memberId: "member-client-001",
    type: "feedback",
    category: "client",
    title: "Client Feedback Received",
    description: "GameCraft approved phase 1 deliverables",
    metadata: { rating: 5, projectPhase: 1 },
    createdAt: "2024-12-17T09:00:00Z",
  },
];

export const FOUNDATION_EVENTS: EngagementEvent[] = [
  {
    id: "event-found-001",
    organizationId: "org-foundation-001",
    memberId: "member-council-001",
    type: "vote_cast",
    category: "governance",
    title: "Proposal Vote Cast",
    description: "Voted on Q1 2025 Grant Allocation",
    metadata: { proposalId: "ledger-found-001", vote: "approve" },
    createdAt: "2024-12-20T10:00:00Z",
  },
  {
    id: "event-found-002",
    organizationId: "org-foundation-001",
    memberId: "member-donor-001",
    type: "donation",
    category: "funding",
    title: "Scholarship Fund Contribution",
    description: "Donated to Foundry student scholarships",
    xpEarned: 500,
    metadata: { amount: 5000, fund: "scholarship" },
    createdAt: "2024-12-19T14:00:00Z",
  },
  {
    id: "event-found-003",
    organizationId: "org-foundation-001",
    memberId: "member-voter-001",
    type: "participation",
    category: "community",
    title: "Town Hall Attendance",
    description: "Participated in quarterly community meeting",
    xpEarned: 50,
    metadata: { meetingType: "town_hall" },
    createdAt: "2024-12-15T18:00:00Z",
  },
];

export const DEV_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit-dev-001",
    organizationId: "org-dev-001",
    memberId: "member-dev-001",
    action: "api_key_generated",
    resource: "api_credentials",
    resourceId: "key-dev-001",
    details: { keyType: "production", permissions: ["read", "write"] },
    ipAddress: "192.168.1.100",
    timestamp: "2024-12-20T09:00:00Z",
  },
  {
    id: "audit-dev-002",
    organizationId: "org-dev-001",
    memberId: "member-api-001",
    action: "webhook_registered",
    resource: "integrations",
    resourceId: "webhook-001",
    details: { endpoint: "https://partner.io/webhooks" },
    ipAddress: "10.0.0.50",
    timestamp: "2024-12-19T16:30:00Z",
  },
];

export const STUDIO_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit-studio-001",
    organizationId: "org-studio-001",
    memberId: "member-studio-001",
    action: "portfolio_published",
    resource: "portfolio",
    resourceId: "portfolio-001",
    details: { visibility: "public", itemCount: 12 },
    ipAddress: "192.168.1.50",
    timestamp: "2024-12-18T14:00:00Z",
  },
  {
    id: "audit-studio-002",
    organizationId: "org-studio-001",
    memberId: "member-client-001",
    action: "nda_signed",
    resource: "contracts",
    resourceId: "nda-gc-001",
    details: { clientName: "GameCraft Studios", projectId: "project-001" },
    ipAddress: "203.0.113.25",
    timestamp: "2024-12-15T11:00:00Z",
  },
];

export const FOUNDATION_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit-found-001",
    organizationId: "org-foundation-001",
    memberId: "member-council-001",
    action: "proposal_created",
    resource: "governance",
    resourceId: "proposal-001",
    details: { title: "Q1 2025 Grant Allocation", budget: 250000 },
    ipAddress: "192.168.1.1",
    timestamp: "2024-12-10T10:00:00Z",
  },
  {
    id: "audit-found-002",
    organizationId: "org-foundation-001",
    memberId: "member-donor-001",
    action: "donation_processed",
    resource: "funding",
    resourceId: "donation-001",
    details: { amount: 5000, fund: "scholarship", recurring: false },
    ipAddress: "172.16.0.100",
    timestamp: "2024-12-19T14:05:00Z",
  },
];

export function getEventsForContext(context: MarketContext): EngagementEvent[] {
  const orgId = context === "business" ? "org-biz-001" : "org-edu-001";
  return DUAL_EVENTS.filter(e => e.organizationId === orgId);
}

export function getEventsForPillar(pillar: EcosystemPillar): EngagementEvent[] {
  switch (pillar) {
    case "dev":
      return DEV_EVENTS;
    case "studio":
      return STUDIO_EVENTS;
    case "foundation":
      return FOUNDATION_EVENTS;
    default:
      return DEV_EVENTS;
  }
}

export function getAuditLogsForContext(context: MarketContext): AuditLogEntry[] {
  const orgId = context === "business" ? "org-biz-001" : "org-edu-001";
  return AUDIT_LOG_ENTRIES.filter(e => e.organizationId === orgId);
}

export function getAuditLogsForPillar(pillar: EcosystemPillar): AuditLogEntry[] {
  switch (pillar) {
    case "dev":
      return DEV_AUDIT_LOGS;
    case "studio":
      return STUDIO_AUDIT_LOGS;
    case "foundation":
      return FOUNDATION_AUDIT_LOGS;
    default:
      return DEV_AUDIT_LOGS;
  }
}
