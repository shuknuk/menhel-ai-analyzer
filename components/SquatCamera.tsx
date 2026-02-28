import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import MediapipePoseView from '../modules/mediapipe-pose';

interface SquatCameraProps {
    onSquatCount?: (count: number) => void;
    onSquatDepth?: (depth: number) => void;
    onFormCorrection?: (message: string) => void;
}

export default function SquatCamera({ onSquatCount, onSquatDepth, onFormCorrection }: SquatCameraProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [squatCount, setSquatCount] = useState(0);
    const [depth, setDepth] = useState(0);
    const [formCorrection, setFormCorrection] = useState<string | null>(null);

    const handleSquatCount = useCallback((event: { nativeEvent: { count: number } }) => {
        const count = event.nativeEvent.count;
        setSquatCount(count);
        onSquatCount?.(count);
    }, [onSquatCount]);

    const handleSquatDepth = useCallback((event: { nativeEvent: { depth: number; angle: number } }) => {
        const depthValue = event.nativeEvent.depth;
        setDepth(depthValue);
        onSquatDepth?.(depthValue);
    }, [onSquatDepth]);

    const handleFormCorrection = useCallback((event: { nativeEvent: { message: string } }) => {
        const message = event.nativeEvent.message;
        setFormCorrection(message);
        onFormCorrection?.(message);
        // Clear the correction after 3 seconds
        setTimeout(() => setFormCorrection(null), 3000);
    }, [onFormCorrection]);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MediapipePoseView
                style={styles.camera}
                onSquatCount={handleSquatCount}
                onSquatDepth={handleSquatDepth}
                onFormCorrection={handleFormCorrection}
            />
            <View style={styles.overlay}>
                <View style={styles.statsContainer}>
                    <Text style={styles.countText}>{squatCount}</Text>
                    <Text style={styles.labelText}>SQUATS</Text>
                </View>
                <View style={styles.depthContainer}>
                    <View style={styles.depthTrack}>
                        <View style={[styles.depthFill, { height: `${depth}%` }]} />
                    </View>
                    <Text style={styles.depthText}>{depth}%</Text>
                </View>
            </View>
            {formCorrection && (
                <View style={styles.formCorrection}>
                    <Text style={styles.formCorrectionText}>{formCorrection}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
    },
    statsContainer: {
        alignItems: 'center',
    },
    countText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'black',
        textShadowRadius: 10,
    },
    labelText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        textShadowColor: 'black',
        textShadowRadius: 5,
    },
    depthContainer: {
        alignItems: 'center',
    },
    depthTrack: {
        width: 12,
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 6,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    depthFill: {
        width: '100%',
        backgroundColor: '#D9ED92',
        borderRadius: 6,
    },
    depthText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        textShadowColor: 'black',
        textShadowRadius: 5,
        marginTop: 8,
    },
    formCorrection: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    formCorrectionText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
