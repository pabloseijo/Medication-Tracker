import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      {/* Mensaje de error */}
      <Text className="text-2xl font-bold text-red-600">Oops!</Text>
      <Text className="text-gray-700 mt-2">This page doesn't exist.</Text>

      {/* Botón para volver al Home */}
      <Link href="/" className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg">
        Go to Home
      </Link>
    </View>
  );
}
