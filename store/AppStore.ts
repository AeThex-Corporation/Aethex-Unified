import { useState, useCallback } from "react";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  completedDates: string[];
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  mood: number;
  note: string;
  date: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
}

export interface GratitudeEntry {
  id: string;
  content: string;
  date: string;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    completed: boolean;
  }>;
  date: string;
  duration: number;
}

export interface StudySet {
  id: string;
  topic: string;
  type: "flashcards" | "quiz";
  cards?: Array<{ question: string; answer: string }>;
  questions?: Array<{ question: string; options: string[]; correct: number }>;
  createdAt: string;
  lastStudied?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold";
  earnedAt: string;
  module: string;
}

export interface AppState {
  habits: Habit[];
  moodEntries: MoodEntry[];
  expenses: Expense[];
  financialGoals: FinancialGoal[];
  journalEntries: JournalEntry[];
  gratitudeEntries: GratitudeEntry[];
  workouts: Workout[];
  studySets: StudySet[];
  badges: Badge[];
  streaks: {
    habits: number;
    study: number;
    finance: number;
    mindful: number;
    fitness: number;
  };
  totalPoints: number;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialState: AppState = {
  habits: [
    {
      id: "1",
      name: "Morning Meditation",
      icon: "sun",
      color: "#A78BFA",
      streak: 7,
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Read 30 mins",
      icon: "book",
      color: "#6366F1",
      streak: 5,
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Exercise",
      icon: "activity",
      color: "#F59E0B",
      streak: 12,
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Drink 8 glasses water",
      icon: "droplet",
      color: "#10B981",
      streak: 3,
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
  ],
  moodEntries: [
    { id: "1", mood: 4, note: "Had a productive day!", date: new Date().toISOString() },
    { id: "2", mood: 3, note: "Feeling okay", date: new Date(Date.now() - 86400000).toISOString() },
  ],
  expenses: [
    { id: "1", amount: 45.50, category: "Food", description: "Groceries", date: new Date().toISOString() },
    { id: "2", amount: 12.99, category: "Entertainment", description: "Streaming", date: new Date().toISOString() },
    { id: "3", amount: 89.00, category: "Utilities", description: "Electricity", date: new Date(Date.now() - 86400000).toISOString() },
  ],
  financialGoals: [
    { id: "1", name: "Emergency Fund", targetAmount: 5000, currentAmount: 2500, deadline: "2025-12-31" },
    { id: "2", name: "Vacation", targetAmount: 2000, currentAmount: 800, deadline: "2025-06-30" },
  ],
  journalEntries: [
    { 
      id: "1", 
      title: "A day of reflection", 
      content: "Today I realized how much I've grown over the past year...", 
      mood: "thoughtful",
      date: new Date().toISOString() 
    },
  ],
  gratitudeEntries: [
    { id: "1", content: "Grateful for my health and family", date: new Date().toISOString() },
    { id: "2", content: "Thankful for good weather today", date: new Date(Date.now() - 86400000).toISOString() },
  ],
  workouts: [
    {
      id: "1",
      name: "Morning Cardio",
      exercises: [
        { name: "Jumping Jacks", sets: 3, reps: "30 sec", completed: true },
        { name: "High Knees", sets: 3, reps: "30 sec", completed: true },
        { name: "Burpees", sets: 3, reps: "10", completed: false },
      ],
      date: new Date().toISOString(),
      duration: 25,
    },
  ],
  studySets: [],
  badges: [
    { id: "1", name: "First Steps", description: "Complete your first habit", icon: "award", tier: "bronze", earnedAt: new Date().toISOString(), module: "habits" },
    { id: "2", name: "Week Warrior", description: "Maintain a 7-day streak", icon: "zap", tier: "silver", earnedAt: new Date().toISOString(), module: "habits" },
  ],
  streaks: {
    habits: 7,
    study: 3,
    finance: 5,
    mindful: 12,
    fitness: 4,
  },
  totalPoints: 1250,
};

let globalState = { ...initialState };
let listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const useAppStore = () => {
  const [, setTick] = useState(0);

  const subscribe = useCallback(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  useState(() => {
    const unsubscribe = subscribe();
    return unsubscribe;
  });

  const addHabit = useCallback((habit: Omit<Habit, "id" | "streak" | "completedDates" | "createdAt">) => {
    const newHabit: Habit = {
      ...habit,
      id: generateId(),
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    globalState = { ...globalState, habits: [...globalState.habits, newHabit] };
    notifyListeners();
  }, []);

  const toggleHabit = useCallback((habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    globalState = {
      ...globalState,
      habits: globalState.habits.map((h) => {
        if (h.id === habitId) {
          const isCompleted = h.completedDates.includes(today);
          return {
            ...h,
            completedDates: isCompleted
              ? h.completedDates.filter((d) => d !== today)
              : [...h.completedDates, today],
            streak: isCompleted ? Math.max(0, h.streak - 1) : h.streak + 1,
          };
        }
        return h;
      }),
    };
    notifyListeners();
  }, []);

  const addMoodEntry = useCallback((entry: Omit<MoodEntry, "id" | "date">) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: generateId(),
      date: new Date().toISOString(),
    };
    globalState = { ...globalState, moodEntries: [newEntry, ...globalState.moodEntries] };
    notifyListeners();
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, "id" | "date">) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      date: new Date().toISOString(),
    };
    globalState = { ...globalState, expenses: [newExpense, ...globalState.expenses] };
    notifyListeners();
  }, []);

