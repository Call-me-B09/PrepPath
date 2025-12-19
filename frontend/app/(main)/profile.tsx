import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { Menu, LogOut, HelpCircle, User } from 'lucide-react-native';
import { MOCK_DATA } from '../../constants/MockData';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Profile() {
    const navigation = useNavigation();
    const router = useRouter();

    const toggleDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());

    const handleLogout = () => {
        // Clear auth state logic here
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <View className="flex-1 p-6">
                <View className="flex-row items-center mb-12 gap-4">
                    <TouchableOpacity onPress={toggleDrawer} className="w-10 h-10 bg-zinc-900 rounded-full items-center justify-center">
                        <Menu size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-xl">Profile</Text>
                </View>

                <Animated.View entering={FadeInDown.delay(100).springify()} className="items-center mb-12">
                    <View className="w-24 h-24 bg-zinc-800 rounded-full items-center justify-center mb-4 border-2 border-zinc-700">
                        <User size={40} color="#e4e4e7" />
                    </View>
                    <Text className="text-2xl font-bold text-white mb-1">{MOCK_DATA.userProfile.name}</Text>
                    <Text className="text-zinc-500">{MOCK_DATA.userProfile.email}</Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} className="gap-4">
                    <TouchableOpacity className="flex-row items-center p-4 bg-zinc-900 rounded-xl">
                        <User size={20} color="#fff" />
                        <Text className="text-zinc-200 font-medium ml-4">Account Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center p-4 bg-zinc-900 rounded-xl">
                        <HelpCircle size={20} color="#fff" />
                        <Text className="text-zinc-200 font-medium ml-4">Help & Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center p-4 bg-zinc-900 rounded-xl mt-4"
                    >
                        <LogOut size={20} color="#ef4444" />
                        <Text className="text-red-400 font-medium ml-4">Logout</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}
