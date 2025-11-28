import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  MarketContext, 
  AppMode, 
  Member, 
  Organization, 
  LedgerItem, 
  EngagementEvent,
  AuditLogEntry,
  SkillNode,
  ChatMessage,
  ComplianceCase 
} from "../types/domain";
import { configService, MarketConfiguration } from "../services/configurationService";
import { complianceService } from "../services/complianceService";
import { consentService } from "../services/consentService";
import { 
  getMembersForContext, 
  getLedgerItemsForContext, 
  getOrganizationForContext,
  getEventsForContext,
  getAuditLogsForContext,
  SKILL_NODES,
  SAMPLE_CHAT_MESSAGES 
} from "../services/mockData";

interface AppState {
  mode: AppMode;
  marketContext: MarketContext;
  currentMember: Member | null;
  organization: Organization | null;
  members: Member[];
  ledgerItems: LedgerItem[];
  events: EngagementEvent[];
  auditLogs: AuditLogEntry[];
  skillNodes: SkillNode[];
  chatMessages: ChatMessage[];
  complianceCases: ComplianceCase[];
  isAuthenticated: boolean;
  isLoading: boolean;
  config: MarketConfiguration;

  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  setMarketContext: (context: MarketContext) => void;
  login: (username: string, context?: MarketContext) => Promise<boolean>;
  logout: () => void;
  loadSession: () => Promise<void>;
  
  sendChatMessage: (content: string, channelId: string) => ChatMessage;
  addLedgerItem: (item: Omit<LedgerItem, "id" | "createdAt" | "updatedAt">) => void;
  updateLedgerItemStatus: (id: string, status: LedgerItem["status"]) => void;
  
  getComplianceStats: () => { totalEvents: number; blockedCount: number; flaggedCount: number; openCases: number };
  getMemberById: (id: string) => Member | undefined;
  getTotalXP: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  mode: "day",
  marketContext: "business",
  currentMember: null,
  organization: null,
  members: [],
  ledgerItems: [],
  events: [],
  auditLogs: [],
  skillNodes: SKILL_NODES,
  chatMessages: SAMPLE_CHAT_MESSAGES,
  complianceCases: [],
  isAuthenticated: false,
  isLoading: true,
  config: configService.getConfig(),

  setMode: (mode) => {
    set({ mode });
    AsyncStorage.setItem("aethex_mode", mode);
  },

  toggleMode: () => {
    const newMode = get().mode === "day" ? "night" : "day";
    set({ mode: newMode });
    AsyncStorage.setItem("aethex_mode", newMode);
  },

  setMarketContext: (context) => {
    configService.setMarketContext(context);
    const config = configService.getConfig();
    const organization = getOrganizationForContext(context);
    const members = getMembersForContext(context);
    const ledgerItems = getLedgerItemsForContext(context);
    const events = getEventsForContext(context);
    const auditLogs = getAuditLogsForContext(context);

    set({ 
      marketContext: context,
      config,
      organization,
      members,
      ledgerItems,
      events,
      auditLogs,
    });
    AsyncStorage.setItem("aethex_context", context);
  },

  login: async (username: string, context?: MarketContext) => {
    const normalizedUsername = username.toLowerCase().trim();
    const marketContext = context || get().marketContext;
    
    configService.setMarketContext(marketContext);
    const config = configService.getConfig();
    const organization = getOrganizationForContext(marketContext);
    const members = getMembersForContext(marketContext);
    const ledgerItems = getLedgerItemsForContext(marketContext);
    const events = getEventsForContext(marketContext);
    const auditLogs = getAuditLogsForContext(marketContext);

    let currentMember: Member | null = null;
    let mode: AppMode = "day";

    if (marketContext === "business") {
      if (normalizedUsername === "admin" || normalizedUsername === "owner") {
        currentMember = members.find(m => m.role === "owner") || null;
        mode = "day";
      } else if (normalizedUsername === "creator" || normalizedUsername === "contractor") {
        currentMember = members.find(m => m.role === "vendor" || m.role === "contractor") || members.find(m => m.role === "employee") || null;
        mode = "night";
      } else {
        currentMember = members.find(m => m.name.toLowerCase().includes(normalizedUsername)) || null;
        mode = currentMember?.role === "owner" || currentMember?.role === "manager" ? "day" : "night";
      }
    } else {
      if (normalizedUsername === "admin" || normalizedUsername === "teacher") {
        currentMember = members.find(m => m.role === "admin" || m.role === "teacher") || null;
        mode = "day";
      } else if (normalizedUsername === "student" || normalizedUsername === "creator") {
        currentMember = members.find(m => m.role === "student") || null;
        mode = "night";
      } else {
        currentMember = members.find(m => m.name.toLowerCase().includes(normalizedUsername)) || null;
        mode = currentMember?.role === "admin" || currentMember?.role === "teacher" ? "day" : "night";
      }
    }

    if (!currentMember) {
      currentMember = members[0];
      mode = config.roles.dayModeRoles.includes(currentMember.role) ? "day" : "night";
    }

    set({
      currentMember,
      mode,
      marketContext,
      config,
      organization,
      members,
      ledgerItems,
      events,
      auditLogs,
      isAuthenticated: true,
    });

    await AsyncStorage.setItem("aethex_member", JSON.stringify(currentMember));
    await AsyncStorage.setItem("aethex_mode", mode);
    await AsyncStorage.setItem("aethex_context", marketContext);

    if (marketContext === "education" && currentMember.role === "student") {
      consentService.createMockConsent(currentMember.id, organization.id);
    }

    return true;
  },

