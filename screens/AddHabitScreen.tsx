import React, { useState } from "react";
import { StyleSheet, View, TextInput, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { HabitsStackParamList } from "@/navigation/HabitsStackNavigator";

const ICONS = [
  "sun", "moon", "star", "heart", "book", "coffee",
  "droplet", "activity", "target", "zap", "music", "camera",
];

const COLORS = [
  "#6366F1", "#8B5CF6", "#A78BFA", "#EC4899",
  "#10B981", "#22C55E", "#F59E0B", "#EF4444",
];

type AddHabitScreenProps = {
  navigation: NativeStackNavigationProp<HabitsStackParamList, "AddHabit">;
};

export default function AddHabitScreen({ navigation }: AddHabitScreenProps) {
  const { theme, isDark } = useTheme();
  const { addHabit } = useAppStore();
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("star");
  const [selectedColor, setSelectedColor] = useState("#6366F1");

  const handleSave = () => {
    if (!name.trim()) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addHabit({
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
    });
    navigation.goBack();
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Habit Name
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.backgroundDefault, color: theme.text },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Morning meditation"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          autoFocus
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Choose an Icon
        </ThemedText>
        <View style={styles.iconGrid}>
          {ICONS.map((icon) => (
            <Pressable
              key={icon}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedIcon(icon);
              }}
              style={[
                styles.iconButton,
                {
                  backgroundColor:
                    selectedIcon === icon ? selectedColor + "20" : theme.backgroundSecondary,
                  borderColor: selectedIcon === icon ? selectedColor : "transparent",
                  borderWidth: 2,
                },
              ]}
            >
              <Feather
                name={icon as keyof typeof Feather.glyphMap}
                size={24}
                color={selectedIcon === icon ? selectedColor : theme.textSecondary}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" style={styles.label}>
          Choose a Color
        </ThemedText>
        <View style={styles.colorGrid}>
          {COLORS.map((color) => (
            <Pressable
              key={color}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedColor(color);
              }}
              style={[
                styles.colorButton,
                {
                  backgroundColor: color,
                  borderWidth: selectedColor === color ? 3 : 0,
                  borderColor: theme.text,
                },
              ]}
            >
              {selectedColor === color ? (
                <Feather name="check" size={20} color="#FFFFFF" />
              ) : null}
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.preview}>
        <ThemedText type="small" style={styles.label}>
          Preview
        </ThemedText>
        <View style={[styles.previewCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={[styles.previewIcon, { backgroundColor: selectedColor + "20" }]}>
            <Feather
              name={selectedIcon as keyof typeof Feather.glyphMap}
              size={24}
              color={selectedColor}
            />
          </View>
          <ThemedText type="body">{name || "Your new habit"}</ThemedText>
        </View>
      </View>

      <Button onPress={handleSave} disabled={!name.trim()}>
        Create Habit
      </Button>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
    opacity: 0.8,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.body.fontSize,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    marginBottom: Spacing.xl,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
