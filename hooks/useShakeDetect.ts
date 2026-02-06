/**
 * useShakeDetect Hook
 * Detects phone shake for privacy mode activation
 */

import { useEffect, useState, useRef } from 'react';
import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';

interface ShakeDetectOptions {
    threshold?: number;      // Acceleration threshold to detect shake
    resetDelay?: number;     // Delay before allowing another shake detection (ms)
    onShake?: () => void;    // Callback when shake is detected
}

export function useShakeDetect(options: ShakeDetectOptions = {}) {
    const {
        threshold = 1.5,
        resetDelay = 1000,
        onShake,
    } = options;

    const [isShaking, setIsShaking] = useState(false);
    const [isPrivacyMode, setIsPrivacyMode] = useState(false);
    const lastShakeTime = useRef<number>(0);
    const subscription = useRef<any>(null);

    useEffect(() => {
        Accelerometer.setUpdateInterval(100);

        subscription.current = Accelerometer.addListener((data: AccelerometerMeasurement) => {
            const { x, y, z } = data;

            // Calculate total acceleration magnitude
            const acceleration = Math.sqrt(x * x + y * y + z * z);

            const now = Date.now();
            const timeSinceLastShake = now - lastShakeTime.current;

            if (acceleration > threshold && timeSinceLastShake > resetDelay) {
                lastShakeTime.current = now;
                setIsShaking(true);

                // Toggle privacy mode
                setIsPrivacyMode(prev => !prev);

                // Call callback if provided
                onShake?.();

                // Reset shaking state after a brief moment
                setTimeout(() => setIsShaking(false), 300);
            }
        });

        return () => {
            if (subscription.current) {
                subscription.current.remove();
            }
        };
    }, [threshold, resetDelay, onShake]);

    const togglePrivacyMode = () => {
        setIsPrivacyMode(prev => !prev);
    };

    return {
        isShaking,
        isPrivacyMode,
        togglePrivacyMode,
    };
}

export default useShakeDetect;
