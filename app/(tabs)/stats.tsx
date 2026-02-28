/**
 * Stats Screen - Trends & Insights
 * Performance visualization with workout trends
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { TrendGraph } from '../../components/TrendGraph';
import { GlassCard } from '../../components/GlassCard';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { getWorkoutStats, getWorkoutHistory, WorkoutSession } from '../../utils/storage';

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
const RANGES: ('week' | 'month')[] = ['week', 'month'];

export default function StatsScreen() {
    const { theme } = useTheme();
    const [range, setRange] = useState<'week' | 'month'>('week');
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        totalReps: 0,
        averageFormScore: 0,
        streakDays: 0,
    });
    const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const workoutStats = await getWorkoutStats();
            const history = await getWorkoutHistory();
            setStats(workoutStats);
            setWorkoutHistory(history);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Generate workout data from history or fall back to mock for demo
    const getWorkoutData = (range: 'week' | 'month') => {
        if (workoutHistory.length > 0) {
            // Use actual workout data
            const days = range === 'week' ? 7 : 28;
            const dayLabels = range === 'week' ? WEEK_LABELS : MONTH_LABELS;

            // Aggregate reps by day
            const repsByDay: number[] = [];
            const today = new Date();

            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);

                const dayReps = workoutHistory
                    .filter(session => {
                        const sessionDate = new Date(session.timestamp);
                        sessionDate.setHours(0, 0, 0, 0);
                        return sessionDate.getTime() === date.getTime();
                    })
                    .reduce((sum, session) => sum + session.repCount, 0);

                repsByDay.push(dayReps);
            }

            return {
                labels: range === 'week' ? dayLabels : Array.from({ length: 4 }, (_, i) => `Week ${i + 1}`),
                data: range === 'week' ? repsByDay : [
                    repsByDay.slice(0, 7).reduce((a, b) => a + b, 0),
                    repsByDay.slice(7, 14).reduce((a, b) => a + b, 0),
                    repsByDay.slice(14, 21).reduce((a, b) => a + b, 0),
                    repsByDay.slice(21, 28).reduce((a, b) => a + b, 0),
                ],
            };
        }

        // Fallback to mock data for demo
        return {
            labels: range === 'week' ? WEEK_LABELS : MONTH_LABELS,
            data: range === 'week' ? [8, 12, 10, 15, 8, 20, 12] : [45, 62, 58, 70],
        };
    };

    const workoutData = getWorkoutData(range);

    const workoutIntensitySeries = [
        { label: 'Squats', data: workoutData.data, color: theme.accent.primary, showGradient: true },
    ];

    const wellnessSeries = [
        { label: 'Form Score', data: [stats.averageFormScore || 85, 88, 82, 90], color: theme.status.success, showGradient: true },
    ];

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
                <View style={styles.loadingContainer}>
                    <Text style={{ color: theme.text.primary }}>Loading stats...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
                    <View>
                        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Trends</Text>
                        <Text style={[styles.headerSubtitle, { color: theme.text.muted }]}>Volume & Recovery Tracking</Text>
                    </View>

                    <View style={[styles.rangeSelector, { backgroundColor: theme.background.secondary }]}>
                        {RANGES.map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => setRange(opt)}
                                style={[
                                    styles.rangeBtn,
                                    range === opt && { backgroundColor: theme.accent.primary }
                                ]}
                            >
                                <Text style={[
                                    styles.rangeBtnText,
                                    { color: range === opt ? theme.text.inverse : theme.text.muted }
                                ]}>
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Stats Summary */}
                <View style={styles.statsRow}>
                    <GlassCard style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.accent.primary }]}>{stats.totalWorkouts}</Text>
                        <Text style={[styles.statLabel, { color: theme.text.muted }]}>Workouts</Text>
                    </GlassCard>
                    <GlassCard style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.accent.teal }]}>{stats.totalReps}</Text>
                        <Text style={[styles.statLabel, { color: theme.text.muted }]}>Total Reps</Text>
                    </GlassCard>
                    <GlassCard style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.status.success }]}>{stats.streakDays}</Text>
                        <Text style={[styles.statLabel, { color: theme.text.muted }]}>Day Streak</Text>
                    </GlassCard>
                </View>

                {/* Workout Volume */}
                <Text style={[styles.sectionTitle, { color: theme.accent.secondary }]}>Workout Volume</Text>
                <GlassCard style={styles.graphCard}>
                    <TrendGraph
                        title="Reps Completed"
                        labels={workoutData.labels}
                        series={workoutIntensitySeries}
                        height={180}
                        maxVal={Math.max(...workoutData.data, 30)}
                        unit=" reps"
                    />
                </GlassCard>

                {/* Form Score Trends */}
                <Text style={[styles.sectionTitle, { color: theme.accent.secondary }]}>Form Quality</Text>
                <GlassCard style={styles.graphCard}>
                    <TrendGraph
                        title="Form Score"
                        labels={range === 'week' ? WEEK_LABELS : MONTH_LABELS}
                        series={wellnessSeries}
                        height={180}
                        maxVal={100}
                        unit="%"
                    />
                </GlassCard>

                {/* Recent Workouts */}
                <Text style={[styles.sectionTitle, { color: theme.accent.secondary }]}>Recent Sessions</Text>
                {workoutHistory.length > 0 ? (
                    workoutHistory.slice(0, 5).map((session) => (
                        <GlassCard key={session.id} style={styles.journalCard}>
                            <View style={styles.journalHeader}>
                                <Text style={[styles.journalDate, { color: theme.text.secondary }]}>
                                    {new Date(session.timestamp).toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                                <View style={[
                                    styles.sentimentDot,
                                    { backgroundColor: session.formScore > 70 ? theme.status.success : theme.status.warning }
                                ]} />
                            </View>
                            <View style={styles.sessionDetails}>
                                <Text style={[styles.journalContent, { color: theme.text.primary }]}>
                                    {session.exerciseType} • {session.repCount} reps • {session.formScore}% form
                                </Text>
                            </View>
                        </GlassCard>
                    ))
                ) : (
                    <GlassCard style={styles.journalCard}>
                        <Text style={[styles.journalContent, { color: theme.text.muted, textAlign: 'center' }]}>
                            No workouts yet. Start a squat session to see your progress!
                        </Text>
                    </GlassCard>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
    },
    header: {
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    headerTitle: {
        ...Typography.h1,
        marginBottom: Spacing.xs,
    },
    headerSubtitle: {
        ...Typography.body,
    },
    rangeSelector: {
        flexDirection: 'row',
        borderRadius: BorderRadius.round,
        padding: 4,
        gap: 4,
    },
    rangeBtn: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: BorderRadius.round,
    },
    rangeBtnText: {
        ...Typography.caption,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    statValue: {
        ...Typography.h2,
        fontWeight: '700',
    },
    statLabel: {
        ...Typography.caption,
        marginTop: Spacing.xs,
    },
    sectionTitle: {
        ...Typography.h3,
        marginBottom: Spacing.md,
        marginTop: Spacing.lg,
    },
    graphCard: {
        marginBottom: Spacing.md,
    },
    journalCard: {
        marginBottom: Spacing.sm,
    },
    journalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xs,
    },
    journalDate: {
        ...Typography.caption,
        fontWeight: '600',
    },
    sentimentDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    sessionDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    journalContent: {
        ...Typography.body,
        fontSize: 14,
    },
});
