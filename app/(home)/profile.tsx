import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser, useAuth, SignedIn } from '@clerk/clerk-expo';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const router = useRouter();
    const [kycStatus, setKycStatus] = useState<string>('Pending');

    useFocusEffect(
        useCallback(() => {
            const checkKycStatus = async () => {
                try {
                    const data = await AsyncStorage.getItem('@kisan_seva_kyc_data');
                    if (data) {
                        setKycStatus('KYC Completed');
                    } else {
                        setKycStatus('Pending');
                    }
                } catch {
                    setKycStatus('Pending');
                }
            };
            checkKycStatus();
        }, [])
    );

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/');
        } catch (err) {
            console.error('Error signing out:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <SignedIn>
                <View style={styles.profileHeader}>
                    <MaterialCommunityIcons name="account-circle" size={100} color="#4CAF50" />
                    <Text style={styles.nameText}>
                        {user?.firstName || 'User'} {user?.lastName || ''}
                    </Text>
                    <Text style={styles.emailText}>
                        {user?.primaryEmailAddress?.emailAddress || 'No Email Provided'}
                    </Text>
                </View>

                <View style={styles.actionSection}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(home)/kyc')}>
                        <View style={styles.actionRow}>
                            <MaterialCommunityIcons name="shield-check-outline" size={24} color="#4CAF50" />
                            <View>
                                <Text style={styles.actionText}>Complete KYC</Text>
                                <Text style={[styles.statusText, kycStatus === 'KYC Completed' ? styles.statusCompleted : styles.statusPending]}>
                                    Status: {kycStatus}
                                </Text>
                            </View>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={styles.actionRow}>
                            <MaterialCommunityIcons name="translate" size={24} color="#4CAF50" />
                            <Text style={styles.actionText}>Change Language</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={styles.actionRow}>
                            <MaterialCommunityIcons name="help-circle-outline" size={24} color="#4CAF50" />
                            <Text style={styles.actionText}>Help & Support</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={styles.actionRow}>
                            <MaterialCommunityIcons name="information-outline" size={24} color="#4CAF50" />
                            <Text style={styles.actionText}>About App</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#CCC" />
                    </TouchableOpacity>
                </View>

                <View style={styles.settingsSection}>
                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <MaterialCommunityIcons name="logout" size={24} color="#FFF" style={styles.signOutIcon} />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </SignedIn>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
    },
    emailText: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    actionSection: {
        marginBottom: 20,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 15,
    },
    statusText: {
        fontSize: 12,
        marginLeft: 15,
        marginTop: 2,
        fontWeight: 'bold',
    },
    statusCompleted: {
        color: '#4CAF50',
    },
    statusPending: {
        color: '#FF9800',
    },
    settingsSection: {
        marginTop: 10,
    },
    signOutButton: {
        flexDirection: 'row',
        backgroundColor: '#d32f2f',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signOutIcon: {
        marginRight: 10,
    },
    signOutText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
