import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase';
import { router } from 'expo-router';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("Auth State Changed. User:", currentUser ? currentUser.uid : "null");

            if (currentUser) {
                await syncUserWithBackend(currentUser);
            }

            setUser(currentUser);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const signOut = async () => {
        try {
            console.log("Signing out...");
            await firebaseSignOut(auth);
            router.replace('/(auth)/login');
        } catch (error) {
            console.error("Sign out error", error);
        }
    };

    const syncUserWithBackend = async (firebaseUser: User) => {
        try {
            console.log("Syncing user with backend...", firebaseUser.uid);
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
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
        <AuthContext.Provider value={{ user, isLoading, signOut }}>
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
