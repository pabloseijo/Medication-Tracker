import React, { useState } from "react";
import { ScrollView, View, SafeAreaView } from "react-native";
import { Text, Card, Button } from "@ui-kitten/components";
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from "react-native-calendars";
import MedicineCard from "../components/MedicineCard";
import StatsOverview from "components/StatsOverview";

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

  // 🔹 Mensaje cuando no hay eventos
  const renderEmptyData = () => (
    <ScrollView className="flex-1">
    {(
      <>
        <Card className="mb-4 p-4">
          <StatsOverview progress={0.7} medsTaken={7} medsTotal={10} />
        </Card>

        {/* 🔹 Sección de Medicamentos */}
        <Card className="mb-4 p-4">
          <View className="mb-4">
            <Text className="text-xl font-semibold mb-2">Desayuno</Text>
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
        </Card>

        <Card className="mb-4 p-4">
          <View className="mb-4">
            <Text className="text-xl font-semibold mb-2">Comida</Text>
            <MedicineCard
              name="Paracetamol"
              taken={medsTaken.comida.paracetamol}
              onPress={() => toggleMedicine("comida", "paracetamol")}
            />
            <Button appearance="outline" status="info">
              + Añadir Medicamento
            </Button>
          </View>
        </Card>

        <Card className="mb-4 p-4">
          <View className="mb-4">
            <Text className="text-xl font-semibold mb-2">Cena</Text>
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
      </>
    )}
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
        <Text className="text-8xl font-bold text-center my-4">Agenda</Text>
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
