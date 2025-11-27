import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, ModuleColors } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";

const BREATH_IN = 4;
const HOLD = 4;
const BREATH_OUT = 4;
const TOTAL_CYCLE = BREATH_IN + HOLD + BREATH_OUT;

export default function BreathingScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [timer, setTimer] = useState(0);
  const [totalBreaths, setTotalBreaths] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0.5);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (isActive) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: BREATH_IN * 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: HOLD * 1000 }),
          withTiming(0.5, { duration: BREATH_OUT * 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: BREATH_IN * 1000 }),
          withTiming(1, { duration: HOLD * 1000 }),
          withTiming(0.5, { duration: BREATH_OUT * 1000 })
        ),
        -1,
        false
      );

      let seconds = 0;
      intervalRef.current = setInterval(() => {
        seconds++;
        setTimer(seconds);

        const cyclePosition = seconds % TOTAL_CYCLE;
        if (cyclePosition < BREATH_IN) {
          setPhase("in");
        } else if (cyclePosition < BREATH_IN + HOLD) {
          setPhase("hold");
        } else {
          setPhase("out");
        }

        if (cyclePosition === 0 && seconds > 0) {
          setTotalBreaths((prev) => prev + 1);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = withTiming(0.5, { duration: 300 });
      opacity.value = withTiming(0.5, { duration: 300 });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const toggleSession = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isActive) {
      setIsActive(false);
      setTimer(0);
      setPhase("in");
    } else {
      setIsActive(true);
      setTotalBreaths(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseText = () => {
    switch (phase) {
      case "in":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "out":
        return "Breathe Out";
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: headerHeight + Spacing.xl }]}>
      <View style={styles.content}>
        <View style={styles.timerContainer}>
          <ThemedText type="h1">{formatTime(timer)}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {totalBreaths} breath cycles
          </ThemedText>
        </View>

        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.breathCircle,
              { backgroundColor: ModuleColors.mindful },
              animatedCircleStyle,
            ]}
          />
          <View style={styles.phaseTextContainer}>
            <ThemedText type="h3" style={{ color: "#FFFFFF" }}>
              {isActive ? getPhaseText() : "Ready"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.instructions}>
          <View style={styles.instructionItem}>
            <View style={[styles.instructionDot, { backgroundColor: theme.success }]} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Breathe in: {BREATH_IN}s
            </ThemedText>
          </View>
          <View style={styles.instructionItem}>
            <View style={[styles.instructionDot, { backgroundColor: theme.accent }]} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Hold: {HOLD}s
            </ThemedText>
          </View>
          <View style={styles.instructionItem}>
            <View style={[styles.instructionDot, { backgroundColor: ModuleColors.mindful }]} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Breathe out: {BREATH_OUT}s
            </ThemedText>
          </View>
        </View>

        <Pressable
          onPress={toggleSession}
          style={[
            styles.controlButton,
            { backgroundColor: isActive ? theme.error : ModuleColors.mindful },
          ]}
        >
          <Feather
            name={isActive ? "square" : "play"}
            size={28}
            color="#FFFFFF"
          />
          <ThemedText type="h4" style={{ color: "#FFFFFF" }}>
            {isActive ? "Stop" : "Start"}
          </ThemedText>
        </Pressable>
      </View>

      <View style={[styles.bottomPadding, { paddingBottom: insets.bottom + Spacing.xl }]} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing["3xl"],
  },
  timerContainer: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  circleContainer: {
    width: 250,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  breathCircle: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  phaseTextContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  instructions: {
    flexDirection: "row",
    gap: Spacing.xl,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  instructionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["3xl"],
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    gap: Spacing.md,
  },
  bottomPadding: {
    paddingTop: Spacing.xl,
  },
});