  const addFinancialGoal = useCallback((goal: Omit<FinancialGoal, "id">) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: generateId(),
    };
    globalState = { ...globalState, financialGoals: [...globalState.financialGoals, newGoal] };
    notifyListeners();
  }, []);

  const updateGoalProgress = useCallback((goalId: string, amount: number) => {
    globalState = {
      ...globalState,
      financialGoals: globalState.financialGoals.map((g) =>
        g.id === goalId ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) } : g
      ),
    };
    notifyListeners();
  }, []);

  const addJournalEntry = useCallback((entry: Omit<JournalEntry, "id" | "date">) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: generateId(),
      date: new Date().toISOString(),
    };
    globalState = { ...globalState, journalEntries: [newEntry, ...globalState.journalEntries] };
    notifyListeners();
  }, []);

  const addGratitudeEntry = useCallback((content: string) => {
    const newEntry: GratitudeEntry = {
      id: generateId(),
      content,
      date: new Date().toISOString(),
    };
    globalState = { ...globalState, gratitudeEntries: [newEntry, ...globalState.gratitudeEntries] };
    notifyListeners();
  }, []);

  const addWorkout = useCallback((workout: Omit<Workout, "id" | "date">) => {
    const newWorkout: Workout = {
      ...workout,
      id: generateId(),
      date: new Date().toISOString(),
    };
    globalState = { ...globalState, workouts: [newWorkout, ...globalState.workouts] };
    notifyListeners();
  }, []);

  const addStudySet = useCallback((studySet: Omit<StudySet, "id" | "createdAt">) => {
    const newSet: StudySet = {
      ...studySet,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    globalState = { ...globalState, studySets: [newSet, ...globalState.studySets] };
    notifyListeners();
  }, []);

  const addBadge = useCallback((badge: Omit<Badge, "id" | "earnedAt">) => {
    const newBadge: Badge = {
      ...badge,
      id: generateId(),
      earnedAt: new Date().toISOString(),
    };
    globalState = { ...globalState, badges: [...globalState.badges, newBadge] };
    notifyListeners();
  }, []);

  const addPoints = useCallback((points: number) => {
    globalState = { ...globalState, totalPoints: globalState.totalPoints + points };
    notifyListeners();
  }, []);

  return {
    state: globalState,
    addHabit,
    toggleHabit,
    addMoodEntry,
    addExpense,
    addFinancialGoal,
    updateGoalProgress,
    addJournalEntry,
    addGratitudeEntry,
    addWorkout,
    addStudySet,
    addBadge,
    addPoints,
  };
};
