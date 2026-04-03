import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Placeholder values that indicate a key has not been configured
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

// Dummy forecast to preserve UI structure
const DUMMY_FORECAST = [
    { day: 'Tue', temp: '19°C', icon: 'weather-sunny' },
    { day: 'Wed', temp: '17°C', icon: 'weather-cloudy' },
    { day: 'Thu', temp: '16°C', icon: 'weather-rainy' },
];

type ScreenState = 'loading' | 'no_key' | 'error' | 'success';

export default function WeatherScreen() {
    const [weatherData, setWeatherData] = useState<any>(null);
    const [screenState, setScreenState] = useState<ScreenState>('loading');
    const [errorMsg, setErrorMsg] = useState<string>('');

    const fetchWeather = async () => {
        const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

        // Guard: skip API call if key is missing or a placeholder
        if (!isKeyValid(API_KEY)) {
            setScreenState('no_key');
            return;
        }

        setScreenState('loading');
        setErrorMsg('');

        try {
            const city = 'Shimla';
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}. Check your API key.`);
            }

            const data = await response.json();

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
            setScreenState('error');
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    // ── No API Key ─────────────────────────────────────────────────────────────
    if (screenState === 'no_key') {
        return (
            <View style={[styles.container, styles.center]}>
                <MaterialCommunityIcons name="weather-cloudy-alert" size={70} color="#BDBDBD" />
                <Text style={styles.unavailableTitle}>Weather Data Unavailable</Text>
                <Text style={styles.unavailableSubtitle}>
                    No API key configured.{'\n'}Set EXPO_PUBLIC_WEATHER_API_KEY in your .env file.
                </Text>
            </View>
        );
    }

    // ── Loading ─────────────────────────────────────────────────────────────────
    if (screenState === 'loading') {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.stateText}>Fetching weather data...</Text>
            </View>
        );
    }

    // ── Error ───────────────────────────────────────────────────────────────────
    if (screenState === 'error') {
        return (
            <View style={[styles.container, styles.center]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#d32f2f" />
                <Text style={styles.errorText}>{errorMsg}</Text>
                <TouchableOpacity style={styles.refreshButton} onPress={fetchWeather}>
                    <MaterialCommunityIcons name="refresh" size={20} color="#FFF" />
                    <Text style={styles.refreshButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ── Success ─────────────────────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Location Header */}
                <View style={styles.header}>
                    <MaterialCommunityIcons name="map-marker" size={24} color="#2E7D32" />
                    <Text style={styles.locationText}>{weatherData?.location}</Text>
                </View>

                {/* Main Weather Card */}
                <View style={styles.mainCard}>
                    <MaterialCommunityIcons name={weatherData?.iconName as any} size={80} color="#FFF" />
                    <Text style={styles.temperature}>{weatherData?.temperature}</Text>
                    <Text style={styles.condition}>{weatherData?.condition}</Text>
                </View>

                {/* Details Grid */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="water-percent" size={30} color="#2E7D32" />
                        <Text style={styles.detailLabel}>Humidity</Text>
                        <Text style={styles.detailValue}>{weatherData?.humidity}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="weather-windy" size={30} color="#2E7D32" />
                        <Text style={styles.detailLabel}>Wind Speed</Text>
                        <Text style={styles.detailValue}>{weatherData?.windSpeed}</Text>
                    </View>
                </View>

                {/* 3-Day Forecast */}
                <View style={styles.forecastContainer}>
                    <Text style={styles.sectionTitle}>3-Day Forecast</Text>
                    {DUMMY_FORECAST.map((item, index) => (
                        <View key={index} style={styles.forecastItem}>
                            <Text style={styles.forecastDay}>{item.day}</Text>
                            <MaterialCommunityIcons name={item.icon as any} size={24} color="#555" />
                            <Text style={styles.forecastTemp}>{item.temp}</Text>
                        </View>
                    ))}
                </View>

                {/* Refresh Button */}
                <TouchableOpacity style={styles.refreshButton} onPress={fetchWeather}>
                    <MaterialCommunityIcons name="refresh" size={24} color="#FFF" />
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    stateText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        marginTop: 15,
        marginBottom: 25,
        fontSize: 16,
        color: '#d32f2f',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    unavailableTitle: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#757575',
        textAlign: 'center',
    },
    unavailableSubtitle: {
        marginTop: 10,
        fontSize: 14,
        color: '#9E9E9E',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 30,
    },
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    locationText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    mainCard: {
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        marginBottom: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 10,
    },
    condition: {
        fontSize: 24,
        color: '#E8F5E9',
        marginTop: 5,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
    },
    detailItem: {
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 15,
        width: '45%',
        elevation: 2,
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    detailValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    forecastContainer: {
        width: '100%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    forecastItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    forecastDay: {
        fontSize: 16,
        color: '#333',
        width: 50,
    },
    forecastTemp: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    refreshButton: {
        flexDirection: 'row',
        backgroundColor: '#2E7D32',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
    },
    refreshButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
