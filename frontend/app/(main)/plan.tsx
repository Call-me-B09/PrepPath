import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { Menu, RefreshCw, Trash2, Settings, Upload, CheckCircle2, Clock, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useUser } from '../../context/UserContext';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import SwipeButton from '../../components/SwipeButton';
import Animated, { FadeInDown, FadeInRight, FadeInLeft } from 'react-native-reanimated';
import ScrollPicker from '../../components/ScrollPicker';

export default function Plan() {
    const router = useRouter();
    const navigation = useNavigation();
    const { userData, createRoadmap, resetRoadmap } = useUser();

    // Check local context data instead of static mock
    const hasRoadmap = userData.hasRoadmap;

    // Creation Wizard State
    const [wizardStep, setWizardStep] = useState(0);
    const [examName, setExamName] = useState("");

    // Time State - DD:HH:MM
    const [days, setDays] = useState("00");
    const [hours, setHours] = useState("00");
    const [minutes, setMinutes] = useState("00");

    // File State
    const [syllabusFile, setSyllabusFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [pyqFile, setPyqFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

    // Step 1 State
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedCommitment, setSelectedCommitment] = useState("");

    const toggleDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());

    const handlePickDocument = async (type: 'syllabus' | 'pyq') => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            if (type === 'syllabus') setSyllabusFile(asset);
            else setPyqFile(asset);

        } catch (err) {
            console.log("Unknown error: ", err);
        }
    };



    // Check local context data instead of static mock


    // Creation Wizard State
    // ... rest of state code if unchanged ...

    // NOTE: We need to see where handleCreate is. It's around line 59.
    // But I'm replacing the top part too to get router.

    // I will replace handleCreate separately, and adding router separately.
    // This tool call is ONLY for handleCreate. I will do another for imports/router.

    const handleCreate = async () => {
        // Finalize creation
        if (!examName || (!syllabusFile && !pyqFile)) {
            // Logic handled by UI disablement usually, but double check.
            return;
        }

        try {
            // Navigate to generating screen
            router.push('/generating');

            await createRoadmap({
                examName,
                days,
                hours,
                minutes,
                level: selectedLevel,
                commitment: selectedCommitment,
                syllabusFile,
                pyqFile
            });
            // Success
            router.replace('/(main)');
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to create roadmap. Please try again.");
            if (router.canGoBack()) router.back();
        }
    };

    const handleReset = () => {
        Alert.alert(
            "Delete PrepPath",
            "This will delete all progress and data. Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete & Reset",
                    style: "destructive",
                    onPress: () => {
                        resetRoadmap();
                        setWizardStep(0);
                        setExamName("");
                        setSelectedLevel("");
                        setSelectedCommitment("");
                    }
                }
            ]
        );
    };

    // Validation
    const isTimeValid = parseInt(days) > 0 || parseInt(hours) > 0 || parseInt(minutes) > 0;
    const isStep0Valid = examName.length > 0 && isTimeValid;
    const isStep1Valid = selectedLevel.length > 0 && selectedCommitment.length > 0;

    // --- State: NO ROADMAP (Wizard Mode) ---
    if (!hasRoadmap) {
        return (
            <SafeAreaView className="flex-1 bg-zinc-950">
                {/* Step 0: Basic Info */}
                {wizardStep === 0 && (
                    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                        <Animated.View entering={FadeInLeft}>
                            <View className="flex-row items-center mb-8 gap-4">
                                <TouchableOpacity onPress={toggleDrawer} className="w-10 h-10 bg-zinc-900 rounded-full items-center justify-center">
                                    <Menu size={20} color="white" />
                                </TouchableOpacity>
                                <Text className="text-white font-bold text-xl">Build PrepPath</Text>
                            </View>

                            <Text className="text-zinc-400 mb-8 leading-relaxed">
                                Let's define your target. We'll handle the rest.
                            </Text>

                            <AuthInput
                                label="Exam Name"
                                placeholder="e.g. JEE Advanced"
                                icon={CheckCircle2}
                                value={examName}
                                onChangeText={setExamName}
                            />

                            {/* Sliding Time Picker - DD : HH : MM */}
                            <Text className="text-zinc-400 text-sm font-medium mb-4 mt-2">Time Remaining</Text>
                            <View className="flex-row gap-2 mb-4">
                                <View className="flex-1">
                                    <ScrollPicker
                                        items={Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'))}
                                        onSelect={setDays}
                                        label="Days"
                                    />
                                </View>
                                <View className="flex-1">
                                    <ScrollPicker
                                        items={Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))}
                                        onSelect={setHours}
                                        label="Hrs"
                                    />
                                </View>
                                <View className="flex-1">
                                    <ScrollPicker
                                        items={Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))}
                                        onSelect={setMinutes}
                                        label="Min"
                                    />
                                </View>
                            </View>

                            <Text className="text-zinc-400 text-sm font-medium mb-4 mt-2">Optional Resources</Text>

                            <TouchableOpacity
                                onPress={() => handlePickDocument('syllabus')}
                                className={`h-16 border border-dashed rounded-2xl flex-row items-center justify-center gap-3 mb-4 ${syllabusFile ? 'bg-green-900/20 border-green-800' : 'bg-zinc-900/30 border-zinc-700'}`}
                            >
                                <Upload size={20} color={syllabusFile ? "#4ade80" : "#a1a1aa"} />
                                <Text className={syllabusFile ? "text-green-400 font-medium" : "text-zinc-400 font-medium"} numberOfLines={1}>
                                    {syllabusFile ? syllabusFile.name : "Upload Syllabus PDF"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handlePickDocument('pyq')}
                                className={`h-16 border border-dashed rounded-2xl flex-row items-center justify-center gap-3 mb-8 ${pyqFile ? 'bg-green-900/20 border-green-800' : 'bg-zinc-900/30 border-zinc-700'}`}
                            >
                                <Upload size={20} color={pyqFile ? "#4ade80" : "#a1a1aa"} />
                                <Text className={pyqFile ? "text-green-400 font-medium" : "text-zinc-400 font-medium"} numberOfLines={1}>
                                    {pyqFile ? pyqFile.name : "Upload PYQs PDF"}
                                </Text>
                            </TouchableOpacity>

                            {/* Show Next Button only if Valid */}
                            {isStep0Valid && (
                                <Animated.View entering={FadeInDown.springify()}>
                                    <AuthButton title="Next Step" onPress={() => setWizardStep(1)} />
                                </Animated.View>
                            )}
                        </Animated.View>
                    </ScrollView>
                )}

                {/* Step 1: Questionnaire */}
                {wizardStep === 1 && (
                    <ScrollView className="flex-1 p-6">
                        <Animated.View entering={FadeInRight}>
                            <View className="flex-row items-center mb-8 gap-4">
                                <TouchableOpacity onPress={() => setWizardStep(0)} className="w-10 h-10 bg-zinc-900 rounded-full items-center justify-center">
                                    <ArrowLeft size={20} color="white" />
                                </TouchableOpacity>
                                <Text className="text-white font-bold text-xl">Personalize</Text>
                            </View>

                            <Text className="text-zinc-400 mb-6 font-medium">What is your current preparation level?</Text>
                            <View className="gap-3 mb-8">
                                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                    <TouchableOpacity
                                        key={level}
                                        onPress={() => setSelectedLevel(level)}
                                        className={`p-4 rounded-xl border ${selectedLevel === level ? 'bg-zinc-800 border-white' : 'bg-zinc-900 border-zinc-800'}`}
                                    >
                                        <Text className={selectedLevel === level ? 'text-white font-bold' : 'text-zinc-400'}>{level}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text className="text-zinc-400 mb-6 font-medium">Daily commitment?</Text>
                            <View className="gap-3 mb-8">
                                {['2-4 Hours', '4-6 Hours', '6+ Hours'].map((time) => (
                                    <TouchableOpacity
                                        key={time}
                                        onPress={() => setSelectedCommitment(time)}
                                        className={`p-4 rounded-xl border ${selectedCommitment === time ? 'bg-zinc-800 border-white' : 'bg-zinc-900 border-zinc-800'}`}
                                    >
                                        <Text className={selectedCommitment === time ? 'text-white font-bold' : 'text-zinc-400'}>{time}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Show Generate Button only if Valid */}
                            {isStep1Valid && (
                                <Animated.View entering={FadeInDown.springify()}>
                                    <AuthButton title="Generate Roadmap" onPress={() => setWizardStep(2)} />
                                </Animated.View>
                            )}
                        </Animated.View>
                    </ScrollView>
                )}

                {/* Step 2: Swipe Confirmation */}
                {wizardStep === 2 && (
                    <View className="flex-1 justify-center items-center p-6 pb-20">
                        <Animated.View entering={FadeInDown} className="items-center">
                            <CheckCircle2 size={64} color="#fff" className="mb-6" />
                            <Text className="text-2xl font-bold text-white text-center mb-2">Ready to Launch</Text>
                            <Text className="text-zinc-400 text-center mb-12 max-w-[280px]">
                                We have structured your path based on your inputs.
                            </Text>

                            <SwipeButton
                                text="Slide to Create PrepPath"
                                onSwipeComplete={handleCreate}
                            />

                            <TouchableOpacity onPress={() => setWizardStep(1)} className="mt-8">
                                <Text className="text-zinc-500 font-medium">Go Back</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                )}
            </SafeAreaView>
        );
    }

    // --- State: EXISTING ROADMAP (Adjust Mode) ---
    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <ScrollView className="flex-1 p-6">
                <View className="flex-row items-center mb-8 gap-4">
                    <TouchableOpacity onPress={toggleDrawer} className="w-10 h-10 bg-zinc-900 rounded-full items-center justify-center">
                        <Menu size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-xl">Adjust Plan</Text>
                </View>

                <Animated.View entering={FadeInDown.delay(100).springify()} className="gap-4">
                    <View className="bg-zinc-900 p-4 rounded-2xl">
                        <Text className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-4">Current Goal</Text>
                        <Text className="text-white text-lg font-bold mb-1">{userData.examName}</Text>
                        <Text className="text-zinc-400">{userData.examTimeLeftDays} days remaining</Text>
                    </View>

                    <TouchableOpacity className="flex-row items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                        <View className="flex-row items-center gap-3">
                            <Settings size={20} color="#fff" />
                            <Text className="text-zinc-200 font-medium">Adjust Daily Hours</Text>
                        </View>
                    </TouchableOpacity>

                    <View className="mt-8">
                        <Text className="text-red-400 font-medium mb-4">Danger Zone</Text>
                        <TouchableOpacity
                            onPress={handleReset}
                            className="flex-row items-center justify-between p-4 bg-red-950/20 rounded-xl border border-red-900/50"
                        >
                            <View className="flex-row items-center gap-3">
                                <Trash2 size={20} color="#ef4444" />
                                <Text className="text-red-400 font-medium">Delete & Reset PrepPath</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
