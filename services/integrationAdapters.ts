import { Member, LedgerItem, Organization, IntegrationConfig } from "../types/domain";

export interface RosterData {
  organizationId: string;
  organizationName: string;
  members: Member[];
  classes?: {
    id: string;
    name: string;
    memberIds: string[];
    instructorIds: string[];
  }[];
}

export interface IntegrationAdapter {
  type: IntegrationConfig["type"];
  connect(credentials: Record<string, string>): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getLastSyncTime(): string | null;
}

export interface RosterAdapter extends IntegrationAdapter {
  importRoster(): Promise<RosterData>;
  exportRoster(data: RosterData): Promise<boolean>;
  syncRoster(): Promise<{ added: number; updated: number; removed: number }>;
}

export interface LMSAdapter extends IntegrationAdapter {
  launchContent(contentId: string, memberId: string): Promise<{ launchUrl: string }>;
  getGrades(memberId: string): Promise<{ itemId: string; score: number; maxScore: number }[]>;
  submitGrade(memberId: string, itemId: string, score: number): Promise<boolean>;
}

export interface PaymentAdapter extends IntegrationAdapter {
  createPayment(amount: number, currency: string, description: string): Promise<{ paymentId: string }>;
  getPaymentStatus(paymentId: string): Promise<"pending" | "completed" | "failed">;
  refundPayment(paymentId: string, amount?: number): Promise<boolean>;
}

export interface AccountingAdapter extends IntegrationAdapter {
  syncExpenses(expenses: LedgerItem[]): Promise<{ synced: number; failed: number }>;
  syncInvoices(invoices: LedgerItem[]): Promise<{ synced: number; failed: number }>;
  getAccounts(): Promise<{ id: string; name: string; type: string }[]>;
}

class MockOneRosterAdapter implements RosterAdapter {
  type: "oneroster" = "oneroster";
  private connected = false;
  private lastSync: string | null = null;

  async connect(credentials: Record<string, string>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (credentials.clientId && credentials.clientSecret) {
      this.connected = true;
      return true;
    }
    return false;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.lastSync = null;
  }

  isConnected(): boolean {
    return this.connected;
  }

  getLastSyncTime(): string | null {
    return this.lastSync;
  }

  async importRoster(): Promise<RosterData> {
    if (!this.connected) throw new Error("Not connected to OneRoster");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.lastSync = new Date().toISOString();
    
    return {
      organizationId: "school-001",
      organizationName: "Lincoln High School",
      members: [
        {
          id: "student-001",
          organizationId: "school-001",
          externalId: "LHS-2024-001",
          name: "Alex Chen",
          email: "alex.chen@lincoln.edu",
          role: "student",
          status: "active",
          trustScore: 85,
          metadata: { gradeLevel: 11, enrollmentDate: "2023-09-01" },
          createdAt: "2023-09-01T00:00:00Z",
          lastActiveAt: new Date().toISOString(),
        },
        {
          id: "student-002",
          organizationId: "school-001",
          externalId: "LHS-2024-002",
          name: "Sarah Johnson",
          email: "sarah.j@lincoln.edu",
          role: "student",
          status: "active",
          trustScore: 92,
          metadata: { gradeLevel: 10, enrollmentDate: "2023-09-01" },
          createdAt: "2023-09-01T00:00:00Z",
          lastActiveAt: new Date().toISOString(),
        },
        {
          id: "teacher-001",
          organizationId: "school-001",
          externalId: "LHS-T-001",
          name: "Dr. Michael Ross",
          email: "m.ross@lincoln.edu",
          role: "teacher",
          status: "active",
          trustScore: 100,
          metadata: { department: "Computer Science", hireDate: "2018-08-15" },
          createdAt: "2018-08-15T00:00:00Z",
          lastActiveAt: new Date().toISOString(),
        },
      ],
      classes: [
        {
          id: "class-cs101",
          name: "AP Computer Science",
          memberIds: ["student-001", "student-002"],
          instructorIds: ["teacher-001"],
        },
      ],
    };
  }

  async exportRoster(data: RosterData): Promise<boolean> {
    if (!this.connected) throw new Error("Not connected to OneRoster");
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  async syncRoster(): Promise<{ added: number; updated: number; removed: number }> {
    if (!this.connected) throw new Error("Not connected to OneRoster");
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.lastSync = new Date().toISOString();
    return { added: 5, updated: 12, removed: 2 };
  }
}

class MockLTIAdapter implements LMSAdapter {
  type: "lti" = "lti";
  private connected = false;
  private lastSync: string | null = null;

  async connect(credentials: Record<string, string>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (credentials.platformId && credentials.clientId) {
      this.connected = true;
      return true;
    }
    return false;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  getLastSyncTime(): string | null {
    return this.lastSync;
  }

  async launchContent(contentId: string, memberId: string): Promise<{ launchUrl: string }> {
    if (!this.connected) throw new Error("Not connected to LMS");
    return {
      launchUrl: `https://lms.example.com/lti/launch?content=${contentId}&user=${memberId}&token=mock`,
    };
  }

  async getGrades(memberId: string): Promise<{ itemId: string; score: number; maxScore: number }[]> {
    if (!this.connected) throw new Error("Not connected to LMS");
    return [
      { itemId: "assignment-1", score: 85, maxScore: 100 },
      { itemId: "assignment-2", score: 92, maxScore: 100 },
      { itemId: "quiz-1", score: 45, maxScore: 50 },
    ];
  }

  async submitGrade(memberId: string, itemId: string, score: number): Promise<boolean> {
    if (!this.connected) throw new Error("Not connected to LMS");
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }
}

class IntegrationManager {
  private adapters: Map<string, IntegrationAdapter> = new Map();

  constructor() {
    this.adapters.set("oneroster", new MockOneRosterAdapter());
    this.adapters.set("lti", new MockLTIAdapter());
  }

  getAdapter<T extends IntegrationAdapter>(type: IntegrationConfig["type"]): T | null {
    return (this.adapters.get(type) as T) || null;
  }

  async connectIntegration(
    type: IntegrationConfig["type"],
    credentials: Record<string, string>
  ): Promise<boolean> {
    const adapter = this.adapters.get(type);
    if (!adapter) return false;
    return adapter.connect(credentials);
  }

  async disconnectIntegration(type: IntegrationConfig["type"]): Promise<void> {
    const adapter = this.adapters.get(type);
    if (adapter) {
      await adapter.disconnect();
    }
  }

  getIntegrationStatus(type: IntegrationConfig["type"]): IntegrationConfig | null {
    const adapter = this.adapters.get(type);
    if (!adapter) return null;

    return {
      id: `integration-${type}`,
      type,
      status: adapter.isConnected() ? "connected" : "disconnected",
      lastSyncAt: adapter.getLastSyncTime() || undefined,
    };
  }

  getAllIntegrations(): IntegrationConfig[] {
    const configs: IntegrationConfig[] = [];
    for (const [type, adapter] of this.adapters) {
      configs.push({
        id: `integration-${type}`,
        type: type as IntegrationConfig["type"],
        status: adapter.isConnected() ? "connected" : "disconnected",
        lastSyncAt: adapter.getLastSyncTime() || undefined,
      });
    }
    return configs;
  }
}

export const integrationManager = new IntegrationManager();
