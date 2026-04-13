import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#2E7D32',
            tabBarInactiveTintColor: '#666',
            headerShown: false,
        }}>
            <Tabs.Screen 
                name="index" 
                options={{ 
                    title: 'Home', 
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" size={size} color={color} /> 
                }} 
            />
            <Tabs.Screen 
                name="profile" 
                options={{ 
                    title: 'Profile', 
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" size={size} color={color} /> 
                }} 
            />
            <Tabs.Screen name="marketplace" options={{ href: null, headerShown: true, title: 'Market Place' }} />
            <Tabs.Screen name="subsidies" options={{ href: null, headerShown: true, title: 'Govt Subsidies' }} />
            <Tabs.Screen name="weather" options={{ href: null, headerShown: true, title: 'Weather Report' }} />
            <Tabs.Screen name="news" options={{ href: null, headerShown: true, title: 'Agriculture News' }} />
            <Tabs.Screen name="disease" options={{ href: null, headerShown: true, title: 'Crop Disease ID' }} />
            <Tabs.Screen name="my-products" options={{ href: null, headerShown: true, title: 'My Products' }} />
            <Tabs.Screen name="kyc" options={{ href: null, headerShown: true, title: 'KYC Verification' }} />
        </Tabs>
    );
}
