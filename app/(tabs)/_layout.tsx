/**
 * Tabs Layout
 * New Rebound AI Structure: Home, Recover, Stats, Profile
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Home, Activity, BarChart2, User } from 'lucide-react-native';
import { Colors } from '../../constants/theme';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarBackground: () => (
                    <BlurView
                        intensity={90}
                        tint="light"
                        style={StyleSheet.absoluteFill}
                    />
                ),
                tabBarActiveTintColor: Colors.accent.primary,
                tabBarInactiveTintColor: Colors.text.muted,
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
                name="recover"
                options={{
                    title: 'Recover',
                    tabBarIcon: ({ color, size }) => (
                        <Activity color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
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

            {/* Hidden tabs (preserving old routes temporarily or redirecting) */}
            {/* Hidden/Utility tabs */}
            <Tabs.Screen name="body" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderTopWidth: 1,
        borderTopColor: Colors.glass.border,
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
