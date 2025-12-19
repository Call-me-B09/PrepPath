import React from 'react';
import { View, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';

const BUTTON_HEIGHT = 60;
const BUTTON_WIDTH = 280;
const BUTTON_PADDING = 5;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

// Adjusted Trigger Range for better sensitivity
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;

interface SwipeButtonProps {
    onSwipeComplete: () => void;
    text: string;
}

export default function SwipeButton({ onSwipeComplete, text }: SwipeButtonProps) {
    const X = useSharedValue(0);
    const isComplete = useSharedValue(false);

    const pan = Gesture.Pan()
        .onUpdate((event) => {
            if (!isComplete.value) {
                let newValue = event.translationX;
                if (newValue < 0) newValue = 0;
                if (newValue > H_SWIPE_RANGE) newValue = H_SWIPE_RANGE;
                X.value = newValue;
            }
        })
        .onEnd(() => {
            if (isComplete.value) return;

            if (X.value > H_SWIPE_RANGE * 0.7) {
                X.value = withSpring(H_SWIPE_RANGE);
                isComplete.value = true;
                runOnJS(onSwipeComplete)();
            } else {
                X.value = withSpring(0);
            }
        });

    const animatedStyles = {
        swipeable: useAnimatedStyle(() => {
            return {
                transform: [{ translateX: X.value }],
            };
        }),
        swipeText: useAnimatedStyle(() => {
            return {
                opacity: interpolate(
                    X.value,
                    [0, H_SWIPE_RANGE / 2],
                    [1, 0],
                    Extrapolate.CLAMP
                ),
            };
        }),
    };

    return (
        <View style={{ width: BUTTON_WIDTH, height: BUTTON_HEIGHT }} className="bg-zinc-800 rounded-full justify-center self-center overflow-hidden border border-zinc-700">
            <Animated.Text style={[animatedStyles.swipeText]} className="text-zinc-400 font-semibold text-center absolute w-full">
                {text}
            </Animated.Text>

            <GestureDetector gesture={pan}>
                <Animated.View style={[animatedStyles.swipeable, { width: SWIPEABLE_DIMENSIONS, height: SWIPEABLE_DIMENSIONS }]} className="bg-white rounded-full absolute left-1 justify-center items-center shadow-sm">
                    <ChevronRight size={24} color="#09090b" strokeWidth={2.5} />
                </Animated.View>
            </GestureDetector>
        </View>
    );
}
