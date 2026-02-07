/**
 * Wellness Trend Graph
 * Visualizes mood vs pain correlation over time
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line } from 'react-native-svg';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

interface DataPoint {
    date: string;
    mood: number;
    pain: number;
}

interface WellnessGraphProps {
    data: DataPoint[];
    height?: number;
}

export function WellnessGraph({ data, height = 200 }: WellnessGraphProps) {
    const { theme } = useTheme();
    const width = 320; // Fixed width for now, could be responsive

    // Calculate path for Mood (Curved line)
    const getPath = (points: DataPoint[], key: 'mood' | 'pain') => {
        if (points.length === 0) return '';

        const firstPoint = points[0];
        const xStep = width / (points.length - 1);

        // Fix: Map 0-10 score to Y coordinate (inverted, 0 at bottom)
        let path = `M 0 ${height - (firstPoint[key] / 10) * height}`;

        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            const x = i * xStep;
            const y = height - (point[key] / 10) * height;

            // Simple line smoothing (bezier could be added here for more smoothness)
            path += ` L ${x} ${y}`;
        }

        return path;
    };

    const moodPath = getPath(data, 'mood');
    const painPath = getPath(data, 'pain');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Correlation Trend</Text>
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: theme.accent.teal }]} />
                        <Text style={[styles.legendText, { color: theme.text.secondary }]}>Mood</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: theme.accent.secondary }]} />
                        <Text style={[styles.legendText, { color: theme.text.secondary }]}>Pain</Text>
                    </View>
                </View>
            </View>

            <View style={{ height, width }}>
                <Svg height={height} width={width}>
                    <Defs>
                        <LinearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={theme.accent.teal} stopOpacity="0.5" />
                            <Stop offset="1" stopColor={theme.accent.teal} stopOpacity="0" />
                        </LinearGradient>
                        <LinearGradient id="painGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <Stop offset="0%" stopColor={theme.accent.secondary} stopOpacity="0.3" />
                            <Stop offset="100%" stopColor={theme.accent.secondary} stopOpacity="0" />
                        </LinearGradient>
                    </Defs>

                    {/* Grid Lines */}
                    <Line x1="0" y1={height} x2={width} y2={height} stroke={theme.background.tertiary} strokeWidth="1" />
                    <Line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={theme.background.tertiary} strokeWidth="1" strokeDasharray="5 5" />

                    {/* Mood Path */}
                    <Path
                        d={`${moodPath} L ${width} ${height} L 0 ${height} Z`}
                        fill="url(#moodGradient)"
                    />
                    <Path
                        d={moodPath}
                        fill="none"
                        stroke={theme.accent.teal}
                        strokeWidth="3"
                    />

                    {/* Pain Path (Secondary) */}
                    <Path
                        d={`${painPath} L ${width} ${height} L 0 ${height} Z`}
                        fill="url(#painGradient)"
                    />
                    <Path
                        d={painPath}
                        fill="none"
                        stroke={theme.accent.secondary}
                        strokeWidth="2"
                    />

                    {/* Data Points */}
                    {data.map((point, index) => {
                        const x = (index / (data.length - 1)) * width;
                        const y = height - (point.mood / 10) * height;
                        return (
                            <Circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="4"
                                fill={theme.background.secondary}
                                stroke={theme.accent.teal}
                                strokeWidth="2"
                            />
                        );
                    })}
                </Svg>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.h3,
        fontSize: 16,
    },
    legend: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        ...Typography.small,
    },
});
