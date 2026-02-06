/**
 * Stats Screen - Orbit & History
 * Solar system visualization with Journal history
 */

import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { OrbitSystem } from '../../components/OrbitSystem';
import { WellnessGraph } from '../../components/WellnessGraph';
import { GlassCard } from '../../components/GlassCard';
import { Colors, Typography, Spacing } from '../../constants/theme';
import type { DailyTask, JournalEntry } from '../../types/health';

const MOCK_TASKS: DailyTask[] = [
    { id: '1', type: 'journal', title: 'Daily Journal', completed: true },
    { id: '2', type: 'workout', title: 'ACL Rehab', completed: true },
    { id: '3', type: 'meditate', title: 'Mindfulness', completed: false },
];

const MOCK_JOURNAL: JournalEntry[] = [
    { id: '1', timestamp: new Date(Date.now() - 86400000 * 0), content: "Feeling stronger today. The knee pain is subsiding.", sentimentScore: 0.8 },
    { id: '2', timestamp: new Date(Date.now() - 86400000 * 1), content: "Had a tough session, but getting there.", sentimentScore: 0.4 },
    { id: '3', timestamp: new Date(Date.now() - 86400000 * 2), content: "Anxious about returning to sport.", sentimentScore: -0.2 },
];

const MOCK_GRAPH_DATA = [
    { date: '2026-02-01', mood: 6, pain: 4 },
    { date: '2026-02-02', mood: 7, pain: 3 },
    { date: '2026-02-03', mood: 5, pain: 5 },
    { date: '2026-02-04', mood: 8, pain: 2 },
    { date: '2026-02-05', mood: 7, pain: 3 },
    { date: '2026-02-06', mood: 9, pain: 2 },
    { date: '2026-02-07', mood: 8, pain: 1 },
];

export default function StatsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeIn.duration(600)}>
                    <Text style={styles.headerTitle}>Insights</Text>
                    <Text style={styles.headerSubtitle}>Wellness Orbit & Trends</Text>
                </Animated.View>

                {/* Orbit Visualization */}
                <View style={styles.orbitContainer}>
                    <OrbitSystem
                        wellnessScore={78}
                        tasks={MOCK_TASKS}
                        onTaskPress={() => { }}
                    />
                </View>

                {/* Trends */}
                <Text style={styles.sectionTitle}>Correlations</Text>
                <GlassCard style={styles.graphCard}>
                    <WellnessGraph data={MOCK_GRAPH_DATA} height={180} />
                </GlassCard>

                {/* Journal History */}
                <Text style={styles.sectionTitle}>Recent Thoughts</Text>
                {MOCK_JOURNAL.map((entry) => (
                    <GlassCard key={entry.id} style={styles.journalCard}>
                        <View style={styles.journalHeader}>
                            <Text style={styles.journalDate}>
                                {entry.timestamp.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </Text>
                            <View style={[
                                styles.sentimentDot,
                                { backgroundColor: (entry.sentimentScore || 0) > 0 ? Colors.status.success : Colors.status.warning }
                            ]} />
                        </View>
                        <Text style={styles.journalContent} numberOfLines={2}>
                            {entry.content}
                        </Text>
                    </GlassCard>
                ))}

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
    },
    headerTitle: {
        ...Typography.h1,
        marginBottom: Spacing.xs,
    },
    headerSubtitle: {
        ...Typography.body,
        color: Colors.text.muted,
        marginBottom: Spacing.lg,
    },
    orbitContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        transform: [{ scale: 0.9 }],
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
