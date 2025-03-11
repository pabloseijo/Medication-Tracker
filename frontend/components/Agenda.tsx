import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, SafeAreaView, Platform } from "react-native";
import { Agenda, DateData } from "react-native-calendars";

const { width, height } = Dimensions.get("window");

// Definir el tipo para los eventos de la agenda
interface AgendaItem {
  name: string;
  meal: "Desayuno" | "Comida" | "Cena"; // Ahora tiene categorías en lugar de horas
}


// Base de datos de eventos por día
const eventsDatabase: { [key: string]: AgendaItem[] } = {
  "2025-03-10": [
    { name: "Tostadas y café", meal: "Desayuno" },
    { name: "Pasta con ensalada", meal: "Comida" },
    { name: "Sopa y pan", meal: "Cena" },
  ],
  "2025-03-11": [
    { name: "Huevos revueltos", meal: "Desayuno" },
    { name: "Pollo asado", meal: "Comida" },
    { name: "Pizza casera", meal: "Cena" },
  ],
};


const MyAgenda = () => {
  const [items, setItems] = useState<{ [key: string]: AgendaItem[] }>({});

  // Función para cargar eventos dinámicamente por día
  const loadItemsForDay = (day: DateData) => {
    console.log("Cargando eventos para el día:", day.dateString);

    setItems((prevItems) => ({
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
              <Text style={styles.mealText}>{item.meal}</Text> 
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
  mealText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "gray",
  },  
});

export default MyAgenda;
