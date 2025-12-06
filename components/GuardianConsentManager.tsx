import React, { useState, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import Animated, { FadeInDown, FadeInUp, SlideInRight } from "react-native-reanimated";
import {
  Shield,
  UserCheck,
  Clock,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Send,
  RefreshCw,
  ChevronRight,
  Lock,
  Inbox,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useAppStore, useTheme } from "@/store/appStore";
import { Spacing, BorderRadius } from "@/constants/theme";

interface ConsentRecord {
  id: string;
  studentName: string;
  studentGrade: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  consentType: "full" | "limited" | "communication_only" | "none";
  status: "active" | "pending" | "expired" | "revoked";
  grantedAt?: string;
  expiresAt?: string;
  categories: {
    basic_info: boolean;
    academic: boolean;
    behavioral: boolean;
    communication: boolean;
    gamification: boolean;
    analytics: boolean;
  };
}


function ConsentStatusBadge({ status }: { status: ConsentRecord["status"] }) {
  const colors = {
    active: { bg: "#DCFCE7", text: "#22C55E" },
    pending: { bg: "#FEF3C7", text: "#F59E0B" },
    expired: { bg: "#FEE2E2", text: "#EF4444" },
    revoked: { bg: "#F1F5F9", text: "#64748B" },
  };

  const labels = {
    active: "Active",
    pending: "Pending",
    expired: "Expired",
    revoked: "Revoked",
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: colors[status].bg }]}>
      <Text style={{ fontSize: 11, fontWeight: "600", color: colors[status].text }}>
        {labels[status]}
      </Text>
    </View>
  );
}

