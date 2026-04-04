import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { ROLE_STORAGE_KEY, UserRole } from '../screens/RoleSelectionScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';

type CheckState = 'checking' | 'no_role' | 'farmer' | 'buyer';

export default function Index() {
    const [state, setState] = useState<CheckState>('checking');

    const checkRole = async () => {
        // Set to checking state to avoid stale redirects while looking up
        setState('checking');
        try {
            const stored = await AsyncStorage.getItem(ROLE_STORAGE_KEY);
            if (stored === 'farmer' || stored === 'buyer') {
                setState(stored as CheckState);
            } else {
                setState('no_role');
            }
        } catch (error) {
            setState('no_role');
        }
    };

    useFocusEffect(
        useCallback(() => {
            checkRole();
        }, [])
    );

    // While checking stored role — render nothing (splash stays visible)
    if (state === 'checking') return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;

    // Redirect returning users directly to their last role
    if (state === 'farmer') return <Redirect href="/(home)" />;
    if (state === 'buyer') return <Redirect href={'/(buyer)' as any} />;

    // New user/Signed out: show role selection inline
    return (
        <RoleSelectionScreen
            onSelectRole={(role: UserRole) => {
                setState(role);
            }}
        />
    );
}
