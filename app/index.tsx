import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ROLE_STORAGE_KEY, UserRole } from '../screens/RoleSelectionScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';

type CheckState = 'checking' | 'no_role' | 'farmer' | 'buyer';

export default function Index() {
    const [state, setState] = useState<CheckState>('checking');

    useEffect(() => {
        AsyncStorage.getItem(ROLE_STORAGE_KEY)
            .then((stored) => {
                if (stored === 'farmer' || stored === 'buyer') {
                    setState(stored);
                } else {
                    setState('no_role');
                }
            })
            .catch(() => {
                // If AsyncStorage fails, always show role selection
                setState('no_role');
            });
    }, []);

    // While checking stored role — render nothing (splash stays visible)
    if (state === 'checking') return <View style={{ flex: 1, backgroundColor: '#F1F8E9' }} />;

    // Redirect returning users directly to their last role
    if (state === 'farmer') return <Redirect href="/(home)" />;
    if (state === 'buyer') return <Redirect href={'/(buyer)' as any} />;

    // New user: show role selection inline (no extra route needed)
    return (
        <RoleSelectionScreen
            onSelectRole={(role: UserRole) => {
                setState(role);
            }}
        />
    );
}
