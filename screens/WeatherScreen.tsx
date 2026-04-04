import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';

const PLACEHOLDER_KEYS = ['your_openweathermap_api_key_here', 'undefined', ''];

function isKeyValid(key: string | undefined): boolean {
    if (!key) return false;
    return !PLACEHOLDER_KEYS.includes(key.trim());
}

function getWeatherIcon(conditionCode: number): string {
    if (conditionCode >= 200 && conditionCode < 300) return 'weather-lightning';
    if (conditionCode >= 300 && conditionCode < 500) return 'weather-rainy';
    if (conditionCode >= 500 && conditionCode < 600) return 'weather-pouring';
    if (conditionCode >= 600 && conditionCode < 700) return 'weather-snowy';
    if (conditionCode >= 700 && conditionCode < 800) return 'weather-fog';
    if (conditionCode === 800) return 'weather-sunny';
    if (conditionCode > 800) return 'weather-cloudy';
    return 'weather-partly-cloudy';
}

type ScreenState = 'loading' | 'no_key' | 'error' | 'success';

export default function WeatherScreen() {
    const [weatherData, setWeatherData] = useState<any>(null);
    const [screenState, setScreenState] = useState<ScreenState>('loading');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [searchCity, setSearchCity] = useState('');
    const [loadingMore, setLoadingMore] = useState(false);

    const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

    const fetchWeather = async (type: 'location' | 'search' = 'location', cityName?: string) => {
        if (!isKeyValid(API_KEY)) {
            setScreenState('no_key');
            return;
        }

        if (type === 'search' && !cityName) return;

        setLoadingMore(true);
        if (screenState !== 'success') setScreenState('loading');
        setErrorMsg('');

        try {
            let url = '';
            if (type === 'location') {
                const { status } = await Location.requestForegroundPermissionsAsync();
                
                if (status !== 'granted') {
                    // Fallback to Delhi if permission denied
                    url = `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${API_KEY}&units=metric`;
                } else {
                    const location = await Location.getCurrentPositionAsync({});
                    url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}&units=metric`;
                }
            } else {
                url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch weather data.');
            }

            setWeatherData({
                location: `${data.name}, ${data.sys.country}`,
                temperature: `${Math.round(data.main.temp)}°C`,
                condition: data.weather[0].main,
                humidity: `${data.main.humidity}%`,
                windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`,
                iconName: getWeatherIcon(data.weather[0].id),
            });
            setScreenState('success');
        } catch (err: any) {
            setErrorMsg(err?.message ?? 'Failed to fetch weather data.');
            if (screenState !== 'success') setScreenState('error');
            else Alert.alert('Error', err?.message || 'Could not find city.');
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchWeather('location');
    }, []);

    const handleSearch = () => {
        if (searchCity.trim()) {
            fetchWeather('search', searchCity.trim());
        }
    };

    if (screenState === 'no_key') {
        return (
            <View style={[styles.container, styles.center]}>
                <MaterialCommunityIcons name="weather-cloudy-alert" size={80} color="#BDBDBD" />
                <Text style={styles.unavailableTitle}>Weather Data Unavailable</Text>
                <Text style={styles.unavailableSubtitle}>
                    API key missing or invalid. Check your .env setup.
                </Text>
            </View>
        );
    }

    if (screenState === 'loading' && !loadingMore) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={styles.stateText}>Getting latest weather...</Text>
            </View>
        );
    }

    if (screenState === 'error' && !weatherData) {
        return (
            <View style={[styles.container, styles.center]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={70} color="#d32f2f" />
                <Text style={styles.errorText}>{errorMsg}</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => fetchWeather('location')}>
                    <Text style={styles.buttonText}>Try Current Location</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search City (e.g. Pune)"
                    placeholderTextColor="#999"
                    value={searchCity}
                    onChangeText={setSearchCity}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
                    <MaterialCommunityIcons name="magnify" size={28} color="#2E7D32" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {loadingMore && <ActivityIndicator size="small" color="#2E7D32" style={{ marginBottom: 10 }} />}
                
                <View style={styles.header}>
                    <MaterialCommunityIcons name="map-marker" size={26} color="#2E7D32" />
                    <Text style={styles.locationText}>{weatherData?.location}</Text>
                </View>

                <View style={styles.mainCard}>
                    <MaterialCommunityIcons name={weatherData?.iconName as any} size={100} color="#FFF" />
                    <Text style={styles.temperature}>{weatherData?.temperature}</Text>
                    <Text style={styles.condition}>{weatherData?.condition}</Text>
                </View>

                <View style={styles.detailsRow}>
                    <View style={styles.detailCard}>
                        <MaterialCommunityIcons name="water-percent" size={34} color="#2E7D32" />
                        <Text style={styles.detailLabel}>Humidity</Text>
                        <Text style={styles.detailValue}>{weatherData?.humidity}</Text>
                    </View>
                    <View style={styles.detailCard}>
                        <MaterialCommunityIcons name="weather-windy" size={34} color="#2E7D32" />
                        <Text style={styles.detailLabel}>Wind Speed</Text>
                        <Text style={styles.detailValue}>{weatherData?.windSpeed}</Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.gpsButton} 
                    onPress={() => {
                        setSearchCity('');
                        fetchWeather('location');
                    }}
                >
                    <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#FFF" />
                    <Text style={styles.gpsButtonText}>Use Current Location</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F8E9',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: 15,
        borderRadius: 12,
        paddingHorizontal: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchInput: {
        flex: 1,
        height: 55,
        fontSize: 18,
        color: '#333',
    },
    searchIcon: {
        padding: 8,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    locationText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    mainCard: {
        backgroundColor: '#4CAF50',
        width: '100%',
        borderRadius: 25,
        padding: 35,
        alignItems: 'center',
        marginBottom: 25,
        elevation: 6,
    },
    temperature: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 10,
    },
    condition: {
        fontSize: 28,
        color: '#E8F5E9',
        textTransform: 'capitalize',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 25,
    },
    detailCard: {
        backgroundColor: '#FFF',
        width: '47%',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 3,
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
    },
    detailValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginTop: 4,
    },
    gpsButton: {
        flexDirection: 'row',
        backgroundColor: '#2E7D32',
        paddingVertical: 16,
        paddingHorizontal: 25,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
    },
    gpsButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    primaryButton: {
        backgroundColor: '#2E7D32',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    stateText: {
        marginTop: 20,
        fontSize: 18,
        color: '#555',
    },
    errorText: {
        fontSize: 18,
        color: '#d32f2f',
        textAlign: 'center',
        marginBottom: 20,
    },
    unavailableTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#757575',
        marginTop: 20,
    },
    unavailableSubtitle: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 10,
    },
});
