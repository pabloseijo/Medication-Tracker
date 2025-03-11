import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from "react-native-calendars";

// 🔹 Definimos correctamente el tipo de los eventos
interface CustomAgendaEntry extends AgendaEntry {
  meal: "Desayuno" | "Comida" | "Cena";
}

export default function MyAgenda() {
  const [items, setItems] = useState<AgendaSchedule>({});

  // 🔹 Base de datos con eventos
  const eventsDatabase: { [key: string]: CustomAgendaEntry[] } = {
    "2025-03-10": [
      { name: "Tostadas y café", meal: "Desayuno", height: 60, day: "2025-03-10" },
      { name: "Pasta con ensalada", meal: "Comida", height: 60, day: "2025-03-10" },
      { name: "Sopa y pan", meal: "Cena", height: 60, day: "2025-03-10" },
    ],
    "2025-03-11": [
      { name: "Huevos revueltos", meal: "Desayuno", height: 60, day: "2025-03-11" },
      { name: "Pollo asado", meal: "Comida", height: 60, day: "2025-03-11" },
      { name: "Pizza casera", meal: "Cena", height: 60, day: "2025-03-11" },
    ],
  };

  // 🔹 Cargar eventos dinámicamente
  const loadItemsForDay = (day: DateData) => {
    console.log("Cargando eventos para el día:", day.dateString);

    const newItems: AgendaSchedule = {};
    newItems[day.dateString] = eventsDatabase[day.dateString] || [];

    setItems((prevItems) => ({
      ...prevItems,
      ...newItems,
    }));
  };

  // 🔹 Renderizar cada elemento en la agenda
  const renderItem = (reservation: CustomAgendaEntry, isFirst: boolean) => (
    <View className="bg-white p-4 rounded-lg shadow-md my-2 mx-3">
      <Text className="font-bold text-lg">{reservation.name}</Text>
      <Text className="text-gray-500 italic">{reservation.meal}</Text>
    </View>
  );

  // 🔹 Mensaje cuando no hay eventos
  const renderEmptyData = () => (
    <View className="flex-1 justify-center items-center py-4">
      <Text className="text-gray-500">No hay eventos para este día</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white pt-10">
      <View className="flex-1 mx-4">
        <Text className="text-2xl font-bold text-center my-4">Agenda</Text>

        <Agenda
          items={items}
          showOnlySelectedDayItems={true} // Solo mostrar eventos del día seleccionado
          onDayPress={loadItemsForDay}
          renderItem={(reservation, isFirst) => renderItem(reservation as CustomAgendaEntry, isFirst)}
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
