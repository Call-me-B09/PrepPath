import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, ArrowLeft, KeyRound } from 'lucide-react-native';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-expo';

export default function Signup() {
    const router = useRouter();
    const { isLoaded, signUp, setActive } = useSignUp();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async () => {
        if (!isLoaded) return;
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            await signUp.create({
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' '),
                emailAddress: email,
                password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (error: any) {
            console.error(JSON.stringify(error, null, 2));
            Alert.alert('Signup Failed', error.errors?.[0]?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!isLoaded) return;
        if (!code) {
            Alert.alert('Error', 'Please enter verification code');
            return;
        }

        setIsLoading(true);
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });
                // Navigation handled by auth listener
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
                Alert.alert('Verification Failed', 'Unable to verify email.');
            }
        } catch (error: any) {
            console.error(JSON.stringify(error, null, 2));
            Alert.alert('Verification Failed', error.errors?.[0]?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (pendingVerification) {
        return (
            <SafeAreaView className="flex-1 bg-zinc-950">
                <View className="flex-1 p-8 pt-16">
                    <Text className="text-3xl font-bold text-white mb-2">Verify Email</Text>
                    <Text className="text-zinc-400 text-lg mb-8">Enter the code sent to {email}</Text>

                    <AuthInput
                        label="Verification Code"
                        placeholder="123456"
                        icon={KeyRound}
                        keyboardType="number-pad"
                        value={code}
                        onChangeText={setCode}
                    />

                    <View className="h-4" />

                    <AuthButton
                        title="Verify Email"
                        onPress={handleVerify}
                        isLoading={isLoading}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-8">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center mb-8 mt-4"
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>

                    <Animated.View entering={FadeInDown.duration(600).springify()}>
                        <Text className="text-3xl font-bold text-white mb-2">Create Account</Text>
                        <Text className="text-zinc-400 text-lg mb-8">Start your journey with PrepPath.</Text>

                        <View className="gap-2">
                            <AuthInput
                                label="Full Name"
                                placeholder="John Doe"
                                icon={User}
                                autoCapitalize="words"
                                value={name}
                                onChangeText={setName}
                            />
                            <AuthInput
                                label="Email Address"
                                placeholder="you@example.com"
                                icon={Mail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <AuthInput
                                label="Password"
                                placeholder="••••••••"
                                icon={Lock}
                                isPassword
                                value={password}
                                onChangeText={setPassword}
                            />

                            <View className="mb-8" />

                            <AuthButton
                                title="Create Account"
                                onPress={handleSignup}
                                isLoading={isLoading}
                            />
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
