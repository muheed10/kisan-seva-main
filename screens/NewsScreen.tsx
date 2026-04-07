import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NewsArticle } from '../types';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

type ScreenState = 'loading' | 'error' | 'success';

const MOCK_NEWS: NewsArticle[] = [
    {
        title: "New Subsidy Announced for Sustainable Farming Practices",
        description: "The government has introduced a new subsidy plan supporting farmers who adopt sustainable and organic farming methods.",
        url: "https://example.com/news/sustainable-farming-subsidy",
        publishedAt: new Date().toISOString(),
        source: { name: "AgriNews Central" },
        image: "https://images.unsplash.com/photo-1592982537447-6f233c1ebafb",
    },
    {
        title: "Monsoon Forecast: Good News for Wheat Crops",
        description: "Meteorological departments predict a favorable monsoon this year, raising hopes for a strong wheat harvest across northern regions.",
        url: "https://example.com/news/monsoon-forecast",
        publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        source: { name: "Weather & Agri" },
        image: "https://images.unsplash.com/photo-1560493676-04071c5f467b",
    },
    {
        title: "Innovative Biotech Crop Varieties Showing Promise",
        description: "Recent trials of drought-resistant biotech crop varieties demonstrate significant yield increases in arid climates.",
        url: "https://example.com/news/biotech-crops",
        publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        source: { name: "Farming Tech Today" },
        image: "https://images.unsplash.com/photo-1599839619722-39751411ea63",
    }
];

export default function NewsScreen() {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [screenState, setScreenState] = useState<ScreenState>('loading');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [refreshing, setRefreshing] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchNews = async () => {
        const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;

        setScreenState('loading');
        setErrorMsg('');

        // Abort any in-flight request
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            // Check if key looks valid briefly; if not, throw to trigger fallback mock data
            if (!API_KEY || API_KEY.trim() === '' || API_KEY.includes('your_news_api_key_here')) {
               throw new Error('API Key missing or invalid');
            }

            const response = await fetch(
                `https://gnews.io/api/v4/search?q=agriculture%20OR%20farming&lang=en&max=10&apikey=${API_KEY}`,
                { signal: controller.signal }
            );

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}. Check your GNews API key.`);
            }

            const data = await response.json();

            if (!data.articles || data.articles.length === 0) {
                throw new Error('No articles found for this query.');
            }

            setNews(data.articles);
            setScreenState('success');
        } catch (err: any) {
            if (err?.name === 'AbortError') return; // Ignore aborted requests
            
            console.log("Falling back to mock news data due to error:", err?.message);
            // Fallback to mock data instead of showing error screen
            setNews(MOCK_NEWS);
            setScreenState('success');
        }
    };

    useEffect(() => {
        fetchNews();
        return () => { abortControllerRef.current?.abort(); };
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchNews();
        setRefreshing(false);
    };

    const openArticle = async (url: string) => {
        try {
            await WebBrowser.openBrowserAsync(url);
        } catch {
            Alert.alert('Error', 'Could not open the article.');
        }
    };

    const renderItem = ({ item }: { item: NewsArticle }) => (
        <View style={styles.card}>
            {item.image && (
                <Image source={{ uri: item.image }} style={styles.cardImage} />
            )}
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.source} numberOfLines={1}>
                        {item.source?.name ?? 'Unknown Source'}
                    </Text>
                    <Text style={styles.date}>
                        {new Date(item.publishedAt).toLocaleDateString()}
                    </Text>
                </View>

                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.summary} numberOfLines={3}>
                    {item.description}
                </Text>

                <TouchableOpacity
                    style={styles.readMoreButton}
                    onPress={() => openArticle(item.url)}
                >
                    <Text style={styles.readMoreText}>Read More</Text>
                    <MaterialCommunityIcons name="arrow-right" size={16} color="#2E7D32" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // ── Loading ─────────────────────────────────────────────────────────────────
    if (screenState === 'loading') {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.stateText}>Loading latest agriculture news...</Text>
            </View>
        );
    }

    // ── Error ───────────────────────────────────────────────────────────────────
    if (screenState === 'error') {
        return (
            <View style={[styles.container, styles.center]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#d32f2f" />
                <Text style={styles.errorText}>{errorMsg}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchNews}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ── Success ─────────────────────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Agriculture News</Text>
            <FlatList
                data={news}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.url ?? index.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews={true}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                ListEmptyComponent={
                    <Text style={styles.stateText}>No news articles found.</Text>
                }
            />
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
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 20,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 20,
        paddingHorizontal: 15,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderBottomWidth: 3,
        borderBottomColor: '#2E7D32',
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    source: {
        flex: 1,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2E7D32',
        textTransform: 'uppercase',
        marginRight: 10,
    },
    date: {
        fontSize: 12,
        color: '#888',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
        lineHeight: 24,
    },
    summary: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginBottom: 15,
    },
    readMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: 5,
    },
    readMoreText: {
        color: '#2E7D32',
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 5,
    },
    stateText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    errorText: {
        marginTop: 15,
        marginBottom: 25,
        fontSize: 16,
        color: '#d32f2f',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    retryButton: {
        backgroundColor: '#2E7D32',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 20,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
