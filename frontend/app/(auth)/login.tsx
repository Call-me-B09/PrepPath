import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import Animated, { FadeInDown } from 'react-native-reanimated';
import GoogleLogo from '../../components/icons/GoogleLogo';

export default function Login() {
    const router = useRouter();

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
                            />
                            <AuthInput
                                label="Password"
                                placeholder="••••••••"
                                icon={Lock}
                                isPassword
                            />

                            <TouchableOpacity className="self-end mb-8">
                                <Text className="text-zinc-400 text-sm">Forgot Password?</Text>
                            </TouchableOpacity>

                            <AuthButton
                                title="Sign In"
                                onPress={() => router.replace('/(main)')}
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
                                onPress={() => router.replace('/(main)')}
                            />
                        </View>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
