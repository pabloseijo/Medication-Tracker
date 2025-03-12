import React, { useState } from "react";
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
  Modal,
  Input,
  Datepicker,
  Radio,
  RadioGroup,
  CheckBox,
} from "@ui-kitten/components";
import { Agenda, DateData } from "react-native-calendars";
import MedicineCard from "../components/MedicineCard";
import StatsOverview from "components/StatsOverview";
import MedicineForm from "../components/MedicineForm"; // Componente de formulario (si lo usas)
import { Swipeable } from "react-native-gesture-handler";

// Definición de la interfaz Treatment que usaremos para mapear los datos
interface Treatment {
  name: string;            // Nombre del medicamento
  dose: number;            // Dosis en mg
  meals: {
    desayuno: boolean;     // Ingesta en desayuno
    comida: boolean;       // Ingesta en comida
    cena: boolean;         // Ingesta en cena
  };
  startDate: Date;         // Fecha de inicio del tratamiento
  duration: number;        // Duración del tratamiento (en días)
}

type MedicineList = {
  desayuno: { [key: string]: boolean };
  comida: { [key: string]: boolean };
  cena: { [key: string]: boolean };
};


export default function HomeScreen() {
  // Estado para almacenar los tratamientos (resultado del GET)
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  // Estado para almacenar el día seleccionado en el calendario
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Estados para el modal y formulario (para agregar nuevos tratamientos)
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string>("");

  // (Opcional) Si sigues usando tomas esporádicas en otra estructura, lo puedes eliminar
  const [medsTaken, setMedsTaken] = useState<{ [key: string]: any }>({
    desayuno: {},
    comida: {},
    cena: {},
  });

  const buildMedicineList = (treatments: Treatment[]): MedicineList => {
    const list: MedicineList = { desayuno: {}, comida: {}, cena: {} };
    treatments.forEach((treatment) => {
      // Si el tratamiento debe tomarse en desayuno, agrega su nombre con valor false
      if (treatment.meals.desayuno) {
        list.desayuno[treatment.name] = false;
      }
      // Lo mismo para comida y cena
      if (treatment.meals.comida) {
        list.comida[treatment.name] = false;
      }
      if (treatment.meals.cena) {
        list.cena[treatment.name] = false;
      }
    });
    return list;
  };
  



  const loadItemsForDay = async (day: DateData) => {
    console.log("Cargando eventos para el día:", day.dateString);
    const [year, month, dayNum] = day.dateString.split("-").map(Number);
    const localDate = new Date(year, month - 1, dayNum);
    setSelectedDate(localDate);
  
    try {
      const response = await fetch("http://localhost:8000/sporadic");
      if (response.ok) {
        const data = await response.json();
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
        
        // Filtramos los tratamientos activos para la fecha seleccionada
        const activeTreatments: Treatment[] = mappedTreatments.filter((treatment) => {
          const treatmentEnd = new Date(treatment.startDate);
          treatmentEnd.setDate(treatmentEnd.getDate() + treatment.duration);
          return localDate >= treatment.startDate && localDate <= treatmentEnd;
        });
        // Convertimos el array filtrado a la estructura MedicineList
        const medicineList: MedicineList = buildMedicineList(activeTreatments);
        // Actualizamos el estado para la visualización
        setMedsTaken(medicineList);
        
        // Imprime en consola para ver el resultado
        console.log("Formato final:", medicineList);
      } else {
        console.error("Error en GET sporadic: ", response.status);
      }
    } catch (error) {
      console.error("Error al obtener sporadic: ", error);
    }
  };

  // Función para renderizar la lista de tratamientos filtrados por comida y día
  const getTreatmentsForMeal = (meal: string, date: Date): Treatment[] => {
    return treatments.filter((treatment) => {
      const treatmentEnd = new Date(treatment.startDate);
      treatmentEnd.setDate(treatmentEnd.getDate() + treatment.duration);
      // El tratamiento está activo si la fecha se encuentra entre el inicio y el final
      if (date < treatment.startDate || date > treatmentEnd) return false;
      // Y se debe tomar en la comida indicada
      return treatment.meals[meal];
    });
  };


    // Renderiza las MedicineCard usando la estructura obtenida (MedicineList)
    const renderTreatmentList = (meal: string, date: Date) => {
      // Alternativamente, podrías usar getTreatmentsForMeal para mostrar más detalles
      // Aquí usamos la estructura medsTaken, que tiene el formato deseado
      return Object.keys(medsTaken[meal]).map((med, index) => (
        <MedicineCard
          key={index}
          name={med}
          taken={medsTaken[meal][med]}
          onPress={() => {
            // Por ejemplo, aquí puedes alternar el estado o realizar otra acción
            console.log(`Toggle ${med} en ${meal}`);
          }}
        />
      ));
    };

  // Abre el modal para agregar medicamento y define la comida seleccionada
  const openAddMedicineModal = (meal: string) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  // Función para guardar un medicamento (aquí solo se muestra el envío a la API)
  const saveMedicine = async (selectedDate: any) => {
    try {
      console.log("📡 Enviando petición a la API con datos:", JSON.stringify(selectedDate, null, 2));

      const response = await fetch("http://localhost:8000/sporadic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedDate),
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

  // Renderiza la vista vacía con tratamientos y botón para agregar
  const renderEmptyData = () => (
    <ScrollView className="flex-1">
      <Card className="mb-4 p-4 shadow-lg rounded-lg">
        <StatsOverview progress={0.7} medsTaken={0} medsTotal={0} />
      </Card>
      {["desayuno", "comida", "cena"].map((meal) => (
        <Card key={meal} className="mb-4 p-4 shadow-lg rounded-lg">
          <View className="mb-4">
            <Text className="text-2xl font-semibold mb-2 capitalize">{meal}</Text>
            {renderTreatmentList(meal, selectedDate)}
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

      {/* Integración del formulario de medicamentos */}
      <MedicineForm
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={saveMedicine}
        selectedMeal={selectedMeal}
        selectedDate={selectedDate}
      />
    </SafeAreaView>
  );
}