  logout: () => {
    set({
      currentMember: null,
      isAuthenticated: false,
      mode: "day",
      organization: null,
      members: [],
      ledgerItems: [],
      events: [],
      auditLogs: [],
    });
    AsyncStorage.multiRemove(["aethex_member", "aethex_mode", "aethex_context"]);
  },

  loadSession: async () => {
    try {
      const [memberJson, mode, context] = await Promise.all([
        AsyncStorage.getItem("aethex_member"),
        AsyncStorage.getItem("aethex_mode"),
        AsyncStorage.getItem("aethex_context"),
      ]);

      if (memberJson) {
        const member = JSON.parse(memberJson) as Member;
        const marketContext = (context as MarketContext) || "business";
        
        configService.setMarketContext(marketContext);
        const config = configService.getConfig();
        const organization = getOrganizationForContext(marketContext);
        const members = getMembersForContext(marketContext);
        const ledgerItems = getLedgerItemsForContext(marketContext);
        const events = getEventsForContext(marketContext);
        const auditLogs = getAuditLogsForContext(marketContext);

        set({
          currentMember: member,
          mode: (mode as AppMode) || "day",
          marketContext,
          config,
          organization,
          members,
          ledgerItems,
          events,
          auditLogs,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error loading session:", error);
      set({ isLoading: false });
    }
  },

  sendChatMessage: (content: string, channelId: string) => {
    const { currentMember, config } = get();
    if (!currentMember) throw new Error("Not authenticated");

    const rawMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentMember.id,
      senderName: currentMember.name,
      channelId,
      content,
      timestamp: new Date().toISOString(),
    };

    const processedMessage = config.features.piiDetection 
      ? complianceService.processMessage(rawMessage)
      : { ...rawMessage, isBlocked: false, piiRedacted: false };

    set(state => ({
      chatMessages: [...state.chatMessages, processedMessage],
    }));

    return processedMessage;
  },

  addLedgerItem: (item) => {
    const newItem: LedgerItem = {
      ...item,
      id: `ledger-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set(state => ({
      ledgerItems: [...state.ledgerItems, newItem],
    }));
  },

  updateLedgerItemStatus: (id: string, status: LedgerItem["status"]) => {
    set(state => ({
      ledgerItems: state.ledgerItems.map(item =>
        item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
      ),
    }));
  },

  getComplianceStats: () => {
    const { auditLogs, complianceCases } = get();
    return {
      totalEvents: auditLogs.length,
      blockedCount: auditLogs.filter(e => e.status === "BLOCKED").length,
      flaggedCount: auditLogs.filter(e => e.flagged).length,
      openCases: complianceCases.filter(c => c.status === "open" || c.status === "investigating").length,
    };
  },

  getMemberById: (id: string) => {
    return get().members.find(m => m.id === id);
  },

  getTotalXP: () => {
    const { events, currentMember } = get();
    if (!currentMember) return 0;
    return events
      .filter(e => e.memberId === currentMember.id && e.gamification.isUnlocked)
      .reduce((total, e) => total + e.gamification.xp, 0);
  },
}));

export const themes = {
  day: {
    background: "#ffffff",
    accent: "#1e3a8a",
    accentLight: "#3b82f6",
    secondary: "#f1f5f9",
    tertiary: "#e2e8f0",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#cbd5e1",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    card: "#ffffff",
  },
  night: {
    background: "#0B0A0F",
    accent: "#22c55e",
    accentLight: "#4ade80",
    secondary: "#1a1a24",
    tertiary: "#252530",
    text: "#f8fafc",
    textSecondary: "#94a3b8",
    border: "#2d2d3a",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    card: "#13131a",
  },
};

export const useTheme = () => {
  const mode = useAppStore((state) => state.mode);
  return themes[mode];
};

export const useTerminology = () => {
  const config = useAppStore((state) => state.config);
  return config.terminology;
};

export const useFeatures = () => {
  const config = useAppStore((state) => state.config);
  return config.features;
};
