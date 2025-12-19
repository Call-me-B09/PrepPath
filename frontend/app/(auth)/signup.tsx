import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react-native';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Signup() {
    const router = useRouter();

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
                            />
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

                            <View className="mb-8" />

                            <AuthButton
                                title="Create Account"
                                onPress={() => router.replace('/(main)')}
                            />
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
