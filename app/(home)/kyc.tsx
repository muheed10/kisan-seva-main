import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const KYC_STORAGE_KEY = '@kisan_seva_kyc_data';

export default function KYCFormScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [address, setAddress] = useState('');
    const [idProofUri, setIdProofUri] = useState<string | null>(null);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (!permissionResult.granted) {
            Alert.alert('Permission Denied', 'Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setIdProofUri(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!fullName.trim() || !phone.trim() || !aadhaar.trim() || !address.trim() || !idProofUri) {
            Alert.alert('Validation Error', 'Please fill all fields and upload an ID proof.');
            return;
        }

        const kycData = {
            fullName,
            phone,
            aadhaar,
            address,
            idProofUri,
            submittedAt: new Date().toISOString()
        };

        try {
            await AsyncStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(kycData));
            Alert.alert('Success', 'KYC details submitted successfully.', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error('Error saving KYC form', error);
            Alert.alert('Error', 'Failed to save KYC verification.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>KYC Verification</Text>
                <Text style={styles.subtitle}>Complete your profile by verifying identity</Text>
            </View>
            
            <View style={styles.formGroup}>
                <TextInput 
                    style={styles.input} 
                    placeholder="Full Name" 
                    value={fullName} 
                    onChangeText={setFullName} 
                />
                
                <TextInput 
                    style={styles.input} 
                    placeholder="Phone Number" 
                    keyboardType="phone-pad" 
                    value={phone} 
                    onChangeText={setPhone} 
                    maxLength={15}
                />
                
                <TextInput 
                    style={styles.input} 
                    placeholder="Aadhaar Number (12 digits)" 
                    keyboardType="numeric" 
                    value={aadhaar} 
                    onChangeText={setAadhaar}
                    maxLength={12}
                />
                
                <TextInput 
                    style={[styles.input, styles.textArea]} 
                    placeholder="Full Address" 
                    multiline 
                    numberOfLines={3} 
                    value={address} 
                    onChangeText={setAddress} 
                />

                <View style={styles.imagePickerContainer}>
                    <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                        <MaterialCommunityIcons name="image-plus" size={24} color="#FFF" />
                        <Text style={styles.imagePickerText}>Upload ID Proof (Image)</Text>
                    </TouchableOpacity>
                    
                    {idProofUri ? (
                        <View style={styles.previewContainer}>
                            <Image source={{ uri: idProofUri }} style={styles.previewImage} />
                            <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" style={styles.checkIcon} />
                        </View>
                    ) : (
                        <Text style={styles.noImageText}>No image selected</Text>
                    )}
                </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit KYC</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    formGroup: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 25,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#FAFAFA',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    imagePickerContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    imagePickerButton: {
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    imagePickerText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    previewContainer: {
        marginTop: 15,
        alignItems: 'center',
        position: 'relative',
    },
    previewImage: {
        width: 200,
        height: 150,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    checkIcon: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        backgroundColor: '#FFF',
        borderRadius: 12,
    },
    noImageText: {
        color: '#999',
        marginTop: 10,
        fontStyle: 'italic',
    },
    submitButton: {
        backgroundColor: '#2E7D32',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
