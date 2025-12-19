import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, TouchableOpacity } from 'react-native';
import { LucideIcon, Eye, EyeOff } from 'lucide-react-native';

interface AuthInputProps extends TextInputProps {
    label: string;
    icon: LucideIcon;
    isPassword?: boolean;
}

export default function AuthInput({ label, icon: Icon, isPassword, ...props }: AuthInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className="gap-2 mb-4">
            <Text className="text-zinc-400 text-sm font-medium ml-1">{label}</Text>
            <View
                className={`flex-row items-center h-14 px-4 rounded-2xl bg-zinc-900 border ${isFocused ? 'border-white' : 'border-zinc-800'
                    }`}
            >
                <Icon size={20} color={isFocused ? "#fff" : "#71717a"} />
                <TextInput
                    placeholderTextColor="#52525b"
                    style={{ flex: 1, color: "white", marginLeft: 12, fontSize: 16 }}
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                            <EyeOff size={20} color="#71717a" />
                        ) : (
                            <Eye size={20} color="#71717a" />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
