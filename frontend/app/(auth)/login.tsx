import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import Animated, { FadeInDown } from 'react-native-reanimated';
import GoogleLogo from '../../components/icons/GoogleLogo';
import { useState, useCallback } from 'react';
import { useSignIn } from '@clerk/clerk-expo';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Warm up browser for OAuth
export const useWarmUpBrowser = () => {
    useState(() => {
        void WebBrowser.warmUpAsync();
    });
    return {
        warmUpAsync: WebBrowser.warmUpAsync,
        coolDownAsync: WebBrowser.coolDownAsync,
    };
};

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    useWarmUpBrowser();
    const router = useRouter();
    const { signIn, setActive, isLoaded } = useSignIn();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleLogin = async () => {
        if (!isLoaded) return;
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const completeSignIn = await signIn.create({
                identifier: email,
                password,
            });

            if (completeSignIn.status === 'complete') {
                await setActive({ session: completeSignIn.createdSessionId });
                // Navigation is handled by AuthContext effect
            } else {
                console.log(JSON.stringify(completeSignIn, null, 2));
                Alert.alert('Login Failed', 'Additional steps required (e.g. MFA).');
            }
        } catch (error: any) {
            console.error(JSON.stringify(error, null, 2));
            Alert.alert('Login Failed', error.errors?.[0]?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = useCallback(async () => {
        try {
            setIsGoogleLoading(true);
            const { createdSessionId, transport, setActive } = await startOAuthFlow({
                redirectUrl: Linking.createURL('/'),
            });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
            } else {
                // Use signIn or signUp for next steps such as MFA
            }
        } catch (err: any) {
            console.error("OAuth error", err);
            Alert.alert("Google Sign-In Error", err.errors?.[0]?.message || "Failed to sign in with Google");
        } finally {
            setIsGoogleLoading(false);
        }
    }, [startOAuthFlow]);

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 p-8">
                    <TouchableOpacity
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/(auth)');
                            }
                        }}
                        className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center mb-8"
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>

                    <Animated.View entering={FadeInDown.duration(600).springify()}>
                        <Text className="text-3xl font-bold text-white mb-2">Welcome Back</Text>
                        <Text className="text-zinc-400 text-lg mb-8">Sign in to continue your progress.</Text>

                        <View className="gap-2">
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

                            <TouchableOpacity className="self-end mb-8">
                                <Text className="text-zinc-400 text-sm">Forgot Password?</Text>
                            </TouchableOpacity>

                            <AuthButton
                                title="Sign In"
                                onPress={handleLogin}
                                isLoading={isLoading}
                            />

                            <View className="flex-row items-center gap-4 my-6">
                                <View className="flex-1 h-[1px] bg-zinc-800" />
                                <Text className="text-zinc-500 text-sm">Or continue with</Text>
                                <View className="flex-1 h-[1px] bg-zinc-800" />
                            </View>

                            <AuthButton
                                title="Google"
                                icon={GoogleLogo}
                                variant="outline"
                                onPress={handleGoogleSignIn}
                                isLoading={isGoogleLoading}
                            />

                        </View>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
