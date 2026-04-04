import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Button, Text, TextInput, View, Alert } from 'react-native'

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [isMfaRequired, setIsMfaRequired] = useState(false)

    const onSignInPress = async () => {
        if (!isLoaded) return

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else if (signInAttempt.status === 'needs_second_factor') {
                setIsMfaRequired(true)
            } else {
                console.error('Sign-in status unknown:', signInAttempt.status)
            }
        } catch (err: any) {
            console.error('Sign-in error:', JSON.stringify(err, null, 2))
            Alert.alert('Sign-in Error', err.errors?.[0]?.message || 'An error occurred')
        }
    }

    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            const result = await signIn.attemptSecondFactor({
                strategy: 'email_code',
                code,
            })

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId })
                router.replace('/')
            } else {
                console.error('MFA status unknown:', result.status)
            }
        } catch (err: any) {
            console.error('MFA error:', JSON.stringify(err, null, 2))
            Alert.alert('Verification Error', err.errors?.[0]?.message || 'Invalid code')
        }
    }

    if (isMfaRequired) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                <Text style={{ fontSize: 24, marginBottom: 10, textAlign: 'center' }}>Verify Your Identity</Text>
                <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#666' }}>
                    A verification code has been sent to your email.
                </Text>
                <TextInput
                    value={code}
                    placeholder="Enter verification code"
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    style={{ borderWidth: 1, padding: 15, marginBottom: 20, borderRadius: 10, borderColor: '#DDD' }}
                />
                <Button title="Verify Code" onPress={onVerifyPress} color="#2E7D32" />
                <Button title="Back to Login" onPress={() => setIsMfaRequired(false)} color="#666" />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 28, marginBottom: 10, fontWeight: 'bold', textAlign: 'center', color: '#2E7D32' }}>Kisan Seva</Text>
            <Text style={{ fontSize: 18, marginBottom: 30, textAlign: 'center', color: '#666' }}>Login to your dashboard</Text>
            
            <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter email address"
                onChangeText={setEmailAddress}
                style={{ borderWidth: 1, padding: 15, marginBottom: 15, borderRadius: 10, borderColor: '#DDD' }}
            />
            <TextInput
                value={password}
                placeholder="Enter password"
                secureTextEntry={true}
                onChangeText={setPassword}
                style={{ borderWidth: 1, padding: 15, marginBottom: 25, borderRadius: 10, borderColor: '#DDD' }}
            />
            
            <Button title="Sign In" onPress={onSignInPress} color="#2E7D32" />
            
            <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ color: '#666' }}>Don't have an account? </Text>
                <Link href="/sign-up">
                    <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>Sign Up</Text>
                </Link>
            </View>
        </View>
    )
}

