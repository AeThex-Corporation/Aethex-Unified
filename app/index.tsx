import { Redirect } from "expo-router";
import { useAppStore } from "@/store/appStore";

export default function Index() {
  const { isAuthenticated, isLoading } = useAppStore();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
