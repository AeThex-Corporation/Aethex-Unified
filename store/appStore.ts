import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppMode = "day" | "night";

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  avatar: string;
}

interface AppState {
  mode: AppMode;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  loadSession: () => Promise<void>;
}

const DAY_USER: User = {
  id: "1",
  username: "admin",
  name: "Sarah Mitchell",
  role: "School Administrator",
  avatar: "SM",
};

const NIGHT_USER: User = {
  id: "2",
  username: "creator",
  name: "Alex Chen",
  role: "Verified Architect",
  avatar: "AC",
};

export const useAppStore = create<AppState>((set, get) => ({
  mode: "day",
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setMode: (mode) => {
    set({ mode });
    AsyncStorage.setItem("aethex_mode", mode);
  },

  toggleMode: () => {
    const newMode = get().mode === "day" ? "night" : "day";
    set({ mode: newMode });
    AsyncStorage.setItem("aethex_mode", newMode);
  },

  login: async (username: string) => {
    const normalizedUsername = username.toLowerCase().trim();
    
    if (normalizedUsername === "admin") {
      set({
        user: DAY_USER,
        mode: "day",
        isAuthenticated: true,
      });
      await AsyncStorage.setItem("aethex_user", JSON.stringify(DAY_USER));
      await AsyncStorage.setItem("aethex_mode", "day");
      return true;
    } else if (normalizedUsername === "creator") {
      set({
        user: NIGHT_USER,
        mode: "night",
        isAuthenticated: true,
      });
      await AsyncStorage.setItem("aethex_user", JSON.stringify(NIGHT_USER));
      await AsyncStorage.setItem("aethex_mode", "night");
      return true;
    }
    
    return false;
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      mode: "day",
    });
    AsyncStorage.removeItem("aethex_user");
    AsyncStorage.removeItem("aethex_mode");
  },

  loadSession: async () => {
    try {
      const [userJson, mode] = await Promise.all([
        AsyncStorage.getItem("aethex_user"),
        AsyncStorage.getItem("aethex_mode"),
      ]);

      if (userJson) {
        const user = JSON.parse(userJson);
        set({
          user,
          mode: (mode as AppMode) || "day",
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error loading session:", error);
      set({ isLoading: false });
    }
  },
}));

export const themes = {
  day: {
    background: "#ffffff",
    accent: "#1e3a8a",
    accentLight: "#3b82f6",
    secondary: "#f1f5f9",
    tertiary: "#e2e8f0",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#cbd5e1",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    card: "#ffffff",
  },
  night: {
    background: "#0B0A0F",
    accent: "#22c55e",
    accentLight: "#4ade80",
    secondary: "#1a1a24",
    tertiary: "#252530",
    text: "#f8fafc",
    textSecondary: "#94a3b8",
    border: "#2d2d3a",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    card: "#13131a",
  },
};

export const useTheme = () => {
  const mode = useAppStore((state) => state.mode);
  return themes[mode];
};
