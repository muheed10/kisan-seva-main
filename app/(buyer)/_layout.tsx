import { Stack } from 'expo-router';

export default function BuyerLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Buyer Dashboard', headerShown: false }} />
        </Stack>
    );
}
