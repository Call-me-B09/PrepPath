import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Menu, Pause, Play, CheckSquare, Square, Clock, Circle, Map } from 'lucide-react-native';
import { useUser } from '../../context/UserContext'; // Updated import
import Animated, { FadeInDown } from 'react-native-reanimated';
import AuthButton from '../../components/AuthButton';

// Helper component for Syllabus Progress
const SyllabusItem = ({ title, completed, total }: { title: string, completed: number, total: number }) => {
    const percentage = Math.round((completed / total) * 100);
    return (
        <View className="mb-4">
            <View className="flex-row justify-between mb-2">
                <Text className="text-zinc-400 font-medium">{title}</Text>
                <Text className="text-zinc-500 text-sm">{completed}/{total} Topics</Text>
            </View>
            <View className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <View style={{ width: `${percentage}%` }} className="h-full bg-white rounded-full" />
            </View>
        </View>
    );
};

export default function Roadmap() {
    const navigation = useNavigation();
    const { userData, toggleTask } = useUser(); // Use Context
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const [isRunning, setIsRunning] = useState(true); // Default to running

    const toggleDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleToggleTask = (taskId: string) => {
        const task = userData.tasks.find(t => t.id === taskId);
        if (task?.completed) {
            toggleTask(taskId); // Unchecking is fine
            return;
        }

        Alert.alert(
            "Complete Task",
            "Are you sure you want to mark this as done? This action tracks your progress.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Mark Done",
                    onPress: () => toggleTask(taskId)
                }
            ]
        );
    };

    if (!userData.hasRoadmap) {
        return (
            <SafeAreaView className="flex-1 bg-zinc-950">
                <View className="p-6">
                    <TouchableOpacity onPress={toggleDrawer} className="w-10 h-10 bg-zinc-900 rounded-full items-center justify-center mb-8">
                        <Menu size={20} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1 justify-center items-center mt-32">
                        <View className="w-24 h-24 bg-zinc-900 rounded-full items-center justify-center mb-8 border border-zinc-800">
                            <Map size={48} color="#e4e4e7" strokeWidth={1} />
                        </View>
                        <Text className="text-2xl font-bold text-white text-center mb-2">Your PrepPath isn’t created yet</Text>
                        <Text className="text-zinc-400 text-center mb-8">Go to Plan to create your preparation path</Text>

                        <View className="w-48">
                            <AuthButton
                                title="Create Roadmap"
                                onPress={() => navigation.navigate('plan' as never)}
                                variant="primary"
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row justify-between items-start mb-8">
                    <TouchableOpacity onPress={toggleDrawer} className="w-10 h-10 bg-zinc-900 rounded-full items-center justify-center">
                        <Menu size={20} color="white" />
                    </TouchableOpacity>
                    <View className="items-end">
                        <Text className="text-white font-bold text-xl">{userData.examName}</Text>
                        <Text className="text-zinc-400 font-medium">{userData.examTimeLeftDays} Days Remaining</Text>
                    </View>
                </View>

                {/* Today's Tasks */}
                <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-8">
                    <Text className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-4">Today's Focus</Text>

                    <View className="gap-3">
                        {userData.tasks.map((task, index) => (
                            <TouchableOpacity
                                key={task.id}
                                onPress={() => handleToggleTask(task.id)}
                                activeOpacity={0.7}
                                className="flex-row items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800"
                            >
                                {task.completed ? <CheckSquare size={20} color="#fff" /> : <Square size={20} color="#71717a" />}
                                <View className="ml-3 flex-1">
                                    <Text className={`font-medium text-base ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                                        {task.title}
                                    </Text>
                                    <View className="flex-row items-center mt-1">
                                        <Clock size={12} color="#71717a" />
                                        <Text className="text-zinc-500 text-xs ml-1">{task.durationMinutes} min</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Focus Timer - Auto Running */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="mb-8 p-6 bg-zinc-900 rounded-2xl border border-zinc-800 items-center">
                    <View className="flex-row items-center gap-2 mb-4">
                        <View className="w-2 h-2 rounded-full bg-green-500" />
                        <Text className="text-zinc-400 font-medium">Focus Session Active</Text>
                    </View>
                    <Text className="text-6xl font-bold text-white mb-6 tabular-nums tracking-tighter">
                        {formatTime(timeLeft)}
                    </Text>

                    <TouchableOpacity
                        onPress={() => setIsRunning(!isRunning)}
                        className="w-14 h-14 bg-zinc-800 rounded-full items-center justify-center"
                    >
                        {isRunning ? <Pause size={24} color="#e4e4e7" fill="#e4e4e7" /> : <Play size={24} color="#e4e4e7" fill="#e4e4e7" />}
                    </TouchableOpacity>
                </Animated.View>

                {/* Syllabus Progress */}
                <Animated.View entering={FadeInDown.delay(300).springify()} className="mb-12">
                    <Text className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-4">Syllabus Progress</Text>
                    <View className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                        {userData.syllabus.map(section => (
                            <SyllabusItem key={section.id} title={section.title} completed={section.completed} total={section.totalTopics} />
                        ))}
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
