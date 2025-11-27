# Aethex Mobile App - Design Guidelines

## Authentication Architecture
**No Authentication Required** - Aethex is a local-first wellness and productivity app. All data is stored locally using AsyncStorage.

**Profile/Settings Screen Required:**
- User-customizable display name
- Avatar selection (generate 3 preset avatars with calming, wellness-themed aesthetics - meditation figure, lotus flower, zen circle)
- App preferences: theme toggle (light/dark), notification settings, data backup/restore options
- Located in Dashboard or accessible from top-right header button

---

## Navigation Architecture

### Root Navigation: Custom Tab Bar (6 Tabs)
Due to 6 distinct feature modules, use a **two-row custom tab bar** or **scrollable horizontal tab bar**:

**Tab Structure:**
1. **Dashboard** - Unified progress overview (home icon)
2. **Habits** - Habit & Mood Tracker (checkbox icon)
3. **Study** - AI Study Buddy (book icon)
4. **Finance** - Smart Finance Coach (dollar icon)
5. **Mindful** - Mindful Moments (lotus/meditation icon)
6. **Journal** - Creative Journal (pen icon)
7. **Fitness** - Fitness Companion (dumbbell icon)

**Alternative:** Use 5 tabs + hamburger menu for lesser-used modules, or group related features (Habits+Mindful, Journal+Study).

**Navigation Pattern:** Each tab contains its own stack navigator with dedicated screens.

---

## Screen Specifications

### 1. Dashboard (Home Tab)
**Purpose:** Unified overview of all module progress and achievements

**Layout:**
- **Header:** Transparent, title "Dashboard", right button (profile/settings icon)
- **Content:** Scrollable vertical feed
  - Welcome banner with motivational quote (AI-generated daily)
  - Active streaks card (show all module streaks)
  - Recent achievements grid (latest badges earned)
  - Daily summary cards for each module (compact stats)
  - Quick action buttons to jump into each module
- **Safe Area:** Top inset = headerHeight + Spacing.xl, Bottom inset = customTabBarHeight + Spacing.xl

**Components:** Cards with subtle shadows, progress rings, badge icons, stat numbers with labels

---

### 2. Habits & Mood Tracker
**Purpose:** Track daily habits and log mood entries

**Layout:**
- **Header:** Transparent, title "Habits & Mood", right button (+ add habit icon)
- **Content:** Scrollable sections
  - Today's Habits checklist (large checkboxes, habit name, streak count)
  - Mood Log section with emotion picker (5 emoji faces) and notes field
  - Habit calendar view (monthly grid showing completion)
- **Floating Button:** FAB for quick mood check-in
- **Safe Area:** Top = headerHeight + Spacing.xl, Bottom = tabBarHeight + Spacing.xl + FAB clearance

**Components:** Custom checkboxes (animated), emoji pickers, calendar heat-map, streak badges

---

### 3. AI Study Buddy
**Purpose:** Generate flashcards/quizzes and track study sessions

**Layout:**
- **Header:** Default navigation, title "Study Buddy", right button (history icon)
- **Content:** Two-tab view (Generate | My Study Sets)
  - Generate Tab: Topic input field, difficulty selector, "Generate" button (AI creates content)
  - My Study Sets: List of saved flashcard/quiz sets with topic and date
  - Study session screen: Flashcard flip interface, quiz multiple-choice
- **Safe Area:** Standard with tab bar

**Components:** Input forms, card flip animations, progress indicators, timer display

---

### 4. Smart Finance Coach
**Purpose:** Log expenses, set goals, receive AI budget tips

**Layout:**
- **Header:** Transparent, title "Finance Coach", right button (goals icon)
- **Content:** Scrollable
  - Monthly spending overview (bar chart or donut chart)
  - Quick expense log form (amount, category dropdown, date)
  - Financial goals list (progress bars, target amounts)
  - AI tips card (refreshes weekly)
- **Floating Button:** FAB for quick expense entry
- **Safe Area:** Top = headerHeight + Spacing.xl, Bottom = tabBarHeight + Spacing.xl

**Components:** Charts, category icons, progress bars, currency input fields

---

### 5. Mindful Moments
**Purpose:** Breathing exercises and gratitude journaling

**Layout:**
- **Header:** Transparent, title "Mindful Moments"
- **Content:** Two-section scrollable
  - Breathing Exercise card (animated expanding circle, timer, start button)
  - Gratitude Journal entries (daily prompt, text input, save button)
  - Past gratitude entries list
- **Safe Area:** Standard with tab bar

**Components:** Animated SVG circles (breathing), gentle color transitions, soft typography

---

