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
            onSelectRole(role);
        } catch (error) {
            console.error('Error saving role:', error);
            // Even if save fails, proceed with navigation to keep app usable
            onSelectRole(role);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Kisan Seva</Text>
                <Text style={styles.subtitle}>Select your role to continue</Text>

                <TouchableOpacity
                    style={[styles.button, styles.farmerButton]}
                    onPress={() => handleSelect('farmer')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Farmer 🌾</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.buyerButton]}
                    onPress={() => handleSelect('buyer')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Buyer 🛒</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '80%',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
    },
    button: {
        width: '100%',
        paddingVertical: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    farmerButton: {
        backgroundColor: '#4CAF50',
    },
    buyerButton: {
        backgroundColor: '#FF9800',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
    },
});
