import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/store/appStore";
import { Quest, gamificationService } from "@/services/gamificationService";
import { GlassCard } from "./GlassCard";
import { XPDashboard } from "./XPDashboard";
import { BorderRadius, Spacing } from "@/constants/theme";

interface SkillNodeProps {
  id: string;
  name: string;
  icon: keyof typeof Feather.glyphMap;
  level: number;
  maxLevel: number;
  color: string;
  isUnlocked: boolean;
  index: number;
}

function SkillNode({ name, icon, level, maxLevel, color, isUnlocked, index }: SkillNodeProps) {
  const theme = useTheme();
  const scale = useSharedValue(0.8);
  const glow = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(index * 100, withSpring(1, { damping: 12 }));
    if (isUnlocked && level === maxLevel) {
      glow.value = withDelay(index * 100 + 300, withSequence(
        withTiming(0.8, { duration: 300 }),
        withTiming(0.3, { duration: 1000 })
      ));
    }
  }, []);

  const nodeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  const progress = level / maxLevel;

  return (
    <Animated.View style={[styles.skillNode, nodeStyle]}>
      {isUnlocked && level === maxLevel && (
        <Animated.View
          style={[
            styles.skillGlow,
            { backgroundColor: color },
            glowStyle,
          ]}
        />
      )}
      <View
        style={[
          styles.skillCircle,
          {
            backgroundColor: isUnlocked ? `${color}20` : theme.secondary,
            borderColor: isUnlocked ? color : theme.border,
          },
        ]}
      >
        <Feather
          name={icon}
          size={24}
          color={isUnlocked ? color : theme.textSecondary}
        />
        {isUnlocked && (
          <View style={[styles.levelBadge, { backgroundColor: color }]}>
            <Text style={styles.levelText}>{level}</Text>
          </View>
        )}
      </View>
      <Text
        style={[
          styles.skillName,
          { color: isUnlocked ? theme.text : theme.textSecondary },
        ]}
      >
        {name}
      </Text>
      {isUnlocked && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: theme.secondary }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: color, width: `${progress * 100}%` },
              ]}
            />
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const SKILLS: SkillNodeProps[] = [
  { id: "math", name: "Math", icon: "hash", level: 3, maxLevel: 5, color: "#6366F1", isUnlocked: true, index: 0 },
  { id: "science", name: "Science", icon: "zap", level: 2, maxLevel: 5, color: "#22C55E", isUnlocked: true, index: 1 },
  { id: "reading", name: "Reading", icon: "book-open", level: 4, maxLevel: 5, color: "#EC4899", isUnlocked: true, index: 2 },
  { id: "writing", name: "Writing", icon: "edit-3", level: 1, maxLevel: 5, color: "#F59E0B", isUnlocked: true, index: 3 },
  { id: "history", name: "History", icon: "clock", level: 0, maxLevel: 5, color: "#8B5CF6", isUnlocked: false, index: 4 },
  { id: "art", name: "Art", icon: "image", level: 0, maxLevel: 5, color: "#14B8A6", isUnlocked: false, index: 5 },
];

