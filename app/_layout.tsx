/**
 * Root Layout
 * Stack navigator that wraps the tabs group
 */

import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider, useTheme } from '../hooks/useTheme';

const AppContent = () => {
    const { theme } = useTheme();
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.background.primary },
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
};

const RootLayout = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default RootLayout;
