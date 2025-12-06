# AeThex Companion - Hybrid Dual-Mode Compliance Platform

## Overview
AeThex Companion is a React Native (Expo) mobile application that serves TWO market contexts with a unified architecture:

1. **Small Business** - Day Mode (enterprise compliance/finance) + Night Mode (creator/freelance economy)
2. **K-12 EdTech** - Day Mode (admin/teacher oversight) + Night Mode (student engagement)

The app uses a configuration-driven architecture with a shared compliance layer (PII detection, audit logging) that adapts terminology, features, and compliance rules based on market context.

## Project Structure

```
├── app/                        # Expo Router file-based navigation
│   ├── _layout.tsx             # Root layout with navigation
│   ├── index.tsx               # Entry point with auth redirect
│   ├── (auth)/                 # Authentication screens
│   │   ├── _layout.tsx
│   │   └── login.tsx           # Login with market context selection
│   └── (tabs)/                 # Main tab screens
│       ├── _layout.tsx         # Tab navigator with dual configuration
│       ├── home.tsx            # Dashboard with context-aware metrics
│       ├── scanner.tsx         # Scanner (business) / Student ID (education)
│       ├── actions.tsx         # Approvals (Day) / Guild Chat with PII protection (Night)
│       └── profile.tsx         # Profile with Mode Toggle & Context Info
├── types/
│   └── domain.ts               # Unified domain models (Member, Organization, LedgerItem, etc.)
├── services/
│   ├── configurationService.ts # Market context configuration & terminology
│   ├── complianceService.ts    # PII detection, audit logging, consent management
│   ├── integrationAdapters.ts  # OneRoster/LTI adapter interfaces
│   └── mockData.ts             # Context-aware mock data for both markets
├── store/
│   └── appStore.ts             # Zustand store with unified models & context support
├── global.css                  # Tailwind/NativeWind styles
├── tailwind.config.js          # Tailwind configuration
└── babel.config.js             # Babel with NativeWind preset
```

## Tech Stack

