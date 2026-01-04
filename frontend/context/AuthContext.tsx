import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';

// Define a minimal User type compatible with what the app expects, or extend it
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
    const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
    const { signOut: clerkSignOut } = useClerkAuth();

    // Derived state for app consumption
    const [userData, setUserData] = useState<UserData | null>(null);
    const isLoading = !isUserLoaded;

    useEffect(() => {
        if (clerkUser) {
            const mappedUser: UserData = {
                uid: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress || null,
                displayName: clerkUser.fullName,
                photoURL: clerkUser.imageUrl,
            };

            console.log("Auth State Changed. User:", mappedUser.uid);
            syncUserWithBackend(mappedUser);
            setUserData(mappedUser);
        } else {
            console.log("Auth State Changed. User: null");
            setUserData(null);
        }
    }, [clerkUser]);

    const signOut = async () => {
        try {
            console.log("Signing out...");
            await clerkSignOut();
            // Router redirection is handled by _layout.tsx based on user state
        } catch (error) {
            console.error("Sign out error", error);
        }
    };

    const syncUserWithBackend = async (user: UserData) => {
        try {
            console.log("Syncing user with backend...", user.uid);
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    photoURL: user.photoURL,
                }),
            });

            if (!response.ok) {
                throw new Error(`Sync failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log("User synced success:", data);
        } catch (error) {
            console.error("Error syncing user with backend:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user: userData, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
