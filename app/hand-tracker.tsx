import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Hand, HandMetal } from 'lucide-react-native';
import { HandTrackerView, HandLandmark } from '../modules/mediapipe-pose';
import { useTheme } from '../hooks/useTheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Landmark indices for drawing connections
const FINGER_CONNECTIONS = [
    // Thumb
    [0, 1], [1, 2], [2, 3], [3, 4],
    // Index
    [0, 5], [5, 6], [6, 7], [7, 8],
    // Middle
    [0, 9], [9, 10], [10, 11], [11, 12],
    // Ring
    [0, 13], [13, 14], [14, 15], [15, 16],
    // Little
    [0, 17], [17, 18], [18, 19], [19, 20],
    // Palm
    [5, 9], [9, 13], [13, 17],
];

// Finger tip indices
const FINGER_TIPS = [4, 8, 12, 16, 20];

export default function HandTrackerScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    const [openCloseCount, setOpenCloseCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [landmarks, setLandmarks] = useState<HandLandmark[]>([]);
    const [avgTipDistance, setAvgTipDistance] = useState(0);

    const handleHandOpenClose = useCallback((event: { nativeEvent: { count: number } }) => {
        setOpenCloseCount(event.nativeEvent.count);
    }, []);

    const handleLandmarks = useCallback((event: { nativeEvent: { landmarks: HandLandmark[] } }) => {
        setLandmarks(event.nativeEvent.landmarks);
    }, []);

    const handleHandState = useCallback((event: { nativeEvent: { isOpen: boolean; avgTipDistance: number } }) => {
        setIsOpen(event.nativeEvent.isOpen);
        setAvgTipDistance(event.nativeEvent.avgTipDistance);
    }, []);

    // Render landmark dots
    const renderLandmarks = () => {
        if (landmarks.length === 0) return null;

        // Camera preview is mirrored and rotated, so we need to adjust coordinates
        // x: 0 = left, 1 = right (flip it for mirror)
        // y: 0 = top, 1 = bottom

        return (
            <>
                {/* Draw connections */}
                {FINGER_CONNECTIONS.map(([startIdx, endIdx], idx) => {
                    const start = landmarks[startIdx];
                    const end = landmarks[endIdx];
                    if (!start || !end) return null;

                    // Mirror x coordinate and convert to screen space
                    const x1 = (1 - start.x) * SCREEN_WIDTH;
                    const y1 = start.y * SCREEN_HEIGHT;
                    const x2 = (1 - end.x) * SCREEN_WIDTH;
                    const y2 = end.y * SCREEN_HEIGHT;

                    // Calculate line angle and length
                    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
                    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                    return (
                        <View
                            key={`line-${idx}`}
                            style={[
                                styles.connectionLine,
                                {
                                    left: x1,
                                    top: y1,
                                    width: length,
                                    transform: [{ rotate: `${angle}deg` }],
                                    transformOrigin: 'left center',
                                },
                            ]}
                        />
                    );
                })}
                {/* Draw landmark dots */}
                {landmarks.map((landmark, idx) => {
                    // Mirror x coordinate and convert to screen space
                    const x = (1 - landmark.x) * SCREEN_WIDTH;
                    const y = landmark.y * SCREEN_HEIGHT;
                    const isTip = FINGER_TIPS.includes(idx);

                    return (
                        <View
                            key={`point-${idx}`}
                            style={[
                                styles.landmarkDot,
                                isTip && styles.fingerTipDot,
                                {
                                    left: x - (isTip ? 8 : 5),
                                    top: y - (isTip ? 8 : 5),
                                    backgroundColor: isTip
                                        ? (isOpen ? '#4ADE80' : '#F87171')
                                        : '#60A5FA',
                                },
                            ]}
                        />
                    );
                })}
            </>
        );
    };

    return (
        <View style={styles.container}>
            <HandTrackerView
                style={styles.camera}
                onHandOpenClose={handleHandOpenClose}
                onLandmarks={handleLandmarks}
                onHandState={handleHandState}
            />

            {/* Landmark overlay */}
            {renderLandmarks()}

            {/* Header */}
            <View style={[styles.header, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <Text style={styles.title}>Hand Tracker Test</Text>
                <Text style={styles.subtitle}>
                    {landmarks.length > 0 ? 'Hand detected!' : 'Show your hand...'}
                </Text>
            </View>

            {/* Close button */}
            <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: theme.background.secondary }]}
                onPress={() => router.back()}
            >
                <X size={24} color={theme.text.primary} />
            </TouchableOpacity>

            {/* Stats overlay */}
            <View style={styles.statsOverlay}>
                {/* Count display */}
                <View style={styles.countContainer}>
                    <Text style={styles.countLabel}>OPEN/CLOSE</Text>
                    <Text style={styles.countValue}>{openCloseCount}</Text>
                </View>

                {/* Hand state indicator */}
                <View style={[styles.stateContainer, { backgroundColor: isOpen ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)' }]}>
                    {isOpen ? (
                        <Hand size={32} color="#4ADE80" />
                    ) : (
                        <HandMetal size={32} color="#F87171" />
                    )}
                    <Text style={[styles.stateText, { color: isOpen ? '#4ADE80' : '#F87171' }]}>
                        {isOpen ? 'OPEN' : 'CLOSED'}
                    </Text>
                </View>

                {/* Debug info */}
                <View style={styles.debugContainer}>
                    <Text style={styles.debugLabel}>Tip Distance</Text>
                    <Text style={styles.debugValue}>{avgTipDistance.toFixed(3)}</Text>
                    <Text style={styles.debugHint}>Threshold: 0.22</Text>
                </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                    Open and close your hand to increment counter
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 16,
        borderRadius: 12,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginTop: 4,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    landmarkDot: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#60A5FA',
    },
    fingerTipDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    connectionLine: {
        position: 'absolute',
        height: 3,
        backgroundColor: 'rgba(96, 165, 250, 0.6)',
        borderRadius: 1.5,
    },
    statsOverlay: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    countContainer: {
        alignItems: 'center',
    },
    countLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '600',
    },
    countValue: {
        fontSize: 72,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'black',
        textShadowRadius: 10,
    },
    stateContainer: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        minWidth: 80,
    },
    stateText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
    debugContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 8,
    },
    debugLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
    },
    debugValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    debugHint: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
    },
    instructions: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    instructionText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        textAlign: 'center',
    },
});