import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  Animated,
  Text as RNText,
} from "react-native";
import {
  Text,
  Card,
  Button,
} from "@ui-kitten/components";
import { Agenda, DateData } from "react-native-calendars";
import MedicineCard from "../components/MedicineCard";
import StatsOverview from "components/StatsOverview";
import MedicineForm from "../components/MedicineForm";
import { Swipeable } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";


// Interfaz de un tratamiento
interface Treatment {
  name: string;
  dose: number;
  meals: {
    desayuno: boolean;
    comida: boolean;
    cena: boolean;
  };
  startDate: Date;
  duration: number;
}

type MealType = "desayuno" | "comida" | "cena";

// Estructura de medsTaken para la UI
type MedicineList = {
  [key in MealType]: { [key: string]: boolean };
};

// Cuenta el total de medicamentos en la estructura MedicineList
function countAllMeds(meds: MedicineList): number {
  let total = 0;
  for (const meal of Object.keys(meds) as MealType[]) {
    total += Object.keys(meds[meal]).length;
  }
  return total;
}

// Cuenta cuántos medicamentos han sido tomados (valor === true)
function countTakenMeds(meds: MedicineList): number {
  let total = 0;
  for (const meal of Object.keys(meds) as MealType[]) {
    total += Object.values(meds[meal]).filter(val => val === true).length;
  }
  return total;
}

// Calcula los "top meds" (los más tomados)
function computeTopMeds(meds: MedicineList): { name: string; taken: number }[] {
  const counts: { [name: string]: number } = {};
  for (const meal of Object.keys(meds) as MealType[]) {
    for (const med in meds[meal]) {
      if (meds[meal][med] === true) {
        counts[med] = (counts[med] || 0) + 1;
      }
    }
  }
  return Object.entries(counts)
    .map(([name, taken]) => ({ name, taken }))
    .sort((a, b) => b.taken - a.taken);
}

