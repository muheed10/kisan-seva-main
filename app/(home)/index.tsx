import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link, Redirect, useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ROLE_STORAGE_KEY } from '../../screens/RoleSelectionScreen'

export default function Page() {
    const { user } = useUser()
    const { signOut } = useAuth()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            // 1. Sign out from Clerk FIRST to clear auth state
            await signOut()

            // 2. Clear the persisted role
            await AsyncStorage.removeItem(ROLE_STORAGE_KEY)

            // 3. Navigate to root (Role Selection)
            router.replace('/')
        } catch (err) {
            console.error('Error signing out:', err)
        }
    }

    const features = [
        { name: 'Market Place', route: '/(home)/marketplace', icon: '🛒' },
        { name: 'Govt Subsidies', route: '/(home)/subsidies', icon: '📜' },
        { name: 'Weather Report', route: '/(home)/weather', icon: '☁️' },
        { name: 'Agriculture News', route: '/(home)/news', icon: '📰' },
        { name: 'Crop Disease', route: '/(home)/disease', icon: '🔍' },
        { name: 'My Products', route: '/(home)/my-products', icon: '📦' },
    ]

    return (
        <SafeAreaView style={styles.container}>
            <SignedIn>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'User'}!</Text>
                    <Text style={styles.subText}>Kisan Seva Dashboard</Text>
                </View>

                <ScrollView contentContainerStyle={styles.grid}>
                    {features.map((feature, index) => (
                        <Link key={index} href={feature.route as any} asChild>
                            <TouchableOpacity style={styles.card}>
                                <Text style={styles.cardIcon}>{feature.icon}</Text>
                                <Text style={styles.cardText}>{feature.name}</Text>
                            </TouchableOpacity>
                        </Link>
                    ))}
                </ScrollView>

                <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </SignedIn>

            <SignedOut>
                <Redirect href="/(auth)/sign-in" />
            </SignedOut>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Light background
        padding: 20,
    },
    header: {
        marginTop: 10,
        marginBottom: 30,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#388E3C', // Darker Green
        textAlign: 'center',
    },
    subText: {
        fontSize: 16,
        color: '#666',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%', // Two columns
        backgroundColor: '#4CAF50', // Green Theme
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        aspectRatio: 1, // Square cards
    },
    cardIcon: {
        fontSize: 40,
        marginBottom: 10,
        color: '#FFF',
    },
    cardText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    signOutButton: {
        backgroundColor: '#d32f2f', // Red
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    signOutText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
})
