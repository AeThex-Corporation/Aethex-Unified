import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AnimatedSplashProps {
  onComplete: () => void;
}

export function AnimatedSplash({ onComplete }: AnimatedSplashProps) {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const logoRotate = useSharedValue(-15);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const ringScale = useSharedValue(0.8);
  const ringOpacity = useSharedValue(0);
  const progress = useSharedValue(0);
  const fadeOut = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    logoScale.value = withDelay(
      200,
      withSequence(
        withSpring(1.1, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 12 })
      )
    );
    logoRotate.value = withDelay(
      200,
      withSpring(0, { damping: 10, stiffness: 80 })
    );

    ringOpacity.value = withDelay(400, withTiming(0.6, { duration: 300 }));
    ringScale.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(1.3, { duration: 1500, easing: Easing.out(Easing.ease) }),
          withTiming(0.8, { duration: 0 })
        ),
        3,
        false
      )
    );

    textOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));
    textTranslateY.value = withDelay(600, withSpring(0, { damping: 12 }));

    progress.value = withDelay(
      800,
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
    );

    const timer = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      fadeOut.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(onComplete)();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value * fadeOut.value,
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value * fadeOut.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value * fadeOut.value,
    transform: [{ scale: ringScale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    opacity: fadeOut.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeOut.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.ring, ringStyle]} />
          <Animated.View style={[styles.logo, logoStyle]}>
            <View style={styles.logoInner}>
              <Feather name="compass" size={48} color="#FFFFFF" />
            </View>
          </Animated.View>
        </View>

        <Animated.View style={textStyle}>
          <Text style={styles.title}>AeThex</Text>
          <Text style={styles.subtitle}>Companion</Text>
        </Animated.View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
        <Animated.Text style={[styles.loadingText, { opacity: fadeOut.value }]}>
          Loading your experience...
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020817",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  content: {
    alignItems: "center",
    marginBottom: 80,
  },
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  ring: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#5533FF",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#5533FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5533FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#F8FAFC",
    letterSpacing: -1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#5533FF",
    letterSpacing: 4,
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 4,
  },
  progressContainer: {
    position: "absolute",
    bottom: 100,
    left: 40,
    right: 40,
    alignItems: "center",
  },
  progressTrack: {
    width: "60%",
    height: 4,
    backgroundColor: "#1E293B",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#5533FF",
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
});
