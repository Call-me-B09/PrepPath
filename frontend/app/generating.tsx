import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingScreen = () => {
    return (
        <View className="flex-1 items-center justify-center bg-zinc-900">
            <LottieView
                source={require('../assets/Live chatbot.json')}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
            />
        </View>
    );
};

export default LoadingScreen;
