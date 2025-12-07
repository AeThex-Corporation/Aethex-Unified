import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore } from "@/store/appStore";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AnimatedSplash } from "@/components/AnimatedSplash";
import "../global.css";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, loadSession, isAuthenticated, mode } = useAppStore();
  const segments = useSegments();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadSession();
    checkOnboarding();
  }, []);

  // Re-check onboarding when navigation segments change (to detect completion)
  useEffect(() => {
    if (hasCheckedOnboarding) {
      checkOnboarding();
    }
  }, [segments]);

  const checkOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem("aethex_onboarding_complete");
      const altCompleted = await AsyncStorage.getItem("@aethex:onboarding_complete");
      const isComplete = completed === "true" || altCompleted === "true";
      setNeedsOnboarding(!isComplete);
      setHasCheckedOnboarding(true);
    } catch (e) {
      setNeedsOnboarding(false);
      setHasCheckedOnboarding(true);
    }
  };

  useEffect(() => {
    if (!isLoading && hasCheckedOnboarding) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, hasCheckedOnboarding]);

  useEffect(() => {
    if (isLoading || !isMounted || !hasCheckedOnboarding || showSplash) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";
    const inTabs = segments[0] === "(tabs)";

    // User needs to complete onboarding first
    if (needsOnboarding && !inOnboarding) {
      router.replace("/(onboarding)");
      return;
    }
    
    // Onboarding complete - handle auth routing
    if (!needsOnboarding) {
      // Authenticated users go to home if in auth or onboarding
      if (isAuthenticated && (inAuthGroup || inOnboarding)) {
        router.replace("/(tabs)/home");
      } 
      // Non-authenticated users go to login if not already there
      else if (!isAuthenticated && !inAuthGroup) {
        router.replace("/(auth)/login");
      }
    }
  }, [isLoading, isAuthenticated, segments, isMounted, hasCheckedOnboarding, showSplash, needsOnboarding]);

  if (isLoading || !hasCheckedOnboarding) {
    return null;
  }

  if (showSplash) {
    return <AnimatedSplash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <>
      <StatusBar style={mode === "night" ? "light" : "dark"} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
