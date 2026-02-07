/**
 * Health Data Types
 * Pain-Mood correlation schema for Antigravity
 */

export interface PainLog {
    id: string;
    timestamp: Date;
    location: PainLocation;
    intensity: number; // 1-10 scale
    duration?: string;
    notes?: string;
}

export type PainLocation =
    | 'head'
    | 'neck'
    | 'shoulder_left'
    | 'shoulder_right'
    | 'back_upper'
    | 'back_lower'
    | 'knee_left'
    | 'knee_right'
    | 'ankle_left'
    | 'ankle_right'
    | 'other';

export interface MoodLog {
    id: string;
    timestamp: Date;
    score: number; // 1-10 scale
    notes?: string;
    triggers?: string[];
    activities?: string[];
}

export interface CorrelationEntry {
    date: string; // YYYY-MM-DD
    painLog?: PainLog;
    moodLog?: MoodLog;
    correlationScore?: number; // Calculated relationship
}

// "Escape Velocity" Momentum System
export interface Momentum {
    currentLevel: number;     // 0-100 momentum percentage
    peakLevel: number;        // Highest achieved
    driftRate: number;        // How fast momentum decays (0.05 = 5% per missed day)
    lastActiveDate: string;   // YYYY-MM-DD
    totalActiveDays: number;
}

export interface DailyTask {
    id: string;
    type: 'journal' | 'workout' | 'meditate';
    title: string;
    completed: boolean;
    completedAt?: Date;
}

export interface WellnessScore {
    overall: number;          // 0-100
    mind: number;             // Mental health component
    body: number;             // Physical health component
    momentum: number;         // Gamification component
    lastUpdated: Date;
}

export interface JournalEntry {
    id: string;
    timestamp: Date;
    content: string;
    sentimentScore?: number;  // AI-analyzed sentiment -1 to 1
    tags?: string[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface WorkoutSession {
    id: string;
    type: string;
    startTime: Date;
    endTime?: Date;
    exercisesCompleted: number;
    formScore?: number;       // AI-analyzed form quality 0-100
    corrections: FormCorrection[];
}

export interface FormCorrection {
    id: string;             // Added id
    timestamp: Date;
    joint: string;
    message: string;        // Renamed from issue
    severity: 'low' | 'medium' | 'high';
}

export interface Video {
    id: string;
    title: string;
    duration: string;
    difficulty: string;
    tag: string;
    thumbnail: string;
    exercises: string[];
}

export interface Workout {
    id: string;
    title: string;
    duration: string;
    level: string;
    tags: string[];
    image: string;
}
