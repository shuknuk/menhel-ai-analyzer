import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Play, Pause } from 'lucide-react-native';
import SquatCamera from '../components/SquatCamera';
import { useTheme } from '../hooks/useTheme';
import { saveWorkoutSession } from '../utils/storage';

export default function SquatTrackerScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { theme } = useTheme();

    const exerciseType = Array.isArray(params.exercise) ? params.exercise[0] : (params.exercise || 'Squat');

    const [squatCount, setSquatCount] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [startTime] = useState(Date.now());
    const [formCorrections, setFormCorrections] = useState<string[]>([]);
    const startTimeRef = useRef(startTime);

    const handleSquatCount = (count: number) => {
        if (isActive) {
            setSquatCount(count);
        }
    };

    const handleFormCorrection = (message: string) => {
        if (isActive && !formCorrections.includes(message)) {
            setFormCorrections(prev => [...prev, message]);
        }
    };

    const handleClose = () => {
        if (squatCount > 0) {
            Alert.alert(
                'Save Workout?',
                `Save your ${squatCount} rep session?`,
                [
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => router.back()
                    },
                    {
                        text: 'Save',
                        onPress: async () => {
                            try {
                                const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
                                const formScore = Math.max(0, 100 - (formCorrections.length * 10));

                                await saveWorkoutSession({
                                    exerciseType,
                                    repCount: squatCount,
                                    formScore,
                                    duration,
                                    corrections: formCorrections.map((msg, idx) => ({
                                        id: idx.toString(),
                                        type: 'form',
                                        message: msg,
                                        timestamp: new Date(),
                                    })),
                                });

                                Alert.alert('Saved!', 'Your workout has been recorded.');
                            } catch (error) {
                                console.error('Error saving workout:', error);
                            }
                            router.back();
                        }
                    }
                ]
            );
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <SquatCamera
                onSquatCount={handleSquatCount}
                onFormCorrection={handleFormCorrection}
            />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <View>
                    <Text style={styles.exerciseTitle}>{exerciseType}</Text>
                    <Text style={styles.exerciseSubtitle}>
                        {isActive ? 'Tracking...' : 'Paused'}
                    </Text>
                </View>
            </View>

            {/* Close button */}
            <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: theme.background.secondary }]}
                onPress={handleClose}
            >
                <X size={24} color={theme.text.primary} />
            </TouchableOpacity>

            {/* Pause/Resume button */}
            <TouchableOpacity
                style={[styles.pauseButton, { backgroundColor: theme.background.secondary }]}
                onPress={() => setIsActive(!isActive)}
            >
                {isActive ? (
                    <Pause size={24} color={theme.text.primary} />
                ) : (
                    <Play size={24} color={theme.accent.primary} />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 16,
        borderRadius: 12,
    },
    exerciseTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    exerciseSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    pauseButton: {
        position: 'absolute',
        top: 50,
        right: 80,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});
