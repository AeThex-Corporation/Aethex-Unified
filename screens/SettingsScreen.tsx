import React, { useState } from "react";
import { StyleSheet, View, Switch, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

interface SettingRowProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
}

function SettingRow({ icon, title, subtitle, trailing, onPress }: SettingRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingRow,
        { backgroundColor: theme.backgroundDefault, opacity: pressed && onPress ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.settingIcon, { backgroundColor: theme.primary + "20" }]}>
        <Feather name={icon} size={20} color={theme.primary} />
      </View>
      <View style={styles.settingContent}>
        <ThemedText type="body">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {trailing}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  return (
    <ScreenScrollView>
      <View style={styles.section}>
        <ThemedText type="small" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          PREFERENCES
        </ThemedText>
        <View style={[styles.sectionContent, { backgroundColor: theme.backgroundDefault }, Shadows.card]}>
          <SettingRow
            icon="bell"
            title="Notifications"
            subtitle="Daily reminders"
            trailing={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon="smartphone"
            title="Haptic Feedback"
            subtitle="Vibration on actions"
            trailing={
              <Switch
                value={hapticEnabled}
                onValueChange={setHapticEnabled}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="small" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          DATA
        </ThemedText>
        <View style={[styles.sectionContent, { backgroundColor: theme.backgroundDefault }, Shadows.card]}>
          <SettingRow
            icon="download"
            title="Export Data"
            subtitle="Download all your data"
            onPress={() => {}}
            trailing={<Feather name="chevron-right" size={20} color={theme.textSecondary} />}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon="refresh-cw"
            title="Reset Progress"
            subtitle="Clear all module data"
            onPress={() => {}}
            trailing={<Feather name="chevron-right" size={20} color={theme.textSecondary} />}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="small" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          ABOUT
        </ThemedText>
        <View style={[styles.sectionContent, { backgroundColor: theme.backgroundDefault }, Shadows.card]}>
          <SettingRow
            icon="info"
            title="Version"
            trailing={
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                1.0.0
              </ThemedText>
            }
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon="heart"
            title="Made with love"
            subtitle="Aethex Team"
          />
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
    fontWeight: "600",
  },
  sectionContent: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  settingContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
});
