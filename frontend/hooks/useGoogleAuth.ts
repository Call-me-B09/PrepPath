import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID!,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;

      if (!idToken) {
        Alert.alert("Google Sign-In Failed", "No ID token received");
        return;
      }

      signInWithFirebase(idToken);
    }

    if (response?.type === "error") {
      Alert.alert("Google Sign-In Error", "Authentication failed");
    }
  }, [response]);

  const signInWithFirebase = async (idToken: string) => {
    try {
      setLoading(true);
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
    } catch (error: any) {
      Alert.alert("Firebase Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    try {
      await promptAsync({ useProxy: true });
    } catch (error) {
      Alert.alert("Google Sign-In Error", "Failed to start sign-in");
    }
  };

  return {
    signIn,
    loading,
  };
}
