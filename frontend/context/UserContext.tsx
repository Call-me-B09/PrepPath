import React, { createContext, useContext, useState } from 'react';
import { MOCK_DATA, MOCK_EMPTY_DATA, UserData } from '../constants/MockData';

interface UserContextType {
    userData: UserData;
    createRoadmap: () => void;
    resetRoadmap: () => void;
    toggleTask: (taskId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    // Start with empty data as requested ("make no roadmap for now")
    // But we use MOCK_EMPTY_DATA structure which has hasRoadmap: false
    const [userData, setUserData] = useState<UserData>(MOCK_EMPTY_DATA);

    const createRoadmap = () => {
        // Switch to populated data
        setUserData(MOCK_DATA);
    };

    const toggleTask = (taskId: string) => {
        setUserData(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        }));
    };

    const resetRoadmap = () => {
        setUserData(MOCK_EMPTY_DATA);
    };

    return (
        <UserContext.Provider value={{ userData, createRoadmap, resetRoadmap, toggleTask }}>
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
