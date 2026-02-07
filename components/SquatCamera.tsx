import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { useCameraPermissions } from 'expo-camera'; // Usage: Just for permission request logic
import MediapipePoseView from '../modules/mediapipe-pose';

export default function SquatCamera() {
    const [permission, requestPermission] = useCameraPermissions();
    const [squatCount, setSquatCount] = useState(0);

    const handleSquatCount = useCallback((event: { nativeEvent: { count: number } }) => {
        setSquatCount(event.nativeEvent.count);
    }, []);

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
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
            />
            <View style={styles.overlay}>
                <Text style={styles.countText}>Squats: {squatCount}</Text>
            </View>
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
        alignItems: 'center',
    },
    countText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'black',
        textShadowRadius: 10,
    },
});
