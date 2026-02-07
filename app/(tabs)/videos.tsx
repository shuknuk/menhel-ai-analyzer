import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, FlatList, Modal, Image } from 'react-native';
import { Play, Video, Camera, Info, CheckCircle2, ChevronLeft, RotateCcw, Activity, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { GlassCard } from '../../components/GlassCard';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

const VIDEOS = [
    {
        id: '1',
        title: 'Hip Mobility Flow',
        duration: '12m',
        difficulty: 'Easy',
        tag: 'rehab',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
        exercises: ['Glute Bridge', 'Lizard Stretch', 'Butterfly Flow']
    },
    {
        id: '2',
        title: 'Deep Squat Mechanics',
        duration: '08m',
        difficulty: 'Intermediate',
        tag: 'squat',
        thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
        exercises: ['Bodyweight Squat', 'Goblet Squat', 'Pause Squat']
    },
    {
        id: '3',
        title: 'Lower Back Recovery',
        duration: '15m',
        difficulty: 'Easy',
        tag: 'spine',
        thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
        exercises: ['Cat-Cow', 'Bird-Dog', 'Childs Pose']
    },
];

export default function VideosScreen() {
    const { theme, isDark } = useTheme();
    const router = useRouter();
    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    const dynamicStyles = StyleSheet.create({
        container: { backgroundColor: theme.background.primary },
        header: { backgroundColor: theme.background.primary },
        title: { color: theme.text.primary, ...Typography.h1 },
        subtitle: { color: theme.text.muted, ...Typography.body },
        videoTitle: { color: theme.text.primary, ...Typography.h3, fontSize: 16 },
        tagBadge: { backgroundColor: theme.accent.primary + '15' },
        tagText: { color: theme.accent.primary, fontWeight: '700', fontSize: 10 },
        cameraTitle: {
            color: theme.text.inverse,
            ...Typography.h3,
            fontWeight: '800',
        },
        cameraDesc: {
            color: theme.text.inverse,
            opacity: 0.9,
            fontSize: 13,
        },
        actionText: {
            color: theme.text.inverse,
            fontWeight: '700',
        },
        modalContent: {
            backgroundColor: theme.background.secondary,
            borderRadius: BorderRadius.xl,
            padding: Spacing.lg,
            borderWidth: 1,
            borderColor: theme.background.tertiary,
        },
        exerciseItem: {
            backgroundColor: theme.background.primary,
            borderColor: theme.background.tertiary,
        }
    });

    const handleStartWorkout = (exercise: string) => {
        setSelectedVideo(null);
        // Navigate to body tab with params
        router.push({
            pathname: '/(tabs)/body',
            params: { exercise }
        });
    };

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            <View style={[styles.header, dynamicStyles.header]}>
                <View>
                    <Text style={dynamicStyles.title}>Workouts</Text>
                    <Text style={dynamicStyles.subtitle}>AI-guided recovery sessions</Text>
                </View>
                <TouchableOpacity style={styles.infoButton}>
                    <Info size={24} color={theme.text.muted} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
            >
                {/* AI Form Check Invite */}
                <Animated.View entering={FadeInDown.delay(200)}>
                    <TouchableOpacity
                        style={[styles.cameraCard, { backgroundColor: theme.accent.primary }]}
                        onPress={() => handleStartWorkout('Squat')}
                    >
                        <View style={styles.cameraRow}>
                            <Camera size={32} color={theme.text.inverse} />
                            <View style={{ flex: 1 }}>
                                <Text style={dynamicStyles.cameraTitle}>Quick AI Squat Check</Text>
                                <Text style={dynamicStyles.cameraDesc}>Instant feedback on your squat depth and form.</Text>
                            </View>
                        </View>
                        <View style={styles.cameraAction}>
                            <Text style={dynamicStyles.actionText}>Jump In</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Video Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>RECOVERY LIBRARY</Text>
                </View>

                {VIDEOS.map((item, index) => (
                    <Animated.View key={item.id} entering={FadeInDown.delay(300 + index * 100)}>
                        <TouchableOpacity
                            style={[styles.videoCard, { backgroundColor: theme.background.secondary, borderColor: theme.background.tertiary }]}
                            onPress={() => setSelectedVideo(item)}
                        >
                            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                            <View style={styles.videoInfo}>
                                <View style={styles.videoMeta}>
                                    <Text style={dynamicStyles.videoTitle}>{item.title}</Text>
                                    <View style={[styles.tagBadge, dynamicStyles.tagBadge]}>
                                        <Text style={dynamicStyles.tagText}>{item.tag.toUpperCase()}</Text>
                                    </View>
                                </View>
                                <View style={styles.videoDetails}>
                                    <Activity size={14} color={theme.text.muted} />
                                    <Text style={{ color: theme.text.muted, fontSize: 12 }}>{item.duration} • {item.difficulty}</Text>
                                </View>
                            </View>
                            <View style={[styles.playButton, { backgroundColor: theme.accent.primary }]}>
                                <Play size={20} color={theme.text.inverse} fill={theme.text.inverse} />
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </ScrollView>

            <View style={{ height: 40 }} />

            {/* Exercise Picker Modal */}
            <Modal
                visible={!!selectedVideo}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedVideo(null)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        onPress={() => setSelectedVideo(null)}
                    />
                    <View style={[styles.modalContent, dynamicStyles.modalContent]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text.primary }]}>{selectedVideo?.title}</Text>
                            <TouchableOpacity onPress={() => setSelectedVideo(null)}>
                                <X size={24} color={theme.text.muted} />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.modalSubtitle, { color: theme.text.secondary }]}>Select an exercise to start AI analysis:</Text>

                        {selectedVideo?.exercises.map((exercise: string, idx: number) => (
                            <TouchableOpacity
                                key={idx}
                                style={[styles.exerciseItem, dynamicStyles.exerciseItem]}
                                onPress={() => handleStartWorkout(exercise)}
                            >
                                <View style={styles.exerciseInfo}>
                                    <Activity size={18} color={theme.accent.primary} />
                                    <Text style={[styles.exerciseName, { color: theme.text.primary }]}>{exercise}</Text>
                                </View>
                                <ChevronLeft size={20} color={theme.text.muted} style={{ transform: [{ rotate: '180deg' }] }} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 10,
        paddingBottom: Spacing.lg,
        paddingHorizontal: Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    scroll: { flex: 1 },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: 120,
    },
    infoButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraCard: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
        gap: Spacing.md,
    },
    cameraRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        alignItems: 'center',
    },
    cameraAction: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 10,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    sectionHeader: {
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
    },
    videoCard: {
        flexDirection: 'row',
        padding: Spacing.md,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.md,
        alignItems: 'center',
        gap: Spacing.md,
        borderWidth: 1,
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: BorderRadius.lg,
    },
    videoInfo: {
        flex: 1,
        gap: 4,
    },
    videoMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tagBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    videoDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    playButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    modalContent: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    modalTitle: {
        ...Typography.h2,
        fontSize: 20,
        textAlign: 'center',
    },
    modalSubtitle: {
        ...Typography.caption,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    exerciseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.sm,
    },
    exerciseInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    exerciseName: {
        ...Typography.body,
        fontWeight: '600',
    },
});
