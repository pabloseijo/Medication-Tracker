import React, { useState } from "react";
import { ScrollView, View, SafeAreaView, Animated, Text as RNText } from "react-native";
import { Text, Card, Button } from "@ui-kitten/components";
import { Agenda, DateData } from "react-native-calendars";
import MedicineCard from "../components/MedicineCard";
import StatsOverview from "components/StatsOverview";
import MedicineForm from "../components/MedicineForm"; // ✅ Importamos el nuevo componente
import { Swipeable } from "react-native-gesture-handler";

// Tipo de la lista de medicamentos
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

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string>("");

  // 📌 Cargar eventos de un día específico
  const loadItemsForDay = (day: DateData) => {
    console.log("Cargando eventos para el día:", day.dateString);
    updateMedsForDay(day.dateString);
  };

  // 📌 Actualiza la lista de medicamentos según el día
  const updateMedsForDay = (selectedDay: string) => {
    if (selectedDay === "2025-03-10") {
      setMedsTaken({
        desayuno: { ibuprofeno: false, omeprazol: false },
        comida: { paracetamol: false },
        cena: { vitaminaC: false },
      });
    } else if (selectedDay === "2025-03-11") {
      setMedsTaken({
        desayuno: { ibuprofeno: true, omeprazol: false },
        comida: { paracetamol: false },
        cena: { vitaminaC: true },
      });
    }
  };

  // 📌 Elimina un medicamento de la lista
  const removeMedicine = (meal: string, med: string) => {
    setMedsTaken((prev) => {
      const newMeds = { ...prev };
      delete newMeds[meal][med];
      return newMeds;
    });
  };

  // 📌 Alterna el estado de un medicamento (tomado/no tomado)
  const toggleMedicine = (meal: string, med: string) => {
    setMedsTaken((prev) => ({
      ...prev,
      [meal]: { ...prev[meal], [med]: !prev[meal][med] },
    }));
  };

  // 📌 Renderiza la lista de medicamentos con swipe
  const renderMedicineList = (meal: string, meds: { [key: string]: boolean }) => {
    return Object.keys(meds).map((med) => (
      <View key={med} className="relative mb-2">
        <View className="absolute inset-0 h-full bg-red-500 flex justify-center items-end pr-5 rounded-lg">
          <RNText className="text-white font-bold text-lg">Borrar</RNText>
        </View>

        <Swipeable
          friction={2}
          rightThreshold={60}
          onSwipeableOpen={() => removeMedicine(meal, med)}
          renderRightActions={(progress, dragX) => {
            const translateX = dragX.interpolate({
              inputRange: [-100, 0],
              outputRange: [-100, 0],
              extrapolate: "clamp",
            });

            return <Animated.View style={{ width: "100%", height: "100%", transform: [{ translateX }] }} />;
          }}
        >
          <MedicineCard name={med} taken={meds[med]} onPress={() => toggleMedicine(meal, med)} />
        </Swipeable>
      </View>
    ));
  };

  // 📌 Abre el modal y define la comida seleccionada
  const openAddMedicineModal = (meal: string) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  // 📌 Guarda un medicamento en el backend
  const saveMedicine = async (data: any) => {
    try {
      console.log("📡 Enviando petición a la API con datos:", JSON.stringify(data, null, 2));
  
      const response = await fetch("http://localhost:8000/sporadic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la API: ${response.status} - ${errorText}`);
      }
  
      console.log("✅ Medicamento guardado correctamente.");
    } catch (error) {
      console.error("❌ Error al guardar el medicamento:", error);
    }
  };
  

  // 📌 Renderiza la vista vacía con medicamentos y botones para agregar
  const renderEmptyData = () => (
    <ScrollView className="flex-1">
      <Card className="mb-4 p-4 shadow-lg rounded-lg">
        <StatsOverview progress={0.7} medsTaken={7} medsTotal={10} />
      </Card>
      {["desayuno", "comida", "cena"].map((meal) => (
        <Card key={meal} className="mb-4 p-4 shadow-lg rounded-lg">
          <View className="mb-4">
            <Text className="text-2xl font-semibold mb-2 capitalize">{meal}</Text>
            {renderMedicineList(meal, medsTaken[meal])}
            <Button appearance="outline" status="info" onPress={() => openAddMedicineModal(meal)}>
              + Añadir Medicamento
            </Button>
          </View>
        </Card>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-center my-4 text-2xl font-bold">Agenda</Text>
        <Agenda showOnlySelectedDayItems={true} onDayPress={loadItemsForDay} renderEmptyData={renderEmptyData} />
      </View>

      {/* ✅ Integración del formulario de medicamentos */}
      <MedicineForm isVisible={isModalVisible} onClose={() => setModalVisible(false)} onSave={saveMedicine} selectedMeal={selectedMeal} />
    </SafeAreaView>
  );
}
