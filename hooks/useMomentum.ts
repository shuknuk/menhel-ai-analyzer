/**
 * useMomentum Hook
 * "Escape Velocity" gamification - drift instead of streak-breaking
 */

import { useState, useEffect, useCallback } from 'react';
import type { Momentum } from '../types/health';

const DRIFT_RATE = 0.05; // 5% decay per missed day
const ACTIVITY_BOOST = 0.15; // 15% boost per active day
const MAX_MOMENTUM = 100;
const MIN_MOMENTUM = 0;

// Helper to get date string
const getDateString = (date: Date = new Date()): string => {
    return date.toISOString().split('T')[0];
};

// Calculate days between two date strings
const daysBetween = (date1: string, date2: string): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export function useMomentum(initialMomentum?: Momentum) {
    const [momentum, setMomentum] = useState<Momentum>(
        initialMomentum || {
            currentLevel: 50,
            peakLevel: 50,
            driftRate: DRIFT_RATE,
            lastActiveDate: getDateString(),
            totalActiveDays: 1,
        }
    );

    // Check for drift on mount
    useEffect(() => {
        const today = getDateString();
        const missedDays = daysBetween(momentum.lastActiveDate, today);

        if (missedDays > 0) {
            // Apply drift for each missed day
            const driftAmount = missedDays * DRIFT_RATE * 100;
            const newLevel = Math.max(MIN_MOMENTUM, momentum.currentLevel - driftAmount);

            setMomentum(prev => ({
                ...prev,
                currentLevel: newLevel,
            }));
        }
    }, []);

    // Log activity and boost momentum
    const logActivity = useCallback(() => {
        const today = getDateString();

        setMomentum(prev => {
            const isNewDay = prev.lastActiveDate !== today;
            const boost = ACTIVITY_BOOST * 100;
            const newLevel = Math.min(MAX_MOMENTUM, prev.currentLevel + boost);
            const newPeak = Math.max(prev.peakLevel, newLevel);

            return {
                ...prev,
                currentLevel: newLevel,
                peakLevel: newPeak,
                lastActiveDate: today,
                totalActiveDays: isNewDay ? prev.totalActiveDays + 1 : prev.totalActiveDays,
            };
        });
    }, []);

    // Get momentum status message
    const getStatusMessage = useCallback((): string => {
        if (momentum.currentLevel >= 80) {
            return "🚀 You've achieved escape velocity! Keep soaring!";
        } else if (momentum.currentLevel >= 60) {
            return "🌙 Great altitude! You're breaking through the atmosphere.";
        } else if (momentum.currentLevel >= 40) {
            return "🛫 Building momentum. Each activity gets you higher.";
        } else if (momentum.currentLevel >= 20) {
            return "🌍 You're drifting a bit. One activity can change your trajectory.";
        } else {
            return "🌱 Ready for liftoff? Your next action starts the engines.";
        }
    }, [momentum.currentLevel]);

    // Get color based on momentum level
    const getMomentumColor = useCallback((): string => {
        if (momentum.currentLevel >= 80) return '#00d26a'; // Success green
        if (momentum.currentLevel >= 60) return '#6b5ce7'; // Purple
        if (momentum.currentLevel >= 40) return '#ffc107'; // Warning yellow
        return '#e94560'; // Alert red/pink
    }, [momentum.currentLevel]);

    // Calculate days until momentum hits zero (for UI display)
    const daysUntilZero = useCallback((): number => {
        if (momentum.currentLevel <= 0) return 0;
        return Math.ceil(momentum.currentLevel / (DRIFT_RATE * 100));
    }, [momentum.currentLevel]);

    return {
        momentum,
        logActivity,
        getStatusMessage,
        getMomentumColor,
        daysUntilZero,
    };
}

export default useMomentum;
