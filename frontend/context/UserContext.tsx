import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import { MOCK_DATA, MOCK_EMPTY_DATA, UserData } from '../constants/MockData';
import { getDashboardOverview, createRoadmap as apiCreateRoadmap, toggleStep as apiToggleStep, resetRoadmapData } from '../services/api';

interface UserContextType {
    userData: UserData;
    createRoadmap: (params: any) => Promise<void>;
    resetRoadmap: () => void;
    toggleTask: (taskId: string) => void;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData>(MOCK_EMPTY_DATA);
    const [isLoading, setIsLoading] = useState(false);

    // Initial Fetch when user changes
    React.useEffect(() => {
        if (user) {
            fetchDashboard(user.uid);
        } else {
            setUserData(MOCK_EMPTY_DATA);
        }
    }, [user]);

    const fetchDashboard = async (uid?: string) => {
        const targetUid = uid || user?.uid;
        if (!targetUid) return;

        console.log(`[UserContext] Fetching dashboard for UID: ${targetUid}`);

        setIsLoading(true);
        try {
            const data = await getDashboardOverview(targetUid);
            console.log("[UserContext] Dashboard data received:", data ? "Data present" : "No data");
            if (data) {
                setUserData(data);
            }
        } catch (error) {
            console.log("Error fetching dashboard, using empty");
        } finally {
            setIsLoading(false);
        }
    };

    const createRoadmap = async (params: any) => {
        if (!user) return;
        console.log("[UserContext] Creating roadmap with params:", JSON.stringify(params, null, 2));
        setIsLoading(true);
        try {
            await apiCreateRoadmap(params, user.uid);
            console.log("[UserContext] Roadmap created successfully");
            await fetchDashboard(user.uid); // Refresh data after creation
        } catch (error) {
            console.error("Create roadmap failed", error);
            throw error; // Re-throw to be handled by UI
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTask = async (taskId: string) => {
        if (!user) return;
        setIsLoading(true);
        try {
            await apiToggleStep(taskId, user.uid);
            await fetchDashboard(user.uid);
        } catch (error) {
            console.error("Toggle task failed", error);
            Alert.alert("Error", "Failed to update task status");
        } finally {
            setIsLoading(false);
        }
    };

    const resetRoadmap = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            await resetRoadmapData(user.uid);
            setUserData(MOCK_EMPTY_DATA); // Or fetchDashboard() which will return empty
        } catch (error) {
            console.error("Reset roadmap failed", error);
            Alert.alert("Error", "Failed to reset roadmap");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ userData, createRoadmap, resetRoadmap, toggleTask, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
