import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '../utils/tokenCache'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'

SplashScreen.preventAutoHideAsync()

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

export default function RootLayout() {
  const [clerkTimedOut, setClerkTimedOut] = useState(false)
  const clerkLoadedRef = useRef(false)

  const handleClerkLoaded = useCallback(() => {
    clerkLoadedRef.current = true
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!clerkLoadedRef.current) {
        setClerkTimedOut(true)
        SplashScreen.hideAsync()
      }
    }, 10000) // 10s timeout — prevents infinite splash if Clerk can't connect

    return () => clearTimeout(timer)
  }, [])

  if (clerkTimedOut) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#FFF' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#d32f2f', marginBottom: 12 }}>
          Connection Error
        </Text>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24 }}>
          Unable to connect to the authentication service. Please check your internet connection and restart the app.
        </Text>
      </View>
    )
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <LayoutContent onLoaded={handleClerkLoaded} />
      </ClerkLoaded>
    </ClerkProvider>
  )
}

function LayoutContent({ onLoaded }: { onLoaded: () => void }) {
  useEffect(() => {
    onLoaded()
    SplashScreen.hideAsync()
  }, [onLoaded])

  return <Slot />
}

