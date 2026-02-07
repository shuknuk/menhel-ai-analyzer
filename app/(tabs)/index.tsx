import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { Heart, Brain, TrendingUp, Zap, User as UserIcon, ChevronRight, Activity, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { GlassCard } from '../../components/GlassCard';
import { BouncingLogo } from '../../components/BouncingLogo';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { useRouter } from 'expo-router';

export default function HealthHomeScreen() {
    const { theme, isDark } = useTheme();
    const router = useRouter();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    const MOODS = [
        { emoji: '😔', label: 'Down', color: theme.moods.down },
        { emoji: '😐', label: 'Okay', color: theme.moods.okay },
        { emoji: '🙂', label: 'Good', color: theme.moods.good },
        { emoji: '🤩', label: 'Great', color: theme.moods.great },
    ];

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const dynamicStyles = StyleSheet.create({
        container: {
            backgroundColor: theme.background.primary,
        },
        header: {
            backgroundColor: theme.background.secondary,
            borderBottomColor: theme.background.tertiary,
        },
        title: {
            color: theme.text.primary,
        },
        sectionTitle: {
            color: theme.text.primary,
            ...Typography.h3,
            marginBottom: Spacing.md,
        },
        cardValue: {
            color: theme.text.primary,
            ...Typography.h2,
        },
        advisorText: {
            color: theme.text.secondary,
            ...Typography.body,
            lineHeight: 22,
        },
        actionButtonText: {
            color: theme.text.inverse,
            fontWeight: '700',
            fontSize: 16,
        },
    });

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={[styles.header, dynamicStyles.header]}>
                    <View style={styles.headerTop}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                            <BouncingLogo size={32} color={theme.accent.primary} />
                            <View>
                                <Text style={[styles.greeting, { color: theme.text.primary }]}>ReboundAI</Text>
                                <Text style={[styles.date, { color: theme.text.muted }]}>{dateStr}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[styles.profileButton, { backgroundColor: theme.background.tertiary }]}
                            onPress={() => router.push('/profile')}
                        >
                            <UserIcon size={24} color={theme.text.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Mood Section */}
                    <Animated.View entering={FadeInDown.delay(200)}>
                        <Text style={dynamicStyles.sectionTitle}>How are you feeling?</Text>
                        <View style={styles.moodGrid}>
                            {MOODS.map((mood) => {
                                const isSelected = selectedMood === mood.label;
                                return (
                                    <TouchableOpacity
                                        key={mood.label}
                                        style={[
                                            styles.moodCard,
                                            {
                                                backgroundColor: isSelected ? theme.accent.primary : theme.background.secondary,
                                                borderColor: isSelected ? theme.accent.primary : theme.background.tertiary
                                            }
                                        ]}
                                        onPress={() => setSelectedMood(mood.label)}
                                    >
                                        <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                        <Text style={[
                                            styles.moodLabel,
                                            { color: isSelected ? theme.text.inverse : theme.text.secondary }
                                        ]}>
                                            {mood.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Animated.View>

                    {/* AI Advisor Card */}
                    <Animated.View entering={FadeInDown.delay(400)} style={styles.advisorContainer}>
                        <GlassCard style={styles.advisorCard}>
                            <View style={styles.advisorHeader}>
                                <Zap size={20} color={theme.accent.orange} fill={theme.accent.orange} />
                                <Text style={[styles.advisorTitle, { color: theme.accent.orange }]}>AI DAILY INSIGHT</Text>
                            </View>
                            <Text style={dynamicStyles.advisorText}>
                                Based on your heart rate variability and yesterday's mobility session, you're recovering well. Today is a great day for some light squat work to improve hip flexibility.
                            </Text>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: theme.accent.primary }]}
                                onPress={() => router.push('/chat')}
                            >
                                <Text style={styles.actionButtonText}>Discuss with AI</Text>
                                <ChevronRight size={20} color={theme.text.inverse} />
                            </TouchableOpacity>
                        </GlassCard>
                    </Animated.View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        <Animated.View entering={FadeInRight.delay(500)} style={styles.statItem}>
                            <GlassCard style={styles.statCard}>
                                <Heart size={24} color={theme.accent.red} />
                                <Text style={dynamicStyles.cardValue}>72</Text>
                                <Text style={{ color: theme.text.muted, fontSize: 12 }}>BPM</Text>
                            </GlassCard>
                        </Animated.View>
                        <Animated.View entering={FadeInRight.delay(600)} style={styles.statItem}>
                            <GlassCard style={styles.statCard}>
                                <Brain size={24} color={theme.accent.primary} />
                                <Text style={dynamicStyles.cardValue}>Balanced</Text>
                                <Text style={{ color: theme.text.muted, fontSize: 12 }}>Mental State</Text>
                            </GlassCard>
                        </Animated.View>
                    </View>

                    {/* Recovery Quick Access */}
                    <Animated.View entering={FadeInDown.delay(700)} style={{ marginTop: Spacing.xl }}>
                        <Text style={dynamicStyles.sectionTitle}>Recovery Focus</Text>
                        <TouchableOpacity
                            style={[styles.recoveryCard, { backgroundColor: theme.background.secondary, borderColor: theme.background.tertiary }]}
                            onPress={() => router.push('/videos')}
                        >
                            <View style={styles.recoveryInfo}>
                                <View style={[styles.iconCircle, { backgroundColor: 'rgba(96, 108, 56, 0.1)' }]}>
                                    <Activity size={24} color={theme.accent.primary} />
                                </View>
                                <View>
                                    <Text style={[styles.recoveryMain, { color: theme.text.primary }]}>Hip Mobility & Squats</Text>
                                    <Text style={{ color: theme.text.muted, fontSize: 12 }}>Suggested by AI • 12 mins</Text>
                                </View>
                            </View>
                            <ChevronRight size={24} color={theme.text.muted} />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    header: {
        paddingTop: 10,
        paddingBottom: Spacing.lg,
        paddingHorizontal: Spacing.lg,
        borderBottomWidth: 1,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        ...Typography.h1,
        fontSize: 28,
    },
    date: {
        ...Typography.body,
        marginTop: 4,
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: Spacing.lg,
    },
    moodGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: Spacing.sm,
    },
    moodCard: {
        flex: 1,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
    },
    moodEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    moodLabel: {
        ...Typography.small,
        fontWeight: '700',
    },
    advisorContainer: {
        marginTop: Spacing.xl,
    },
    advisorCard: {
        padding: Spacing.lg,
    },
    advisorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: Spacing.sm,
    },
    advisorTitle: {
        ...Typography.small,
        fontWeight: '800',
        letterSpacing: 1,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        gap: 8,
    },
    actionButtonText: {
        fontWeight: '700',
        fontSize: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.xl,
    },
    statItem: {
        flex: 1,
    },
    statCard: {
        padding: Spacing.md,
        alignItems: 'center',
        gap: Spacing.xs,
    },
    recoveryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
    },
    recoveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recoveryMain: {
        fontWeight: '700',
        fontSize: 16,
    }
});
