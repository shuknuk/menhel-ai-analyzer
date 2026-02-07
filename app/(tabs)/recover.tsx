/**
 * Recover Screen - Workouts & Rehab
 * Grid layout with video popups leading to Smart Mirror
 */

import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Modal, SafeAreaView, TextInput } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInUp } from 'react-native-reanimated';
import { ChevronRight, Play, Search, BookOpen, HeartPulse, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

// Mock Workout Data
const WORKOUTS = [
    { id: '1', title: 'ACL Rehab', duration: '15 min', level: 'Beginner', tags: ['injured', 'knee'], image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop' },
    { id: '2', title: 'Lower Back', duration: '20 min', level: 'Intermediate', tags: ['recovery', 'back'], image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=600&auto=format&fit=crop' },
    { id: '3', title: 'Shoulder Mobility', duration: '12 min', level: 'All Levels', tags: ['mobility', 'shoulder'], image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=600&auto=format&fit=crop' },
    { id: '4', title: 'Knee Strength', duration: '18 min', level: 'Beginner', tags: ['strength', 'knee', 'squat'], image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?q=80&w=600&auto=format&fit=crop' },
    { id: '5', title: 'Hip Flexor Flow', duration: '25 min', level: 'Advanced', tags: ['mobility', 'yoga'], image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop' },
    { id: '6', title: 'Ankle Stability', duration: '10 min', level: 'Beginner', tags: ['recovery', 'ankle'], image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop' },
];

export default function RecoverScreen() {
    const { theme, isDark } = useTheme();
    const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
    const [isSessionActive, setIsSessionActive] = useState(false);

    const dynamicStyles = StyleSheet.create({
        container: {
            backgroundColor: theme.background.primary,
        },
        headerTitle: {
            color: theme.text.primary,
        },
        searchBar: {
            backgroundColor: theme.background.secondary,
            borderColor: theme.background.tertiary,
        },
        searchInput: {
            color: theme.text.primary,
        },
        insightLabel: {
            color: theme.accent.primary,
        },
        insightTitle: {
            color: theme.text.primary,
        },
        insightDesc: {
            color: theme.text.secondary,
        },
        workoutCard: {
            backgroundColor: theme.background.secondary,
        },
        modalContent: {
            backgroundColor: theme.background.secondary,
        },
        modalTitle: {
            color: theme.text.primary,
        },
        modalDesc: {
            color: theme.text.secondary,
        },
    });

    const handleOpenModal = (workout: any) => {
        setSelectedWorkout(workout);
    };

    const handleCloseModal = () => {
        setSelectedWorkout(null);
    };

    const handleStartSession = () => {
        setIsSessionActive(true);
        handleCloseModal();
    };

    // If session is active, show the placeholder for MediaPipe trainer
    if (isSessionActive) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>Rebound Trainer Active</Text>
                <Text style={{ color: '#aaa', marginBottom: 40 }}>Camera Feed Initializing...</Text>
                <TouchableOpacity
                    style={styles.closeSessionButton}
                    onPress={() => setIsSessionActive(false)}
                >
                    <X color="#fff" size={24} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeIn.duration(600)}>
                    <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>Recovery</Text>
                </Animated.View>

                {/* Search Bar */}
                <View style={[styles.searchBar, dynamicStyles.searchBar]}>
                    <Search size={20} color={theme.text.muted} />
                    <TextInput
                        placeholder="Search exercises, injuries..."
                        placeholderTextColor={theme.text.muted}
                        style={[styles.searchInput, dynamicStyles.searchInput]}
                    />
                </View>

                {/* Journal Insight Card */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.insightCard}>
                    <BlurView intensity={30} style={styles.insightBlur}>
                        <View style={styles.insightHeader}>
                            <BookOpen size={20} color={theme.accent.secondary} />
                            <Text style={[styles.insightLabel, { color: theme.accent.secondary }]}>AI JOURNAL INSIGHT</Text>
                        </View>
                        <Text style={[styles.insightTitle, dynamicStyles.insightTitle]}>Recovery focus: Knee Health</Text>
                        <Text style={[styles.insightDesc, { color: isDark ? 'rgba(255,255,255,0.7)' : theme.text.secondary }]}>
                            Based on your recent logs about "left knee stiffness," we've prioritized mobility sessions.
                        </Text>
                        <TouchableOpacity style={[styles.insightAction, { backgroundColor: theme.accent.secondary }]}>
                            <Text style={styles.insightActionText}>Start Suggested Routine</Text>
                            <ChevronRight size={16} color="white" />
                        </TouchableOpacity>
                    </BlurView>
                </Animated.View>

                <View style={styles.grid}>
                    {WORKOUTS.map((workout, index) => (
                        <Animated.View
                            key={workout.id}
                            entering={FadeInDown.delay(index * 100).duration(500)}
                            style={styles.gridItem}
                        >
                            <TouchableOpacity onPress={() => handleOpenModal(workout)} activeOpacity={0.9}>
                                <View style={styles.cardContainer}>
                                    <Image source={{ uri: workout.image }} style={styles.cardImage} />
                                    <View style={styles.cardOverlay} />
                                    <View style={styles.cardContent}>
                                        <View style={styles.playIcon}>
                                            <Play size={16} color="white" fill="white" />
                                        </View>
                                        <View>
                                            <Text style={[styles.cardTitle, { color: '#fff' }]}>{workout.title}</Text>
                                            <Text style={[styles.cardMeta, { color: 'rgba(255,255,255,0.8)' }]}>{workout.duration} • {workout.level}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>

            {/* Workout Detail Modal */}
            <Modal
                visible={!!selectedWorkout}
                transparent
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

                    <Animated.View
                        entering={SlideInUp.springify()}
                        style={[styles.modalContent, dynamicStyles.modalContent]}
                    >
                        {selectedWorkout && (
                            <>
                                <Image source={{ uri: selectedWorkout.image }} style={styles.modalImage} />
                                <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                                    <View style={styles.closeButtonBlur}>
                                        <X color={theme.text.primary} size={20} />
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.modalBody}>
                                    <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>{selectedWorkout.title}</Text>
                                    <View style={styles.tagContainer}>
                                        <View style={styles.tag}>
                                            <Text style={styles.tagText}>{selectedWorkout.level}</Text>
                                        </View>
                                        <View style={styles.tag}>
                                            <Text style={styles.tagText}>{selectedWorkout.duration}</Text>
                                        </View>
                                        {selectedWorkout.tags?.map((tag: string) => (
                                            <View key={tag} style={[styles.tag, { backgroundColor: theme.accent.primary + '20' }]}>
                                                <Text style={[styles.tagText, { color: theme.accent.primary }]}>#{tag}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    <Text style={[styles.modalDescription, dynamicStyles.modalDesc]}>
                                        This guided session focuses on {selectedWorkout.title.toLowerCase()}.
                                        The smart camera will track your form in real-time to ensure safety and effectiveness.
                                    </Text>

                                    <TouchableOpacity
                                        style={[styles.startButton, { backgroundColor: theme.accent.primary, shadowColor: theme.accent.primary }]}
                                        onPress={handleStartSession}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.startButtonText}>Start Session</Text>
                                        <Play size={20} color="white" fill="white" />
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </Animated.View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    headerTitle: {
        ...Typography.h1,
        marginBottom: Spacing.xs,
    },
    headerSubtitle: {
        ...Typography.body,
        color: 'rgba(255,255,255,0.8)', // This will be overridden by dynamicStyles.headerSubtitle if it existed
        marginBottom: Spacing.xl,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.xl,
        gap: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        ...Typography.body,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        marginBottom: Spacing.md,
    },
    cardContainer: {
        height: 200,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        backgroundColor: '#333', // Placeholder, will be dynamic if needed
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    cardContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.md,
        justifyContent: 'space-between',
        height: '100%',
    },
    playIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    cardTitle: {
        ...Typography.h3,
        color: '#fff',
        fontSize: 16,
        marginBottom: 4,
    },
    cardMeta: {
        ...Typography.small,
        color: 'rgba(255,255,255,0.8)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    modalContent: {
        width: '100%',
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    modalImage: {
        width: '100%',
        height: 250,
    },
    modalBody: {
        padding: Spacing.lg,
    },
    closeButton: {
        position: 'absolute',
        top: Spacing.md,
        right: Spacing.md,
        zIndex: 10,
    },
    closeButtonBlur: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        ...Typography.h2,
        marginBottom: Spacing.sm,
    },
    tagContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    tag: {
        backgroundColor: '#444', // Placeholder, will be dynamic if needed
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
    },
    tagText: {
        ...Typography.small,
        color: '#ccc', // Placeholder, will be dynamic if needed
        fontWeight: '600',
    },
    modalDescription: {
        ...Typography.body,
        color: '#ccc', // Placeholder, will be dynamic if needed
        marginBottom: Spacing.xl,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.round,
        gap: Spacing.sm,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    startButtonText: {
        ...Typography.h3,
        fontSize: 16,
        color: '#fff',
    },
    closeSessionButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    insightCard: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        marginBottom: Spacing.xl,
    },
    insightBlur: {
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: BorderRadius.xl,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: Spacing.sm,
    },
    insightLabel: {
        ...Typography.small,
        fontWeight: '700',
        letterSpacing: 1,
    },
    insightTitle: {
        ...Typography.h3,
        marginBottom: Spacing.xs,
    },
    insightDesc: {
        ...Typography.body,
        lineHeight: 22,
        marginBottom: Spacing.lg,
    },
    insightAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: BorderRadius.round,
    },
    insightActionText: {
        ...Typography.body,
        color: 'white',
        fontWeight: '600',
    },
    insightButtonText: {
        ...Typography.h3,
        fontSize: 14,
    },
});
