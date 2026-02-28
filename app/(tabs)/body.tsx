/**
 * Body Screen - AI Trainer Hub
 * Quick access to start different exercise types with real pose detection
 */

import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ChevronRight, Dumbbell, Activity, Target, Zap, Hand } from 'lucide-react-native';
import { GlassCard } from '../../components/GlassCard';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { useRouter } from 'expo-router';

interface ExerciseOption {
    id: string;
    name: string;
    description: string;
    icon: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const EXERCISES: ExerciseOption[] = [
    {
        id: 'squat',
        name: 'Squat',
        description: 'Track your squat form with real-time AI feedback',
        icon: 'Dumbbell',
        difficulty: 'beginner',
    },
    {
        id: 'deadlift',
        name: 'Deadlift',
        description: 'Monitor your hinge pattern and back position',
        icon: 'Activity',
        difficulty: 'intermediate',
    },
    {
        id: 'lunge',
        name: 'Lunge',
        description: 'Balance and depth tracking for lunges',
        icon: 'Zap',
        difficulty: 'beginner',
    },
];

export default function BodyScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const handleStartExercise = (exercise: ExerciseOption) => {
        router.push({
            pathname: '/squat-tracker',
            params: { exercise: exercise.name }
        });
    };

    const getDifficultyColor = (difficulty: ExerciseOption['difficulty']) => {
        switch (difficulty) {
            case 'beginner':
                return theme.status.success;
            case 'intermediate':
                return theme.accent.orange;
            case 'advanced':
                return theme.accent.red;
        }
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Dumbbell':
                return <Dumbbell size={32} color={theme.accent.primary} />;
            case 'Activity':
                return <Activity size={32} color={theme.accent.teal} />;
            case 'Zap':
                return <Zap size={32} color={theme.accent.orange} />;
            default:
                return <Target size={32} color={theme.accent.primary} />;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
                    <Text style={[styles.headerTitle, { color: theme.text.primary }]}>AI Trainer</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.text.muted }]}>
                        Real-time form analysis powered by MediaPipe
                    </Text>
                </Animated.View>

                {/* Status Card */}
                <GlassCard style={styles.statusCard}>
                    <View style={styles.statusContent}>
                        <View style={[styles.statusDot, { backgroundColor: theme.status.success }]} />
                        <View style={styles.statusTextContainer}>
                            <Text style={[styles.statusTitle, { color: theme.text.primary }]}>
                                Pose Detection Active
                            </Text>
                            <Text style={[styles.statusSubtitle, { color: theme.text.muted }]}>
                                Using native MediaPipe for accurate tracking
                            </Text>
                        </View>
                    </View>
                </GlassCard>

                {/* Exercise List */}
                <Text style={[styles.sectionTitle, { color: theme.accent.secondary }]}>
                    Start Training
                </Text>

                {EXERCISES.map((exercise) => (
                    <TouchableOpacity
                        key={exercise.id}
                        onPress={() => handleStartExercise(exercise)}
                        activeOpacity={0.7}
                    >
                        <GlassCard style={styles.exerciseCard}>
                            <View style={styles.exerciseContent}>
                                <View style={[styles.iconContainer, { backgroundColor: theme.background.tertiary }]}>
                                    {getIcon(exercise.icon)}
                                </View>
                                <View style={styles.exerciseInfo}>
                                    <Text style={[styles.exerciseName, { color: theme.text.primary }]}>
                                        {exercise.name}
                                    </Text>
                                    <Text style={[styles.exerciseDescription, { color: theme.text.muted }]}>
                                        {exercise.description}
                                    </Text>
                                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) + '20' }]}>
                                        <Text style={[styles.difficultyText, { color: getDifficultyColor(exercise.difficulty) }]}>
                                            {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                                        </Text>
                                    </View>
                                </View>
                                <ChevronRight size={24} color={theme.text.muted} />
                            </View>
                        </GlassCard>
                    </TouchableOpacity>
                ))}

                {/* Info Section */}
                <GlassCard style={styles.infoCard}>
                    <Text style={[styles.infoTitle, { color: theme.text.primary }]}>
                        How It Works
                    </Text>
                    <Text style={[styles.infoText, { color: theme.text.secondary }]}>
                        1. Select an exercise{'\n'}
                        2. Position yourself in frame{'\n'}
                        3. Start your set{'\n'}
                        4. Get real-time form feedback{'\n'}
                        5. Save your workout session
                    </Text>
                </GlassCard>

                {/* Debug Section */}
                <Text style={[styles.sectionTitle, { color: theme.accent.secondary, marginTop: Spacing.lg }]}>
                    Debug Tools
                </Text>
                <TouchableOpacity
                    onPress={() => router.push('/hand-tracker')}
                    activeOpacity={0.7}
                >
                    <GlassCard style={[styles.exerciseCard, { borderColor: theme.accent.orange + '40', borderWidth: 1 }]}>
                        <View style={styles.exerciseContent}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.accent.orange + '20' }]}>
                                <Hand size={32} color={theme.accent.orange} />
                            </View>
                            <View style={styles.exerciseInfo}>
                                <Text style={[styles.exerciseName, { color: theme.text.primary }]}>
                                    Hand Tracker Test
                                </Text>
                                <Text style={[styles.exerciseDescription, { color: theme.text.muted }]}>
                                    Test hand pose detection (for debugging)
                                </Text>
                            </View>
                            <ChevronRight size={24} color={theme.text.muted} />
                        </View>
                    </GlassCard>
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
    },
    header: {
        marginBottom: Spacing.lg,
    },
    headerTitle: {
        ...Typography.h1,
        marginBottom: Spacing.xs,
    },
    headerSubtitle: {
        ...Typography.body,
    },
    statusCard: {
        marginBottom: Spacing.lg,
    },
    statusContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: Spacing.md,
    },
    statusTextContainer: {
        flex: 1,
    },
    statusTitle: {
        ...Typography.body,
        fontWeight: '600',
    },
    statusSubtitle: {
        ...Typography.caption,
    },
    sectionTitle: {
        ...Typography.h3,
        marginBottom: Spacing.md,
    },
    exerciseCard: {
        marginBottom: Spacing.md,
    },
    exerciseContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        ...Typography.h3,
        fontSize: 18,
        marginBottom: 2,
    },
    exerciseDescription: {
        ...Typography.caption,
        marginBottom: Spacing.xs,
    },
    difficultyBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    difficultyText: {
        ...Typography.small,
        fontWeight: '600',
    },
    infoCard: {
        marginTop: Spacing.md,
    },
    infoTitle: {
        ...Typography.body,
        fontWeight: '600',
        marginBottom: Spacing.sm,
    },
    infoText: {
        ...Typography.body,
        lineHeight: 24,
    },
});
