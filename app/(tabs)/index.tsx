import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Link href={"/(tabs)/VocabularyCards"}>
        <Text className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
      </Link>
    </View>
  );
}
