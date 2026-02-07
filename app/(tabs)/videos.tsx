import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, FlatList, Modal, Image } from 'react-native';
import { Play, Video, Camera, Info, CheckCircle2, ChevronLeft, RotateCcw, Activity } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
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
    },
    {
        id: '2',
        title: 'Deep Squat Mechanics',
        duration: '08m',
        difficulty: 'Intermediate',
        tag: 'squat',
        thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '3',
        title: 'Lower Back Recovery',
        duration: '15m',
        difficulty: 'Easy',
        tag: 'spine',
        thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    },
];

export default function VideosScreen() {
    const { theme } = useTheme();
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const dynamicStyles = StyleSheet.create({
        container: { backgroundColor: theme.background.primary },
        header: { backgroundColor: theme.background.secondary, borderBottomColor: theme.background.tertiary },
        title: { color: theme.text.primary, ...Typography.h2 },
        subtitle: { color: theme.text.muted, ...Typography.body, fontSize: 13 },
        videoTitle: { color: theme.text.primary, ...Typography.h3, fontSize: 16 },
        tagBadge: { backgroundColor: 'rgba(96, 108, 56, 0.1)' },
        tagText: { color: theme.accent.primary, fontWeight: '700', fontSize: 10 },
    });

    const startFormAnalysis = () => {
        setIsCameraActive(true);
        setIsAnalyzing(true);
        // Placeholder for MediaPipe init
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

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
                {/* AI Form Check Invite */}
                <Animated.View entering={FadeInDown.delay(200)}>
                    <TouchableOpacity
                        style={[styles.cameraCard, { backgroundColor: theme.accent.primary }]}
                        onPress={startFormAnalysis}
                    >
                        <View style={styles.cameraRow}>
                            <Camera size={32} color="#fff" />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cameraTitle}>AI Form Check</Text>
                                <Text style={styles.cameraDesc}>Get real-time feedback on your squat form using AI vision.</Text>
                            </View>
                        </View>
                        <View style={styles.cameraAction}>
                            <Text style={styles.actionText}>Start Analysis</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Video Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>RECOVERY LIBRARY</Text>
                </View>

                <FlatList
                    data={VIDEOS}
                    scrollEnabled={false}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(300 + index * 100)}>
                            <TouchableOpacity style={[styles.videoCard, { backgroundColor: theme.background.secondary, borderColor: theme.background.tertiary }]}>
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
                                    <Play size={20} color="#fff" fill="#fff" />
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                />
            </ScrollView>

            <View style={{ height: 100 }} />

            {/* AI Analysis Modal Placeholder */}
            <Modal visible={isCameraActive} animationType="slide">
                <View style={[styles.modalContent, { backgroundColor: '#000' }]}>
                    <View style={styles.cameraPlaceholder}>
                        <View style={styles.skeletonOverlay}>
                            {/* Mock skeleton tracking dots */}
                            <View style={[styles.dot, { top: '30%', left: '50%' }]} />
                            <View style={[styles.dot, { top: '45%', left: '40%' }]} />
                            <View style={[styles.dot, { top: '45%', left: '60%' }]} />
                            <View style={[styles.dot, { top: '70%', left: '35%' }]} />
                            <View style={[styles.dot, { top: '70%', left: '65%' }]} />
                        </View>

                        <View style={styles.feedbackOverlay}>
                            <GlassCard style={styles.aiFeedback}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Activity size={24} color={theme.accent.teal} />
                                    <Text style={{ color: '#fff', fontWeight: '800' }}>AI SQUAT ANALYSIS</Text>
                                </View>
                                <Text style={styles.feedbackText}>
                                    Lower your hips slightly more. Your knees are tracking well over your toes. Depth: 85%
                                </Text>
                            </GlassCard>
                        </View>
                    </View>

                    <SafeAreaView style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setIsCameraActive(false)} style={styles.closeButton}>
                            <ChevronLeft size={28} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.recordingIndicator}>
                            <View style={styles.redDot} />
                            <Text style={{ color: '#fff', fontWeight: '700' }}>ANALYZING FORM</Text>
                        </View>
                    </SafeAreaView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.resetButton}>
                            <RotateCcw size={24} color="#fff" />
                            <Text style={{ color: '#fff' }}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.stopButton, { backgroundColor: theme.accent.red }]} onPress={() => setIsCameraActive(false)}>
                            <Text style={{ color: '#fff', fontWeight: '800' }}>FINISH SESSION</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 20,
        paddingBottom: Spacing.lg,
        paddingHorizontal: Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    scroll: { padding: Spacing.lg },
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
    cameraTitle: {
        color: '#fff',
        ...Typography.h3,
        fontWeight: '800',
    },
    cameraDesc: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 13,
    },
    cameraAction: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 10,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    actionText: {
        color: '#fff',
        fontWeight: '700',
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
    modalContent: {
        flex: 1,
    },
    cameraPlaceholder: {
        flex: 1,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
    },
    skeletonOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        position: 'absolute',
        width: 12,
        height: 12,
        backgroundColor: '#D1E16A',
        borderRadius: 6,
        shadowColor: '#D1E16A',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    feedbackOverlay: {
        position: 'absolute',
        bottom: 120,
        left: Spacing.lg,
        right: Spacing.lg,
    },
    aiFeedback: {
        padding: Spacing.lg,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    feedbackText: {
        color: '#fff',
        marginTop: 8,
        lineHeight: 20,
        fontSize: 15,
    },
    modalHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recordingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: BorderRadius.round,
    },
    redDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    modalFooter: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: Spacing.xl,
        gap: Spacing.md,
    },
    resetButton: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    stopButton: {
        flex: 1,
        height: 54,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
