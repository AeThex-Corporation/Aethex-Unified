import type { ConsentRecord, DataConsentCategory, ConsentRequirement, Member } from '../types/domain';
import { databaseService } from './databaseService';
import { complianceService } from './complianceService';

const COPPA_AGE = 13;
const SCHOOL_AGE = 18;

const CONSENT_REQUIREMENTS: ConsentRequirement[] = [
  { category: 'basic_info', required: true, description: 'Name and grade level', ageThreshold: SCHOOL_AGE },
  { category: 'academic', required: true, description: 'Grades and assignments', ageThreshold: SCHOOL_AGE },
  { category: 'behavioral', required: false, description: 'Attendance and conduct records', ageThreshold: SCHOOL_AGE },
  { category: 'communication', required: true, description: 'Chat and messaging features', ageThreshold: COPPA_AGE },
  { category: 'gamification', required: false, description: 'XP points and achievements', ageThreshold: COPPA_AGE },
  { category: 'analytics', required: false, description: 'Usage data and analytics', ageThreshold: SCHOOL_AGE },
];

const consentRecords: ConsentRecord[] = [];

export const consentService = {
  getRequirements: (): ConsentRequirement[] => {
    return CONSENT_REQUIREMENTS;
  },

  getStudentConsent: async (studentId: string): Promise<ConsentRecord | null> => {
    const record = consentRecords.find(
      r => r.studentId === studentId && r.status === 'granted'
    );
    return record || null;
  },

  hasConsentForCategory: async (
    studentId: string,
    category: DataConsentCategory
  ): Promise<boolean> => {
    const consent = await consentService.getStudentConsent(studentId);
    if (!consent) return false;
    return consent.dataCategories.includes(category);
  },

  hasFullConsent: async (studentId: string): Promise<boolean> => {
    const consent = await consentService.getStudentConsent(studentId);
    if (!consent) return false;
    return consent.consentType === 'full' && consent.status === 'granted';
  },

  needsGuardianConsent: (student: Member, category: DataConsentCategory): boolean => {
    if (student.role !== 'student') return false;
    
    const gradeLevel = student.metadata.gradeLevel || 0;
    const estimatedAge = gradeLevel + 5;
    
    const requirement = CONSENT_REQUIREMENTS.find(r => r.category === category);
    if (!requirement || !requirement.ageThreshold) return false;
    
    return estimatedAge < requirement.ageThreshold;
  },

  requestConsent: async (
    studentId: string,
    guardianEmail: string,
    categories: DataConsentCategory[],
    organizationId: string
  ): Promise<{ success: boolean; message: string }> => {
    const pendingRecord: ConsentRecord = {
      id: `consent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentId,
      guardianId: '',
      guardianName: '',
      guardianEmail,
      organizationId,
      consentType: 'pending',
      dataCategories: categories,
      grantedAt: '',
      status: 'pending',
      verificationMethod: 'email',
    };
    
    consentRecords.push(pendingRecord);
    
    await complianceService.logAuditEntry({
      action: 'consent_requested',
      resource: 'consent',
      resourceId: pendingRecord.id,
      memberId: studentId,
      organizationId,
      timestamp: new Date().toISOString(),
      riskLevel: 'LOW',
      status: 'ALLOWED',
      flagged: false,
      metadata: {
        guardianEmail,
        categories,
      },
    });
    
    return {
      success: true,
      message: 'Consent request sent to guardian',
    };
  },

  grantConsent: async (
    consentId: string,
    guardianId: string,
    guardianName: string,
    consentType: ConsentRecord['consentType'],
    categories: DataConsentCategory[]
  ): Promise<{ success: boolean; record: ConsentRecord | null }> => {
    const recordIndex = consentRecords.findIndex(r => r.id === consentId);
    if (recordIndex === -1) {
      return { success: false, record: null };
    }
    
    const record = consentRecords[recordIndex];
    const updatedRecord: ConsentRecord = {
      ...record,
      guardianId,
      guardianName,
      consentType,
      dataCategories: categories,
      grantedAt: new Date().toISOString(),
      status: 'granted',
    };
    
    consentRecords[recordIndex] = updatedRecord;
    
    await complianceService.logAuditEntry({
      action: 'consent_granted',
      resource: 'consent',
      resourceId: consentId,
      memberId: record.studentId,
      organizationId: record.organizationId,
      timestamp: new Date().toISOString(),
      riskLevel: 'LOW',
      status: 'ALLOWED',
      flagged: false,
      metadata: {
        guardianId,
        guardianName,
        consentType,
        categories,
      },
    });
    
    return { success: true, record: updatedRecord };
  },

  revokeConsent: async (
    consentId: string,
    reason?: string
  ): Promise<{ success: boolean }> => {
    const recordIndex = consentRecords.findIndex(r => r.id === consentId);
    if (recordIndex === -1) {
      return { success: false };
    }
    
    const record = consentRecords[recordIndex];
    consentRecords[recordIndex] = {
      ...record,
      status: 'revoked',
      revokedAt: new Date().toISOString(),
    };
    
    await complianceService.logAuditEntry({
      action: 'consent_revoked',
      resource: 'consent',
      resourceId: consentId,
      memberId: record.studentId,
      organizationId: record.organizationId,
      timestamp: new Date().toISOString(),
      riskLevel: 'MEDIUM',
      status: 'ALLOWED',
      flagged: false,
      metadata: { reason },
    });
    
    return { success: true };
  },

  checkFeatureAccess: async (
    student: Member,
    feature: 'chat' | 'gamification' | 'analytics'
  ): Promise<{ allowed: boolean; reason?: string }> => {
    const categoryMap: Record<string, DataConsentCategory> = {
      chat: 'communication',
      gamification: 'gamification',
      analytics: 'analytics',
    };
    
    const category = categoryMap[feature];
    if (!category) {
      return { allowed: true };
    }
    
    if (!consentService.needsGuardianConsent(student, category)) {
      return { allowed: true };
    }
    
    const hasConsent = await consentService.hasConsentForCategory(student.id, category);
    if (hasConsent) {
      return { allowed: true };
    }
    
    return {
      allowed: false,
      reason: `Guardian consent required for ${feature}. Please ask a parent or guardian to grant permission.`,
    };
  },

  getConsentSummary: async (studentId: string): Promise<{
    hasConsent: boolean;
    consentType: ConsentRecord['consentType'] | null;
    categories: DataConsentCategory[];
    guardianName: string | null;
    grantedAt: string | null;
  }> => {
    const consent = await consentService.getStudentConsent(studentId);
    if (!consent) {
      return {
        hasConsent: false,
        consentType: null,
        categories: [],
        guardianName: null,
        grantedAt: null,
      };
    }
    
    return {
      hasConsent: true,
      consentType: consent.consentType,
      categories: consent.dataCategories,
      guardianName: consent.guardianName,
      grantedAt: consent.grantedAt,
    };
  },

  createMockConsent: (studentId: string, organizationId: string): ConsentRecord => {
    const record: ConsentRecord = {
      id: `consent-mock-${studentId}`,
      studentId,
      guardianId: 'guardian-001',
      guardianName: 'Parent/Guardian',
      guardianEmail: 'guardian@example.com',
      organizationId,
      consentType: 'full',
      dataCategories: ['basic_info', 'academic', 'behavioral', 'communication', 'gamification'],
      grantedAt: new Date().toISOString(),
      status: 'granted',
      verificationMethod: 'portal',
    };
    
    const existing = consentRecords.findIndex(r => r.studentId === studentId);
    if (existing >= 0) {
      consentRecords[existing] = record;
    } else {
      consentRecords.push(record);
    }
    
    return record;
  },
};
