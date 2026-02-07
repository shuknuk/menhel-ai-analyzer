/**
 * ChatBubble Component
 * Floating chat message with reverse gravity animation
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';
import type { ChatMessage } from '../types/health';

interface ChatBubbleProps {
    message: ChatMessage;
    index: number;
}

export function ChatBubble({ message, index }: ChatBubbleProps) {
    const { theme } = useTheme();
    const isUser = message.role === 'user';

    // Reverse gravity: messages float UP like bubbles
    const enteringAnimation = FadeInUp
        .delay(index * 100)
        .duration(500)
        .springify()
        .damping(15);

    return (
        <Animated.View entering={enteringAnimation} style={[
            styles.container,
            isUser ? styles.userContainer : styles.aiContainer
        ]}>
            <View style={[
                styles.bubble,
                isUser
                    ? [styles.userBubble, { backgroundColor: theme.accent.primary }]
                    : [styles.aiBubble, { backgroundColor: theme.background.secondary, borderColor: theme.background.tertiary }]
            ]}>
                <Text style={[
                    styles.text,
                    { color: isUser ? theme.text.inverse : theme.text.primary }
                ]}>
                    {message.content}
                </Text>
            </View>
            <Text style={[styles.timestamp, { color: theme.text.muted }]}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
        maxWidth: '80%',
    },
    userContainer: {
        alignSelf: 'flex-end',
    },
    aiContainer: {
        alignSelf: 'flex-start',
    },
    bubble: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    userBubble: {
        borderBottomRightRadius: 2,
    },
    aiBubble: {
        borderBottomLeftRadius: 2,
        borderWidth: 1,
    },
    text: {
        ...Typography.body,
        fontSize: 16,
        lineHeight: 22,
    },
    timestamp: {
        ...Typography.small,
        marginTop: 4,
        opacity: 0.6,
        alignSelf: 'flex-end',
        marginHorizontal: 4,
    },
});

export default ChatBubble;