export function SkillTree() {
  const theme = useTheme();

  return (
    <View style={styles.skillTreeContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Skill Tree</Text>
        <View style={styles.skillStats}>
          <Feather name="target" size={14} color={theme.accent} />
          <Text style={[styles.skillStatsText, { color: theme.accent }]}>
            4/6 Unlocked
          </Text>
        </View>
      </View>
      <GlassCard style={styles.skillTreeCard}>
        <View style={styles.skillGrid}>
          {SKILLS.map((skill) => (
            <SkillNode key={skill.id} {...skill} />
          ))}
        </View>
      </GlassCard>
    </View>
  );
}

interface StudyGroupProps {
  id: string;
  name: string;
  subject: string;
  memberCount: number;
  activeNow: number;
  color: string;
}

const STUDY_GROUPS: StudyGroupProps[] = [
  { id: "1", name: "Math Masters", subject: "Algebra", memberCount: 12, activeNow: 4, color: "#6366F1" },
  { id: "2", name: "Science Squad", subject: "Biology", memberCount: 8, activeNow: 2, color: "#22C55E" },
  { id: "3", name: "Book Club", subject: "Literature", memberCount: 15, activeNow: 0, color: "#EC4899" },
];

function StudyGroupCard({ group, index }: { group: StudyGroupProps; index: number }) {
  const theme = useTheme();

  const handleJoin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <Pressable onPress={handleJoin}>
        <GlassCard style={styles.groupCard}>
          <View style={styles.groupHeader}>
            <View
              style={[styles.groupIcon, { backgroundColor: `${group.color}20` }]}
            >
              <Feather name="users" size={18} color={group.color} />
            </View>
            <View style={styles.groupInfo}>
              <Text style={[styles.groupName, { color: theme.text }]}>
                {group.name}
              </Text>
              <Text style={[styles.groupSubject, { color: theme.textSecondary }]}>
                {group.subject}
              </Text>
            </View>
            {group.activeNow > 0 && (
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>{group.activeNow} online</Text>
              </View>
            )}
          </View>
          <View style={styles.groupFooter}>
            <Text style={[styles.memberCount, { color: theme.textSecondary }]}>
              <Feather name="user" size={12} /> {group.memberCount} members
            </Text>
            <Pressable
              style={[styles.joinButton, { backgroundColor: group.color }]}
            >
              <Text style={styles.joinText}>Join</Text>
            </Pressable>
          </View>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
}

export function StudyGroups() {
  const theme = useTheme();

  return (
    <View style={styles.studyGroupsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Study Groups</Text>
        <Pressable>
          <Text style={[styles.createText, { color: theme.accent }]}>
            + Create
          </Text>
        </Pressable>
      </View>
      {STUDY_GROUPS.map((group, index) => (
        <StudyGroupCard key={group.id} group={group} index={index} />
      ))}
    </View>
  );
}

export function StudentDashboard() {
  const quests = gamificationService.getQuests("education");

  return (
    <View style={styles.dashboardContainer}>
      <XPDashboard />
      
      <View style={styles.questsPreview}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Quests</Text>
          <View style={styles.questBadge}>
            <Text style={styles.questBadgeText}>
              {quests.filter(q => q.category === "daily").length} Active
            </Text>
          </View>
        </View>
        {quests.filter(q => q.category === "daily").slice(0, 2).map((quest, index) => (
          <Animated.View
            key={quest.id}
            entering={FadeIn.delay(index * 100)}
          >
            <GlassCard style={styles.miniQuest}>
              <View style={styles.miniQuestContent}>
                <View style={[styles.questIcon, { backgroundColor: "#22C55E20" }]}>
                  <Feather name="book-open" size={16} color="#22C55E" />
                </View>
                <View style={styles.questInfo}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questProgress}>
                    {quest.steps.filter(s => s.isCompleted).length}/{quest.steps.length} steps
                  </Text>
                </View>
                <View style={styles.questXP}>
                  <Feather name="zap" size={12} color="#F59E0B" />
                  <Text style={styles.questXPText}>+{quest.xpReward}</Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        ))}
      </View>

      <SkillTree />
      <StudyGroups />
    </View>
  );
}

const styles = StyleSheet.create({
  dashboardContainer: {
    gap: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  skillStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  skillStatsText: {
    fontSize: 13,
    fontWeight: "600",
  },
  skillTreeContainer: {},
  skillTreeCard: {
    padding: Spacing.lg,
  },
  skillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  skillNode: {
    width: "30%",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  skillGlow: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    top: 0,
  },
  skillCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  levelBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  levelText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  skillName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  progressContainer: {
    width: "100%",
    paddingHorizontal: 4,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  studyGroupsContainer: {},
  groupCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 15,
    fontWeight: "600",
  },
  groupSubject: {
    fontSize: 12,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  activeText: {
    fontSize: 11,
    color: "#22C55E",
    fontWeight: "500",
  },
  groupFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberCount: {
    fontSize: 12,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  joinText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  createText: {
    fontSize: 14,
    fontWeight: "600",
  },
  questsPreview: {},
  questBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22C55E",
  },
  miniQuest: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  miniQuestContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  questIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F8FAFC",
  },
  questProgress: {
    fontSize: 12,
    color: "#94A3B8",
  },
  questXP: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  questXPText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#F59E0B",
  },
});
