import "../global.css";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Alert } from "react-native";
import { UserProvider } from "../context/UserContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import GlobalLoader from "../components/GlobalLoader";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "../utils/tokenCache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
    throw new Error(
        "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
}

function RootLayoutNav() {
    return (
        <>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
            <GlobalLoader />
        </>
    );
}

export default function Layout() {
    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            <ClerkLoaded>
                <AuthProvider>
                    <UserProvider>
                        <RootLayoutNav />
                    </UserProvider>
                </AuthProvider>
            </ClerkLoaded>
        </ClerkProvider>
    );
}
