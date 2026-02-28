/**
 * Workout Storage Utility
 * AsyncStorage helpers for persisting workout sessions
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const WORKOUT_HISTORY_KEY = '@rebound_ai:workout_history';
const USER_SETTINGS_KEY = '@rebound_ai:user_settings';

export interface WorkoutSession {
    id: string;
    exerciseType: string;
    repCount: number;
    formScore: number; // 0-100
    duration: number; // in seconds
    timestamp: Date;
    corrections: FormCorrection[];
}

export interface FormCorrection {
    id: string;
    type: string;
    message: string;
    timestamp: Date;
}

export interface UserSettings {
    preferredExercise?: string;
    dailyGoal?: number;
    notificationsEnabled?: boolean;
}

/**
 * Save a completed workout session
 */
export async function saveWorkoutSession(session: Omit<WorkoutSession, 'id' | 'timestamp'>): Promise<WorkoutSession> {
    const newSession: WorkoutSession = {
        ...session,
        id: Date.now().toString(),
        timestamp: new Date(),
    };

    try {
        const existingHistory = await getWorkoutHistory();
        const updatedHistory = [newSession, ...existingHistory];

        // Keep only last 100 sessions to avoid storage bloat
        const trimmedHistory = updatedHistory.slice(0, 100);

        await AsyncStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(trimmedHistory));
        return newSession;
    } catch (error) {
        console.error('Error saving workout session:', error);
        throw error;
    }
}

/**
 * Get all workout history
 */
export async function getWorkoutHistory(): Promise<WorkoutSession[]> {
    try {
        const historyJson = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
        if (!historyJson) return [];

        const history = JSON.parse(historyJson);
        // Convert timestamp strings back to Date objects
        return history.map((session: WorkoutSession) => ({
            ...session,
            timestamp: new Date(session.timestamp),
        }));
    } catch (error) {
        console.error('Error getting workout history:', error);
        return [];
    }
}

/**
 * Get workout history for a specific date range
 */
export async function getWorkoutHistoryByDateRange(
    startDate: Date,
    endDate: Date
): Promise<WorkoutSession[]> {
    const history = await getWorkoutHistory();
    return history.filter(session => {
        const sessionDate = new Date(session.timestamp);
        return sessionDate >= startDate && sessionDate <= endDate;
    });
}

/**
 * Get workout stats summary
 */
export async function getWorkoutStats(): Promise<{
    totalWorkouts: number;
    totalReps: number;
    averageFormScore: number;
    streakDays: number;
}> {
    const history = await getWorkoutHistory();

    if (history.length === 0) {
        return {
            totalWorkouts: 0,
            totalReps: 0,
            averageFormScore: 0,
            streakDays: 0,
        };
    }

    const totalReps = history.reduce((sum, session) => sum + session.repCount, 0);
    const averageFormScore = Math.round(
        history.reduce((sum, session) => sum + session.formScore, 0) / history.length
    );

    // Calculate streak (consecutive days with workouts)
    let streakDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workoutDates = new Set(
        history.map(session => {
            const date = new Date(session.timestamp);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        })
    );

    let checkDate = new Date(today);
    while (workoutDates.has(checkDate.getTime())) {
        streakDays++;
        checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
        totalWorkouts: history.length,
        totalReps,
        averageFormScore,
        streakDays,
    };
}

/**
 * Clear all workout history
 */
export async function clearWorkoutHistory(): Promise<void> {
    try {
        await AsyncStorage.removeItem(WORKOUT_HISTORY_KEY);
    } catch (error) {
        console.error('Error clearing workout history:', error);
        throw error;
    }
}

/**
 * Save user settings
 */
export async function saveUserSettings(settings: UserSettings): Promise<void> {
    try {
        const existingSettings = await getUserSettings();
        const updatedSettings = { ...existingSettings, ...settings };
        await AsyncStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
        console.error('Error saving user settings:', error);
        throw error;
    }
}

/**
 * Get user settings
 */
export async function getUserSettings(): Promise<UserSettings> {
    try {
        const settingsJson = await AsyncStorage.getItem(USER_SETTINGS_KEY);
        if (!settingsJson) return {};
        return JSON.parse(settingsJson);
    } catch (error) {
        console.error('Error getting user settings:', error);
        return {};
    }
}
