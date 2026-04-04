import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRODUCTS_STORAGE_KEY = '@kisan_seva_my_products';

interface MyProduct {
    id: string;
    name: string;
    price: string;
    quantity: string;
    createdAt: string;
}

export default function MyProductsScreen() {
    const [products, setProducts] = useState<MyProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const stored = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
            if (stored) {
                setProducts(JSON.parse(stored));
            }
        } catch (err) {
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveProducts = async (updated: MyProduct[]) => {
        try {
            await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
        } catch (err) {
            console.error('Error saving products:', err);
        }
    };

    const handleAdd = () => {
        if (!name.trim() || !price.trim() || !quantity.trim()) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }

        const newProduct: MyProduct = {
            id: Date.now().toString(),
            name: name.trim(),
            price: `₹${price.trim()}`,
            quantity: quantity.trim(),
            createdAt: new Date().toLocaleDateString(),
        };

        const updated = [newProduct, ...products];
        setProducts(updated);
        saveProducts(updated);

        setModalVisible(false);
        setName('');
        setPrice('');
        setQuantity('');
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to remove this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        const updated = products.filter(p => p.id !== id);
                        setProducts(updated);
                        saveProducts(updated);
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    const renderItem = ({ item }: { item: MyProduct }) => (
        <View style={styles.card}>
            <View style={styles.cardIcon}>
                <MaterialCommunityIcons name="package-variant" size={32} color="#4CAF50" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDetail}>
                    Price: <Text style={styles.highlight}>{item.price}</Text>
                </Text>
                <Text style={styles.productDetail}>
                    Qty: <Text style={styles.highlight}>{item.quantity}</Text>
                </Text>
                <Text style={styles.productDate}>Added: {item.createdAt}</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                <MaterialCommunityIcons name="delete-outline" size={22} color="#d32f2f" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="package-variant-closed" size={80} color="#BDBDBD" />
                        <Text style={styles.emptyTitle}>No Products Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Tap the + button below to add your first product listing.
                        </Text>
                    </View>
                }
            />

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <MaterialCommunityIcons name="plus" size={30} color="#FFF" />
            </TouchableOpacity>

            {/* Add Product Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Product</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Product Name (e.g. Wheat)"
                            value={name}
                            onChangeText={setName}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Price (e.g. 2200/quintal)"
                            value={price}
                            onChangeText={setPrice}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Quantity (e.g. 50 Quintals)"
                            value={quantity}
                            onChangeText={setQuantity}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setName('');
                                    setPrice('');
                                    setQuantity('');
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.submitButton]}
                                onPress={handleAdd}
                            >
                                <Text style={styles.buttonText}>Add Product</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 15,
        paddingBottom: 90,
        flexGrow: 1,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardIcon: {
        width: 56,
        height: 56,
        backgroundColor: '#E8F5E9',
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
        marginBottom: 4,
    },
    productDetail: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    highlight: {
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    productDate: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    deleteBtn: {
        padding: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#757575',
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 40,
        lineHeight: 22,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#2E7D32',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        width: '100%',
        borderRadius: 15,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#9E9E9E',
        marginRight: 10,
    },
    submitButton: {
        backgroundColor: '#2E7D32',
        marginLeft: 10,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
