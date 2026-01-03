import React, { createContext, useContext, useState } from 'react';
import { MOCK_DATA, MOCK_EMPTY_DATA, UserData } from '../constants/MockData';
import { getDashboardOverview, createRoadmap as apiCreateRoadmap } from '../services/api';

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

    const toggleTask = (taskId: string) => {
        setUserData(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        }));
        // TODO: Call API to toggle task
    };

    const resetRoadmap = async () => {
        setUserData(MOCK_EMPTY_DATA);
        // Note: Backend might need a reset call if "reset" implies server-side deletion
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
