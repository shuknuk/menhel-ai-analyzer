import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Send, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChatBubble } from '../../components/ChatBubble';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { ChatMessage } from '../../types/health';

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: '1',
        role: 'assistant',
        content: "I'm your AI Assistant. I can analyze your trends and suggest recovery routines. How can I help you today?",
        timestamp: new Date(),
    },
];

export default function ChatScreen() {
    const { theme } = useTheme();
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const dynamicStyles = StyleSheet.create({
        container: {
            backgroundColor: theme.background.primary,
        },
        header: {
            borderBottomColor: theme.background.tertiary,
            backgroundColor: theme.background.secondary,
            paddingTop: 60, // Account for notch
        },
        title: {
            color: theme.text.primary,
            ...Typography.h2,
        },
        inputContainer: {
            backgroundColor: theme.background.secondary,
            borderTopColor: theme.background.tertiary,
            paddingBottom: 100, // Clear floating tab bar
        },
        input: {
            backgroundColor: theme.background.primary,
            color: theme.text.primary,
        },
    });

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
                content: "Analyzing your recent mobility logs... I suggest a 10-minute squat form review. You can find it in the Videos tab.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1500);
    };

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            {/* AI Header */}
            <View style={[styles.header, dynamicStyles.header]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.lg }}>
                    <Sparkles size={24} color={theme.accent.primary} />
                    <Text style={dynamicStyles.title}>ReboundAI Assistant</Text>
                </View>
            </View>

            {/* Chat Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
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
                <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
                    <TextInput
                        style={[styles.input, dynamicStyles.input]}
                        placeholder="Ask me anything..."
                        placeholderTextColor={theme.text.muted}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            !inputText.trim() && styles.sendButtonDisabled,
                            { backgroundColor: inputText.trim() ? theme.accent.primary : theme.text.muted }
                        ]}
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
    },
    header: {
        borderBottomWidth: 1,
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
        borderTopWidth: 1,
        gap: Spacing.sm,
    },
    input: {
        flex: 1,
        padding: Spacing.md,
        borderRadius: BorderRadius.xl,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    sendButtonDisabled: {
        shadowOpacity: 0,
    },
});
