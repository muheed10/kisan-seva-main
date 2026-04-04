import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Subsidy } from '../types';
import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, UIManager, Platform, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

// Enable LayoutAnimation on Android for smooth accordion effect
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

// Structured JSON Data mimicking an API response
const SUBSIDIES_DATA: Subsidy[] = [
    {
        id: '1',
        title: 'PM Kisan Samman Nidhi',
        description: 'Financial support of ₹6,000 per year to landholding farmers to supplement their financial needs for procuring various inputs.',
        eligibility: 'All landholding farmer families across the country.',
        link: 'https://pmkisan.gov.in/'
    },
    {
        id: '2',
        title: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Crop insurance scheme to provide financial support in case of crop failure due to natural calamities, pests or diseases.',
        eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops.',
        link: 'https://pmfby.gov.in/'
    },
    {
        id: '3',
        title: 'Kisan Credit Card (KCC)',
        description: 'Provides affordable credit to farmers for agricultural needs, ensuring timely access to credit for inputs like fertilizers and seeds.',
        eligibility: 'All farmers - individual/joint borrowers who are owner cultivators.',
        link: 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card'
    },
    {
        id: '4',
        title: 'National Mission on Agricultural Extension',
        description: 'Aims to restructure and strengthen agricultural extension to enable delivery of appropriate technology and improved agronomic practices to farmers.',
        eligibility: 'State Governments and individual Farmers applying for extension reforms.',
        link: 'https://agricoop.nic.in/'
    },
];

export default function SubsidyScreen() {
    const [subsidies, setSubsidies] = useState<Subsidy[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Prepared for backend API logic later
    useEffect(() => {
        // Example for future:
        // const fetchSubsidies = async () => {
        //     const response = await fetch('YOUR_API_ENDPOINT');
        //     const data = await response.json();
        //     setSubsidies(data);
        // }
        // fetchSubsidies();

        // For now, load structured JSON data
        setSubsidies(SUBSIDIES_DATA);
    }, []);

    const toggleExpand = (id: string) => {
        // Optional: Adding a smooth easing animation when the accordion opens/closes
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        // Simulate network delay — ready for future API integration
        await new Promise(resolve => setTimeout(resolve, 500));
        setSubsidies(SUBSIDIES_DATA);
        setRefreshing(false);
    };

    const handleApply = async (url?: string) => {
        if (!url) {
            Alert.alert("Link Unavailable", "The application portal is not available at the moment.");
            return;
        }
        await WebBrowser.openBrowserAsync(url);
    };

    const renderItem = ({ item }: { item: Subsidy }) => {
        const isExpanded = expandedId === item.id;

        return (
            <View style={styles.card}>
                <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand(item.id)} activeOpacity={0.7}>
                    <MaterialCommunityIcons name="script-text-outline" size={24} color="#2E7D32" />
                    <Text style={styles.schemeName}>{item.title}</Text>
                    <MaterialCommunityIcons 
                        name={isExpanded ? "chevron-up" : "chevron-down"} 
                        size={24} 
                        color="#2E7D32" 
                    />
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.expandedContent}>
                        <Text style={styles.label}>Description:</Text>
                        <Text style={styles.description}>{item.description}</Text>

                        <Text style={styles.label}>Eligibility:</Text>
                        <Text style={styles.eligibility}>{item.eligibility}</Text>

                        <TouchableOpacity style={styles.applyButton} onPress={() => handleApply(item.link)}>
                            <Text style={styles.applyButtonText}>Apply Now</Text>
                            <MaterialCommunityIcons name="open-in-new" size={16} color="#FFF" style={styles.applyIcon} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Government Subsidies</Text>
            <FlatList
                data={subsidies}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                onRefresh={handleRefresh}
                refreshing={refreshing}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F8E9', // Very light green background
        paddingTop: 20,
        paddingHorizontal: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1B5E20',
        marginBottom: 20,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderLeftWidth: 5,
        borderLeftColor: '#4CAF50',
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    schemeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginLeft: 10,
        flex: 1, 
    },
    expandedContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginTop: 5,
    },
    description: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 5,
    },
    eligibility: {
        fontSize: 14,
        color: '#333',
        fontStyle: 'italic',
        marginBottom: 15,
    },
    applyButton: {
        flexDirection: 'row',
        backgroundColor: '#FF9800', // Orange for action button
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    applyButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    applyIcon: {
        marginLeft: 8,
    }
});
