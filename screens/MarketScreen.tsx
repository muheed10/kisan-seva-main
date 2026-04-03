import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Dummy Product Type
interface Product {
    id: string;
    name: string;
    price: string;
    quantity: string;
    image: any;
}

export default function MarketScreen() {
    const [products, setProducts] = useState<Product[]>([
        { id: '1', name: 'Fresh Wheat', price: '₹2200/quintal', quantity: '50 Quintals', image: 'https://placehold.co/100x100/png' },
        { id: '2', name: 'Organic Tomatoes', price: '₹40/kg', quantity: '200 kg', image: 'https://placehold.co/100x100/png' },
        { id: '3', name: 'Basmati Rice', price: '₹6000/quintal', quantity: '20 Quintals', image: 'https://placehold.co/100x100/png' },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductQty, setNewProductQty] = useState('');

    const handleAddProduct = () => {
        if (!newProductName || !newProductPrice || !newProductQty) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const newProduct: Product = {
            id: Date.now().toString(),
            name: newProductName,
            price: `₹${newProductPrice}`,
            quantity: newProductQty,
            image: 'https://placehold.co/100x100/png',
        };

        setProducts(prev => [newProduct, ...prev]);
        setModalVisible(false);
        setNewProductName('');
        setNewProductPrice('');
        setNewProductQty('');
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <MaterialCommunityIcons name="food-apple" size={40} color="#4CAF50" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDetails}>Price: <Text style={styles.bold}>{item.price}</Text></Text>
                <Text style={styles.productDetails}>Qty: <Text style={styles.bold}>{item.quantity}</Text></Text>

                <TouchableOpacity style={styles.contactButton} onPress={() => Alert.alert('Contact', `Contact buyer for ${item.name}`)}>
                    <Text style={styles.contactButtonText}>Contact Buyer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
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
                            value={newProductName}
                            onChangeText={setNewProductName}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Price (e.g. 2000)"
                            keyboardType="numeric"
                            value={newProductPrice}
                            onChangeText={setNewProductPrice}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Quantity (e.g. 10 kg)"
                            value={newProductQty}
                            onChangeText={setNewProductQty}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleAddProduct}>
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
    listContainer: {
        padding: 15,
        paddingBottom: 80, // Space for FAB
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        flexDirection: 'row',
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    imageContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#E8F5E9',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    productDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    bold: {
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    contactButton: {
        backgroundColor: '#FF9800',
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'flex-start',
        paddingHorizontal: 15,
    },
    contactButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
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
