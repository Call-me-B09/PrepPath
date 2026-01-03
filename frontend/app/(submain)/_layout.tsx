import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function SubMainLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#09090b', // zinc-950
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                contentStyle: {
                    backgroundColor: '#09090b', // zinc-950
                },
                headerShadowVisible: false, // Remove shadow for cleaner look
            }}
        >
            <Stack.Screen
                name="account-details"
                options={{
                    title: 'Account Details',
                    headerBackTitle: 'Back', // iOS back button text
                }}
            />
        </Stack>
    );
}
