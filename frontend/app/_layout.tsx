import "../global.css";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { UserProvider } from "../context/UserContext";

export default function Layout() {
    return (
        <UserProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
        </UserProvider>
    );
}
