import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ROLE_STORAGE_KEY = '@kisan_seva_user_role';

export type UserRole = 'farmer' | 'buyer';

interface Props {
    onSelectRole: (role: UserRole) => void;
    loading?: boolean;
}

export default function RoleSelectionScreen({ onSelectRole, loading = false }: Props) {
    const handleSelect = async (role: UserRole) => {
        try {
            await AsyncStorage.setItem(ROLE_STORAGE_KEY, role);
        } catch {
            // Fail silently — the callback still fires so navigation works
        }
        onSelectRole(role);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.appName}>Kisan Seva</Text>
            <Text style={styles.tagline}>Empowering Indian Farmers</Text>
            <Text style={styles.question}>I am a...</Text>

            <TouchableOpacity
                style={[styles.roleButton, styles.farmerButton]}
                onPress={() => handleSelect('farmer')}
                activeOpacity={0.85}
            >
                <Text style={styles.emoji}>🌾</Text>
                <Text style={styles.roleLabel}>Farmer</Text>
                <Text style={styles.roleDescription}>Sell produce, access subsidies & weather</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.roleButton, styles.buyerButton]}
                onPress={() => handleSelect('buyer')}
                activeOpacity={0.85}
            >
                <Text style={styles.emoji}>🛒</Text>
                <Text style={styles.roleLabel}>Buyer</Text>
                <Text style={styles.roleDescription}>Browse and purchase fresh farm produce</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F8E9',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 6,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 15,
        color: '#66BB6A',
        marginBottom: 48,
        textAlign: 'center',
    },
    question: {
        fontSize: 18,
        color: '#555',
        fontWeight: '600',
        marginBottom: 24,
    },
    roleButton: {
        width: '100%',
        borderRadius: 20,
        paddingVertical: 28,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    farmerButton: {
        backgroundColor: '#4CAF50',
    },
    buyerButton: {
        backgroundColor: '#FF9800',
    },
    emoji: {
        fontSize: 48,
        marginBottom: 10,
    },
    roleLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 6,
    },
    roleDescription: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
    },
});
