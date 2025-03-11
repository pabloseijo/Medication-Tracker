import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, SafeAreaView, Platform } from "react-native";
import { Agenda, DateData } from "react-native-calendars";

const { width, height } = Dimensions.get("window");

// Definir el tipo para los eventos de la agenda
interface AgendaItem {
  name: string;
  time: string;
}

// Base de datos de eventos por día
const eventsDatabase: { [key: string]: AgendaItem[] } = {
  "2025-03-10": [{ name: "Meeting with client", time: "10:00 AM" }],
  "2025-03-11": [
    { name: "Team brainstorming session", time: "9:00 AM" },
    { name: "NO", time: "3:00 PM" },
    { name: "Webon", time: "5:00 PM" },
  ],
  "2025-03-12": [
    { name: "Pablo Garcia Seijo", time: "9:00 AM" },
    { name: "Project presentation", time: "2:00 PM" },
  ],
  "2025-03-13": [
    { name: "Entrega Impactathon", time: "9:00 AM" },
    { name: "Socrates Agudo Torrado", time: "4:00 PM" },
  ],
};

const MyAgenda = () => {
  const [items, setItems] = useState<{ [key: string]: AgendaItem[] }>({});

  // Función para cargar eventos dinámicamente por día
  const loadItemsForDay = (day: DateData) => {
    console.log("Cargando eventos para el día:", day.dateString);

    setItems((prevItems) => ({
      ...prevItems,
      [day.dateString]: eventsDatabase[day.dateString] || [], // Cargar eventos si existen, si no, dejar vacío
    }));
  };

  // Función para mostrar mensaje cuando no hay eventos en un día
  const renderEmptyData = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay eventos para este día</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Agenda</Text>
  
        <Agenda
          items={items}
          showOnlySelectedDayItems={true} // Evita mezclar eventos entre días
          onDayPress={(day: DateData) => {
            loadItemsForDay(day); // Cargar eventos solo para el día seleccionado
          }}
          renderItem={(item: AgendaItem) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text>{item.time}</Text>
            </View>
          )}
          renderEmptyData={renderEmptyData} // Muestra mensaje cuando no hay eventos
          theme={{
            agendaDayTextColor: "blue",
            agendaTodayColor: "red",
            agendaKnobColor: "green",
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  item: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 2, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
  },
  itemTitle: {
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 40 : 0, // Ajusta el espacio para el notch en iPhone
  },
});

export default MyAgenda;
