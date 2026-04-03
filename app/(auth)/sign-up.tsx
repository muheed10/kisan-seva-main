import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Button, Text, TextInput, View } from 'react-native'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')

    const onSignUpPress = async () => {
        if (!isLoaded) {
            return
        }

        try {
            await signUp.create({
                emailAddress,
                password,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setPendingVerification(true)
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        }
    }

    const onPressVerify = async () => {
        if (!isLoaded) {
            return
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId })
                router.replace('/')
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2))
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>Kisan Seva Sign Up</Text>
            {!pendingVerification && (
                <>
                    <TextInput
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Enter email"
                        onChangeText={(email) => setEmailAddress(email)}
                        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
                    />
                    <TextInput
                        value={password}
                        placeholder="Enter password"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                        style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
                    />
                    <Button title="Sign Up" onPress={onSignUpPress} color="#2E7D32" />
                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                        <Text>Already have an account? </Text>
                        <Link href="/sign-in">
                            <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>Sign In</Text>
                        </Link>
                    </View>
                </>
            )}
            {pendingVerification && (
                <>
                    <TextInput
                        value={code}
                        placeholder="Code..."
                        onChangeText={(code) => setCode(code)}
                        style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
                    />
                    <Button title="Verify Email" onPress={onPressVerify} color="#2E7D32" />
                </>
            )}
        </View>
    )
}
