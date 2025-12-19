import { View, Text } from 'react-native'
import React from 'react'


const FeatureItem = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <View className="flex-row items-start gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
    <View className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center">
      <Text className="text-xl">{icon}</Text>
    </View>
    <View className="flex-1">
      <Text className="text-white font-bold text-lg mb-1">{title}</Text>
      <Text className="text-slate-400 leading-snug">{description}</Text>
    </View>
  </View>
);

export default FeatureItem