/**
 * Profile Screen
 * Settings, Privacy Mode toggle, and User Info
 */

import React from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { ChevronRight, Shield, Bell, Lock, LogOut } from 'lucide-react-native';
import { GlassCard } from '../../components/GlassCard';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import useShakeDetect from '../../hooks/useShakeDetect';

export default function ProfileScreen() {
    const { isPrivacyMode, togglePrivacyMode } = useShakeDetect();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.headerTitle}>Profile</Text>

                {/* User Card */}
                <GlassCard style={styles.userCard}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' }}
                        style={styles.avatar}
                    />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>Alex Johnson</Text>
                        <Text style={styles.userStatus}>Premium Member</Text>
                    </View>
                </GlassCard>

                {/* Settings */}
                <Text style={styles.sectionTitle}>Settings</Text>

                <GlassCard style={styles.settingsGroup}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Shield size={20} color={Colors.accent.primary} />
                            <Text style={styles.settingLabel}>Privacy Mode (Shake)</Text>
                        </View>
                        <Switch
                            value={isPrivacyMode}
                            onValueChange={togglePrivacyMode}
                            trackColor={{ false: Colors.background.tertiary, true: Colors.accent.primary }}
                        />
                    </View>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Bell size={20} color={Colors.accent.primary} />
                            <Text style={styles.settingLabel}>Notifications</Text>
                        </View>
                        <ChevronRight size={20} color={Colors.text.muted} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Lock size={20} color={Colors.accent.primary} />
                            <Text style={styles.settingLabel}>Security</Text>
                        </View>
                        <ChevronRight size={20} color={Colors.text.muted} />
                    </TouchableOpacity>
                </GlassCard>

                <TouchableOpacity style={styles.logoutButton}>
                    <LogOut size={20} color={Colors.status.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
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
        color: Colors.accent.primary,
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
        backgroundColor: Colors.background.tertiary,
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
        color: Colors.status.error,
        fontWeight: '600',
    },
});
