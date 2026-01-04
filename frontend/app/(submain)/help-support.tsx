import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Phone, ExternalLink } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HelpSupport() {

    const handleEmail = () => {
        Linking.openURL('mailto:adhirajpal31@gmail.com').catch(err => {
            console.error("Failed to open mail app:", err);
            Alert.alert("Error", "Could not open email client.");
        });
    };

    const handlePhone = () => {
        Linking.openURL('tel:+916291439470').catch(err => {
            console.error("Failed to open dialer:", err);
            Alert.alert("Error", "Could not open dialer.");
        });
    };

    const ContactItem = ({ icon: Icon, label, value, onPress, delay = 0 }: { icon: any, label: string, value: string, onPress: () => void, delay?: number }) => (
        <Animated.View entering={FadeInDown.delay(delay).springify()}>
            <TouchableOpacity
                onPress={onPress}
                className="flex-row items-center p-4 bg-zinc-900 rounded-xl mb-3 border border-zinc-800"
            >
                <View className="w-10 h-10 bg-zinc-800 rounded-full items-center justify-center mr-4">
                    <Icon size={20} color="#e4e4e7" />
                </View>
                <View className="flex-1">
                    <Text className="text-zinc-400 text-xs font-medium uppercase mb-0.5">{label}</Text>
                    <Text className="text-white text-base font-medium">{value}</Text>
                </View>
                <ExternalLink size={16} color="#71717a" />
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <ScrollView className="flex-1">
                <View className="p-6">
                    {/* Header Section */}
                    <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-10 mt-10">
                        <Text className="text-3xl font-bold text-white mb-2">Help & Support</Text>
                        <Text className="text-zinc-400 text-base">
                            Need assistance? Reach out to us directly through the channels below.
                        </Text>
                    </Animated.View>

                    {/* Contact Methods */}
                    <View className="mb-6">
                        <Text className="text-zinc-500 font-medium mb-4 ml-1">Contact Us</Text>

                        <ContactItem
                            icon={Mail}
                            label="Email Support"
                            value="adhirajpal31@gmail.com"
                            onPress={handleEmail}
                            delay={200}
                        />

                        <ContactItem
                            icon={Phone}
                            label="Phone Support"
                            value="+91 6291439470"
                            onPress={handlePhone}
                            delay={300}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
