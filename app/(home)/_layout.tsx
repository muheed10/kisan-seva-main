import { Stack } from 'expo-router'

export default function HomeLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="marketplace" options={{ title: 'Market Place', headerShown: true }} />
            <Stack.Screen name="subsidies" options={{ title: 'Govt Subsidies', headerShown: true }} />
            <Stack.Screen name="weather" options={{ title: 'Weather Report', headerShown: true }} />
            <Stack.Screen name="news" options={{ title: 'Agriculture News', headerShown: true }} />
            <Stack.Screen name="disease" options={{ title: 'Crop Disease ID', headerShown: true }} />
            <Stack.Screen name="my-products" options={{ title: 'My Products', headerShown: true }} />
        </Stack>
    )
}
