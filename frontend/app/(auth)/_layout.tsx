import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

export default function AuthLayout() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.replace('/(main)');
        }
    }, [user]);

    if (user) return null; // Prevent rendering auth screens if logged in

    return (
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    );
}
