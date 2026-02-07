/**
 * GlassCard Component
 * Reusable glassmorphism container with blur effect
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

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
    tint,
}: GlassCardProps) {
    const { isDark, theme } = useTheme();
    const activeTint = tint || (isDark ? 'dark' : 'light');
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
            intensity={isDark ? 50 : 80}
            tint={activeTint}
            style={[
                styles.container,
                {
                    borderColor: theme.accent.tertiary,
                    backgroundColor: isDark ? 'rgba(26, 29, 14, 0.6)' : 'rgba(255, 255, 255, 0.6)'
                },
                style
            ]}
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
    },
    overlay: {
        padding: Spacing.md,
    },
});

export default GlassCard;
