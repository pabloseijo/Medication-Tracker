import React, { useState } from "react";
import { View } from "react-native";
import {
  Text,
  Card,
  Modal,
  Input,
  Datepicker,
  Radio,
  RadioGroup,
  CheckBox,
  Button,
} from "@ui-kitten/components";

interface MedicineFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  selectedMeal: string;
  selectedDate: any;
}

export default function MedicineForm({
  isVisible,
  onClose,
  onSave,
  selectedMeal,
  selectedDate
}: MedicineFormProps) {
  const [medicineType, setMedicineType] = useState<"sporadic" | "treatment">("sporadic");
  const [sporadicName, setSporadicName] = useState("");
  const [sporadicDose, setSporadicDose] = useState("");
  const [treatmentName, setTreatmentName] = useState("");
  const [treatmentDose, setTreatmentDose] = useState("");
  const [treatmentStartDate, setTreatmentStartDate] = useState(selectedDate);
  const [treatmentDuration, setTreatmentDuration] = useState("");
  const [treatmentMeals, setTreatmentMeals] = useState({
    desayuno: false,
    comida: false,
    cena: false,
  });

  const saveMedicine = () => {
    const validSporadicDose = sporadicDose ? parseInt(sporadicDose, 10) : 1;
  
    const data =
      medicineType === "sporadic"
        ? {
            name: sporadicName.trim() || "Medicamento Desconocido",
            cantidad: isNaN(validSporadicDose) ? 1 : validSporadicDose,
            moments: [
              selectedMeal === "desayuno", // Ahora es una lista y no un objeto
              selectedMeal === "comida",
              selectedMeal === "cena",
            ],
            inicio: selectedDate.toISOString(),
            duration_days: 1,
          }
        : {
            name: treatmentName.trim() || "Tratamiento Desconocido",
            cantidad: parseInt(treatmentDose) || 1,
            moments: [
              treatmentMeals.desayuno,
              treatmentMeals.comida,
              treatmentMeals.cena,
            ], // ✅ Ahora es una lista de booleanos
            inicio: treatmentStartDate.toISOString(),
            duration_days: parseInt(treatmentDuration) || 1,
          };
  
    console.log("📤 Enviando datos corregidos al backend:", JSON.stringify(data, null, 2));
    onSave(data);
    onClose();
  };
  
  
  return (
    <Modal
      visible={isVisible}
      backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onBackdropPress={onClose}
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
              label="Cantidad"
              placeholder="Dosis (ej: 1)"
              value={sporadicDose}
              onChangeText={setSporadicDose}
              keyboardType="numeric"
              style={{ marginBottom: 10 }}
            />
            <Text style={{ marginBottom: 10 }}>Momento: {selectedMeal}</Text>
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
            <Input
              label="Cantidad"
              placeholder="Dosis (ej: 1)"
              value={treatmentDose}
              onChangeText={setTreatmentDose}
              keyboardType="numeric"
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
                  setTreatmentMeals({ ...treatmentMeals, desayuno: nextChecked })
                }
              >
                Desayuno
              </CheckBox>
              <CheckBox
                checked={treatmentMeals.comida}
                onChange={(nextChecked) =>
                  setTreatmentMeals({ ...treatmentMeals, comida: nextChecked })
                }
              >
                Comida
              </CheckBox>
              <CheckBox
                checked={treatmentMeals.cena}
                onChange={(nextChecked) =>
                  setTreatmentMeals({ ...treatmentMeals, cena: nextChecked })
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
  );
}
