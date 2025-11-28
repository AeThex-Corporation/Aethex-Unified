import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { 
  QrCode, 
  CheckCircle, 
  Hexagon, 
  Shield, 
  Star, 
  Zap,
  Award,
  Target,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { useAppStore, useTheme, useFeatures } from '@/store/appStore';

interface Skill {
  name: string;
  level: number;
  color: string;
}

interface EnhancedPassportProps {
  onShare?: () => void;
}

export function EnhancedPassport({ onShare }: EnhancedPassportProps) {
  const theme = useTheme();
  const features = useFeatures();
  const { currentMember, marketContext, getTotalXP, skillNodes } = useAppStore();
  
  const isEducation = marketContext === 'education';
  const totalXP = getTotalXP();
  const unlockedSkills = skillNodes.filter(s => s.isUnlocked).length;
  const userLevel = Math.floor(totalXP / 100) + 1;

  const glowOpacity = useSharedValue(0.3);
  const ringRotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    ringRotation.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1
    );

    pulseScale.value = withRepeat(
      withSequence(
        withSpring(1.05, { damping: 10 }),
        withSpring(1, { damping: 10 })
      ),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const skills: Skill[] = isEducation ? [
    { name: 'Math', level: 85, color: '#8b5cf6' },
    { name: 'Science', level: 72, color: '#22c55e' },
    { name: 'English', level: 90, color: '#3b82f6' },
    { name: 'History', level: 65, color: '#f59e0b' },
    { name: 'Art', level: 55, color: '#ec4899' },
    { name: 'Code', level: 78, color: '#06b6d4' },
  ] : [
    { name: 'React', level: 90, color: '#61dafb' },
    { name: 'Python', level: 85, color: '#3776ab' },
    { name: 'Node.js', level: 70, color: '#339933' },
    { name: 'Design', level: 60, color: '#ec4899' },
    { name: 'Rust', level: 40, color: '#f74c00' },
    { name: 'Solidity', level: 30, color: '#627eea' },
  ];

  const avatar = currentMember?.avatar || currentMember?.name?.split(' ').map(n => n[0]).join('') || '??';

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glowOverlay, glowStyle]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#22c55e' }]} />
      </Animated.View>

      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Animated.View style={[styles.levelRing, ringStyle]}>
              <View style={styles.dashedRing} />
            </Animated.View>
            
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatar}</Text>
            </View>

            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>LVL {userLevel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.passportLabel}>
            {isEducation ? 'STUDENT PASSPORT' : 'AETHEX PASSPORT'}
          </Text>
          <Text style={styles.userName}>{currentMember?.name || 'Unknown'}</Text>
          <View style={styles.verifiedRow}>
            <CheckCircle size={14} color="#22c55e" />
            <Text style={styles.verifiedText}>
              {isEducation ? 'Verified Student' : 'Verified Architect'}
            </Text>
          </View>
          <Text style={styles.uidText}>
            UID: {currentMember?.id?.slice(0, 8) || 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.qrSection}>
        <Animated.View style={pulseStyle}>
          <View style={styles.qrContainer}>
            <QrCode size={100} color="#22c55e" />
            <View style={styles.qrOverlay} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Zap size={20} color="#22c55e" />
          <Text style={styles.statValue}>{totalXP}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Target size={20} color="#f59e0b" />
          <Text style={styles.statValue}>{unlockedSkills}</Text>
          <Text style={styles.statLabel}>Skills</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Award size={20} color="#8b5cf6" />
          <Text style={styles.statValue}>{isEducation ? 'A+' : '4.9'}</Text>
          <Text style={styles.statLabel}>{isEducation ? 'Grade' : 'Rating'}</Text>
        </View>
      </View>

      {features.skillTree && (
        <View style={styles.skillSection}>
          <Text style={styles.sectionTitle}>SKILL_MATRIX</Text>
          <View style={styles.skillGrid}>
            {skills.map((skill, index) => (
              <Animated.View
                key={skill.name}
                entering={FadeInDown.delay(100 * index).duration(400)}
                style={styles.skillHex}
              >
                <View style={[styles.hexInner, { borderColor: skill.color }]}>
                  <Text style={[styles.skillLevel, { color: skill.color }]}>
                    {skill.level}
                  </Text>
                  <Text style={styles.skillName}>{skill.name}</Text>
                </View>
                <View 
                  style={[
                    styles.skillProgress,
                    { 
                      width: `${skill.level}%`,
                      backgroundColor: skill.color + '40',
                    }
                  ]} 
                />
              </Animated.View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.statusRow}>
          <Shield size={16} color="#22c55e" />
          <Text style={styles.statusText}>
            {isEducation ? 'FERPA Protected' : 'Verified & Trusted'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B0A0F',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#22c55e',
    overflow: 'hidden',
    position: 'relative',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
    zIndex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelRing: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: '#22c55e50',
    borderStyle: 'dashed',
  },
  dashedRing: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
    borderWidth: 2,
    borderColor: '#22c55e30',
    borderStyle: 'dashed',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0B0A0F',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0A0F',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0B0A0F',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  passportLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#64748b',
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
  },
  uidText: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#13131a',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  qrContainer: {
    position: 'relative',
    padding: 16,
    backgroundColor: '#1a1a24',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2d2d3a',
  },
  qrOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#22c55e05',
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#13131a',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2d2d3a',
  },
  skillSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#64748b',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d3a',
    paddingBottom: 8,
  },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  skillHex: {
    width: '30%',
    aspectRatio: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  hexInner: {
    flex: 1,
    backgroundColor: '#1a1a24',
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  skillLevel: {
    fontSize: 20,
    fontWeight: '700',
  },
  skillName: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  skillProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    borderRadius: 2,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2d2d3a',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
  },
});

export default EnhancedPassport;
