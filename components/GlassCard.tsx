import React from "react";
import { View, StyleSheet, Platform, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { useTheme } from "@/store/appStore";
import { BorderRadius, Spacing } from "@/constants/theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: "subtle" | "medium" | "strong";
  tint?: "light" | "dark" | "default";
  animated?: boolean;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function GlassCard({
  children,
  style,
  intensity = "medium",
  tint = "default",
  animated = false,
}: GlassCardProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const blurIntensity = {
    subtle: 20,
    medium: 40,
    strong: 60,
  }[intensity];

  const blurTint = tint === "default" 
    ? (theme.background === "#020817" ? "dark" : "light")
    : tint;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [0.95, 1], [0.95, 1]),
  }));

  const handlePressIn = () => {
    if (animated) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (animated) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const containerStyle: ViewStyle = {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.background === "#020817" 
      ? "rgba(255, 255, 255, 0.1)" 
      : "rgba(0, 0, 0, 0.05)",
  };

  const innerStyle: ViewStyle = {
    backgroundColor: theme.background === "#020817"
      ? "rgba(15, 23, 42, 0.7)"
      : "rgba(255, 255, 255, 0.7)",
  };

  if (Platform.OS === "web") {
    return (
      <Animated.View 
        style={[containerStyle, innerStyle, styles.webGlass, style, animatedStyle]}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      style={[containerStyle, style, animatedStyle]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      <BlurView
        intensity={blurIntensity}
        tint={blurTint}
        style={[styles.blur, innerStyle]}
      >
        {children}
      </BlurView>
    </Animated.View>
  );
}

export function GlassContainer({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.background === "#020817"
            ? "rgba(15, 23, 42, 0.5)"
            : "rgba(255, 255, 255, 0.5)",
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          borderColor: theme.background === "#020817"
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.04)",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  blur: {
    flex: 1,
  },
  webGlass: {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  } as any,
});
