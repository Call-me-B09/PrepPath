// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBILR8ATGYgNsfmPOhVevcYKMRVIL_2j6g",
    authDomain: "preppath-36cb1.firebaseapp.com",
    projectId: "preppath-36cb1",
    storageBucket: "preppath-36cb1.firebasestorage.app",
    messagingSenderId: "97536276294",
    appId: "1:97536276294:web:a0bbd998505db1f9b59747"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;