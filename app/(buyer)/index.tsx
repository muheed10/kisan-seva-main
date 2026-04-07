import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ROLE_STORAGE_KEY } from '../../screens/RoleSelectionScreen';

const FEATURED_PRODUCTS = [
    { id: '1', name: 'Fresh Wheat', price: '₹2200/quintal', seller: 'Ramesh Kumar', icon: 'grain' },
    { id: '2', name: 'Organic Tomatoes', price: '₹40/kg', seller: 'Priya Farms', icon: 'food-apple' },
    { id: '3', name: 'Basmati Rice', price: '₹6000/quintal', seller: 'Singh Agro', icon: 'rice' },
];

export default function BuyerDashboard() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            // Clear the role and navigate to root (Role Selection)
            await AsyncStorage.removeItem(ROLE_STORAGE_KEY);
            router.replace('/');
        } catch (err) {
            console.error('Error signing out:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🛒 Buyer Dashboard</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Available Products</Text>

                {FEATURED_PRODUCTS.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.iconBox}>
                            <MaterialCommunityIcons name={item.icon as any} size={36} color="#FF9800" />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productPrice}>{item.price}</Text>
                            <Text style={styles.productSeller}>Seller: {item.seller}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.contactBtn}
                            onPress={() => Alert.alert('Contact', `Contacting seller for ${item.name}`)}
                        >
                            <MaterialCommunityIcons name="phone" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                ))}

                <Text style={styles.note}>More features coming soon for buyers!</Text>

                <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                    <MaterialCommunityIcons name="logout" size={20} color="#FFF" />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F1',
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E65100',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#444',
        marginBottom: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 15,
        marginBottom: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    iconBox: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF3E0',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    cardContent: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    productPrice: {
        fontSize: 14,
        color: '#FF9800',
        fontWeight: '600',
        marginTop: 2,
    },
    productSeller: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    contactBtn: {
        backgroundColor: '#FF9800',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    note: {
        marginTop: 10,
        marginBottom: 30,
        textAlign: 'center',
        color: '#BDBDBD',
        fontSize: 13,
    },
    signOutButton: {
        flexDirection: 'row',
        backgroundColor: '#d32f2f',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    signOutText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
});
