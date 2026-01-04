import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, User, Shield } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';

export default function AccountDetails() {
    const { user } = useAuth();

    if (!user) {
        return (
            <View className="flex-1 bg-zinc-950 p-6 items-center justify-center">
                <Text className="text-zinc-500">No user data available.</Text>
            </View>
        );
    }

    const DetailItem = ({ icon: Icon, label, value, delay = 0 }: { icon: any, label: string, value: string, delay?: number }) => (
        <Animated.View
            entering={FadeInDown.delay(delay).springify()}
            className="flex-row items-center p-4 bg-zinc-900 rounded-xl mb-3 border border-zinc-800"
        >
            <View className="w-10 h-10 bg-zinc-800 rounded-full items-center justify-center mr-4">
                <Icon size={20} color="#e4e4e7" />
            </View>
            <View className="flex-1">
                <Text className="text-zinc-400 text-xs font-medium uppercase mb-0.5">{label}</Text>
                <Text className="text-white text-base font-medium" numberOfLines={1} ellipsizeMode="middle">{value}</Text>
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <ScrollView className="flex-1">
                <View className="p-6">

                    {/* Header Section */}
                    <Animated.View entering={FadeInDown.delay(100).springify()} className="items-center mb-8 mt-10">
                        <View className="w-24 h-24 bg-zinc-900 rounded-full items-center justify-center mb-4 border-2 border-zinc-800">
                            <Text className="text-3xl font-bold text-zinc-300">
                                {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                            </Text>
                        </View>
                        <Text className="text-xl font-bold text-white">{user.displayName || "User"}</Text>
                        <Text className="text-zinc-500">{user.email}</Text>
                    </Animated.View>

                    {/* Details Section */}
                    <View className="mb-6">
                        <Text className="text-zinc-500 font-medium mb-4 ml-1">Personal Information</Text>

                        <DetailItem
                            icon={User}
                            label="Full Name"
                            value={user.displayName || "Not provided"}
                            delay={200}
                        />
                        <DetailItem
                            icon={Mail}
                            label="Email Address"
                            value={user.email || "Not provided"}
                            delay={300}
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-zinc-500 font-medium mb-4 ml-1">Account Info</Text>

                        <DetailItem
                            icon={Shield}
                            label="User ID"
                            value={user.uid}
                            delay={400}
                        />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
