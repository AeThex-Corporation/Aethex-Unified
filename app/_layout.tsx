import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { useAppStore } from "@/store/appStore";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "../global.css";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, loadSession, isAuthenticated, mode } = useAppStore();
  const segments = useSegments();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadSession();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading || !isMounted) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && inAuthGroup) {
      setTimeout(() => router.replace("/(tabs)/home"), 0);
    } else if (!isAuthenticated && !inAuthGroup) {
      setTimeout(() => router.replace("/(auth)/login"), 0);
    }
  }, [isLoading, isAuthenticated, segments, isMounted]);

  if (isLoading) {
    return null;
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
