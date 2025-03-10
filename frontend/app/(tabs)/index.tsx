import { View, Text, Image } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      {/* Título */}
      <Text className="text-2xl font-bold text-center text-blue-600">
        Step 1: Set up your development environment
      </Text>

      {/* Descripción */}
      <Text className="text-center text-gray-700 mt-4">
        This page will help you install and set up your development environment for React Native.
      </Text>

      {/* Botón de navegación */}
      <Link href="/explore" className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg">
        Go to Explore
      </Link>
    </View>
  );
}
