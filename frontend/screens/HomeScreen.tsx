import React, { useState } from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  Animated,
  Text as RNText,
} from "react-native";
import { Text, Card, Button } from "@ui-kitten/components";
import { Agenda, DateData } from "react-native-calendars";
import MedicineCard from "../components/MedicineCard";
import StatsOverview from "components/StatsOverview";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

// 🔹 Definimos correctamente el tipo de los eventos

type MedicineList = {
  desayuno: { [key: string]: boolean };
  comida: { [key: string]: boolean };
  cena: { [key: string]: boolean };
};

export default function MyAgenda() {
  const [medsTaken, setMedsTaken] = useState<MedicineList>({
    desayuno: { ibuprofeno: false, omeprazol: false },
    comida: { paracetamol: false },
    cena: { vitaminaC: false },
  });

  // 🔹 Cargar eventos dinámicamente cuando se seleccione un día
  const loadItemsForDay = (day: DateData) => {
    console.log("Cargando eventos para el día:", day.dateString);

    // Actualizar los medicamentos del día seleccionado
    updateMedsForDay(day.dateString);
  };

  // Función para actualizar los medicamentos según el día seleccionado
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

    // 🔹 Función para eliminar medicamento con swipe
  const removeMedicine = (meal: string, med: string) => {
    setMedsTaken((prev) => {
      const newMeds = { ...prev };
      delete newMeds[meal][med];
      return newMeds;
    });
  };

  const renderMedicineList = (meal: string, meds: { [key: string]: boolean }) => {
    return Object.keys(meds).map((med) => (
      <View key={med} className="relative mb-2">
        {/* 🔴 Botón de eliminar detrás de la tarjeta */}
        <View className="absolute inset-0 h-full bg-red-500 flex justify-center items-end pr-5 rounded-lg">
          <RNText className="text-white font-bold text-lg">Borrar</RNText>
        </View>
  
        <Swipeable
          friction={2} // Suaviza la animación
          rightThreshold={60} // Cuánto arrastrar antes de activarse
          onSwipeableOpen={() => removeMedicine(meal, med)}
          renderRightActions={(progress, dragX) => {
            const translateX = dragX.interpolate({
              inputRange: [-100, 0], 
              outputRange: [-100, 0], // Desplazamiento smooth
              extrapolate: "clamp",
            });
  
            return (
              <Animated.View
                style={{
                  width: "100%",
                  height: "100%",
                  transform: [{ translateX }],
                }}
              />
            );
          }}
        >
          {/* 🔹 Tarjeta del medicamento */}
            <MedicineCard
              name={med}
              taken={meds[med]}
              onPress={() => toggleMedicine(meal, med)}
            />
        </Swipeable>
      </View>
    ));
  };
  
  
  
  
  

  // 🔹 Mensaje cuando no hay eventos
  
  // 🔹 Renderizar la vista vacía con medicamentos y swipe
  const renderEmptyData = () => (
    <ScrollView className="flex-1">
      <Card className="mb-4 p-4 shadow-lg rounded-lg">
        <StatsOverview progress={0.7} medsTaken={7} medsTotal={10} />
      </Card>

      {/* 🔹 Sección de Medicamentos */}
      {["desayuno", "comida", "cena"].map((meal) => (
        <Card key={meal} className="mb-4 p-4 shadow-lg rounded-lg">
          <View className="mb-4">
            <Text className="text-2xl font-semibold mb-2 capitalize">
              {meal}
            </Text>
            {renderMedicineList(meal, medsTaken[meal])}
            <Button appearance="outline" status="info">
              + Añadir Medicamento
            </Button>
          </View>
        </Card>
      ))}
    </ScrollView>
  );

  // Función para cambiar el estado de los medicamentos
  const toggleMedicine = (meal: string, med: string) => {
    setMedsTaken((prev) => ({
      ...prev,
      [meal]: { ...prev[meal], [med]: !prev[meal][med] },
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        {/* 🔹 Agenda */}
        {/* <Text className="text-center my-4" style={{ fontSize: 20, fontWeight: "bold" }}>Agenda</Text> */}
        <Text className="text-center my-4" style={{ fontSize: 20, fontWeight: "bold" }}>Agenda</Text>
        <Agenda
          showOnlySelectedDayItems={true}
          onDayPress={loadItemsForDay}
          renderEmptyData={renderEmptyData}
          theme={{
            agendaDayTextColor: "blue",
            agendaTodayColor: "red",
            agendaKnobColor: "green",
          }}
        />


      </View>
    </SafeAreaView>
  );
}
