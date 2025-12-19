import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Map, Edit3, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { UserProvider } from '../../context/UserContext';

export default function MainLayout() {
    return (
        <UserProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <StatusBar style="light" />
                <Drawer
                    screenOptions={{
                        headerShown: false,
                        drawerStyle: {
                            backgroundColor: '#09090b', // zinc-950
                            width: 280,
                        },
                        drawerContentStyle: {
                            backgroundColor: '#09090b',
                        },
                        drawerLabelStyle: {
                            color: '#e4e4e7', // zinc-200
                            marginLeft: 16,
                            fontSize: 16,
                            fontWeight: '500',
                        },
                        drawerActiveBackgroundColor: '#27272a', // zinc-800
                        drawerActiveTintColor: '#fff',
                        drawerInactiveTintColor: '#a1a1aa', // zinc-400
                        swipeEdgeWidth: 100,
                    }}
                >
                    <Drawer.Screen
                        name="index" // Roadmap
                        options={{
                            drawerLabel: 'Roadmap',
                            title: 'Roadmap',
                            drawerIcon: ({ color, size }) => (
                                <Map size={size} color={color} strokeWidth={1.5} />
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="plan" // Plan
                        options={{
                            drawerLabel: 'Plan',
                            title: 'Plan',
                            drawerIcon: ({ color, size }) => (
                                <Edit3 size={size} color={color} strokeWidth={1.5} />
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="profile" // Profile
                        options={{
                            drawerLabel: 'Profile',
                            title: 'Profile',
                            drawerIcon: ({ color, size }) => (
                                <User size={size} color={color} strokeWidth={1.5} />
                            ),
                        }}
                    />
                </Drawer>
            </GestureHandlerRootView>
        </UserProvider>
    );
}
