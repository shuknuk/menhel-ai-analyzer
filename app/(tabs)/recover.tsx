/**
 * Recover Screen - Workouts & Rehab
 * Grid layout with video popups leading to Smart Mirror
 */

import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Modal, SafeAreaView } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInUp } from 'react-native-reanimated';
import { Play, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

// Mock Workout Data
const WORKOUTS = [
    { id: '1', title: 'ACL Rehab', duration: '15 min', level: 'Beginner', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop' },
    { id: '2', title: 'Lower Back', duration: '20 min', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=600&auto=format&fit=crop' },
    { id: '3', title: 'Shoulder Mobility', duration: '12 min', level: 'All Levels', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=600&auto=format&fit=crop' },
    { id: '4', title: 'Knee Strength', duration: '18 min', level: 'Beginner', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?q=80&w=600&auto=format&fit=crop' },
    { id: '5', title: 'Hip Flexor Flow', duration: '25 min', level: 'Advanced', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop' },
    { id: '6', title: 'Ankle Stability', duration: '10 min', level: 'Beginner', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop' },
];

export default function RecoverScreen() {
    const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
    const [isSessionActive, setIsSessionActive] = useState(false);

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
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeIn.duration(600)}>
                    <Text style={styles.headerTitle}>Recover</Text>
                    <Text style={styles.headerSubtitle}>Physical Therapy & Workouts</Text>
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
                                            <Text style={styles.cardTitle}>{workout.title}</Text>
                                            <Text style={styles.cardMeta}>{workout.duration} • {workout.level}</Text>
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
                        style={styles.modalContent}
                    >
                        {selectedWorkout && (
                            <>
                                <Image source={{ uri: selectedWorkout.image }} style={styles.modalImage} />
                                <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                                    <View style={styles.closeButtonBlur}>
                                        <X color={Colors.text.primary} size={20} />
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.modalBody}>
                                    <Text style={styles.modalTitle}>{selectedWorkout.title}</Text>
                                    <View style={styles.tagContainer}>
                                        <View style={styles.tag}>
                                            <Text style={styles.tagText}>{selectedWorkout.level}</Text>
                                        </View>
                                        <View style={styles.tag}>
                                            <Text style={styles.tagText}>{selectedWorkout.duration}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.modalDescription}>
                                        This guided session focuses on {selectedWorkout.title.toLowerCase()}.
                                        The smart camera will track your form in real-time to ensure safety and effectiveness.
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.startButton}
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
        backgroundColor: Colors.background.primary,
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    headerTitle: {
        ...Typography.h1,
        marginBottom: Spacing.xs,
    },
    headerSubtitle: {
        ...Typography.body,
        color: Colors.text.muted,
        marginBottom: Spacing.xl,
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
        backgroundColor: Colors.background.secondary,
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
        backgroundColor: Colors.background.secondary,
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
        backgroundColor: Colors.background.tertiary,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
    },
    tagText: {
        ...Typography.small,
        color: Colors.text.secondary,
        fontWeight: '600',
    },
    modalDescription: {
        ...Typography.body,
        color: Colors.text.secondary,
        marginBottom: Spacing.xl,
    },
    startButton: {
        backgroundColor: Colors.accent.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.round,
        gap: Spacing.sm,
        shadowColor: Colors.accent.primary,
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
});
