import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '../utils/tokenCache'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

SplashScreen.preventAutoHideAsync()

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

export default function RootLayout() {
  useEffect(() => {
    // Hidden automatically when Clerk is loaded via ClerkLoaded
    // But we can hide it manually here once the component mounts
    // or keep it till ClerkLoaded resolves.
  }, [])

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <LayoutContent />
      </ClerkLoaded>
    </ClerkProvider>
  )
}

function LayoutContent() {
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return <Slot />
}

