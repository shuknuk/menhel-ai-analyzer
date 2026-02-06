/**
 * OrbitSystem Component
 * Solar system visualization for task completion and wellness score
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    SharedValue,
} from 'react-native-reanimated';
import { BookOpen, Dumbbell, Brain } from 'lucide-react-native';
import { Colors, Typography } from '../constants/theme';
import type { DailyTask } from '../types/health';

interface OrbitSystemProps {
    wellnessScore: number;
    tasks: DailyTask[];
    onTaskPress: (task: DailyTask) => void;
}

const WellnessSun = ({ score }: { score: number }) => {
    return (
        <View style={styles.sunContainer}>
            <Svg height="120" width="120" viewBox="0 0 120 120">
                <Defs>
                    <RadialGradient id="sunGradient" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor={Colors.accent.orange} stopOpacity="1" />
                        <Stop offset="100%" stopColor={Colors.accent.red} stopOpacity="1" />
                    </RadialGradient>
                </Defs>
                <Circle cx="60" cy="60" r="40" fill="url(#sunGradient)" />
                <Circle cx="60" cy="60" r="55" stroke={Colors.accent.orange} strokeWidth="1" strokeOpacity="0.3" />
            </Svg>
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{score}</Text>
                <Text style={styles.scoreLabel}>Wellness</Text>
            </View>
        </View>
    );
};

const Planet = ({ type, icon: Icon, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.planetContainer}>
        <View style={styles.planet}>
            <Icon size={20} color="#fff" />
        </View>
    </TouchableOpacity>
);

export function OrbitSystem({ wellnessScore, tasks, onTaskPress }: OrbitSystemProps) {
    const orbit1 = useSharedValue(0);
    const orbit2 = useSharedValue(120);
    const orbit3 = useSharedValue(240);

    const ORBIT_RADII = [80, 110, 140];

    useEffect(() => {
        orbit1.value = withRepeat(
            withTiming(360, { duration: 10000, easing: Easing.linear }),
            -1
        );
        orbit2.value = withRepeat(
            withTiming(360 + 120, { duration: 15000, easing: Easing.linear }),
            -1
        );
        orbit3.value = withRepeat(
            withTiming(360 + 240, { duration: 20000, easing: Easing.linear }),
            -1
        );
    }, []);

    const createOrbitStyle = (orbitValue: SharedValue<number>, radius: number) => {
        return useAnimatedStyle(() => {
            const angle = (orbitValue.value * Math.PI) / 180;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return {
                transform: [{ translateX: x }, { translateY: y }],
            };
        });
    };

    const orbit1Style = createOrbitStyle(orbit1, ORBIT_RADII[0]);
    const orbit2Style = createOrbitStyle(orbit2, ORBIT_RADII[1]);
    const orbit3Style = createOrbitStyle(orbit3, ORBIT_RADII[2]);

    return (
        <View style={styles.container}>
            {/* Orbit Paths */}
            <View style={styles.orbitPaths}>
                {ORBIT_RADII.map((r, i) => (
                    <View
                        key={i}
                        style={[
                            styles.orbitPath,
                            { width: r * 2, height: r * 2, borderRadius: r }
                        ]}
                    />
                ))}
            </View>

            {/* Sun Center */}
            <WellnessSun score={wellnessScore} />

            {/* Planets */}
            <Animated.View style={[styles.orbitContainer, orbit1Style]}>
                <Planet type={tasks[0]?.type || 'journal'} icon={BookOpen} onPress={() => tasks[0] && onTaskPress(tasks[0])} />
            </Animated.View>
            <Animated.View style={[styles.orbitContainer, orbit2Style]}>
                <Planet type={tasks[1]?.type || 'workout'} icon={Dumbbell} onPress={() => tasks[1] && onTaskPress(tasks[1])} />
            </Animated.View>
            <Animated.View style={[styles.orbitContainer, orbit3Style]}>
                <Planet type={tasks[2]?.type || 'meditate'} icon={Brain} onPress={() => tasks[2] && onTaskPress(tasks[2])} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 300,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orbitPaths: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orbitPath: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: Colors.background.tertiary, // Slate 200
    },
    sunContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 120,
        backgroundColor: Colors.background.secondary, // White
        borderRadius: 60,
        shadowColor: Colors.accent.orange,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    scoreContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    scoreText: {
        ...Typography.h1,
        color: Colors.accent.orange,
        fontSize: 28,
    },
    scoreLabel: {
        ...Typography.small,
        color: Colors.text.muted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    orbitContainer: {
        position: 'absolute',
        width: 0,
        height: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    planetContainer: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    planet: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.accent.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.accent.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#fff',
    },
});
