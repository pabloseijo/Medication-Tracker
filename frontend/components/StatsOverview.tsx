import React from "react";
import { View, Text } from "react-native";
import { Card } from "@ui-kitten/components";
import * as Progress from "react-native-progress";
import { Icon } from "react-native-elements";

// Interfaz de las props que recibirá StatsOverview
interface StatsOverviewProps {
  progress?: number; 
  medsTaken?: number;
  medsTotal?: number;
  topMeds?: { name: string; taken: number }[];
}

export default function StatsOverview({
  progress,
  medsTaken,
  medsTotal,
  topMeds,
}: StatsOverviewProps) {

  // Si no se pasan todos los datos necesarios, no renderizamos nada (o podrías renderizar un mensaje de "Sin datos")
  if (
    progress === undefined ||
    medsTaken === undefined ||
    medsTotal === undefined ||
    topMeds === undefined
  ) {
    return null; 
  }
    
  const remainingMeds = medsTotal - medsTaken;

  return (
    <Card className="mb-4 p-4">
      <Text className="text-lg font-bold mb-4 text-center">Resumen Diario</Text>
      <View className="flex-row items-center justify-between w-full">
        {/* Círculo de Progreso */}
        <View className="relative items-center justify-center">
          <Progress.Circle 
            size={90}
            progress={progress}
            showsText={false}
            color="green"
            thickness={8}
          />
          <Text className="absolute text-lg font-bold">
            {Math.round(progress * 100)}%
          </Text>
        </View>

        {/* Estadísticas de Medicamentos */}
        <View className="flex-1 ml-6">
          {/* Medicinas más ingeridas */}
          <View className="mb-3 bg-green">
            <Text className="text-md font-semibold mb-1">Más Tomadas</Text>
            {topMeds.map((med, index) => (
              <View key={index} className="flex-row items-center mt-1">
                <Icon name="pill" type="material-community" color="blue" size={20} />
                <Text className="ml-2 text-gray-700">
                  {med.name} ({med.taken})
                </Text>
              </View>
            ))}
          </View>

          {/* Medicinas faltantes */}
          <View>
            <Text className="text-md font-semibold mb-1">Faltantes</Text>
            <View className="flex-row items-center">
              <Icon name="cancel" color="red" size={20} />
              <Text className="ml-2 text-gray-700">
                {remainingMeds} Medicamentos
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}
