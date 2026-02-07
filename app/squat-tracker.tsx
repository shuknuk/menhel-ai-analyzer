import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import SquatCamera from '../components/SquatCamera';
import { useTheme } from '../hooks/useTheme';

export default function SquatTrackerScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <SquatCamera />

            <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: theme.background.secondary }]}
                onPress={() => router.back()}
            >
                <X size={24} color={theme.text.primary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
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
});
