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
import { Swipeable } from "react-native-gesture-handler";

// Tipo de la lista de medicamentos
type MedicineList = {
  desayuno: { [key: string]: boolean };
  comida: { [key: string]: boolean };
  cena: { [key: string]: boolean };
};

export default function MyAgenda() {
  // Estado de los medicamentos del día
  const [medsTaken, setMedsTaken] = useState<MedicineList>({
    desayuno: { ibuprofeno: false, omeprazol: false },
    comida: { paracetamol: false },
    cena: { vitaminaC: false },
  });

  // Estados para el modal y formulario
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string>("");
  const [medicineType, setMedicineType] = useState<"sporadic" | "treatment">(
    "sporadic"
  );

  // Formulario para Toma Esporádica
  const [sporadicName, setSporadicName] = useState("");
  const [sporadicDose, setSporadicDose] = useState("");

  // Formulario para Tratamiento
  const [treatmentName, setTreatmentName] = useState("");
  const [treatmentStartDate, setTreatmentStartDate] = useState(new Date());
  const [treatmentDuration, setTreatmentDuration] = useState("");
  const [treatmentMeals, setTreatmentMeals] = useState({
    desayuno: false,
    comida: false,
    cena: false,
  });

  // Cargar eventos para un día (ya existente)
  const loadItemsForDay = (day: DateData) => {
    console.log("Cargando eventos para el día:", day.dateString);
    updateMedsForDay(day.dateString);
  };

  // Actualización de medicamentos según el día seleccionado
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

  // Función para eliminar un medicamento mediante swipe
  const removeMedicine = (meal: string, med: string) => {
    setMedsTaken((prev) => {
      const newMeds = { ...prev };
      delete newMeds[meal][med];
      return newMeds;
    });
  };

  // Función para alternar el estado de un medicamento
  const toggleMedicine = (meal: string, med: string) => {
    setMedsTaken((prev) => ({
      ...prev,
      [meal]: { ...prev[meal], [med]: !prev[meal][med] },
    }));
  };

  // Render de la lista de medicamentos con swipe
  const renderMedicineList = (
    meal: string,
    meds: { [key: string]: boolean }
  ) => {
    return Object.keys(meds).map((med) => (
      <View key={med} className="relative mb-2">
        {/* Botón de eliminar detrás de la tarjeta */}
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
            onPress={() => toggleMedicine(meal, med)}
          />
        </Swipeable>
      </View>
    ));
  };

  // Abre el modal de agregar medicamento, seteando el momento (meal) actual
  const openAddMedicineModal = (meal: string) => {
    setSelectedMeal(meal);
    // Para tratamientos se preselecciona el momento según el botón pulsado
    setTreatmentMeals({
      desayuno: meal === "desayuno",
      comida: meal === "comida",
      cena: meal === "cena",
    });
    // Reseteamos campos del formulario
    setSporadicName("");
    setSporadicDose("");
    setTreatmentName("");
    setTreatmentStartDate(new Date());
    setTreatmentDuration("");
    setMedicineType("sporadic");
    setModalVisible(true);
  };

  // Función para guardar el medicamento y llamar a la API correspondiente
  const saveMedicine = async () => {
    if (medicineType === "sporadic") {
      const data = { name: sporadicName, dose: sporadicDose, meal: selectedMeal };
      try {
        const response = await fetch("http://localhost:8000/sporadic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          console.log("Medicamento esporádico guardado");
          // Aquí podrías actualizar el calendario si fuera necesario
        } else {
          console.error("Error al guardar medicamento esporádico");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else if (medicineType === "treatment") {
      const data = {
        name: treatmentName,
        startDate: treatmentStartDate.toISOString().split("T")[0],
        meals: treatmentMeals,
        duration: treatmentDuration,
      };
      try {
        const response = await fetch("http://localhost:8000/treatments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          console.log("Tratamiento guardado");
          // Aquí podrías actualizar el calendario para los días del tratamiento
        } else {
          console.error("Error al guardar tratamiento");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setModalVisible(false);
  };

  // Render de la vista vacía con medicamentos y botones para agregar
  const renderEmptyData = () => (
    <ScrollView className="flex-1">
      <Card className="mb-4 p-4 shadow-lg rounded-lg">
        <StatsOverview progress={0.7} medsTaken={7} medsTotal={10} />
      </Card>
      {["desayuno", "comida", "cena"].map((meal) => (
        <Card key={meal} className="mb-4 p-4 shadow-lg rounded-lg">
          <View className="mb-4">
            <Text className="text-2xl font-semibold mb-2 capitalize">
              {meal}
            </Text>
            {renderMedicineList(meal, medsTaken[meal])}
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text
          className="text-center my-4"
          style={{ fontSize: 20, fontWeight: "bold" }}
        >
          Agenda
        </Text>
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
      {/* Modal para agregar medicamento */}
      <Modal
        visible={isModalVisible}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onBackdropPress={() => setModalVisible(false)}
      >
        <Card disabled={true} style={{ padding: 20 }}>
          <Text category="h5" style={{ marginBottom: 10 }}>
            Añadir Medicamento
          </Text>
          <RadioGroup
            selectedIndex={medicineType === "sporadic" ? 0 : 1}
            onChange={(index) =>
              setMedicineType(index === 0 ? "sporadic" : "treatment")
            }
            style={{ marginBottom: 20 }}
          >
            <Radio>Toma Esporádica</Radio>
            <Radio>Tratamiento</Radio>
          </RadioGroup>
          {medicineType === "sporadic" ? (
            <>
              <Input
                label="Nombre"
                placeholder="Nombre del medicamento"
                value={sporadicName}
                onChangeText={setSporadicName}
                style={{ marginBottom: 10 }}
              />
              <Input
                label="Dosis"
                placeholder="Ej: Ibuprofeno 1g"
                value={sporadicDose}
                onChangeText={setSporadicDose}
                style={{ marginBottom: 10 }}
              />
              <Text style={{ marginBottom: 10 }}>
                Momento: {selectedMeal}
              </Text>
            </>
          ) : (
            <>
              <Input
                label="Nombre"
                placeholder="Nombre del medicamento"
                value={treatmentName}
                onChangeText={setTreatmentName}
                style={{ marginBottom: 10 }}
              />
              <Datepicker
                label="Fecha de inicio"
                date={treatmentStartDate}
                onSelect={(nextDate) => setTreatmentStartDate(nextDate)}
                style={{ marginBottom: 10 }}
              />
              <Text category="s1" style={{ marginBottom: 10 }}>
                Momentos del día:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <CheckBox
                  checked={treatmentMeals.desayuno}
                  onChange={(nextChecked) =>
                    setTreatmentMeals({
                      ...treatmentMeals,
                      desayuno: nextChecked,
                    })
                  }
                >
                  Desayuno
                </CheckBox>
                <CheckBox
                  checked={treatmentMeals.comida}
                  onChange={(nextChecked) =>
                    setTreatmentMeals({
                      ...treatmentMeals,
                      comida: nextChecked,
                    })
                  }
                >
                  Comida
                </CheckBox>
                <CheckBox
                  checked={treatmentMeals.cena}
                  onChange={(nextChecked) =>
                    setTreatmentMeals({
                      ...treatmentMeals,
                      cena: nextChecked,
                    })
                  }
                >
                  Cena
                </CheckBox>
              </View>
              <Input
                label="Duración (días)"
                placeholder="Número de días"
                value={treatmentDuration}
                onChangeText={setTreatmentDuration}
                keyboardType="numeric"
                style={{ marginBottom: 10 }}
              />
            </>
          )}
          <Button onPress={saveMedicine}>Guardar</Button>
        </Card>
      </Modal>
    </SafeAreaView>
  );
}
