import Onboarding from "../components/Onboarding";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";

export default function Page() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(`[Index] Mounting. User: ${user?.uid}, IsLoading: ${isLoading}`);
    if (!isLoading && user) {
      console.log("[Index] User found, redirecting to (main)");
      router.replace("/(main)");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#09090b" }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#09090b" }}>
        <Text style={{ color: 'white' }}>Redirecting...</Text>
      </View>
    );
  }

  console.log("[Index] Rendering Onboarding");
  return <Onboarding />;
}
