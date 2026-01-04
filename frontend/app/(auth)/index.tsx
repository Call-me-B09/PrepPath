import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import AuthButton from '../../components/AuthButton';
import Animated, { FadeInDown } from 'react-native-reanimated';
import GoogleLogo from '../../components/icons/GoogleLogo';
import { useCallback, useState } from 'react';
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

export default function AuthLanding() {
    useWarmUpBrowser();
    const router = useRouter();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = useCallback(async () => {
        try {
            setIsLoading(true);
            const { createdSessionId, setActive } = await startOAuthFlow({
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
            setIsLoading(false);
        }
    }, [startOAuthFlow]);

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <View className="flex-1 p-8 justify-between">
                <View className="flex-1 justify-center items-center">
                    <Animated.View entering={FadeInDown.delay(200).springify()} className="items-center gap-4">
                        <Text className="text-4xl font-bold text-white text-center">
                            Unlock Your Potential
                        </Text>
                        <Text className="text-zinc-400 text-lg text-center max-w-[80%]">
                            Join thousands of students mastering their prep with PrepPath.
                        </Text>
                    </Animated.View>
                </View>

                <Animated.View entering={FadeInDown.delay(400).springify()} className="gap-4 w-full">
                    <AuthButton
                        title="Continue with Google"
                        icon={GoogleLogo}
                        variant="outline"
                        onPress={handleGoogleSignIn}
                        isLoading={isLoading}
                    />
                    <AuthButton
                        title="Sign Up with Email"
                        icon={Mail}
                        variant="primary"
                        onPress={() => router.push('/(auth)/signup')}
                    />

                    <View className="mt-4 flex-row justify-center items-center gap-2">
                        <Text className="text-zinc-400">Already have an account?</Text>
                        <Text
                            onPress={() => router.push('/(auth)/login')}
                            className="text-white font-bold"
                        >
                            Log In
                        </Text>
                    </View>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}
