import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useAppStore } from '../store/appStore';
import { consentService } from '../services/consentService';
import type { DataConsentCategory } from '../types/domain';

interface Props {
  feature: 'chat' | 'gamification' | 'analytics';
  onRequestConsent?: () => void;
}

export function GuardianConsentBanner({ feature, onRequestConsent }: Props) {
  const { currentMember, marketContext } = useAppStore();
  const [hasConsent, setHasConsent] = React.useState<boolean | null>(null);
  const [reason, setReason] = React.useState<string>('');

  React.useEffect(() => {
    checkConsent();
  }, [currentMember, feature]);

  const checkConsent = async () => {
    if (!currentMember || marketContext !== 'education') {
      setHasConsent(true);
      return;
    }

    const result = await consentService.checkFeatureAccess(currentMember, feature);
    setHasConsent(result.allowed);
    setReason(result.reason || '');
  };

  if (hasConsent === null || hasConsent || marketContext !== 'education') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name="shield" size={20} color="#f59e0b" />
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Guardian Consent Required</ThemedText>
        <ThemedText style={styles.message}>{reason}</ThemedText>
        {onRequestConsent ? (
          <Pressable style={styles.button} onPress={onRequestConsent}>
            <ThemedText style={styles.buttonText}>Request Permission</ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

interface ConsentStatusProps {
  studentId: string;
}

export function ConsentStatus({ studentId }: ConsentStatusProps) {
  const [summary, setSummary] = React.useState<{
    hasConsent: boolean;
    consentType: string | null;
    categories: DataConsentCategory[];
    guardianName: string | null;
    grantedAt: string | null;
  } | null>(null);

  React.useEffect(() => {
    loadSummary();
  }, [studentId]);

  const loadSummary = async () => {
    const data = await consentService.getConsentSummary(studentId);
    setSummary(data);
  };

  if (!summary) {
    return null;
  }

  if (!summary.hasConsent) {
    return (
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, styles.pendingBadge]}>
          <Feather name="clock" size={14} color="#f59e0b" />
          <ThemedText style={[styles.statusText, styles.pendingText]}>
            Consent Pending
          </ThemedText>
        </View>
        <ThemedText style={styles.statusDescription}>
          A parent or guardian has not yet granted permission for this account.
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.statusContainer}>
      <View style={[styles.statusBadge, styles.grantedBadge]}>
        <Feather name="check-circle" size={14} color="#22c55e" />
        <ThemedText style={[styles.statusText, styles.grantedText]}>
          Consent Granted
        </ThemedText>
      </View>
      <ThemedText style={styles.statusDescription}>
        {summary.guardianName} granted {summary.consentType} access
        {summary.grantedAt
          ? ` on ${new Date(summary.grantedAt).toLocaleDateString()}`
          : ''}
      </ThemedText>
      <View style={styles.categoriesContainer}>
        {summary.categories.map((cat) => (
          <View key={cat} style={styles.categoryTag}>
            <ThemedText style={styles.categoryText}>
              {cat.replace('_', ' ')}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  iconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  statusContainer: {
    padding: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    gap: 6,
  },
  pendingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  grantedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pendingText: {
    color: '#f59e0b',
  },
  grantedText: {
    color: '#22c55e',
  },
  statusDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  categoryTag: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    color: '#8b5cf6',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
