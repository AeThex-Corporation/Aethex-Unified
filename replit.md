# Aethex - Wellness & Productivity Super-App

## Overview
Aethex is a comprehensive mobile application that combines six productivity and wellness modules into one unified ecosystem. Built with Expo and React Native, it features a calming, modern interface inspired by Notion and Headspace.

## Project Structure

```
├── App.tsx                    # Root component with navigation
├── app.json                   # Expo configuration
├── components/                # Reusable UI components
│   ├── Button.tsx             # Primary/secondary button with animations
│   ├── Card.tsx               # Elevated card component
│   ├── ErrorBoundary.tsx      # App crash handler
│   ├── ErrorFallback.tsx      # Error UI component
│   ├── HeaderTitle.tsx        # Custom header with app logo
│   ├── ScreenFlatList.tsx     # FlatList with safe area handling
│   ├── ScreenKeyboardAwareScrollView.tsx  # Keyboard-aware scroll
│   ├── ScreenScrollView.tsx   # ScrollView with safe area handling
│   ├── Spacer.tsx             # Spacing utility component
│   ├── ThemedText.tsx         # Themed typography component
│   └── ThemedView.tsx         # Themed view component
├── constants/
│   └── theme.ts               # Design tokens (colors, spacing, typography)
├── hooks/
│   ├── useColorScheme.ts      # System color scheme detection
│   ├── useScreenInsets.ts     # Safe area insets hook
│   └── useTheme.ts            # Theme access hook
├── navigation/                # React Navigation configuration
│   ├── DashboardStackNavigator.tsx
│   ├── HabitsStackNavigator.tsx
│   ├── StudyStackNavigator.tsx
│   ├── FinanceStackNavigator.tsx
│   ├── MindfulStackNavigator.tsx
│   ├── FitnessStackNavigator.tsx
│   ├── MainTabNavigator.tsx   # 6-tab bottom navigation
│   └── screenOptions.ts       # Common screen options
├── screens/                   # All app screens
│   ├── DashboardScreen.tsx    # Main dashboard with module overview
│   ├── SettingsScreen.tsx     # App settings
│   ├── HabitsScreen.tsx       # Habit tracking & mood logging
│   ├── AddHabitScreen.tsx     # Create new habit
│   ├── MoodLogScreen.tsx      # Log mood entry
│   ├── StudyScreen.tsx        # AI Study Buddy main screen
│   ├── FlashcardsScreen.tsx   # Flashcard study interface
│   ├── QuizScreen.tsx         # Quiz interface
│   ├── FinanceScreen.tsx      # Finance overview
│   ├── AddExpenseScreen.tsx   # Log new expense
│   ├── AddGoalScreen.tsx      # Create financial goal
│   ├── MindfulScreen.tsx      # Mindfulness hub
│   ├── BreathingScreen.tsx    # Breathing exercise
│   ├── JournalScreen.tsx      # Journal entries list
│   ├── JournalEntryScreen.tsx # Create/view journal entry
│   ├── FitnessScreen.tsx      # Fitness overview
│   ├── WorkoutScreen.tsx      # Workout session
│   └── LogWorkoutScreen.tsx   # Log completed workout
└── store/
    └── AppStore.ts            # In-memory state management
```

## Core Modules

1. **Dashboard** - Unified progress overview with streaks, badges, and quick access to all modules
2. **Habits & Mood** - Track daily habits with streaks, log mood with emotion picker
3. **AI Study Buddy** - Generate flashcards and quizzes (AI-ready, uses mock data for prototype)
4. **Finance Coach** - Log expenses, track financial goals, view spending insights
5. **Mindful Moments** - Breathing exercises, gratitude journaling, creative journal
6. **Fitness Companion** - AI workout generator (mock), workout logging, progress tracking

## Design System

### Colors
- Primary: #6366F1 (Soft Indigo)
- Secondary: #10B981 (Emerald Green)
- Accent: #F59E0B (Warm Amber)
- Success: #22C55E (Bright Green)
- Calm: #A78BFA (Light Purple)
- Background: #F8FAFC (Cool White)
- Text: #1E293B (Slate Grey)

### Module Colors
- Habits: #6366F1
- Study: #8B5CF6
- Finance: #10B981
- Mindful: #A78BFA
- Journal: #EC4899
- Fitness: #F59E0B

### Typography
- H1: 28px, Bold
- H2: 24px, SemiBold
- H3: 20px, SemiBold
- H4: 17px, SemiBold
- Body: 16px, Regular
- Small: 14px, Regular
- Caption: 12px, Medium

### Spacing Scale
- xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 20px, 2xl: 24px, 3xl: 32px

## State Management
Uses in-memory store (store/AppStore.ts) with React hooks. No persistent storage in this prototype - all data resets on app restart.

## Key Patterns

### Screen Structure
All screens use safe area insets via helper components:
- `ScreenScrollView` for scrollable content
- `ScreenKeyboardAwareScrollView` for forms with inputs
- `ScreenFlatList` for lists

### Navigation
- 6-tab bottom navigation using React Navigation
- Each tab has its own stack navigator
- Transparent headers with blur effect on iOS

### Animations
- Spring animations for button presses and card interactions
- Breathing circle animation in mindfulness module
- Flashcard flip animation

## Development Notes

- This is an Expo project - use `npm run dev` to start
- All features work with mock/sample data
- AI features are prepared for integration but use static content
- Haptic feedback is enabled for touch interactions
- Supports light and dark color schemes

## Next Steps for Full Implementation

1. Add AsyncStorage for data persistence
2. Integrate OpenAI API for AI features (study content generation, financial tips, workout plans)
3. Add push notifications for habit reminders
4. Implement data export/backup functionality
5. Add analytics dashboards with charts
6. Add social/sharing features
