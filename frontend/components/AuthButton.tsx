import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface AuthButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'ghost';
    icon?: LucideIcon | React.ComponentType<any>;
    fullWidth?: boolean;
}

export default function AuthButton({ title, onPress, variant = 'primary', icon: Icon, fullWidth = true }: AuthButtonProps) {
    const baseStyles = "h-14 rounded-2xl flex-row items-center justify-center gap-3";
    const variants = {
        primary: "bg-white",
        outline: "bg-transparent border border-zinc-700",
        ghost: "bg-transparent",
    };

    const textStyles = {
        primary: "text-zinc-950 font-bold text-lg",
        outline: "text-white font-semibold text-lg",
        ghost: "text-zinc-400 font-semibold text-base",
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
        >
            {Icon && <Icon size={20} color={variant === 'primary' ? '#09090b' : '#fff'} />}
            <Text className={textStyles[variant]}>{title}</Text>
        </TouchableOpacity>
    );
}
