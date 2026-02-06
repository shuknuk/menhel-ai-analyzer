/**
 * Root Layout
 * Stack navigator that wraps the tabs group
 */

import { Stack } from 'expo-router';
import React from 'react';
import { Colors } from '../constants/theme';

const RootLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background.primary },
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
};

export default RootLayout;
