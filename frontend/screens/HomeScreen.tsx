import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text, Card, Button } from "@ui-kitten/components";
import MedicineCard from "../components/MedicineCard";

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
    <ScrollView style={styles.container}>
      {/* 🔹 Sección: Desayuno */}
      <Card style={styles.sectionCard}>
        <Text category="h6">Desayuno</Text>
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
      </Card>

      {/* Sección: Comida */}
      <Card style={styles.sectionCard}>
        <Text category="h6">Comida</Text>
        <MedicineCard
          name="Paracetamol"
          taken={medsTaken.comida.paracetamol}
          onPress={() => toggleMedicine("comida", "paracetamol")}
        />
        <Button appearance="outline" status="info">
          + Añadir Medicamento
        </Button>
      </Card>

      {/* 🔹 Sección: Cena */}
      <Card style={styles.sectionCard}>
        <Text category="h6">Cena</Text>
        <MedicineCard
          name="Vitamina C"
          taken={medsTaken.cena.vitaminaC}
          onPress={() => toggleMedicine("cena", "vitaminaC")}
        />
        <Button appearance="outline" status="info">
          + Añadir Medicamento
        </Button>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  sectionCard: { marginBottom: 10, padding: 15 },
});
