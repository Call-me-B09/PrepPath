import React, { useRef } from 'react';
import { View, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
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
        // We pad with one empty string at the start, so items[index] maps correctly to the visual item
        // The data array is ['', ...items, '']
        // Index 0 is padding, Index 1 is items[0]... wait.
        // ScrollView contents:
        // 0: Padding
        // 1: Item 0
        // ...
        // If we scroll to 0 (offset 0), we see Padding (top) and Item 0 (centered)?
        // Wait, the highlighted area is top-[39px] (roughly center of 128px height container).
        // Container height 128px (h-32). ITEM_HEIGHT 50.
        // Center is 64. 50/2 = 25. 64-25 = 39. Correct.
        // So visual center corresponds to the item at that position.
        // If offset is 0. Top is 0.
        // Visual:
        // [Pad] (0-50)
        // [Item0] (50-100)
        // [Item1] (100-150)
        //
        // If we snap to 0: We see Pad and part of Item0.
        // Wait, FlatList logic was:
        // data = ['', ...items, '']
        // index calculated from offsetY / ITEM_HEIGHT.
        // If offset is 0 -> index 0. items[0] in the DATA array is ''.
        // But the original logic: if (items[index]) onSelect(items[index]).
        // Original data was ['', ...items, '']?
        // Wait, let's look at original code.
        // data={['', ...items, '']}
        // if (items[index]) -> accessing the PROP items, not the data array.
        // If offset 0 -> index 0. items[0] is valid.
        // So if I am at offset 0, I select items[0].
        // Visual at offset 0:
        // Row 0 (Pad) is at y=0.
        // Row 1 (Item0) is at y=50.
        // The highlight box is at y=39 (middle).
        // So at offset 0, the highlight box covers... wait. 39 to 89.
        // Row 0 covers 0-50. Row 1 covers 50-100.
        // So at offset 0, we see mostly Row 0? No.
        //
        // Let's re-verify the logic.
        // If we use ScrollView with same data structure.
        // Padding top needs to be handled.
        // If we just map the items with padding.

        if (index >= 0 && index < items.length) {
            onSelect(items[index]);
            Haptics.selectionAsync();
        }
    };

    const paddedItems = ['', ...items, ''];

    return (
        <View className="h-32 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex-row items-center relative">
            {/* Selection Highlight */}
            <View className="absolute w-full h-[50px] bg-zinc-800 border-y border-zinc-700 top-[39px]" pointerEvents="none" />

            <View className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={onMomentumScrollEnd}
                >
                    {paddedItems.map((item, index) => (
                        <View key={index} style={{ height: ITEM_HEIGHT }} className="justify-center items-center">
                            <Text className={`text-xl font-bold ${item ? 'text-white' : 'text-transparent'}`}>{item}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {label && (
                <View className="absolute right-8" pointerEvents="none">
                    <Text className="text-zinc-500 font-medium">{label}</Text>
                </View>
            )}
        </View>
    );
}
