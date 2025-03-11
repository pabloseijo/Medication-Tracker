import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Card, Button } from "@ui-kitten/components";
import MedicineCard from "../components/MedicineCard";
import StatsOverview from "components/StatsOverview";

type MealType = "desayuno" | "comida" | "cena";
type MedicineList = {
  desayuno: { [key: string]: boolean };
  comida: { [key: string]: boolean };
  cena: { [key: string]: boolean };
};

export default function HomeScreen() {
  const [medsTaken, setMedsTaken] = useState<MedicineList>({
    desayuno: { ibuprofeno: false, omeprazol: false },
    comida: { paracetamol: false },
    cena: { vitaminaC: false },
  });

  const toggleMedicine = (meal: MealType, med: string) => {
    setMedsTaken((prev) => ({
      ...prev,
      [meal]: { ...prev[meal], [med]: !prev[meal][med] },
    }));
  };

  return (
    <ScrollView className="flex-1 p-4">

      {/* 🔹 Estadísticas */}
      <Card className="p-4 mb-4">
        <StatsOverview progress={0.7} medsTaken={7} medsTotal={10} />
      </Card>

      {/* 🔹 Secciones de Comidas */}
      <Card className="p-4">
        
        {/* 🔹 Sección: Desayuno */}
        <View className="mb-5">
          <Text className="text-lg font-semibold mb-2">Desayuno</Text>
          <MedicineCard
            name="Ibuprofeno"
            taken={medsTaken.desayuno.ibuprofeno}
            onPress={() => toggleMedicine("desayuno", "ibuprofeno")}
          />
          <MedicineCard
            name="Omeprazol"
            taken={medsTaken.desayuno.omeprazol}
            onPress={() => toggleMedicine("desayuno", "omeprazol")}
          />
          <Button appearance="outline" status="info">
            + Añadir Medicamento
          </Button>
        </View>

        {/* 🔹 Sección: Comida */}
        <View className="mb-5">
          <Text className="text-lg font-semibold mb-2">Comida</Text>
          <MedicineCard
            name="Paracetamol"
            taken={medsTaken.comida.paracetamol}
            onPress={() => toggleMedicine("comida", "paracetamol")}
          />
          <Button appearance="outline" status="info">
            + Añadir Medicamento
          </Button>
        </View>

        {/* 🔹 Sección: Cena */}
        <View className="mb-5">
          <Text className="text-lg font-semibold mb-2">Cena</Text>
          <MedicineCard
            name="Vitamina C"
            taken={medsTaken.cena.vitaminaC}
            onPress={() => toggleMedicine("cena", "vitaminaC")}
          />
          <Button appearance="outline" status="info">
            + Añadir Medicamento
          </Button>
        </View>

      </Card>
    </ScrollView>
  );
}