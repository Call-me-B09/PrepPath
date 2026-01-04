import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { useUser } from '../context/UserContext';

export default function GlobalLoader() {
    const { isLoading } = useUser();

    if (!isLoading) return null;

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../assets/Live chatbot.json')}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#18181b', // zinc-900
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        elevation: 10,
    },
});
