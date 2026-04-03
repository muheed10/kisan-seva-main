import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyProductsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Products</Text>
            <Text style={styles.subtitle}>Manage your product uploads here.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#388E3C',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});
