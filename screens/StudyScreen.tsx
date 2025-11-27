import React, { useState } from "react";
import { StyleSheet, View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows, Typography, ModuleColors } from "@/constants/theme";
import { useAppStore } from "@/store/AppStore";
import { StudyStackParamList } from "@/navigation/StudyStackNavigator";

type StudyScreenProps = {
  navigation: NativeStackNavigationProp<StudyStackParamList, "Study">;
};

const SAMPLE_FLASHCARDS = [
  { question: "What is photosynthesis?", answer: "The process by which plants convert sunlight into energy" },
  { question: "What is the mitochondria?", answer: "The powerhouse of the cell that produces ATP" },
  { question: "What is DNA?", answer: "Deoxyribonucleic acid - carries genetic information" },
  { question: "What is osmosis?", answer: "Movement of water molecules through a membrane" },
  { question: "What is metabolism?", answer: "Chemical processes that occur within a living organism" },
];

const SAMPLE_QUIZ = [
  { question: "What organelle is responsible for photosynthesis?", options: ["Mitochondria", "Chloroplast", "Ribosome", "Nucleus"], correct: 1 },
  { question: "Which molecule carries genetic information?", options: ["RNA", "ATP", "DNA", "Protein"], correct: 2 },
  { question: "What is the basic unit of life?", options: ["Atom", "Molecule", "Cell", "Organ"], correct: 2 },
];

export default function StudyScreen({ navigation }: StudyScreenProps) {
  const { theme, isDark } = useTheme();
  const { state, addStudySet } = useAppStore();
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [studyType, setStudyType] = useState<"flashcards" | "quiz">("flashcards");

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (studyType === "flashcards") {
      addStudySet({
        topic: topic.trim(),
        type: "flashcards",
        cards: SAMPLE_FLASHCARDS,
      });
      navigation.navigate("Flashcards", { topic: topic.trim(), cards: SAMPLE_FLASHCARDS });
    } else {
      addStudySet({
        topic: topic.trim(),
        type: "quiz",
        questions: SAMPLE_QUIZ,
      });
      navigation.navigate("Quiz", { topic: topic.trim(), questions: SAMPLE_QUIZ });
    }
    
    setIsLoading(false);
    setTopic("");
  };

  return (
    <ScreenScrollView>
      <View style={[styles.generateCard, { backgroundColor: theme.backgroundDefault }, Shadows.card]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: ModuleColors.study + "20" }]}>
            <Feather name="cpu" size={24} color={ModuleColors.study} />
          </View>
          <View style={styles.headerText}>
            <ThemedText type="h4">AI Study Generator</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Create flashcards or quizzes on any topic
            </ThemedText>
          </View>
        </View>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.backgroundSecondary, color: theme.text },
          ]}
          value={topic}
          onChangeText={setTopic}
          placeholder="Enter a topic (e.g., Biology, History)"
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
        />

        <View style={styles.typeSelector}>
          <Pressable
            onPress={() => setStudyType("flashcards")}
            style={[
              styles.typeButton,
              {
                backgroundColor: studyType === "flashcards" ? ModuleColors.study + "20" : theme.backgroundSecondary,
                borderColor: studyType === "flashcards" ? ModuleColors.study : "transparent",
                borderWidth: 2,
              },
            ]}
          >
            <Feather
              name="layers"
              size={20}
              color={studyType === "flashcards" ? ModuleColors.study : theme.textSecondary}
            />
            <ThemedText
              type="small"
              style={{ color: studyType === "flashcards" ? ModuleColors.study : theme.textSecondary }}
            >
              Flashcards
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setStudyType("quiz")}
            style={[
              styles.typeButton,
              {
                backgroundColor: studyType === "quiz" ? ModuleColors.study + "20" : theme.backgroundSecondary,
                borderColor: studyType === "quiz" ? ModuleColors.study : "transparent",
                borderWidth: 2,
              },
            ]}
          >
            <Feather
              name="help-circle"
              size={20}
              color={studyType === "quiz" ? ModuleColors.study : theme.textSecondary}
            />
            <ThemedText
              type="small"
              style={{ color: studyType === "quiz" ? ModuleColors.study : theme.textSecondary }}
            >
              Quiz
            </ThemedText>
          </Pressable>
        </View>

        <Button onPress={handleGenerate} disabled={!topic.trim() || isLoading}>
          {isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <ThemedText type="body" style={{ color: "#FFFFFF" }}>Generating...</ThemedText>
            </View>
          ) : (
            "Generate"
          )}
        </Button>
      </View>

      {state.studySets.length > 0 ? (
        <>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4">My Study Sets</ThemedText>
          </View>
          <View style={styles.studySetsList}>
            {state.studySets.map((set) => (
              <Pressable
                key={set.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (set.type === "flashcards" && set.cards) {
                    navigation.navigate("Flashcards", { topic: set.topic, cards: set.cards });
                  } else if (set.type === "quiz" && set.questions) {
                    navigation.navigate("Quiz", { topic: set.topic, questions: set.questions });
                  }
                }}
                style={({ pressed }) => [
                  styles.studySetItem,
                  { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
                  Shadows.card,
                ]}
              >
                <View style={[styles.setIcon, { backgroundColor: ModuleColors.study + "20" }]}>
                  <Feather
                    name={set.type === "flashcards" ? "layers" : "help-circle"}
                    size={20}
                    color={ModuleColors.study}
                  />
                </View>
                <View style={styles.setContent}>
                  <ThemedText type="body">{set.topic}</ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {set.type === "flashcards"
                      ? `${set.cards?.length || 0} cards`
                      : `${set.questions?.length || 0} questions`}
                  </ThemedText>
                </View>
                <Feather name="chevron-right" size={20} color={theme.textSecondary} />
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Feather name="book-open" size={48} color={theme.textSecondary} />
          <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
            No study sets yet. Generate your first one above!
          </ThemedText>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  generateCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    gap: Spacing.xs,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.body.fontSize,
  },
  typeSelector: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  sectionHeader: {
    marginBottom: Spacing.lg,
  },
  studySetsList: {
    gap: Spacing.md,
  },
  studySetItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
  },
  setIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  setContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["4xl"],
    gap: Spacing.lg,
  },
  bottomPadding: {
    height: Spacing["2xl"],
  },
});
