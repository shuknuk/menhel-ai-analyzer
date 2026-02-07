/**
 * Stats Screen - Trends & Insights
 * Performance visualization with workout trends
 */

import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { TrendGraph } from '../../components/TrendGraph';
import { GlassCard } from '../../components/GlassCard';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { DailyTask, JournalEntry } from '../../types/health';

const MOCK_JOURNAL: JournalEntry[] = [
    { id: '1', timestamp: new Date(Date.now() - 86400000 * 0), content: "Intensity is up. Squats felt deep and controlled today.", sentimentScore: 0.8 },
    { id: '2', timestamp: new Date(Date.now() - 86400000 * 1), content: "Minor stiffness in the lower back after deadlifts.", sentimentScore: 0.3 },
    { id: '3', timestamp: new Date(Date.now() - 86400000 * 2), content: "Recovery is tracking well. Sleep quality is improving.", sentimentScore: 0.6 },
];

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

export default function StatsScreen() {
    const { theme } = useTheme();
    const [range, setRange] = useState<'week' | 'month'>('week');

    const workoutIntensitySeries = range === 'week' ? [
        { label: 'Squats', data: [80, 85, 90, 85, 95, 100, 95], color: theme.accent.primary, showGradient: true },
        { label: 'Leg Press', data: [120, 120, 130, 125, 140, 150, 145], color: theme.accent.secondary },
        { label: 'Deadlift', data: [100, 110, 115, 115, 125, 135, 130], color: theme.accent.teal },
    ] : [
        { label: 'Squats', data: [75, 85, 95, 105], color: theme.accent.primary, showGradient: true },
        { label: 'Leg Press', data: [110, 125, 140, 155], color: theme.accent.secondary },
        { label: 'Deadlift', data: [90, 110, 125, 140], color: theme.accent.teal },
    ];

    const wellnessSeries = range === 'week' ? [
        { label: 'Recovery', data: [8, 7, 7, 8, 9, 8, 9], color: theme.status.success, showGradient: true },
        { label: 'Mood', data: [6, 7, 5, 8, 7, 9, 8], color: theme.status.info },
    ] : [
        { label: 'Recovery', data: [7, 8, 8, 9], color: theme.status.success, showGradient: true },
        { label: 'Mood', data: [6, 7, 8, 9], color: theme.status.info },
    ];

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
                        {['week', 'month'].map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => setRange(opt as any)}
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

                {/* Intensity Trends */}
                <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Workout Volume (kg)</Text>
                <GlassCard style={styles.graphCard}>
                    <TrendGraph
                        title="Peak Relative Volume"
                        labels={range === 'week' ? WEEK_LABELS : MONTH_LABELS}
                        series={workoutIntensitySeries}
                        height={180}
                        maxVal={200}
                        unit="kg"
                    />
                </GlassCard>

                {/* Recovery Trends */}
                <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Wellness Correlation</Text>
                <GlassCard style={styles.graphCard}>
                    <TrendGraph
                        title="Recovery vs Mood"
                        labels={range === 'week' ? WEEK_LABELS : MONTH_LABELS}
                        series={wellnessSeries}
                        height={180}
                        maxVal={10}
                        unit="/10"
                    />
                </GlassCard>

                {/* Journal History */}
                <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Recent Insights</Text>
                {MOCK_JOURNAL.map((entry) => (
                    <GlassCard key={entry.id} style={styles.journalCard}>
                        <View style={styles.journalHeader}>
                            <Text style={[styles.journalDate, { color: theme.text.secondary }]}>
                                {entry.timestamp.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </Text>
                            <View style={[
                                styles.sentimentDot,
                                { backgroundColor: (entry.sentimentScore || 0) > 0 ? theme.status.success : theme.status.warning }
                            ]} />
                        </View>
                        <Text style={[styles.journalContent, { color: theme.text.primary }]} numberOfLines={2}>
                            {entry.content}
                        </Text>
                    </GlassCard>
                ))}

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
    journalContent: {
        ...Typography.body,
        fontSize: 14,
    },
});

