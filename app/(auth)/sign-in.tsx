import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Button, Text, TextInput, View } from 'react-native'

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')

    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) {
            return
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            alert(err.errors?.[0]?.message || err.message || 'An error occurred during sign in')
        }
    }, [isLoaded, emailAddress, password])

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>Kisan Seva Login</Text>
            <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter email"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
            />
            <TextInput
                value={password}
                placeholder="Enter password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
            />
            <Button title="Sign In" onPress={onSignInPress} color="#2E7D32" />
            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                <Text>Don't have an account? </Text>
                <Link href="/sign-up">
                    <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>Sign Up</Text>
                </Link>
            </View>
        </View>
    )
}
