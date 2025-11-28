import { 
  ComplianceCase, 
  ComplianceFlag, 
  AuditLogEntry, 
  RiskLevel, 
  ComplianceStatus,
  ChatMessage 
} from "../types/domain";
import { configService } from "./configurationService";
import { databaseService } from "./databaseService";

interface PIIPattern {
  name: string;
  pattern: RegExp;
  severity: RiskLevel;
  category: "SSN" | "PHONE" | "EMAIL" | "ADDRESS" | "CREDIT_CARD" | "DOB" | "CUSTOM";
}

const PII_PATTERNS: PIIPattern[] = [
  {
    name: "Social Security Number",
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    severity: "CRITICAL",
    category: "SSN",
  },
  {
    name: "Phone Number",
    pattern: /\b(\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    severity: "HIGH",
    category: "PHONE",
  },
  {
    name: "Email Address",
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    severity: "MEDIUM",
    category: "EMAIL",
  },
  {
    name: "Credit Card",
    pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    severity: "CRITICAL",
    category: "CREDIT_CARD",
  },
  {
    name: "Date of Birth Pattern",
    pattern: /\b(0[1-9]|1[0-2])[\/\-](0[1-9]|[12]\d|3[01])[\/\-](19|20)\d{2}\b/g,
    severity: "HIGH",
    category: "DOB",
  },
  {
    name: "Street Address",
    pattern: /\b\d{1,5}\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|place|pl)\b/gi,
    severity: "HIGH",
    category: "ADDRESS",
  },
];

const CONTENT_PATTERNS = [
  { name: "Profanity Filter", pattern: /\b(damn|hell|crap)\b/gi, severity: "LOW" as RiskLevel },
  { name: "Violence Keywords", pattern: /\b(kill|attack|fight|weapon)\b/gi, severity: "MEDIUM" as RiskLevel },
  { name: "Harmful Content", pattern: /\b(suicide|self-harm|overdose)\b/gi, severity: "CRITICAL" as RiskLevel },
];

class ComplianceService {
  private auditLog: AuditLogEntry[] = [];
  private cases: ComplianceCase[] = [];
  private customPatterns: PIIPattern[] = [];

  addCustomPattern(pattern: PIIPattern): void {
    this.customPatterns.push(pattern);
  }

  detectPII(text: string): { detected: boolean; matches: ComplianceFlag[] } {
    const allPatterns = [...PII_PATTERNS, ...this.customPatterns];
    const matches: ComplianceFlag[] = [];

    for (const piiPattern of allPatterns) {
      const found = text.match(piiPattern.pattern);
      if (found) {
        matches.push({
          id: `flag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "PII",
          severity: piiPattern.severity,
          trigger: `${piiPattern.name} detected`,
          detectedAt: new Date().toISOString(),
        });
      }
    }

    return { detected: matches.length > 0, matches };
  }

  detectContentViolations(text: string): { detected: boolean; matches: ComplianceFlag[] } {
    const matches: ComplianceFlag[] = [];

    for (const contentPattern of CONTENT_PATTERNS) {
      const found = text.match(contentPattern.pattern);
      if (found) {
        matches.push({
          id: `flag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "CONTENT",
          severity: contentPattern.severity,
          trigger: `${contentPattern.name} triggered`,
          detectedAt: new Date().toISOString(),
        });
      }
    }

    return { detected: matches.length > 0, matches };
  }

  redactPII(text: string): string {
    let redacted = text;
    const allPatterns = [...PII_PATTERNS, ...this.customPatterns];

    for (const piiPattern of allPatterns) {
      redacted = redacted.replace(piiPattern.pattern, (match) => {
        if (piiPattern.category === "SSN") return "XXX-XX-XXXX";
        if (piiPattern.category === "PHONE") return "(XXX) XXX-XXXX";
        if (piiPattern.category === "EMAIL") return "[EMAIL REDACTED]";
        if (piiPattern.category === "CREDIT_CARD") return "XXXX-XXXX-XXXX-XXXX";
        return "[REDACTED]";
      });
    }

    return redacted;
  }

