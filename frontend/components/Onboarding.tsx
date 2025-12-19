import React, { useRef, useState } from 'react';
import { View, Text, FlatList, useWindowDimensions, TouchableOpacity, ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClipboardX, Sparkles, CalendarClock, CheckCircle, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, withSpring, withTiming, SharedValue } from 'react-native-reanimated';
import { router } from 'expo-router';

const SCREENS = [
    {
        id: '1',
        title: 'Preparing without a plan doesn’t work.',
        subtitle: 'Too many resources. No clear direction. Zero structure.',
        icon: ClipboardX,
    },
    {
        id: '2',
        title: 'PrepPath builds your personal preparation path.',
        subtitle: 'Tell us your exam, time left, syllabus or PYQs. We handle the plan.',
        icon: Sparkles,
    },
    {
        id: '3',
        title: 'A roadmap that adapts with you.',
        subtitle: 'Daily tasks, timers, progress tracking. Replace or skip topics anytime.',
        icon: CalendarClock,
    },
    {
        id: '4',
        title: 'You stay in control. Always.',
        subtitle: 'No rigid schedules. No pressure. Just consistent progress.',
        icon: CheckCircle,
    },
];

const OnboardingItem = ({ item, index, scrollX }: { item: typeof SCREENS[0], index: number, scrollX: SharedValue<number> }) => {
    const { width } = useWindowDimensions();

    const animatedIconStyle = useAnimatedStyle(() => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const scale = withSpring(scrollX.value >= (index - 0.5) * width && scrollX.value <= (index + 0.5) * width ? 1 : 0.8);
        const opacity = withTiming(scrollX.value >= (index - 0.5) * width && scrollX.value <= (index + 0.5) * width ? 1 : 0.5);
        return {
            transform: [{ scale }],
            opacity,
        };
    });

    return (
        <View style={{ width, padding: 32 }} className="flex-1 justify-center items-center gap-8">
            <Animated.View style={[animatedIconStyle]} className="bg-zinc-800/50 p-12 rounded-full mb-8">
                <item.icon size={64} color="#e2e8f0" strokeWidth={1.5} />
            </Animated.View>

            <View className="items-center gap-4">
                <Animated.Text entering={FadeInDown.delay(200).springify()} className="text-3xl font-bold text-white text-center leading-tight">
                    {item.title}
                </Animated.Text>
                <Animated.Text entering={FadeInDown.delay(400).springify()} className="text-zinc-400 text-lg text-center leading-relaxed">
                    {item.subtitle}
                </Animated.Text>
            </View>
        </View>
    );
};

export default function Onboarding() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useSharedValue(0);
    const slidesRef = useRef<FlatList>(null);
    const { width } = useWindowDimensions();

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleNext = () => {
        if (currentIndex < SCREENS.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/(auth)');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <View className="flex-1">
                <Animated.FlatList
                    ref={slidesRef}
                    data={SCREENS}
                    renderItem={({ item, index }) => <OnboardingItem item={item} index={index} scrollX={scrollX} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={scrollHandler}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    scrollEventThrottle={32}
                />
            </View>

            <View className="px-8 pb-12 pt-4">
                <View className="flex-row justify-center gap-2 mb-12">
                    {SCREENS.map((_, index) => {
                        const dotStyle = useAnimatedStyle(() => {
                            const isActive = index === currentIndex;
                            return {
                                width: withTiming(isActive ? 32 : 8, { duration: 300 }),
                                opacity: withTiming(isActive ? 1 : 0.3, { duration: 300 }),
                            };
                        });

                        return (
                            <Animated.View
                                key={index}
                                style={[dotStyle]}
                                className="h-2 rounded-full bg-white"
                            />
                        );
                    })}
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleNext}
                    className="bg-white rounded-2xl h-14 justify-center items-center flex-row gap-3"
                >
                    <Text className="text-zinc-950 font-bold text-lg">
                        {currentIndex === SCREENS.length - 1 ? "Start My PrepPath" : "Continue"}
                    </Text>
                    {currentIndex !== SCREENS.length - 1 && <ArrowRight size={20} color="#09090b" />}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