### 6. Creative Journal
**Purpose:** Write journal entries and generate AI stories

**Layout:**
- **Header:** Default, title "Creative Journal", right button (+ new entry)
- **Content:** Two-tab view (Entries | AI Stories)
  - Entries: List of journal entries (date, preview text, thumbnail mood)
  - AI Stories: Prompt input, "Generate Story" button, generated story display
  - Entry detail: Full-screen editor with rich text, timestamp
- **Safe Area:** Standard with tab bar

**Components:** Text editor, list items with previews, AI loading states

---

### 7. Fitness Companion
**Purpose:** AI workout plans and workout logging

**Layout:**
- **Header:** Transparent, title "Fitness", right button (stats icon)
- **Content:** Scrollable
  - AI Workout Generator (fitness level selector, goal input, generate button)
  - Today's Workout card (generated plan, exercises list)
  - Workout log form (exercise, sets, reps, notes)
  - Personal records & milestones
- **Safe Area:** Standard with tab bar

**Components:** Exercise cards, set/rep counters, achievement badges

---

## Design System

### Color Palette
- **Primary:** #6366F1 (Soft Indigo) - Main actions, headers, active states
- **Secondary:** #10B981 (Emerald Green) - Success, completed habits, positive progress
- **Accent:** #F59E0B (Warm Amber) - Highlights, badges, milestones
- **Background:** #F8FAFC (Cool White) - Main background
- **Card Background:** #FFFFFF - Elevated cards
- **Text Primary:** #1E293B (Slate Grey)
- **Text Secondary:** #64748B (Light Slate)
- **Success:** #22C55E - Achievements, streaks
- **Calm:** #A78BFA (Light Purple) - Mindfulness features
- **Error:** #EF4444 - Alerts, deletion confirmations

### Typography
- **Font Families:** Inter (primary), Poppins (headings)
- **Headings:** Poppins SemiBold, sizes 24px (H1), 20px (H2), 16px (H3)
- **Body:** Inter Regular, 16px (body), 14px (secondary)
- **Labels:** Inter Medium, 12px (labels, captions)
- **Line Height:** 1.5 for body, 1.2 for headings

### Spacing
- **Base Unit:** 4px
- **Scale:** xs: 8px, sm: 12px, md: 16px, lg: 20px, xl: 24px, 2xl: 32px
- **Card Padding:** 16px
- **Section Margins:** 20px vertical

### Components
- **Cards:** Background #FFFFFF, borderRadius: 12px, shadow: subtle (shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.08, shadowRadius: 4)
- **Buttons:**
  - Primary: background #6366F1, text #FFFFFF, borderRadius: 12px, padding: 12px 24px
  - Secondary: background #F1F5F9, text #1E293B, borderRadius: 12px
  - FAB: circular, 56px diameter, shadow: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
- **Input Fields:** borderColor #E2E8F0, borderRadius: 8px, padding: 12px, focus borderColor: #6366F1
- **Checkboxes:** 24px, rounded 6px, animated checkmark
- **Progress Bars:** height 8px, borderRadius: 4px, background #E2E8F0, fill colors per module

### Visual Feedback
- All touchable elements: opacity: 0.7 when pressed
- Buttons: scale: 0.98 when pressed
- Cards: subtle lift on press (only for interactive cards)
- Smooth transitions: 200ms duration

### Icons
- Use Feather icons from @expo/vector-icons
- Icon sizes: 20px (small), 24px (default), 28px (large headers)
- Tab bar icons: 24px
- Consistent stroke width: 2px

### Critical Assets
1. **Module Avatars/Icons:** Generate unique iconography for each of the 6 modules (minimalist, cohesive style)
2. **Achievement Badges:** Bronze, Silver, Gold badge designs (geometric, celebratory)
3. **User Profile Avatars:** 3 wellness-themed preset avatars (meditation figure, lotus flower, zen circle)
4. **Breathing Animation:** SVG circle that expands/contracts smoothly
5. **App Logo:** Simple, calming wordmark or icon for splash screen

### Gamification Visual Language
- **Streaks:** Fire emoji or flame icon + counter in orange/amber
- **Badges:** Circular medals with ribbon, three tiers (bronze #CD7F32, silver #C0C0C0, gold #FFD700)
- **Milestones:** Confetti animation on achievement unlock
- **Progress Rings:** Circular progress with gradient fill, showing % complete

### Accessibility
- Minimum touch target: 44x44px
- Color contrast: WCAG AA compliant (4.5:1 for text)
- Support dynamic type sizing
- Haptic feedback for completions and achievements
- VoiceOver labels for all interactive elements