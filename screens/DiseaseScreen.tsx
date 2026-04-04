import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DiseaseScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<{ disease: string; remedy: string } | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setResult(null); // Reset previous result
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You must allow this app to access your camera to take a photo!");
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setResult(null); // Reset previous result
        }
    };

    const analyzeImage = () => {
        if (!image) {
            Alert.alert("No Image", "Please select or take an image first.");
            return;
        }

        setAnalyzing(true);
        setResult(null);

        // Simulate API call
        setTimeout(() => {
            setAnalyzing(false);
            setResult({
                disease: "Late Blight",
                remedy: "Remove infected leaves immediately. Apply a copper-based fungicide to the remaining plant to prevent spread. Ensure good air circulation around plants."
            });
        }, 2000); // 2 second mock delay
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Crop Disease ID</Text>
            <Text style={styles.subtitle}>Upload a photo of the affected plant leaf to identify the disease.</Text>

            <View style={styles.demoBanner}>
                <MaterialCommunityIcons name="flask-outline" size={20} color="#FF9800" />
                <Text style={styles.demoText}>
                    Demo Mode — Results are simulated. Real AI analysis coming soon!
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
                    <MaterialCommunityIcons name="camera" size={24} color="#FFF" />
                    <Text style={styles.buttonText}>Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                    <MaterialCommunityIcons name="image" size={24} color="#FFF" />
                    <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>
            </View>

            {image ? (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TouchableOpacity 
                        style={[styles.analyzeButton, analyzing && styles.disabledButton]} 
                        onPress={analyzeImage}
                        disabled={analyzing}
                    >
                        {analyzing ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <MaterialCommunityIcons name="magnify-scan" size={24} color="#FFF" />
                        )}
                        <Text style={styles.analyzeButtonText}>
                            {analyzing ? 'Analyzing...' : 'Analyze Image'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.placeholderContainer}>
                    <MaterialCommunityIcons name="leaf" size={60} color="#ccc" />
                    <Text style={styles.placeholderText}>No image selected</Text>
                </View>
            )}

            {result && (
                <View style={styles.resultContainer}>
                    <View style={styles.demoResultBadge}>
                        <MaterialCommunityIcons name="test-tube" size={16} color="#FF9800" />
                        <Text style={styles.demoResultText}>Demo Result</Text>
                    </View>
                    <Text style={styles.resultTitle}>Analysis Result:</Text>
                    <View style={styles.resultItem}>
                        <MaterialCommunityIcons name="alert-circle" size={24} color="#d32f2f" />
                        <Text style={styles.diseaseName}>{result.disease}</Text>
                    </View>
                    <Text style={styles.remedyTitle}>Recommended Action:</Text>
                    <Text style={styles.remedyText}>{result.remedy}</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#E8F5E9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
    },
    actionButton: {
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignItems: 'center',
        width: '45%',
        justifyContent: 'center',
        elevation: 3,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    placeholderContainer: {
        width: '100%',
        height: 250,
        backgroundColor: '#FFF',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#ccc',
        marginBottom: 30,
    },
    placeholderText: {
        marginTop: 10,
        color: '#999',
        fontSize: 16,
    },
    imagePreviewContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    imagePreview: {
        width: '100%',
        height: 250,
        borderRadius: 15,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    analyzeButton: {
        flexDirection: 'row',
        backgroundColor: '#1976D2',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        width: '80%',
        justifyContent: 'center',
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: '#90CAF9',
    },
    analyzeButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    resultContainer: {
        width: '100%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 15,
        elevation: 4,
        marginBottom: 20,
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    diseaseName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginLeft: 10,
    },
    remedyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 5,
    },
    remedyText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
    },
    demoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FFE0B2',
        width: '100%',
    },
    demoText: {
        fontSize: 13,
        color: '#E65100',
        marginLeft: 8,
        flex: 1,
        fontWeight: '600',
    },
    demoResultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    demoResultText: {
        fontSize: 12,
        color: '#E65100',
        fontWeight: 'bold',
        marginLeft: 4,
    },
});
