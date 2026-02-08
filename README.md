# ReboundAI - now Menhel

A next-generation AI-powered fitness and recovery application built with React Native and Expo. ReboundAI combines real-time pose detection using MediaPipe with a sophisticated health tracking system to provide personalized recovery insights and workout analysis.

## Overview

ReboundAI is a comprehensive health and fitness platform that leverages computer vision and AI to analyze movement patterns, track recovery metrics, and provide intelligent coaching. The application features a clean, clinical design system inspired by high-performance athletic training environments.

## Core Features

### Real-Time Squat Analysis
Custom-built native iOS module integrating Google MediaPipe for pose detection and movement analysis. The system tracks squat mechanics in real-time using the device camera, providing instant feedback on form and counting repetitions automatically.

### AI-Powered Recovery Insights
Intelligent daily recommendations based on heart rate variability, mobility session data, and recovery patterns. The AI advisor suggests optimal workout types and intensity levels tailored to individual recovery status.

### Comprehensive Health Tracking
Multi-dimensional health monitoring including:
- Heart rate and HRV tracking
- Mental state assessment
- Mood tracking with visual indicators
- Recovery metrics and trends
- Body composition analysis

### Video Library
Curated collection of mobility exercises and recovery routines with AI-suggested content based on user needs and recovery status.

## Technical Architecture

### Frontend Stack
- **Framework**: React Native 0.81.5 with Expo 54
- **Navigation**: Expo Router with file-based routing
- **UI Components**: Custom component library with glassmorphism effects
- **Animations**: React Native Reanimated 4.1
- **Gestures**: React Native Gesture Handler 2.28
- **Icons**: Lucide React Native

### Native Modules
- **MediaPipe Pose Detection**: Custom Swift module for iOS
  - AVFoundation camera integration
  - Real-time pose landmark detection
  - Squat counting algorithm
  - Event-driven architecture with React Native bridge

### Design System

#### Color Palette
The application uses a sophisticated earth-tone palette derived from Figma design tokens:

**Light Mode**
- Primary: `#636B2F` (Deep Olive)
- Secondary: `#BAC095` (Sage)
- Tertiary: `#D4DE95` (Light Sage)
- Background: `#F8F9FA` (Clean White)
- Accent Teal: `#869042` (Olive Green)
- Accent Orange: `#D4A373` (Earth Tone)

**Dark Mode**
- Primary: `#D9ED92` (Lime Green)
- Secondary: `#B5C99A` (Muted Sage)
- Background: `#0D1102` (Deep Forest)
- Accent Orange: `#FFD449` (High-Vis Gold)

#### Typography Scale
- H1: 32px, weight 800, -1px letter spacing
- H2: 24px, weight 700, -0.5px letter spacing
- H3: 20px, weight 600, -0.3px letter spacing
- Body: 16px, weight 400, 24px line height
- Caption: 14px, weight 500
- Small: 12px, weight 500

#### Spacing System
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- XXL: 48px

#### Border Radius
- SM: 8px
- MD: 12px
- LG: 16px
- XL: 24px
- Round: 9999px

### Project Structure

```
menhel-ai-analyzer/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home screen with mood tracking
│   │   ├── body.tsx            # Body metrics and AI trainer
│   │   ├── stats.tsx           # Statistics and analytics
│   │   ├── recover.tsx         # Recovery tracking
│   │   ├── videos.tsx          # Exercise video library
│   │   ├── chat.tsx            # AI chat interface
│   │   └── profile.tsx         # User profile
│   ├── squat-tracker.tsx       # Squat camera screen
│   └── _layout.tsx             # Root layout
├── components/
│   ├── GlassCard.tsx           # Glassmorphism card component
│   ├── BouncingLogo.tsx        # Animated logo
│   └── SquatCamera.tsx         # Camera wrapper component
├── modules/
│   └── mediapipe-pose/
│       ├── ios/
│       │   ├── MediapipePoseModule.swift
│       │   ├── MediapipePoseView.swift
│       │   └── MediapipePose.podspec
│       ├── index.tsx           # TypeScript interface
│       └── package.json
├── constants/
│   └── theme.ts                # Design system tokens
└── hooks/
    └── useTheme.ts             # Theme context hook
```

