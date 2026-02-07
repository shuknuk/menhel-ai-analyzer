/**
 * Body Screen - Mediapipe Integration
 * Smart Rehab Trainer with Camera and Skeleton Overlay
 */

import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Image, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronLeft, Info, Camera, Zap, Video, Activity, Target } from 'lucide-react-native';
import { GlassCard } from '../../components/GlassCard';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { FormCorrection } from '../../types/health';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';

// HTML content for MediaPipe Pose Landmarker
const MEDIAPIPE_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils"></script>
  <style>
    body { margin: 0; padding: 0; background: #000; overflow: hidden; }
    video { transform: scale(-1, 1); position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
    canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(-1, 1); }
  </style>
</head>
<body>
  <video id="input_video" playsinline webkit-playsinline></video>
  <canvas id="output_canvas"></canvas>
  <script>
    const videoElement = document.getElementById('input_video');
    const canvasElement = document.getElementById('output_canvas');
    const canvasCtx = canvasElement.getContext('2d');

    function onResults(results) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      
      // Draw skeleton
      if (results.poseLandmarks) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'landmarks', data: results.poseLandmarks }));
        
        // Basic drawing logic would go here
        // For now we rely on the React Native overlay or just raw data stream
      }
      canvasCtx.restore();
    }

    const pose = new Pose({locateFile: (file) => {
      return \`https://cdn.jsdelivr.net/npm/@mediapipe/pose/\${file}\`;
    }});
    
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    
    pose.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await pose.send({image: videoElement});
      },
      width: 1280,
      height: 720
    });
    
    camera.start();
    
    // Notify RN that we are running
    setTimeout(() => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'status', data: 'loaded' }));
    }, 1000);
  </script>
</body>
</html>
`;

export default function BodyScreen() {
    const { theme, isDark } = useTheme();
    const router = useRouter();
    const params = useLocalSearchParams();
    const exerciseName = params.exercise || 'Squat';
    const exerciseNameStr = (Array.isArray(exerciseName) ? exerciseName[0] : exerciseName) || 'Squat';
    const webViewRef = useRef<WebView>(null);
    const [webviewLoaded, setWebviewLoaded] = useState(false);
    const [formAlerts, setFormAlerts] = useState<FormCorrection[]>([]);
    const [squatDepth, setSquatDepth] = useState(0);
    const [reps, setReps] = useState(0);
    const [status, setStatus] = useState('Position yourself in the frame');
    const [showTutorial, setShowTutorial] = useState(true);

    const dynamicStyles = StyleSheet.create({
        container: {
            backgroundColor: theme.background.primary,
        },
        header: {
            backgroundColor: theme.background.secondary,
            borderBottomColor: theme.background.tertiary,
        },
        headerTitle: {
            color: theme.text.primary,
        },
        statusBadge: {
            backgroundColor: theme.background.primary,
            borderColor: theme.accent.tertiary,
        },
        statusText: {
            color: theme.text.secondary,
        },
        controls: {
            backgroundColor: theme.background.secondary,
            borderTopColor: theme.background.tertiary,
        },
        statCard: {
            backgroundColor: theme.background.primary,
            borderColor: theme.accent.tertiary,
            borderWidth: 1,
        },
        statLabel: {
            color: theme.accent.secondary,
        },
        statValue: {
            color: theme.text.primary,
        },
        depthTrack: {
            backgroundColor: theme.background.tertiary,
        },
    });

    const handleWebViewMessage = (event: WebViewMessageEvent) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);

            if (message.type === 'status' && message.data === 'loaded') {
                setWebviewLoaded(true);
            }

            if (message.type === 'landmarks') {
                // Mock logic for demo purposes
                const isSquat = exerciseNameStr.toLowerCase().includes('squat');
                const depth = Math.floor(Math.random() * 100);

                if (isSquat) {
                    setSquatDepth(depth);
                    if (depth > 80 && Math.random() > 0.95) {
                        setReps(r => r + 1);
                        setStatus('Excellent depth!');
                        setTimeout(() => setStatus('Go again!'), 2000);
                    }
                } else {
                    // Mobility/Flow handling
                    setSquatDepth(depth); // Reusing depth bar for "Range of Motion"
                    if (depth > 70 && Math.random() > 0.98) {
                        setReps(r => r + 1);
                        setStatus('Great stretch holding...');
                        setTimeout(() => setStatus('Switching side soon'), 3000);
                    }
                }

                if (Math.random() > 0.99) {
                    setFormAlerts([{
                        id: Date.now().toString(),
                        joint: isSquat ? 'knee' : 'posture',
                        message: isSquat
                            ? "Keep your knees aligned over toes"
                            : "Keep your spine neutral during flow",
                        severity: 'medium',
                        timestamp: new Date()
                    }]);
                    setTimeout(() => setFormAlerts([]), 3000);
                }
            }
        } catch (e) {
            console.error("WebView message error:", e);
        }
    };

    // Initial loading handled in main view

    return (
        <SafeAreaView style={[styles.mainContainer, dynamicStyles.container]}>
            <View style={[styles.header, dynamicStyles.header, { borderBottomColor: theme.accent.tertiary }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>AI Trainer</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Info size={20} color={theme.text.muted} />
                </TouchableOpacity>
            </View>

            {/* AI Tracking Status */}
            <View style={[styles.statusBadge, dynamicStyles.statusBadge]}>
                <View style={[styles.pulseDot, { backgroundColor: theme.status.success }]} />
                <Text style={[styles.statusText, dynamicStyles.statusText]}>AI Active: {exerciseName} Detection</Text>
            </View>

            {/* Camera / MediaPipe Section */}
            <View style={styles.cameraSection}>
                {!webviewLoaded && (
                    <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background.primary, zIndex: 10 }]}>
                        <ActivityIndicator size="large" color={theme.accent.primary} />
                        <Text style={{ marginTop: 10, color: theme.text.primary }}>Initializing Rebound Trainer...</Text>
                    </View>
                )}
                <WebView
                    ref={webViewRef}
                    source={{ html: MEDIAPIPE_HTML }}
                    style={[styles.webview, { opacity: webviewLoaded ? 1 : 0 }]}
                    originWhitelist={['*']}
                    allowsInlineMediaPlayback
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabled
                    onMessage={handleWebViewMessage}
                />

                <BlurView intensity={20} style={styles.statsOverlay}>
                    <View style={[styles.statCard, dynamicStyles.statCard]}>
                        <Activity size={20} color={theme.accent.teal} />
                        <View>
                            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                                {(Array.isArray(exerciseName) ? exerciseName[0] : exerciseName)?.toLowerCase().includes('squat') ? 'REPS' : 'STREAMS'}
                            </Text>
                            <Text style={[styles.statValue, dynamicStyles.statValue]}>{reps}</Text>
                        </View>
                    </View>

                    <View style={[styles.statCard, dynamicStyles.statCard]}>
                        <Target size={20} color={theme.accent.primary} />
                        <View>
                            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                                {(Array.isArray(exerciseName) ? exerciseName[0] : exerciseName)?.toLowerCase().includes('squat') ? 'DEPTH' : 'FLOW %'}
                            </Text>
                            <Text style={[styles.statValue, dynamicStyles.statValue]}>{squatDepth}%</Text>
                        </View>
                    </View>
                </BlurView>

                {/* Depth Bar */}
                <View style={styles.depthBarContainer}>
                    <View style={[styles.depthTrack, dynamicStyles.depthTrack]}>
                        <Animated.View
                            style={[
                                styles.depthFill,
                                {
                                    height: `${squatDepth}%`,
                                    backgroundColor: squatDepth > 80 ? theme.accent.teal : theme.accent.primary
                                }
                            ]}
                        />
                    </View>
                </View>
            </View>

            {/* AI Control Bar */}
            <View style={[styles.controls, dynamicStyles.controls]}>
                <Text style={[styles.instruction, { color: theme.text.primary }]}>{status}</Text>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.accent.primary }]}>
                    <Camera size={20} color={theme.text.inverse} />
                    <Text style={styles.actionText}>Calibrate Pose</Text>
                </TouchableOpacity>
            </View>

            {/* Form Alerts */}
            {formAlerts.length > 0 && (
                <Animated.View entering={FadeInDown} style={[styles.alertContainer, { backgroundColor: theme.accent.red }]}>
                    <View style={[styles.alertIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Info color="#fff" size={24} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.alertTitle, { color: '#fff' }]}>AI Logic Correction</Text>
                        <Text style={[styles.alertText, { color: '#fff' }]}>{formAlerts[0].message}</Text>
                    </View>
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...Typography.body,
        marginTop: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: 10,
        paddingBottom: Spacing.md,
    },
    backButton: {
        padding: 8,
        borderRadius: BorderRadius.round,
    },
    headerTitle: {
        ...Typography.h2,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: Spacing.xs,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderBottomWidth: 1,
        gap: Spacing.sm,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        ...Typography.caption,
        fontWeight: '600',
    },
    cameraSection: {
        flex: 1,
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    statsOverlay: {
        position: 'absolute',
        top: Spacing.lg,
        left: Spacing.lg,
        right: Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: Spacing.md,
    },
    statCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        gap: Spacing.md,
        borderWidth: 1,
    },
    statLabel: {
        ...Typography.caption,
        fontWeight: '700',
    },
    statValue: {
        ...Typography.h2,
        fontSize: 24,
    },
    depthBarContainer: {
        position: 'absolute',
        right: Spacing.lg,
        top: '20%',
        bottom: '20%',
        width: 12,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    depthTrack: {
        width: 8,
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden',
    },
    depthFill: {
        width: '100%',
        borderRadius: 4,
    },
    controls: {
        padding: Spacing.lg,
        paddingBottom: 120, // Clear tab bar explicitly
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    instruction: {
        ...Typography.body,
        flex: 1,
        marginRight: Spacing.md,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.lg,
        gap: Spacing.xs,
    },
    actionText: {
        ...Typography.body,
        fontWeight: 'bold',
        color: 'white',
    },
    alertContainer: {
        position: 'absolute',
        bottom: Spacing.xl,
        left: Spacing.lg,
        right: Spacing.lg,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        gap: Spacing.md,
    },
    alertIcon: {
        borderRadius: BorderRadius.round,
        padding: 8,
    },
    alertTitle: {
        ...Typography.h3,
        fontSize: 16,
    },
    alertText: {
        ...Typography.body,
        fontSize: 14,
    },
    searchInput: {
        flex: 1,
        ...Typography.body,
        padding: 0,
    },
});