function ConsentCard({ 
  record, 
  onSendReminder, 
  onViewDetails,
  onRenew 
}: { 
  record: ConsentRecord;
  onSendReminder: () => void;
  onViewDetails: () => void;
  onRenew: () => void;
}) {
  const theme = useTheme();

  const consentTypeLabels = {
    full: "Full Access",
    limited: "Limited Access",
    communication_only: "Communication Only",
    none: "No Consent",
  };

  const consentTypeColors = {
    full: "#22C55E",
    limited: "#3B82F6",
    communication_only: "#8B5CF6",
    none: "#EF4444",
  };

  return (
    <View style={[styles.consentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.consentHeader}>
        <View style={styles.studentInfo}>
          <Text style={[styles.studentName, { color: theme.text }]}>{record.studentName}</Text>
          <Text style={[styles.studentGrade, { color: theme.textSecondary }]}>
            {record.studentGrade} Grade
          </Text>
        </View>
        <ConsentStatusBadge status={record.status} />
      </View>

      <View style={styles.guardianInfo}>
        <View style={styles.guardianRow}>
          <UserCheck size={14} color={theme.textSecondary} />
          <Text style={[styles.guardianText, { color: theme.textSecondary }]}>
            {record.guardianName}
          </Text>
        </View>
        <View style={styles.guardianRow}>
          <Mail size={14} color={theme.textSecondary} />
          <Text style={[styles.guardianText, { color: theme.textSecondary }]}>
            {record.guardianEmail}
          </Text>
        </View>
      </View>

      <View style={styles.consentTypeRow}>
        <View style={[styles.consentTypeBadge, { backgroundColor: consentTypeColors[record.consentType] + "20" }]}>
          <Lock size={12} color={consentTypeColors[record.consentType]} />
          <Text style={{ fontSize: 12, color: consentTypeColors[record.consentType], fontWeight: "600", marginLeft: 4 }}>
            {consentTypeLabels[record.consentType]}
          </Text>
        </View>
        {record.expiresAt && (
          <Text style={[styles.expiresText, { color: record.status === "expired" ? "#EF4444" : theme.textSecondary }]}>
            {record.status === "expired" ? "Expired" : "Expires"}: {record.expiresAt}
          </Text>
        )}
      </View>

      <View style={styles.consentActions}>
        {record.status === "pending" && (
          <Pressable onPress={onSendReminder} style={[styles.actionBtn, { backgroundColor: "#F1F5F9" }]}>
            <Send size={14} color="#64748B" />
            <Text style={{ color: "#64748B", fontSize: 12, fontWeight: "500" }}>Send Reminder</Text>
          </Pressable>
        )}
        {record.status === "expired" && (
          <Pressable onPress={onRenew} style={[styles.actionBtn, { backgroundColor: "#DBEAFE" }]}>
            <RefreshCw size={14} color="#3B82F6" />
            <Text style={{ color: "#3B82F6", fontSize: 12, fontWeight: "500" }}>Renew</Text>
          </Pressable>
        )}
        <Pressable onPress={onViewDetails} style={[styles.actionBtn, { backgroundColor: "#F1F5F9", flex: 1 }]}>
          <FileText size={14} color="#64748B" />
          <Text style={{ color: "#64748B", fontSize: 12, fontWeight: "500" }}>View Details</Text>
          <ChevronRight size={14} color="#64748B" />
        </Pressable>
      </View>
    </View>
  );
}

function ConsentStats({ records }: { records: ConsentRecord[] }) {
  const theme = useTheme();
  
  const stats = {
    active: records.filter(r => r.status === "active").length,
    pending: records.filter(r => r.status === "pending").length,
    expired: records.filter(r => r.status === "expired").length,
    total: records.length,
  };

  const complianceRate = Math.round((stats.active / stats.total) * 100);

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={[styles.statsCard, { backgroundColor: "#8B5CF6" }]}>
      <View style={styles.statsHeader}>
        <Shield size={24} color="#FFFFFF" />
        <Text style={styles.statsTitle}>Consent Compliance</Text>
      </View>
      <Text style={styles.statsSubtitle}>FERPA & COPPA Status</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{complianceRate}%</Text>
          <Text style={styles.statLabel}>Compliant</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: "#FCD34D" }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: "#FCA5A5" }]}>{stats.expired}</Text>
          <Text style={styles.statLabel}>Expired</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export function GuardianConsentManager() {
  const theme = useTheme();
  const { members, isLoading } = useAppStore();
  const [consentStatusMap, setConsentStatusMap] = useState<Record<string, ConsentRecord["status"]>>({});
  const [consentTypeMap, setConsentTypeMap] = useState<Record<string, ConsentRecord["consentType"]>>({});
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "expired">("all");

  const records = useMemo((): ConsentRecord[] => {
    const studentMembers = members.filter(m => m.role === "student" || m.role === "employee");
    
    return studentMembers.map((student, idx): ConsentRecord => {
      const status = consentStatusMap[student.id] || (idx < 2 ? "active" : idx === 2 ? "pending" : "expired");
      const consentType = consentTypeMap[student.id] || (idx < 2 ? "full" : idx === 2 ? "none" : "limited");
      
      return {
        id: student.id,
        studentName: student.name,
        studentGrade: `${student.metadata.gradeLevel || 5}th`,
        guardianName: `Guardian of ${student.name.split(" ")[0]}`,
        guardianEmail: `guardian${idx}@email.com`,
        guardianPhone: `(555) ${100 + idx}-${1000 + idx}`,
        consentType,
        status,
        grantedAt: status === "active" ? "2024-09-01" : undefined,
        expiresAt: status === "active" || status === "expired" ? "2025-08-31" : undefined,
        categories: {
          basic_info: consentType === "full" || consentType === "limited",
          academic: consentType === "full" || consentType === "limited",
          behavioral: consentType === "full",
          communication: consentType === "full" || consentType === "communication_only",
          gamification: consentType === "full",
          analytics: consentType === "full",
        },
      };
    });
  }, [members, consentStatusMap, consentTypeMap]);

  const filteredRecords = filter === "all" 
    ? records 
    : records.filter(r => r.status === filter);

  const handleSendReminder = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleViewDetails = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleRenew = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setConsentStatusMap(prev => ({ ...prev, [id]: "pending" }));
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: theme.textSecondary }}>Loading consent records...</Text>
      </View>
    );
  }

  if (records.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", gap: Spacing.md }]}>
        <Inbox size={48} color={theme.textSecondary} />
        <Text style={{ color: theme.textSecondary, fontSize: 16 }}>No consent records found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ConsentStats records={records} />

      <View style={styles.filterRow}>
        {(["all", "active", "pending", "expired"] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFilter(f);
            }}
            style={[
              styles.filterBtn,
              filter === f && { backgroundColor: "#8B5CF6" },
            ]}
          >
            <Text style={[
              styles.filterText,
              { color: filter === f ? "#FFFFFF" : theme.textSecondary },
            ]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Consent Records ({filteredRecords.length})
      </Text>

      {filteredRecords.map((record, index) => (
        <Animated.View key={record.id} entering={FadeInDown.delay(100 + index * 50).duration(400)}>
          <ConsentCard
            record={record}
            onSendReminder={() => handleSendReminder(record.id)}
            onViewDetails={() => handleViewDetails(record.id)}
            onRenew={() => handleRenew(record.id)}
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  statsCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statsSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  filterRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  filterBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: "#F1F5F9",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  consentCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  consentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  studentInfo: {},
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  studentGrade: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  guardianInfo: {
    gap: 6,
    marginBottom: Spacing.md,
  },
  guardianRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  guardianText: {
    fontSize: 13,
  },
  consentTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  consentTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  expiresText: {
    fontSize: 12,
  },
  consentActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
});

export default GuardianConsentManager;
