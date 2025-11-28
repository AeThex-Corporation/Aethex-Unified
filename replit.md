# AeThex Companion - Dual-Mode Super-App

## Overview
AeThex Companion is a React Native (Expo) mobile application that transforms its entire UI/UX based on user role. It features two distinct modes:

- **Day Mode (Enterprise)**: For School Admins/Business Owners - Clean, professional interface
- **Night Mode (Creator)**: For Developers/Artists - Dark, neon-accented creative interface

## Project Structure

```
├── app/                        # Expo Router file-based navigation
│   ├── _layout.tsx             # Root layout with navigation
│   ├── index.tsx               # Entry point with auth redirect
│   ├── (auth)/                 # Authentication screens
│   │   ├── _layout.tsx
│   │   └── login.tsx           # Login with mock credentials
│   └── (tabs)/                 # Main tab screens
│       ├── _layout.tsx         # Tab navigator with dual configuration
│       ├── home.tsx            # Dashboard (Day) / Bounty Feed (Night)
│       ├── scanner.tsx         # Receipt Scanner (Day) / Digital Wallet (Night)
│       ├── actions.tsx         # Pending Approvals (Day) / Guild Chat (Night)
│       └── profile.tsx         # Profile with Mode Toggle
├── store/
│   └── appStore.ts             # Zustand store for mode & auth state
├── global.css                  # Tailwind/NativeWind styles
├── tailwind.config.js          # Tailwind configuration
└── babel.config.js             # Babel with NativeWind preset
```

## Tech Stack

- **Framework**: React Native (Expo) with TypeScript
- **Navigation**: Expo Router (File-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand (global mode & auth state)
- **Icons**: Lucide React Native
- **Animations**: React Native Reanimated
- **Storage**: AsyncStorage for session persistence

## The Mode System

### Day Mode (Enterprise)
- **Theme**: Clean White (#ffffff), Deep Blue accents (#1e3a8a)
- **Tabs**: Home (Alerts), Scan (Camera), Actions (Approvals), Profile
- **Features**:
  - Compliance Dashboard with system stats
  - Receipt Scanner for expense tracking
  - Pending Approvals with approve/reject actions

### Night Mode (Creator)
- **Theme**: Deep Black (#0B0A0F), Neon Green accents (#22c55e)
- **Tabs**: Feed (Bounties), Wallet (ID Card), Guild (Chat), Profile
- **Features**:
  - Bounty Feed with job listings
  - Animated Digital ID Card with QR code
  - Guild Chat with channels and messaging

## Authentication

Mock login credentials:
- `admin` - Logs in as Day Mode (School Administrator)
- `creator` - Logs in as Night Mode (Verified Architect)

Session persists via AsyncStorage.

## Key Components

### Mode Toggle
The profile screen contains a "Switch View" button that instantly toggles between Day and Night modes, changing:
- Theme colors
- Tab icons and labels
- Screen content and layouts
- Navigation structure

### Zustand Store
Manages global state including:
- `mode`: 'day' | 'night'
- `user`: User object with role info
- `isAuthenticated`: Auth status
- Theme switching and persistence

## Running the App

```bash
npm run dev
```

Scan the QR code with Expo Go to test on a physical device.

## Design Tokens

### Day Mode Colors
- Background: #ffffff
- Accent: #1e3a8a
- Secondary: #f1f5f9
- Text: #1e293b

### Night Mode Colors
- Background: #0B0A0F
- Accent: #22c55e
- Secondary: #1a1a24
- Text: #f8fafc
