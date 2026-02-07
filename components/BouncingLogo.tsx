import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
    Easing
} from 'react-native-reanimated';

interface BouncingLogoProps {
    size?: number;
    color?: string;
}

export const BouncingLogo: React.FC<BouncingLogoProps> = ({
    size = 40,
    color = '#636B2F' // Theme accent primary
}) => {
    const translateY = useSharedValue(0);
    const scaleY = useSharedValue(1);
    const scaleX = useSharedValue(1);

    useEffect(() => {
        translateY.value = withRepeat(
            withSequence(
                withTiming(-size * 0.8, { duration: 600, easing: Easing.out(Easing.quad) }),
                withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) })
            ),
            -1,
            false
        );

        // Dynamic squash and stretch
        scaleY.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 600 }), // In air
                withTiming(0.6, { duration: 150 }), // Impact squash
                withTiming(1, { duration: 150 })  // Recovery
            ),
            -1,
            false
        );

        scaleX.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 600 }), // In air
                withTiming(1.3, { duration: 150 }), // Impact stretch
                withTiming(1, { duration: 150 })  // Recovery
            ),
            -1,
            false
        );
    }, [size]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { scaleY: scaleY.value },
            { scaleX: scaleX.value },
        ],
    }));

    const shadowStyle = useAnimatedStyle(() => ({
        opacity: 1 - (Math.abs(translateY.value) / (size * 0.8)),
        transform: [{ scale: 1 - (Math.abs(translateY.value) / (size * 1.5)) }],
    }));

    return (
        <View style={[styles.container, { width: size, height: size * 1.5 }]}>
            <Animated.View
                style={[
                    styles.ball,
                    { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
                    animatedStyle
                ]}
            />
            <Animated.View
                style={[
                    styles.shadow,
                    { width: size * 0.8, height: size * 0.15, borderRadius: size * 0.075 },
                    shadowStyle
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    ball: {
        zIndex: 2,
    },
    shadow: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginTop: 2,
        zIndex: 1,
    },
});