export default function HomeScreen() {
  // Estado para almacenar los tratamientos (GET a /sporadic)
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  // Día seleccionado en la Agenda
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Control del modal y la comida seleccionada
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string>("");

  // Estado de la UI (medicinas activas en desayuno, comida, cena)
  const [medsTaken, setMedsTaken] = useState<MedicineList>({
    desayuno: {},
    comida: {},
    cena: {},
  });

  // Estadísticas para StatsOverview
  const totalMeds = countAllMeds(medsTaken);
  const takenMeds = countTakenMeds(medsTaken);
  const progressValue = totalMeds > 0 ? takenMeds / totalMeds : 0;
  const topMedsComputed = computeTopMeds(medsTaken);

  // Construye un MedicineList a partir de un array de Treatment
  const buildMedicineList = (treatments: Treatment[]): MedicineList => {
    const list: MedicineList = { desayuno: {}, comida: {}, cena: {} };
    treatments.forEach((treatment) => {
      if (treatment.meals.desayuno) {
        list.desayuno[treatment.name] = false;
      }
      if (treatment.meals.comida) {
        list.comida[treatment.name] = false;
      }
      if (treatment.meals.cena) {
        list.cena[treatment.name] = false;
      }
    });
    return list;
  };

  // Llamada GET para obtener los medicamentos y actualizar la UI
  const loadItemsForDay = async (day: DateData) => {
    console.log("Cargando eventos para el día:", day.dateString);
    const [year, month, dayNum] = day.dateString.split("-").map(Number);
    const localDate = new Date(year, month - 1, dayNum + 1);
    setSelectedDate(localDate);

    try {
      const response = await fetch("http://localhost:8000/sporadic");
      if (response.ok) {
        const data = await response.json();
        // Mapeamos cada item a un objeto Treatment
        const mappedTreatments: Treatment[] = data.map((item: any) => ({
          name: item.name,
          dose: item.cantidad,
          meals: {
            desayuno: item.moments[0],
            comida: item.moments[1],
            cena: item.moments[2],
          },
          startDate: new Date(item.inicio),
          duration: item.duration_days,
        }));
        setTreatments(mappedTreatments);

        // Filtramos los que están activos en la fecha seleccionada
        const activeTreatments: Treatment[] = mappedTreatments.filter((t) => {
          const treatmentEnd = new Date(t.startDate);
          treatmentEnd.setDate(treatmentEnd.getDate() + t.duration);
          return localDate >= t.startDate && localDate <= treatmentEnd;
        });

        // Construimos la estructura para medsTaken
        const medicineList = buildMedicineList(activeTreatments);
        setMedsTaken(medicineList);

        console.log("Formato final:", medicineList);
      } else {
        console.error("Error en GET sporadic:", response.status);
      }
    } catch (error) {
      console.error("Error al obtener sporadic:", error);
    }
  };

  // DELETE: elimina un medicamento de la API y de la UI local
  const removeMedicine = async (meal: MealType, med: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/sporadic/delete?name=${encodeURIComponent(med)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar medicamento: ${response.status} - ${errorText}`);
      }

      console.log("✅ Medicamento eliminado correctamente en la API.");

      // Eliminamos localmente
      setMedsTaken((prev) => {
        const newMeds = { ...prev };
        delete newMeds[meal][med];
        return newMeds;
      });
    } catch (error) {
      console.error("❌ Error al eliminar el medicamento:", error);
    }
  };

  // Alterna el estado (true/false) de un medicamento
  const toggleMedicine = (meal: MealType, med: string) => {
    setMedsTaken((prev) => ({
      ...prev,
      [meal]: { ...prev[meal], [med]: !prev[meal][med] },
    }));
  };

  // Renderiza la lista de medicamentos con swipe para borrar
  const renderMedicineList = (meal: string, meds: { [key: string]: boolean }) => {
    return Object.keys(meds).map((med) => (
      <View key={med} className="relative mb-2">
        <View className="absolute inset-0 h-full bg-red-500 flex justify-center items-end pr-5 rounded-lg">
          <RNText className="text-white font-bold text-lg">Borrar</RNText>
        </View>

        <Swipeable
          friction={2}
          rightThreshold={60}
          onSwipeableOpen={() => removeMedicine(meal as MealType, med)}
          renderRightActions={(progress, dragX) => {
            const translateX = dragX.interpolate({
              inputRange: [-100, 0],
              outputRange: [-100, 0],
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
          <MedicineCard
            name={med}
            taken={meds[med]}
            onPress={() => toggleMedicine(meal as MealType, med)}
          />
        </Swipeable>
      </View>
    ));
  };

  // Abre el modal para agregar un medicamento
  const openAddMedicineModal = (meal: string) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  // Extraemos fecha en formato YYYY-MM-DD para recargar datos tras guardar
  const year = selectedDate.getFullYear();
  const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
  const day = (selectedDate.getDate() - 1).toString().padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  // POST: guarda un medicamento en la API y recarga la lista
  const saveMedicine = async (medData: any) => {
    try {
      console.log("✅ Medicamento guardado correctamente.");


    } catch (error) {
      console.error("❌ Error al guardar el medicamento:", error);
    }
  };

  // Renderiza la vista vacía (cuando no hay datos en el día)
  const renderEmptyData = () => (
    <ScrollView className="flex-1">
      <Card className="mb-4 p-4 shadow-lg rounded-lg">
        <StatsOverview
          progress={progressValue}
          medsTaken={takenMeds}
          medsTotal={totalMeds}
          topMeds={topMedsComputed}
        />
      </Card>
      {["desayuno", "comida", "cena"].map((meal) => (
        <Card key={meal} className="mb-4 p-4 shadow-lg rounded-lg">
          <View className="mb-4">
            <Text className="text-2xl font-semibold mb-2 capitalize">{meal}</Text>
            {renderMedicineList(meal, medsTaken[meal as MealType])}
            <Button
              appearance="outline"
              status="info"
              onPress={() => openAddMedicineModal(meal)}
            >
              + Añadir Medicamento
            </Button>
          </View>
        </Card>
      ))}
    </ScrollView>
  );

  useFocusEffect(
    useCallback(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
  
      loadItemsForDay({ dateString, year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate(), timestamp: today.getTime() });
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-center my-4 text-2xl font-bold">Agenda</Text>
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

      {/* Formulario para agregar medicamentos */}
      <MedicineForm
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={saveMedicine} // Llama a la función que hace POST
        loadItemsForDay={loadItemsForDay} // Añadimos la función loadItemsForDay
        selectedMeal={selectedMeal}
        selectedDate={selectedDate}
      />
    </SafeAreaView>
  );
}
