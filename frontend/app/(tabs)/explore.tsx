import { View, Text, Image } from "react-native";
import { Link } from "expo-router";

export default function ExploreScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      {/* Título */}
      <Text className="text-2xl font-bold text-blue-600">Explore</Text>

      {/* Imagen */}
      <Image
        className="w-40 h-40 mt-4"
        source={require("../../assets/images/react-logo.png")}
        resizeMode="contain"
      />

      {/* Descripción */}
      <Text className="text-center text-gray-700 mt-4">
        Discover new features and examples in this app.
      </Text>

      {/* Botón para volver al Home */}
      <Link href="/" className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg">
        Go to Home
      </Link>
    </View>
  );
}
