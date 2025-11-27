import React, { ReactNode } from "react";
import { StyleSheet, Pressable, View, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

interface CardProps {
  children?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  elevation?: 1 | 2 | 3;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({ children, onPress, style, elevation = 1 }: CardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const getBackgroundColor = () => {
    switch (elevation) {
      case 1:
        return theme.backgroundDefault;
      case 2:
        return theme.backgroundSecondary;
      case 3:
        return theme.backgroundTertiary;
      default:
        return theme.backgroundDefault;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, springConfig);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, springConfig);
    }
  };

  const cardStyle = [
    styles.card,
    { backgroundColor: getBackgroundColor() },
    Shadows.card,
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[cardStyle, animatedStyle]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
});