## Installation

### Prerequisites
- Node.js 18 or higher
- Xcode 15 or higher (for iOS development)
- CocoaPods (installed automatically via Homebrew)
- Apple Developer account (free tier works for development)

### Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd menhel-ai-analyzer
```

2. Install dependencies
```bash
npm install
```

3. Install iOS dependencies
```bash
cd ios && pod install && cd ..
```

### Running the Application

#### iOS Simulator
```bash
npx expo run:ios
```

#### Physical iOS Device
1. Connect your iPhone via USB
2. Run the build command
```bash
npx expo run:ios --device
```

3. Configure code signing in Xcode
   - Open `ios/ReboundAI.xcworkspace`
   - Select the ReboundAI target
   - Go to Signing & Capabilities
   - Enable "Automatically manage signing"
   - Select your Apple ID team

4. Trust the developer certificate on your iPhone
   - Settings > General > VPN & Device Management
   - Tap your Apple ID
   - Tap Trust

#### Web (Limited Functionality)
```bash
npx expo start --web
```

Note: Native camera features will not work on web.

## Development

### Adding New Screens
Create new files in `app/(tabs)/` for tab-based screens or `app/` for modal screens. Expo Router automatically generates routes based on file structure.

### Modifying the Design System
Edit `constants/theme.ts` to update colors, spacing, typography, or other design tokens. All components consume these tokens via the `useTheme` hook.

### Extending MediaPipe Integration
The MediaPipe module is located in `modules/mediapipe-pose/`. To add new pose detection features:

1. Update `MediapipePoseView.swift` with new detection logic
2. Add event dispatchers for new data points
3. Update the TypeScript interface in `index.tsx`
4. Consume events in React components

## Architecture Decisions

### Native Module Approach
The MediaPipe integration uses a local Expo Module rather than a managed library to provide maximum control over camera configuration, pose detection parameters, and performance optimization. This approach enables:
- Direct AVFoundation camera access
- Custom pose analysis algorithms
- Minimal latency between detection and UI updates
- Full control over model loading and inference

### Design System Philosophy
The color palette and visual language draw inspiration from clinical athletic training environments, emphasizing clarity, precision, and performance. The earth-tone palette creates a calming yet energizing atmosphere suitable for both recovery tracking and high-intensity workout analysis.

### State Management
The application uses React hooks and context for state management, avoiding heavy state management libraries to maintain simplicity and reduce bundle size. Critical state is managed at the screen level with prop drilling for shared components.

## Performance Considerations

### Camera Optimization
- Video frames are processed on a dedicated queue to prevent UI blocking
- Late frames are automatically discarded to maintain real-time performance
- Preview layer uses hardware acceleration via Metal

### Bundle Size
- Tree-shaking enabled for all dependencies
- Lazy loading for non-critical screens
- Optimized image assets with appropriate compression

### Animation Performance
- All animations use React Native Reanimated for 60fps performance
- Animations run on the UI thread via worklets
- Gesture handling uses native drivers

## Future Enhancements

### Planned Features
- Complete MediaPipe model integration with actual pose landmark analysis
- Advanced squat form analysis with angle calculations
- Multi-exercise support (deadlifts, bench press, etc.)
- Cloud sync for cross-device data persistence
- Social features for workout sharing
- Integration with Apple Health and Google Fit

### Technical Improvements
- Android support with equivalent native module
- Offline-first architecture with local database
- Background processing for long-running analysis
- Push notifications for recovery reminders

## License

This project is proprietary software. All rights reserved.

## Contact

For questions or support, please contact the development team.

---

Built with React Native, Expo, and MediaPipe. Designed for athletes who demand precision.
