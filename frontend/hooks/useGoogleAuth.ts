import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
    const [loading, setLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: "97536276294-1fssi6bht6ecs6bc51psrolqsgpdu9mr.apps.googleusercontent.com",
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID || "YOUR_ANDROID_CLIENT_ID_HERE",
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID || "YOUR_IOS_CLIENT_ID_HERE",
        redirectUri: makeRedirectUri({
            scheme: "preppath"
        }),
    });

    useEffect(() => {
        if (response?.type === "success") {
            const idToken = response.authentication?.idToken;

            if (!idToken) {
                Alert.alert("Google Error", "No ID token received");
                return;
            }

            signInWithFirebase(idToken);
        }
    }, [response]);

    const signInWithFirebase = async (idToken: string) => {
        try {
            setLoading(true);
            const credential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, credential);
        } catch (err: any) {
            console.error(err);
            Alert.alert("Login failed", err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        signIn: async () => {
            console.log("Initiating Google Sign-In...");
            try {
                await promptAsync();
            } catch (error: any) {
                console.error("Sign-In Prompt Error:", error);
                Alert.alert("Error", "Failed to start sign-in flow");
            }
        },
        loading,
    };
}