- **Framework**: React Native (Expo) with TypeScript
- **Navigation**: Expo Router (File-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand (global mode, context & auth state)
- **Icons**: Lucide React Native
- **Animations**: React Native Reanimated
- **Storage**: AsyncStorage for session persistence

## Market Contexts

### Small Business Context
- **Day Mode**: Enterprise compliance, expense tracking, approvals
- **Night Mode**: Creator bounties, guild chat, digital wallet

### K-12 Education Context
- **Day Mode**: Admin oversight, FERPA compliance, guardian verification
- **Night Mode**: Student engagement, skill progression, study groups

## Unified Domain Models

```typescript
Member        // Unified user (employee/student/teacher)
Organization  // Business or school
LedgerItem    // Expense/assignment/bounty
EngagementEvent // Activity with gamification
AuditLogEntry // Compliance audit trail
ComplianceCase // Flagged issues
```

## Compliance Layer

### PII Detection (Active in Education Context)
- Blocks SSN, phone numbers, email addresses
- Redacts partial matches
- Logs all attempts to audit trail

### Audit Logging
- Tracks all sensitive data access
- Records consent actions
- Flags suspicious activity

### K-12 Specific
- COPPA compliance (under 13)
- FERPA data protection
- State laws (SOPIPA, SCOPE Act)

## Configuration Service

The `configurationService.ts` provides context-aware:
- **Terminology**: members/students, expenses/assignments, bounties/skills
- **Feature Flags**: PII detection, skill trees, gamification
- **Compliance Rules**: Consent age, data visibility, retention policies
- **Integration Settings**: OneRoster, LTI, SIS adapters

## Authentication

Mock login with market context selection:

**Business Context:**
- `admin` or `owner` → Day Mode (Business Owner)
- `creator` or `contractor` → Night Mode (Freelancer)

**Education Context:**
- `admin` or `teacher` → Day Mode (Educator/Admin)
- `student` → Night Mode (Student)

## The Mode System

### Day Mode (Oversight/Compliance)
- **Theme**: White background, Blue (business) or Purple (education) accents
- **Features**: Dashboards, approvals, compliance monitoring
- **Roles**: Owners, Managers, Admins, Teachers

### Night Mode (Engagement/Creation)
- **Theme**: Dark background (#0B0A0F), Neon Green accents (#22c55e)
- **Features**: Bounties/assignments, chat with PII protection, skill trees
- **Roles**: Contractors, Freelancers, Students

## Key Features

### Context-Aware UI
- Terminology changes based on market (expenses→assignments)
- Color accents adapt (blue/purple for business/education)
- Compliance indicators show protection status

### PII Protection in Chat
- Real-time detection of personal information
- Automatic redaction with user notification
- Blocked messages for severe violations

### Gamification (Night Mode)
- XP points for completed activities
- Skill tree progression
- Achievement badges

## Running the App

```bash
npm run dev
```

Scan the QR code with Expo Go to test on a physical device.

## AeThex Brand Identity

### Brand Colors
- **Primary Accent**: #5533FF (AeThex Purple)
- **Light Accent**: #7755FF
- **Background Dark**: #020817
- **Background Light**: #FFFFFF
- **Text Light**: #F8FAFC
- **Text Dark**: #1E293B

### Design Tokens

#### Day Mode
- Background: #FFFFFF
- Accent: #5533FF
- Secondary: #F1F5F9
- Text: #1E293B
- Card: #FFFFFF

#### Night Mode
- Background: #020817
- Accent: #5533FF
- Secondary: #1E293B
- Text: #F8FAFC
- Card: #0F172A

## Guardian Consent System (Education Context)

### ConsentService (`services/consentService.ts`)
- Manages COPPA/FERPA compliant guardian consent for minors
- Tracks consent per data category (basic_info, academic, behavioral, communication, gamification, analytics)
- Auto-grants mock consent for demo mode
- Visible on student profile page in education context

### Consent Types
- `full`: Complete access to all features
- `limited`: Access to basic educational features only
- `communication_only`: Chat and messaging features
- `none`: No consent granted

### Age Thresholds
- COPPA (under 13): Requires guardian consent for communication, gamification
- FERPA (under 18): Requires guardian consent for data export, analytics

## Database Integration (Supabase)

### Graceful Fallback
- App works fully with mock data when Supabase credentials unavailable
- `isSupabaseConfigured()` check before all DB operations
- `getSupabaseClient()` helper for type-safe access

### Schema Location
- Complete SQL schema in `database/schema.sql`
- Tables: members, organizations, ledger_items, engagement_events, audit_logs, chat_messages, skill_nodes, consent_records

### Environment Variables Required
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Google Play Store Assets

- **App Icon**: `assets/images/icon.png` - Purple geometric shape on dark blue
- **Feature Graphic**: `attached_assets/generated_images/play_store_feature_graphic.png` (1024x500)
- **Bundle ID**: `com.aethex.companion`

## Nexus Integration (Night Mode - Business)

### Gig Radar (`components/GigRadar.tsx`)
- Real-time job matching based on Passport Skills
- Push notification ready (when backend connected)
- Swipe-right quick-apply gesture
- Match score percentage display
- Urgency indicators (normal/high/urgent)

### Sprint Countdown (`components/SprintCountdown.tsx`)
- 30-day GameForge sprint timer
- Kill-Gate status indicator (Day 7 checkpoint)
- Hours logged vs target tracking
- Next milestone display
- Kanban board link (ready for integration)

### NexusService (`services/nexusService.ts`)
- Mock data for gigs, sprints, and Passport skills
- API-ready structure for aethex.dev integration
- Skill matching algorithm
- Quick-apply state management

## Simplified Login

Two primary entry points (no complex role selection):
1. **"Sign In with AeThex Passport"** → Business context (creators, staff)
2. **"Sign In with District Credentials"** → Education context (students, admins)

## Recent Changes (2025-12-06)

1. **Simplified login screen** - Two entry points only (Passport + District)
2. **Added Gig Radar** - Swipe-to-apply job matching in Night Mode
3. **Added Sprint Countdown** - 30-day GameForge timer with Kill-Gate status
4. **Created NexusService** - API layer for skills, gigs, and sprint data
5. Fixed Supabase client error with graceful mock data fallback

## Previous Changes (2025-11-28)

1. Added unified domain models in `types/domain.ts`
2. Created `ConfigurationService` for market context switching
3. Implemented `ComplianceService` with PII detection
4. Added `IntegrationAdapter` interfaces for OneRoster/LTI
5. Updated all screens to use context-aware terminology
6. Added PII protection to guild/study group chat
7. Updated login with market context selection
8. Added skill tree and XP tracking in Night Mode
9. Created `ConsentService` for guardian consent workflow
10. Added `ConsentStatus` component to profile page for students
11. Integrated Supabase with graceful mock data fallback
12. Fixed type safety issues with null checks in database service
13. Added `GuardianConsentBanner` component for consent warnings
14. **Rebranded to AeThex identity** - Purple (#5533FF) accent throughout
15. Generated app icon and Play Store feature graphic
16. Updated app.json with complete metadata for Android publishing
