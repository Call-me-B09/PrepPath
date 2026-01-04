import "../global.css";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { UserProvider } from "../context/UserContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import GlobalLoader from "../components/GlobalLoader";

function RootLayoutNav() {
    const { user, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inMainGroup = segments[0] === '(main)';

        if (user && inAuthGroup) {
            // Redirect to dashboard if logged in and trying to access auth screens
            router.replace('/(main)');
        } else if (!user && !inAuthGroup) {
            // Redirect to login if not logged in and not in auth group (trying to access protected routes)
            router.replace('/(auth)/login');
        }
    }, [user, isLoading, segments]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-zinc-950">
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <UserProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
            <GlobalLoader />
        </UserProvider>
    );
}

export default function Layout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}
