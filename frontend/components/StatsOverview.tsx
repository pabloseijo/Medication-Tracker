import React from "react";
import { View, Text } from "react-native";
import { Card } from "@ui-kitten/components";
import * as Progress from "react-native-progress"; // 🔹 Librería de progress circle
import { Icon } from "react-native-elements";

export default function StatsOverview({ progress = 0.7, medsTaken = 7, medsTotal = 10 }) {
  const topMeds = [
    { name: "Paracetamol", taken: 3 },
    { name: "Ibuprofeno", taken: 2 },
    { name: "Omeprazol", taken: 1 },
  ]; 
  const remainingMeds = medsTotal - medsTaken;

  return (
    <Card className="mb-4 p-4">
      <Text className="text-lg font-bold mb-4 text-center">Resumen Diario</Text>

      <View className="flex-row items-center justify-between w-full">
        {/* 🔹 Círculo de Progreso */}
        <View className="relative items-center">
          <Progress.Circle 
            size={90} 
            progress={progress} 
            showsText={false} 
            color="green"
            thickness={8}
          />
          <Text className="absolute text-lg font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {Math.round(progress * 100)}%
          </Text>
        </View>

        {/* 🔹 Estadísticas de Medicamentos */}
        <View className="flex-1 ml-6">
          {/* 🔹 Medicinas más ingeridas */}
          <View className="mb-3 bg-green">
            <Text className="text-md font-semibold mb-1">Más Tomadas</Text>
            {topMeds.map((med, index) => (
              <View key={index} className="flex-row items-center mt-1">
                <Icon name="pill" type="material-community" color="blue" size={20} />
                <Text className="ml-2 text-gray-700">{med.name} ({med.taken})</Text>
              </View>
            ))}
          </View>

          {/* 🔹 Medicinas faltantes */}
          <View>
            <Text className="text-md font-semibold mb-1">Faltantes</Text>
            <View className="flex-row items-center">
              <Icon name="cancel" color="red" size={20} />
              <Text className="ml-2 text-gray-700">{remainingMeds} Medicamentos</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}
