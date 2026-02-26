# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rebound AI (also "Menhel") is a React Native/Expo mobile application for AI-powered fitness and recovery tracking. It uses real-time pose detection via MediaPipe for workout analysis, combined with health metrics tracking and AI-powered recovery insights.

## Original Vision

The app started as an AI mental health and fitness agent (originally planned for WhatsApp integration) that evolved into a comprehensive health platform:

**Core Features Implemented:**
- Real-time squat form analysis using MediaPipe pose detection (like a virtual physical therapist)
- Mood and mental health tracking with daily check-ins
- Recovery metrics tracking (heart rate, HRV)
- Exercise video library with AI-suggested content
- AI chat interface for coaching and motivation
- Body metrics and trends analysis

**Planned/Placeholder Features:**
- WhatsApp integration for 24/7 check-ins
- Google Calendar integration to prompt mood checks between meetings
- Journal feature with AI adjustment
- More exercise types beyond squats (side-to-side trainer)
- Video cases for injured athletes
- Monthly mental health timeline visualization

## Common Commands

```bash
# Install dependencies
npm install

# Run on iOS simulator
npx expo run:ios

# Run on physical iOS device
npx expo run:ios --device

# Run on web (limited functionality - camera won't work)
npx expo start --web

# Lint code
npm run lint
```

For iOS device deployment, you'll need to:
1. Connect iPhone via USB
2. Configure code signing in Xcode (open `ios/ReboundAI.xcworkspace`)
3. Trust the developer certificate on your iPhone (Settings > General > VPN & Device Management)

## Architecture

### Navigation Structure
- Uses **Expo Router** with file-based routing
- Root layout: `app/_layout.tsx` - wraps everything with ThemeProvider
- Tab navigation: `app/(tabs)/` - contains main app screens
- Modal screens: `app/squat-tracker.tsx`

### Key Screens (in `app/(tabs)/`)
- `index.tsx` - Home with mood/health tracking
- `body.tsx` - Body metrics and AI trainer
- `stats.tsx` - Statistics and analytics
- `recover.tsx` - Recovery tracking
- `videos.tsx` - Exercise video library
- `chat.tsx` - AI chat interface
- `profile.tsx` - User profile

### Native Module
Custom iOS native module in `modules/mediapipe-pose/`:
- Swift implementation using AVFoundation for camera
- MediaPipe integration for pose landmark detection
- Event-driven React Native bridge
- Provides real-time pose data to `components/SquatCamera.tsx`

### Design System
- Theme tokens in `constants/theme.ts` (colors, typography, spacing)
- Theme context via `hooks/useTheme.ts`
- Earth-tone palette (olive greens, sage, earth tones)
- Glassmorphism components in `components/GlassCard.tsx`

## Vision & Original Concept

The app was conceived as an AI-powered health companion focused on both mental and physical wellness:

**Mental Health Agent**
- AI chatbot that tracks mood and talks to users about their day
- Motivational check-ins and mood checkups
- Activities/tools to help calm the user
- Encourages professional help when needed
- WhatsApp integration for proactive outreach (calendar-aware check-ins)
- Monthly mental health timeline visualization

**Physical Health & Recovery**
- Real-time workout form analysis using MediaPipe (like a physical therapist)
- Currently focused on squat tracking with AI feedback on form
- Video library of mobility exercises for injured athletes
- Recovery tracking and AI recommendations
- Body metrics tracking

The goal is a 24/7 AI health companion that acts as both mental health support and physical therapy assistant.

## Key Patterns

- **Theme usage**: Components use `useTheme()` hook to access design tokens
- **Native module integration**: Import from `mediapipe-pose` module, events emitted for pose data
- **Animations**: React Native Reanimated for 60fps animations