  processMessage(message: Omit<ChatMessage, "isBlocked" | "piiRedacted" | "redactedContent" | "complianceFlags">): ChatMessage {
    const settings = configService.getComplianceSettings();
    const piiResult = this.detectPII(message.content);
    const contentResult = this.detectContentViolations(message.content);
    
    const allFlags = [...piiResult.matches, ...contentResult.matches];
    const hasCritical = allFlags.some(f => f.severity === "CRITICAL");
    const hasHigh = allFlags.some(f => f.severity === "HIGH");

    const shouldBlock = settings.blockOnPii && (hasCritical || (hasHigh && piiResult.detected));

    const processedMessage: ChatMessage = {
      ...message,
      isBlocked: shouldBlock,
      piiRedacted: piiResult.detected,
      redactedContent: piiResult.detected ? this.redactPII(message.content) : undefined,
      complianceFlags: allFlags.length > 0 ? allFlags : undefined,
    };

    if (allFlags.length > 0) {
      this.logAuditEntry({
        organizationId: "org-1",
        memberId: message.senderId,
        timestamp: new Date().toISOString(),
        action: "MESSAGE_SENT",
        resource: "chat",
        resourceId: message.channelId,
        status: shouldBlock ? "BLOCKED" : piiResult.detected ? "FLAGGED" : "ALLOWED",
        riskLevel: hasCritical ? "CRITICAL" : hasHigh ? "HIGH" : "MEDIUM",
        flagged: true,
        trigger: allFlags.map(f => f.trigger).join(", "),
      });
    }

    return processedMessage;
  }

  async logAuditEntry(entry: Omit<AuditLogEntry, 'id'>): Promise<void> {
    const newEntry: AuditLogEntry = { ...entry, id: `audit-${Date.now()}` };
    this.auditLog.unshift(newEntry);
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(0, 1000);
    }
    
    try {
      await databaseService.auditLogs.create(entry);
    } catch (error) {
      console.warn('Failed to persist audit log to database:', error);
    }
  }

  getAuditLog(filters?: {
    memberId?: string;
    status?: ComplianceStatus;
    riskLevel?: RiskLevel;
    flaggedOnly?: boolean;
    limit?: number;
  }): AuditLogEntry[] {
    let filtered = [...this.auditLog];

    if (filters?.memberId) {
      filtered = filtered.filter(e => e.memberId === filters.memberId);
    }
    if (filters?.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }
    if (filters?.riskLevel) {
      filtered = filtered.filter(e => e.riskLevel === filters.riskLevel);
    }
    if (filters?.flaggedOnly) {
      filtered = filtered.filter(e => e.flagged);
    }
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  createCase(
    memberId: string,
    type: ComplianceCase["type"],
    evidence: ComplianceCase["evidence"],
    severity: RiskLevel
  ): ComplianceCase {
    const newCase: ComplianceCase = {
      id: `case-${Date.now()}`,
      organizationId: "org-1",
      memberId,
      type,
      severity,
      status: severity === "CRITICAL" ? "escalated" : "open",
      title: `${type.replace(/_/g, " ")} - ${new Date().toLocaleDateString()}`,
      description: `Automated case created for ${type}`,
      evidence,
      actions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.cases.unshift(newCase);
    return newCase;
  }

  getCases(filters?: {
    memberId?: string;
    status?: ComplianceCase["status"];
    severity?: RiskLevel;
  }): ComplianceCase[] {
    let filtered = [...this.cases];

    if (filters?.memberId) {
      filtered = filtered.filter(c => c.memberId === filters.memberId);
    }
    if (filters?.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters?.severity) {
      filtered = filtered.filter(c => c.severity === filters.severity);
    }

    return filtered;
  }

  resolveCase(caseId: string, resolution: "allowed" | "blocked" | "quarantined", resolvedBy: string, notes?: string): void {
    const caseIndex = this.cases.findIndex(c => c.id === caseId);
    if (caseIndex !== -1) {
      this.cases[caseIndex] = {
        ...this.cases[caseIndex],
        status: "resolved",
        updatedAt: new Date().toISOString(),
        closedAt: new Date().toISOString(),
        actions: [
          ...this.cases[caseIndex].actions,
          {
            id: `action-${Date.now()}`,
            type: resolution === "allowed" ? "allow" : resolution === "blocked" ? "block" : "quarantine",
            performedBy: resolvedBy,
            performedAt: new Date().toISOString(),
            notes,
          },
        ],
      };
    }
  }

  getComplianceStats(): {
    totalEvents: number;
    blockedCount: number;
    flaggedCount: number;
    openCases: number;
    criticalCases: number;
  } {
    return {
      totalEvents: this.auditLog.length,
      blockedCount: this.auditLog.filter(e => e.status === "BLOCKED").length,
      flaggedCount: this.auditLog.filter(e => e.flagged).length,
      openCases: this.cases.filter(c => c.status === "open" || c.status === "investigating").length,
      criticalCases: this.cases.filter(c => c.severity === "CRITICAL" && c.status !== "resolved").length,
    };
  }
}

export const complianceService = new ComplianceService();
