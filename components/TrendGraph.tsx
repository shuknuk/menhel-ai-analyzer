/**
 * Trend Graph Component
 * Visualizes multiple data series over time (e.g., intensity, mood, pain)
 */

import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line } from 'react-native-svg';
import { Typography, Spacing } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

export interface GraphSeries {
    label: string;
    data: number[]; // Values should be normalized to 0-10 or handled by scale
    color: string;
    showGradient?: boolean;
}

interface TrendGraphProps {
    title: string;
    labels: string[]; // X-axis labels
    series: GraphSeries[];
    height?: number;
    maxVal?: number;
    unit?: string;
}

export function TrendGraph({
    title,
    labels,
    series,
    height = 180,
    maxVal = 10,
    unit = 'kg'
}: TrendGraphProps) {
    const { theme } = useTheme();
    const screenWidth = Dimensions.get('window').width;
    const padding = Spacing.lg * 2;
    const yAxisWidth = 40; // Increased fixed width for Y axis labels
    const width = screenWidth - padding - yAxisWidth - 20;

    // Internal padding to prevent clipping of circles/strokes
    const graphPadding = 12;
    const innerWidth = width - (graphPadding * 2);
    const innerHeight = height - (graphPadding * 2);

    const getX = (index: number, total: number) => {
        return graphPadding + (index / (total - 1)) * innerWidth;
    };

    const getY = (val: number) => {
        return graphPadding + innerHeight - (val / maxVal) * innerHeight;
    };

    const getPath = (data: number[]) => {
        if (data.length === 0) return '';

        let path = `M ${getX(0, data.length)} ${getY(data[0])}`;

        for (let i = 1; i < data.length; i++) {
            path += ` L ${getX(i, data.length)} ${getY(data[i])}`;
        }

        return path;
    };

    // Calculate Y-axis steps
    const ySteps = [0, maxVal / 2, maxVal];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
                <View style={styles.legend}>
                    {series.map((s, i) => (
                        <View key={i} style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: s.color }]} />
                            <Text style={[styles.legendText, { color: theme.text.secondary }]}>{s.label}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.chartWrapper}>
                {/* Y Axis Labels */}
                <View style={[styles.yLabels, { height }]}>
                    {ySteps.map((step, i) => (
                        <Text key={i} style={[styles.yLabel, { color: theme.text.muted, top: getY(step) - 6 }]}>
                            {Math.round(step)}{unit}
                        </Text>
                    )).reverse()}
                </View>

                <View style={{ height, width }}>
                    <Svg height={height} width={width}>
                        <Defs>
                            {series.map((s, i) => (
                                <LinearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0" stopColor={s.color} stopOpacity="0.2" />
                                    <Stop offset="1" stopColor={s.color} stopOpacity="0" />
                                </LinearGradient>
                            ))}
                        </Defs>

                        {/* Grid Lines */}
                        {ySteps.map((step, i) => (
                            <Line
                                key={`grid-${i}`}
                                x1={graphPadding}
                                y1={getY(step)}
                                x2={width - graphPadding}
                                y2={getY(step)}
                                stroke={theme.background.tertiary}
                                strokeWidth="1"
                                strokeDasharray={step === 0 ? "0" : "4 4"}
                                opacity={0.5}
                            />
                        ))}

                        {/* Paths */}
                        {series.map((s, i) => {
                            const path = getPath(s.data);
                            return (
                                <React.Fragment key={i}>
                                    {s.showGradient && (
                                        <Path
                                            d={`${path} L ${getX(s.data.length - 1, s.data.length)} ${getY(0)} L ${getX(0, s.data.length)} ${getY(0)} Z`}
                                            fill={`url(#grad-${i})`}
                                        />
                                    )}
                                    <Path
                                        d={path}
                                        fill="none"
                                        stroke={s.color}
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    {s.data.map((val, idx) => (
                                        <Circle
                                            key={idx}
                                            cx={getX(idx, s.data.length)}
                                            cy={getY(val)}
                                            r="4"
                                            fill={theme.background.secondary}
                                            stroke={s.color}
                                            strokeWidth="2"
                                        />
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </Svg>

                    {/* X-Axis Labels */}
                    <View style={[styles.xLabels, { paddingHorizontal: graphPadding }]}>
                        {labels.map((label, i) => (
                            <Text key={i} style={[styles.label, { color: theme.text.muted }]}>{label}</Text>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Spacing.xs,
    },
    header: {
        flexDirection: 'column',
        gap: Spacing.xs,
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.h3,
        fontSize: 16,
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
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
    chartWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    yLabels: {
        width: 40,
        position: 'relative',
    },
    yLabel: {
        ...Typography.caption,
        fontSize: 10,
        position: 'absolute',
        right: 8,
        textAlign: 'right',
    },
    xLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.xs,
    },
    label: {
        ...Typography.caption,
        fontSize: 10,
    },
});
