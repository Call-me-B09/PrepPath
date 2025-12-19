import React, { useRef } from 'react';
import { View, Text, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ScrollPickerProps {
    items: string[];
    onSelect: (item: string) => void;
    label?: string;
}

const ITEM_HEIGHT = 50;

export default function ScrollPicker({ items, onSelect, label }: ScrollPickerProps) {
    const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        if (items[index]) {
            onSelect(items[index]);
            Haptics.selectionAsync();
        }
    };

    return (
        <View className="h-32 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex-row items-center relative">
            {/* Selection Highlight */}
            <View className="absolute w-full h-[50px] bg-zinc-800 border-y border-zinc-700 top-[39px]" pointerEvents="none" />

            <View className="flex-1">
                <FlatList
                    data={['', ...items, '']} // Padding items
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ height: ITEM_HEIGHT }} className="justify-center items-center">
                            <Text className={`text-xl font-bold ${item ? 'text-white' : 'text-transparent'}`}>{item}</Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    getItemLayout={(_, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                    })}
                />
            </View>

            {label && (
                <View className="absolute right-8" pointerEvents="none">
                    <Text className="text-zinc-500 font-medium">{label}</Text>
                </View>
            )}
        </View>
    );
}
