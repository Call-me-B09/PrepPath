import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
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
    const [userData, setUserData] = useState<UserData>(MOCK_EMPTY_DATA);
    const [isLoading, setIsLoading] = useState(false);

    // Initial Fetch
    React.useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        setIsLoading(true);
        try {
            const data = await getDashboardOverview();
            // Backend returns simplified object, we might need to ensure it matches UserData interface
            // or if the backend returns the exact shape.
            // Based on controller, it returns matching shape.
            if (data) {
                setUserData(data);
            }
        } catch (error) {
            console.log("Error fetching dashboard, using empty");
            // Optionally set error state
        } finally {
            setIsLoading(false);
        }
    };

    const createRoadmap = async (params: any) => {
        setIsLoading(true);
        try {
            await apiCreateRoadmap(params);
            // Refresh data after creation
            await fetchDashboard();
        } catch (error) {
            console.error("Create roadmap failed", error);
            throw error; // Re-throw to be handled by UI
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTask = async (taskId: string) => {
        // Optimistic Update can be tricky if we want to also update syllabus instantly.
        // For simplicity, let's call API then refresh.
        // Or if we want better UX, we can optimistically toggle task completion locally first.

        setIsLoading(true);
        try {
            await apiToggleStep(taskId);
            // Refresh dashboard to get updated syllabus counts and new tasks if any
            await fetchDashboard();
        } catch (error) {
            console.error("Toggle task failed", error);
            Alert.alert("Error", "Failed to update task status");
        } finally {
            setIsLoading(false);
        }
    };

    const resetRoadmap = async () => {
        setIsLoading(true);
        try {
            await resetRoadmapData();
            setUserData(MOCK_EMPTY_DATA);
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
