/**
 * GlassCard Component
 * Reusable glassmorphism container with blur effect
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
    entering?: 'fade' | 'fadeUp' | 'fadeDown' | 'none';
    delay?: number;
    tint?: 'light' | 'dark' | 'default';
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function GlassCard({
    children,
    style,
    intensity = 80,
    entering = 'fadeUp',
    delay = 0,
    tint = 'dark',
}: GlassCardProps) {
    const getEnteringAnimation = () => {
        switch (entering) {
            case 'fade':
                return FadeIn.delay(delay).duration(600);
            case 'fadeUp':
                return FadeInUp.delay(delay).duration(600).springify();
            case 'fadeDown':
                return FadeInDown.delay(delay).duration(600).springify();
            case 'none':
                return undefined;
            default:
                return FadeInUp.delay(delay).duration(600).springify();
        }
    };

    return (
        <AnimatedBlurView
            intensity={intensity}
            tint={tint}
            style={[styles.container, style]}
            entering={getEnteringAnimation()}
        >
            <View style={styles.overlay}>
                {children}
            </View>
        </AnimatedBlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.glass.border,
        backgroundColor: 'rgba(255, 255, 255, 0.4)', // Base layer for light mode depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    overlay: {
        backgroundColor: Colors.glass.light,
        padding: Spacing.md,
    },
});

export default GlassCard;
