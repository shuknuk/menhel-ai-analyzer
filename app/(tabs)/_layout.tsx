/**
 * Tabs Layout
 * New ReboundAI Structure: Home, Recover, Stats, Profile
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Home, Sparkles, Video, BarChart2, User } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';

export default function TabLayout() {
    const { theme, isDark } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: [styles.tabBar, {
                    backgroundColor: isDark ? 'rgba(13, 17, 2, 0.8)' : 'rgba(248, 249, 250, 0.8)',
                    borderTopColor: theme.background.tertiary
                }],
                tabBarBackground: () => (
                    <BlurView
                        intensity={90}
                        tint={isDark ? 'dark' : 'light'}
                        style={StyleSheet.absoluteFill}
                    />
                ),
                tabBarActiveTintColor: theme.accent.primary,
                tabBarInactiveTintColor: theme.text.muted,
                tabBarShowLabel: true,
                tabBarLabelStyle: styles.tabLabel,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'AI Chat',
                    tabBarIcon: ({ color, size }) => (
                        <Sparkles color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="videos"
                options={{
                    title: 'Videos',
                    tabBarIcon: ({ color, size }) => (
                        <Video color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Trends',
                    tabBarIcon: ({ color, size }) => (
                        <BarChart2 color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <User color={color} size={size} />
                    ),
                }}
            />

            {/* Hidden/Utility tabs */}
            <Tabs.Screen name="recover" options={{ href: null }} />
            <Tabs.Screen name="body" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        borderTopWidth: 1,
        elevation: 0,
        height: 85,
        paddingBottom: 20,
        paddingTop: 10,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
});
