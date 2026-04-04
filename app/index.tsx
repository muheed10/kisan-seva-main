import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useFocusEffect } from 'expo-router';
import React, { useCallback, useState, useEffect } from 'react';
import { View } from 'react-native';
import { ROLE_STORAGE_KEY, UserRole } from '../screens/RoleSelectionScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import { useAuth } from '@clerk/clerk-expo';

type CheckState = 'checking' | 'no_role' | 'farmer' | 'buyer';

export default function Index() {
    const [state, setState] = useState<CheckState>('checking');
    const { isSignedIn, isLoaded } = useAuth();

    const checkRole = async () => {
        try {
            const stored = await AsyncStorage.getItem(ROLE_STORAGE_KEY);
            if (stored === 'farmer' || stored === 'buyer') {
                setState(stored as CheckState);
            } else {
                setState('no_role');
            }
        } catch (error) {
            console.error('Error checking role:', error);
            setState('no_role');
        }
    };

    // Initial check on mount
    useEffect(() => {
        checkRole();
    }, []);

    // Also re-check when screen comes back into focus
    useFocusEffect(
        useCallback(() => {
            checkRole();
        }, [])
    );

    // Wait for both role check and Clerk load
    if (state === 'checking' || !isLoaded) {
        return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
    }

    // New user or cleared role: show role selection screen
    if (state === 'no_role') {
        return (
            <RoleSelectionScreen
                onSelectRole={(role: UserRole) => {
                    setState(role);
                }}
            />
        );
    }

    // Farmer Logic: Must be signed in to see dashboard
    if (state === 'farmer') {
        if (isSignedIn) {
            return <Redirect href="/(home)" />;
        } else {
            return <Redirect href="/(auth)/sign-in" />;
        }
    }

    // Buyer Logic: Dashboard is currently open to all
    if (state === 'buyer') {
        return <Redirect href={'/(buyer)' as any} />;
    }

    return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
}

