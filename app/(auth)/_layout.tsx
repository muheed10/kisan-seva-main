import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'

export default function AuthLayout() {
    const { isSignedIn } = useAuth()
    console.log('AuthLayout: isSignedIn =', isSignedIn)

    if (isSignedIn) {
        return <Redirect href={'/'} />
    }

    return <Stack />
}
