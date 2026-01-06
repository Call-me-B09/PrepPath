import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import { MOCK_EMPTY_DATA, UserData } from '../constants/MockData';
import {
    getDashboardOverview,
    createRoadmap as apiCreateRoadmap,
    toggleStep as apiToggleStep,
    resetRoadmapData,
} from '../services/api';

interface UserContextType {
    userData: UserData;
    isLoading: boolean;
    createRoadmap: (params: any) => Promise<void>;
    resetRoadmap: () => Promise<void>;
    toggleTask: (taskId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    const [userData, setUserData] = useState<UserData>(MOCK_EMPTY_DATA);
    const [isLoading, setIsLoading] = useState(false);

    const lastFetchedUid = useRef<string | null>(null);
    const isUnmounted = useRef(false);

    /* ---------- CLEANUP ---------- */
    useEffect(() => {
        return () => {
            isUnmounted.current = true;
        };
    }, []);

    /* ---------- FETCH DASHBOARD ON LOGIN ---------- */
    useEffect(() => {
        if (!user?.uid) {
            lastFetchedUid.current = null;
            setUserData(MOCK_EMPTY_DATA);
            setIsLoading(false); // <--- FORCE RESET
            return;
        }

        if (lastFetchedUid.current === user.uid) return;

        lastFetchedUid.current = user.uid;
        fetchDashboard(user.uid);
    }, [user?.uid]);

    /* ---------- API CALLS ---------- */

    const fetchDashboard = async (uid: string) => {
        if (isUnmounted.current) return;

        console.log(`[UserContext] Fetching dashboard for UID: ${uid}`);
        setIsLoading(true);

        try {
            const data = await getDashboardOverview(uid);
            if (!isUnmounted.current && data) {
                console.log('[UserContext] Dashboard data received');
                setUserData(data);
            }
        } catch (err) {
            console.error('Dashboard fetch failed', err);
            if (!isUnmounted.current) {
                setUserData(MOCK_EMPTY_DATA);
            }
        } finally {
            if (!isUnmounted.current) {
                setIsLoading(false);
            }
        }
    };

    const createRoadmap = async (params: any) => {
        if (!user?.uid) return;

        setIsLoading(true);
        try {
            await apiCreateRoadmap(params, user.uid);
            await fetchDashboard(user.uid);
        } finally {
            if (!isUnmounted.current) {
                setIsLoading(false);
            }
        }
    };

    const toggleTask = async (taskId: string) => {
        if (!user?.uid) return;

        setIsLoading(true);
        try {
            await apiToggleStep(taskId, user.uid);
            await fetchDashboard(user.uid);
        } catch {
            Alert.alert('Error', 'Failed to update task');
        } finally {
            if (!isUnmounted.current) {
                setIsLoading(false);
            }
        }
    };

    const resetRoadmap = async () => {
        if (!user?.uid) return;

        setIsLoading(true);
        try {
            await resetRoadmapData(user.uid);
            setUserData(MOCK_EMPTY_DATA);
        } catch {
            Alert.alert('Error', 'Failed to reset roadmap');
        } finally {
            if (!isUnmounted.current) {
                setIsLoading(false);
            }
        }
    };

    return (
        <UserContext.Provider
            value={{
                userData,
                isLoading,
                createRoadmap,
                resetRoadmap,
                toggleTask,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

/* ---------- HOOK ---------- */
export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used within UserProvider');
    return ctx;
}
