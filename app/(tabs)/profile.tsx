/**
 * Profile Screen
 * Settings, Privacy Mode toggle, and User Info
 */

import React from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { ChevronRight, Shield, Bell, Lock, LogOut, Moon, Sun, Monitor } from 'lucide-react-native';
import { GlassCard } from '../../components/GlassCard';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import useShakeDetect from '../../hooks/useShakeDetect';
import { useTheme } from '../../hooks/useTheme';

export default function ProfileScreen() {
    const { isPrivacyMode, togglePrivacyMode } = useShakeDetect();
    const { theme, mode, setMode } = useTheme();

    const THEME_OPTIONS = [
        { id: 'system', label: 'System', icon: Monitor },
        { id: 'light', label: 'Light', icon: Sun },
        { id: 'dark', label: 'Dark', icon: Moon },
    ] as const;

    const dynamicStyles = StyleSheet.create({
        container: {
            backgroundColor: theme.background.primary,
        },
        headerTitle: {
            color: theme.text.primary,
        },
        userName: {
            color: theme.text.primary,
        },
        userStatus: {
            color: theme.accent.primary,
        },
        sectionTitle: {
            color: theme.text.primary,
        },
        settingLabel: {
            color: theme.text.primary,
        },
        divider: {
            backgroundColor: theme.background.tertiary,
        },
        logoutText: {
            color: theme.status.error,
        },
    });

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            <View style={styles.content}>
                <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>Profile</Text>

                {/* User Card */}
                <GlassCard style={styles.userCard}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' }}
                        style={styles.avatar}
                    />
                    <View style={styles.userInfo}>
                        <Text style={[styles.userName, dynamicStyles.userName]}>Alex Johnson</Text>
                        <Text style={[styles.userStatus, dynamicStyles.userStatus]}>Premium Member</Text>
                    </View>
                </GlassCard>

                {/* Appearance Settings */}
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Appearance</Text>
                <GlassCard style={styles.settingsGroup}>
                    <View style={styles.themeSelector}>
                        {THEME_OPTIONS.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.themeItem,
                                    mode === item.id && { backgroundColor: theme.accent.primary + '20', borderColor: theme.accent.primary }
                                ]}
                                onPress={() => setMode(item.id)}
                            >
                                <item.icon size={18} color={mode === item.id ? theme.accent.primary : theme.text.muted} />
                                <Text style={[
                                    styles.themeLabel,
                                    { color: mode === item.id ? theme.accent.primary : theme.text.muted }
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </GlassCard>

                {/* Settings */}
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, { marginTop: Spacing.xl }]}>Settings</Text>

                <GlassCard style={styles.settingsGroup}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Shield size={20} color={theme.accent.primary} />
                            <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>Privacy Mode (Shake)</Text>
                        </View>
                        <Switch
                            value={isPrivacyMode}
                            onValueChange={togglePrivacyMode}
                            trackColor={{ false: theme.background.tertiary, true: theme.accent.primary }}
                        />
                    </View>

                    <View style={[styles.divider, dynamicStyles.divider]} />

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Bell size={20} color={theme.accent.primary} />
                            <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>Notifications</Text>
                        </View>
                        <ChevronRight size={20} color={theme.text.muted} />
                    </TouchableOpacity>

                    <View style={[styles.divider, dynamicStyles.divider]} />

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Lock size={20} color={theme.accent.primary} />
                            <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>Security</Text>
                        </View>
                        <ChevronRight size={20} color={theme.text.muted} />
                    </TouchableOpacity>
                </GlassCard>

                <TouchableOpacity style={styles.logoutButton}>
                    <LogOut size={20} color={theme.status.error} />
                    <Text style={[styles.logoutText, dynamicStyles.logoutText]}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: Spacing.lg,
    },
    headerTitle: {
        ...Typography.h1,
        marginBottom: Spacing.lg,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: Spacing.md,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...Typography.h2,
        fontSize: 20,
    },
    userStatus: {
        ...Typography.caption,
        fontWeight: '600',
    },
    sectionTitle: {
        ...Typography.h3,
        marginBottom: Spacing.md,
    },
    settingsGroup: {
        padding: 0,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    settingLabel: {
        ...Typography.body,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        marginLeft: 50, // Indent past icon
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.xl,
        gap: Spacing.sm,
        padding: Spacing.md,
    },
    logoutText: {
        ...Typography.body,
        fontWeight: '600',
    },
    themeSelector: {
        flexDirection: 'row',
        padding: Spacing.sm,
        gap: Spacing.sm,
    },
    themeItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: 'transparent',
        gap: 6,
    },
    themeLabel: {
        ...Typography.small,
        fontWeight: '600',
    },
});
