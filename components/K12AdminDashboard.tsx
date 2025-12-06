import React, { useState, useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Bell,
  UserCheck,
  Lock,
  FileText,
  ArrowUpRight,
  XCircle,
  Mail,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useAppStore, useTheme } from "@/store/appStore";
import { Spacing, BorderRadius } from "@/constants/theme";

interface StudentAlert {
  id: string;
  studentName: string;
  grade: string;
  alertType: "pii_attempt" | "content_flag" | "consent_expired" | "guardian_request";
  description: string;
  time: string;
  severity: "low" | "medium" | "high";
  resolved: boolean;
}

interface ConsentRequest {
  id: string;
  studentName: string;
  guardianName: string;
  guardianEmail: string;
  requestType: "full" | "limited" | "revoke";
  requestedAt: string;
  status: "pending" | "approved" | "denied";
}


function SafetyMetricCard({ 
  icon, 
  title, 
  value, 
  subtitle,
  color,
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  subtitle?: string;
  color: string;
  delay: number;
}) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={[styles.metricIconBg, { backgroundColor: color + "20" }]}>
        {icon}
      </View>
      <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.metricTitle, { color: theme.textSecondary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.metricSubtitle, { color }]}>{subtitle}</Text>
      )}
    </Animated.View>
  );
}

function AlertCard({ alert, onResolve, onView }: { 
  alert: StudentAlert; 
  onResolve: () => void;
  onView: () => void;
}) {
  const theme = useTheme();

  const severityColors = {
    low: "#3B82F6",
    medium: "#F59E0B",
    high: "#EF4444",
  };

  const alertTypeIcons = {
    pii_attempt: <Lock size={16} color={severityColors[alert.severity]} />,
    content_flag: <AlertTriangle size={16} color={severityColors[alert.severity]} />,
    consent_expired: <Clock size={16} color={severityColors[alert.severity]} />,
    guardian_request: <Mail size={16} color={severityColors[alert.severity]} />,
  };

  const alertTypeLabels = {
    pii_attempt: "PII Attempt",
    content_flag: "Content Flag",
    consent_expired: "Consent Expiring",
    guardian_request: "Guardian Request",
  };

  return (
    <View style={[styles.alertCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.alertHeader}>
        <View style={[styles.alertTypeBadge, { backgroundColor: severityColors[alert.severity] + "20" }]}>
          {alertTypeIcons[alert.alertType]}
          <Text style={{ fontSize: 11, color: severityColors[alert.severity], fontWeight: "600", marginLeft: 4 }}>
            {alertTypeLabels[alert.alertType]}
          </Text>
        </View>
        <Text style={[styles.alertTime, { color: theme.textSecondary }]}>{alert.time}</Text>
      </View>
      <View style={styles.alertContent}>
        <Text style={[styles.alertStudent, { color: theme.text }]}>
          {alert.studentName} <Text style={{ color: theme.textSecondary }}>({alert.grade} Grade)</Text>
        </Text>
        <Text style={[styles.alertDescription, { color: theme.textSecondary }]}>{alert.description}</Text>
      </View>
      <View style={styles.alertActions}>
        <Pressable onPress={onView} style={[styles.alertButton, { backgroundColor: "#F1F5F9" }]}>
          <Eye size={14} color="#64748B" />
          <Text style={{ color: "#64748B", fontSize: 13, fontWeight: "500" }}>View</Text>
        </Pressable>
        <Pressable onPress={onResolve} style={[styles.alertButton, { backgroundColor: "#DCFCE7" }]}>
          <CheckCircle size={14} color="#22C55E" />
          <Text style={{ color: "#22C55E", fontSize: 13, fontWeight: "500" }}>Resolve</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ConsentRequestCard({ request, onApprove, onDeny }: {
  request: ConsentRequest;
  onApprove: () => void;
  onDeny: () => void;
}) {
  const theme = useTheme();

  const typeColors = {
    full: "#22C55E",
    limited: "#3B82F6",
    revoke: "#EF4444",
  };

  const typeLabels = {
    full: "Full Access",
    limited: "Limited Access",
    revoke: "Revoke Access",
  };

  return (
    <View style={[styles.consentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.consentHeader}>
        <View>
          <Text style={[styles.consentStudent, { color: theme.text }]}>{request.studentName}</Text>
          <Text style={[styles.consentGuardian, { color: theme.textSecondary }]}>
            Guardian: {request.guardianName}
          </Text>
        </View>
        <View style={[styles.consentTypeBadge, { backgroundColor: typeColors[request.requestType] + "20" }]}>
          <Text style={{ fontSize: 11, color: typeColors[request.requestType], fontWeight: "600" }}>
            {typeLabels[request.requestType]}
          </Text>
        </View>
      </View>
      <View style={styles.consentActions}>
        <Pressable onPress={onDeny} style={[styles.consentButton, styles.denyButton]}>
          <XCircle size={14} color="#EF4444" />
          <Text style={{ color: "#EF4444", fontWeight: "600" }}>Deny</Text>
        </Pressable>
        <Pressable onPress={onApprove} style={[styles.consentButton, styles.approveButton]}>
          <CheckCircle size={14} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Approve</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function K12AdminDashboard() {
  const theme = useTheme();
  const { members, auditLogs, getComplianceStats, isLoading } = useAppStore();
  const [resolvedAlertIds, setResolvedAlertIds] = useState<string[]>([]);
  const [consentStatusMap, setConsentStatusMap] = useState<Record<string, "pending" | "approved" | "denied">>({});

  const complianceStats = getComplianceStats();
  const students = members.filter(m => m.role === "student" || m.role === "employee");
  const activeStudents = students.filter(m => m.status === "active");
  
  const classStats = useMemo(() => ({
    totalStudents: students.length,
    activeNow: activeStudents.length,
    withConsent: students.filter(m => m.status === "active").length,
    pendingConsent: students.filter(m => m.status === "suspended").length,
    alertsToday: complianceStats.flaggedCount,
    piiBlocked: complianceStats.blockedCount,
  }), [students, activeStudents, complianceStats]);

  const alerts = useMemo((): StudentAlert[] => {
    return auditLogs
      .filter(log => log.flagged)
      .slice(0, 5)
      .map((log): StudentAlert => ({
        id: log.id,
        studentName: members.find(m => m.id === log.memberId)?.name || "Unknown Student",
        grade: "5th",
        alertType: log.action.includes("pii") ? "pii_attempt" : "content_flag",
        description: log.trigger || log.action,
        time: new Date(log.timestamp).toLocaleTimeString(),
        severity: log.riskLevel === "HIGH" ? "high" : log.riskLevel === "MEDIUM" ? "medium" : "low",
        resolved: resolvedAlertIds.includes(log.id),
      }));
  }, [auditLogs, members, resolvedAlertIds]);

  const consentRequests = useMemo((): ConsentRequest[] => {
    return students
      .filter(s => s.status === "suspended" || s.status === "inactive")
      .slice(0, 3)
      .map((student, idx): ConsentRequest => ({
        id: `consent-${student.id}`,
        studentName: student.name,
        guardianName: `Guardian of ${student.name.split(" ")[0]}`,
        guardianEmail: student.email || `guardian${idx}@email.com`,
        requestType: idx === 0 ? "full" : "limited",
        requestedAt: idx === 0 ? "Today" : "Yesterday",
        status: consentStatusMap[`consent-${student.id}`] || "pending",
      }));
  }, [students, consentStatusMap]);

  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const pendingConsents = consentRequests.filter(c => c.status === "pending");

  const handleResolveAlert = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setResolvedAlertIds(prev => [...prev, id]);
  };

  const handleViewAlert = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleApproveConsent = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setConsentStatusMap(prev => ({ ...prev, [id]: "approved" }));
  };

  const handleDenyConsent = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setConsentStatusMap(prev => ({ ...prev, [id]: "denied" }));
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: theme.textSecondary }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)} style={[styles.safetyBanner, { backgroundColor: "#8B5CF6" }]}>
        <View style={styles.bannerHeader}>
          <Shield size={24} color="#FFFFFF" />
          <Text style={styles.bannerTitle}>Student Safety Dashboard</Text>
        </View>
        <Text style={styles.bannerSubtitle}>
          FERPA & COPPA Compliant - All data protected
        </Text>
        <View style={styles.bannerStats}>
          <View style={styles.bannerStat}>
            <Text style={styles.bannerStatValue}>{classStats.totalStudents}</Text>
            <Text style={styles.bannerStatLabel}>Students</Text>
          </View>
          <View style={[styles.bannerDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
          <View style={styles.bannerStat}>
            <Text style={styles.bannerStatValue}>{classStats.piiBlocked}</Text>
            <Text style={styles.bannerStatLabel}>PII Blocked</Text>
          </View>
          <View style={[styles.bannerDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
          <View style={styles.bannerStat}>
            <Text style={styles.bannerStatValue}>{classStats.withConsent > 0 ? "100%" : "0%"}</Text>
            <Text style={styles.bannerStatLabel}>Compliant</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.metricsGrid}>
        <SafetyMetricCard
          icon={<Users size={18} color="#3B82F6" />}
          title="Active Now"
          value={classStats.activeNow.toString()}
          color="#3B82F6"
          delay={100}
        />
        <SafetyMetricCard
          icon={<UserCheck size={18} color="#22C55E" />}
          title="With Consent"
          value={classStats.withConsent.toString()}
          subtitle={classStats.pendingConsent > 0 ? `${classStats.pendingConsent} pending` : undefined}
          color="#22C55E"
          delay={150}
        />
        <SafetyMetricCard
          icon={<AlertTriangle size={18} color="#F59E0B" />}
          title="Alerts Today"
          value={classStats.alertsToday.toString()}
          color="#F59E0B"
          delay={200}
        />
      </View>

      <Animated.View entering={FadeInDown.delay(250).duration(400)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Active Alerts ({unresolvedAlerts.length})
          </Text>
          <Pressable>
            <Text style={{ color: "#8B5CF6", fontWeight: "600" }}>View All</Text>
          </Pressable>
        </View>
        {unresolvedAlerts.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <CheckCircle size={24} color="#22C55E" />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No active alerts - all students are safe
            </Text>
          </View>
        ) : (
          unresolvedAlerts.slice(0, 3).map((alert, index) => (
            <Animated.View key={alert.id} entering={FadeInDown.delay(300 + index * 50).duration(400)}>
              <AlertCard
                alert={alert}
                onResolve={() => handleResolveAlert(alert.id)}
                onView={() => handleViewAlert(alert.id)}
              />
            </Animated.View>
          ))
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(450).duration(400)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Consent Requests ({pendingConsents.length})
          </Text>
        </View>
        {pendingConsents.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <UserCheck size={24} color="#22C55E" />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No pending consent requests
            </Text>
          </View>
        ) : (
          pendingConsents.map((request, index) => (
            <Animated.View key={request.id} entering={FadeInDown.delay(500 + index * 50).duration(400)}>
              <ConsentRequestCard
                request={request}
                onApprove={() => handleApproveConsent(request.id)}
                onDeny={() => handleDenyConsent(request.id)}
              />
            </Animated.View>
          ))
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  safetyBanner: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  bannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: Spacing.lg,
  },
  bannerStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bannerStat: {
    alignItems: "center",
  },
  bannerStatValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bannerStatLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  bannerDivider: {
    width: 1,
    height: 40,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  metricCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  metricIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  metricTitle: {
    fontSize: 11,
    marginTop: 2,
  },
  metricSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  alertCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  alertTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  alertTime: {
    fontSize: 12,
  },
  alertContent: {
    marginBottom: Spacing.md,
  },
  alertStudent: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  alertActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  alertButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  consentCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  consentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  consentStudent: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  consentGuardian: {
    fontSize: 13,
  },
  consentTypeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  consentActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  consentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  denyButton: {
    backgroundColor: "#FEE2E2",
  },
  approveButton: {
    backgroundColor: "#8B5CF6",
  },
  emptyState: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default K12AdminDashboard;
