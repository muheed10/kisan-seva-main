import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ROLE_STORAGE_KEY } from '../../screens/RoleSelectionScreen';
import { useAuth } from '@clerk/clerk-expo';
import { useProductContext } from '../../context/ProductContext';

export default function BuyerDashboard() {
    const router = useRouter();
    const { signOut } = useAuth();
    const { products } = useProductContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'lowToHigh' | 'highToLow' | null>(null);
    
    // Derived list
    const filteredProducts = products
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (!sortOrder) return 0;
            const priceA = parseInt(a.price.replace(/[^\d]/g, '')) || 0;
            const priceB = parseInt(b.price.replace(/[^\d]/g, '')) || 0;
            return sortOrder === 'lowToHigh' ? priceA - priceB : priceB - priceA;
        });
    
    const handleSignOut = async () => {
        try {
            await signOut();
            await AsyncStorage.removeItem(ROLE_STORAGE_KEY);
            router.replace('/(auth)/sign-in');
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
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={24} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search crops..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.filterContainer}>
                    <TouchableOpacity 
                        style={[styles.filterBtn, sortOrder === 'lowToHigh' && styles.filterBtnActive]}
                        onPress={() => setSortOrder(sortOrder === 'lowToHigh' ? null : 'lowToHigh')}
                    >
                        <Text style={[styles.filterText, sortOrder === 'lowToHigh' && styles.filterTextActive]}>Price: Low to High</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.filterBtn, sortOrder === 'highToLow' && styles.filterBtnActive]}
                        onPress={() => setSortOrder(sortOrder === 'highToLow' ? null : 'highToLow')}
                    >
                        <Text style={[styles.filterText, sortOrder === 'highToLow' && styles.filterTextActive]}>Price: High to Low</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Available Crops</Text>

                {filteredProducts.length === 0 ? (
                    <Text style={styles.note}>No crops found.</Text>
                ) : (
                    filteredProducts.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.iconBox}>
                                <MaterialCommunityIcons name="sprout" size={36} color="#FF9800" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productLocation}>
                                    <MaterialCommunityIcons name="map-marker" size={14} color="#888" /> {item.location || 'Location N/A'}
                                </Text>
                                <Text style={styles.productPrice}>{item.price}</Text>
                                <Text style={styles.productSeller}>Qty: {item.quantity}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.contactBtn}
                                onPress={() => Alert.alert('Contact Seller', `Phone: ${item.contactNumber || 'N/A'}`)}
                            >
                                <MaterialCommunityIcons name="phone" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
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
        paddingHorizontal: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E65100',
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    filterBtn: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    filterBtnActive: {
        backgroundColor: '#FF9800',
        borderColor: '#FF9800',
    },
    filterText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#FFF',
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
    productLocation: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
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
        backgroundColor: '#d32f2f',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    signOutText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
