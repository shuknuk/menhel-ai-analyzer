/**
 * Home Screen - Chat Interface
 * Main landing page with AI companion
 */

import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Send, Zap, Sun } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ChatBubble } from '../../components/ChatBubble';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import type { ChatMessage } from '../../types/health';

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: '1',
        role: 'assistant',
        content: "Good morning, Alex. I noticed your sleep quality was a bit lower last night. How is your knee feeling today?",
        timestamp: new Date(),
    },
];

export default function HomeScreen() {
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputText.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I understand. Let's focus on mobility today. I've prepared a gentle recovery session in the Recover tab.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good Morning</Text>
                    <Text style={styles.subtitle}>Ready to rebound?</Text>
                </View>
                <View style={styles.statusBadge}>
                    <Zap size={16} color={Colors.accent.orange} fill={Colors.accent.orange} />
                    <Text style={styles.statusText}>96% Recovery</Text>
                </View>
            </View>

            {/* Chat Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                style={styles.keyboardView}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <ChatBubble message={item} index={index} />
                    )}
                    contentContainerStyle={styles.chatContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    showsVerticalScrollIndicator={false}
                />

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor={Colors.text.muted}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Send size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.background.tertiary,
        backgroundColor: Colors.background.secondary,
    },
    greeting: {
        ...Typography.h2,
        color: Colors.text.primary,
    },
    subtitle: {
        ...Typography.body,
        fontSize: 14,
        color: Colors.text.muted,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.round,
        gap: 4,
    },
    statusText: {
        ...Typography.small,
        color: Colors.accent.orange,
        fontWeight: '700',
    },
    keyboardView: {
        flex: 1,
    },
    chatContent: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: Colors.background.secondary,
        borderTopWidth: 1,
        borderTopColor: Colors.background.tertiary,
        gap: Spacing.sm,
    },
    input: {
        flex: 1,
        backgroundColor: Colors.background.primary,
        padding: Spacing.md,
        borderRadius: BorderRadius.xl,
        fontSize: 16,
        color: Colors.text.primary,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.accent.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.accent.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    sendButtonDisabled: {
        backgroundColor: Colors.text.muted,
        shadowOpacity: 0,
    },
});
