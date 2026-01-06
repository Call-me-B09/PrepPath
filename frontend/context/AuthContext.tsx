import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

interface UserData {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

interface AuthContextType {
    user: UserData | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user: clerkUser, isLoaded } = useUser();
    const { signOut: clerkSignOut } = useClerkAuth();

    const [user, setUser] = useState<UserData | null>(null);

    // 🔒 HARD LOCK — prevents repeat sync
    const syncedUidRef = useRef<string | null>(null);

    const isLoading = !isLoaded;

    useEffect(() => {
        if (!isLoaded) return;

        // 🔓 Signed out
        if (!clerkUser?.id) {
            syncedUidRef.current = null;
            setUser(null);
            return;
        }

        // 🛑 Same user already synced → STOP
        if (syncedUidRef.current === clerkUser.id) {
            return;
        }

        const mappedUser: UserData = {
            uid: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
            displayName: clerkUser.fullName ?? null,
            photoURL: clerkUser.imageUrl ?? null,
        };

        console.log("Auth State Changed → signed in:", mappedUser.uid);

        syncedUidRef.current = clerkUser.id;
        setUser(mappedUser);
        syncUserWithBackend(mappedUser);

    }, [clerkUser?.id, isLoaded]); // ✅ ONLY ID, not whole object



    const signOut = async () => {
        try {
            await clerkSignOut();

            // Try Native Dev Reload (Works in Expo Go/Dev Client)
            try {
                const { NativeModules } = require('react-native');
                if (NativeModules.DevSettings) {
                    NativeModules.DevSettings.reload();
                    return;
                }
            } catch (e) {
                // Ignore dev reload error
            }

            // Fallback to Router Navigation
            router.replace('/');
        } catch (error) {
            console.error("Sign out error", error);
            router.replace('/');
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}

async function syncUserWithBackend(user: UserData) {
    try {
        console.log("Syncing user with backend:", user.uid);

        await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        console.log("User sync successful");
    } catch (err) {
        console.error("User sync failed", err);
    }
}
