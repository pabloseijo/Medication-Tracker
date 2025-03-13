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

type MealType = 'desayuno' | 'comida' | 'cena';

interface MedicineEntry {
    taken: boolean;
    treatment: Treatment;
}

type MedicineList = {
    [key in MealType]: { [key: string]: MedicineEntry };
};

// Cuenta el total de medicamentos en la estructura MedicineList
function countAllMeds(meds: MedicineList): number {
    let total = 0;
    for (const meal of Object.keys(meds) as MealType[]) {
        total += Object.keys(meds[meal]).length;
    }
    return total;
}

// Cuenta cuántos medicamentos se han tomado (valor === true)
function countTakenMeds(meds: MedicineList): number {
    let total = 0;
    for (const meal of Object.keys(meds) as MealType[]) {
        total += Object.values(meds[meal]).filter(val => val.taken === true).length;
    }
    return total;
}

function computeTopMeds(meds: MedicineList): { name: string; taken: number }[] {
    const counts: { [name: string]: number } = {};
    for (const meal of Object.keys(meds) as MealType[]) {
        for (const med in meds[meal]) {
            if (meds[meal][med].taken === true) {
                counts[med] = (counts[med] || 0) + 1;
            }
        }
    }
    // Convierte el objeto a array y ordena de mayor a menor
    return Object.entries(counts)
        .map(([name, taken]) => ({ name, taken }))
        .sort((a, b) => b.taken - a.taken);
}


export default function HomeScreen() {
    // Estado para almacenar los tratamientos (resultado del GET)
    const [treatments, setTreatments] = useState<Treatment[]>([]);

    // Estado para almacenar el día seleccionado en el calendario
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Estados para el modal y formulario (para agregar nuevos tratamientos)
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<string>("");

    // (Opcional) Si sigues usando tomas esporádicas en otra estructura, lo puedes eliminar
    const [medsTaken, setMedsTaken] = useState<MedicineList>({
        desayuno: {},
        comida: {},
        cena: {},
    });

    const totalMeds = countAllMeds(medsTaken);
    const takenMeds = countTakenMeds(medsTaken);
    const progressValue = totalMeds > 0 ? takenMeds / totalMeds : 0;
    const topMedsComputed = computeTopMeds(medsTaken);

    const buildMedicineList = (treatments: Treatment[]): MedicineList => {
        const list: MedicineList = { desayuno: {}, comida: {}, cena: {} };
        treatments.forEach((treatment) => {
            // Si el tratamiento debe tomarse en desayuno, agrega su nombre con valor false
            if (treatment.meals.desayuno) {
                list.desayuno[treatment.name] = { taken: false, treatment: treatment };
            }
            // Lo mismo para comida y cena
            if (treatment.meals.comida) {
                list.comida[treatment.name] = { taken: false, treatment: treatment };
            }
            if (treatment.meals.cena) {
                list.cena[treatment.name] = { taken: false, treatment: treatment };
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

    // Elimina un medicamento de la lista
    const removeMedicine = async (meal: MealType, med: string) => {
        try {
            const treatmentToDelete = medsTaken[meal][med].treatment;

            // Construir el cuerpo según lo esperado por el backend
            const requestBody = {
                name: treatmentToDelete.name,
                cantidad: treatmentToDelete.dose,
                inicio: treatmentToDelete.startDate,
                duration_days: treatmentToDelete.duration,
                moments: [
                    treatmentToDelete.meals.desayuno,
                    treatmentToDelete.meals.comida,
                    treatmentToDelete.meals.cena
                ]
            };

            const response = await fetch("http://localhost:8000/sporadic", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error(`Error ${response.status}`);

            // Actualizar estado después de éxito
            setMedsTaken(prev => {
                const newMeds = { ...prev };
                delete newMeds[meal][med];
                return newMeds;
            });

        } catch (error) {
            console.error("Error eliminando:", error);
            // Opcional: revertir cambios en estado si falla
        }
    };    // Función para cambiar el estado de los medicamentos
    const toggleMedicine = (meal: MealType, med: string) => {
        setMedsTaken(prev => ({
            ...prev,
            [meal]: {
                ...prev[meal],
                [med]: {
                    ...prev[meal][med],
                    taken: !prev[meal][med].taken
                }
            }
        }));
    };

    // Renderiza la lista de medicamentos con swipe
    const renderMedicineList = (meal: string, meds: { [key: string]: MedicineEntry }) => {
        return Object.entries(meds).map(([med, entry]) => (
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

                        return <Animated.View style={{ width: "100%", height: "100%", transform: [{ translateX }] }} />;
                    }}
                >
                    <MedicineCard name={med} taken={entry.taken} onPress={() => toggleMedicine(meal as MealType, med)} />
                </Swipeable>
            </View>
        ));
    };

    // Abre el modal para agregar medicamento y define la comida seleccionada
    const openAddMedicineModal = (meal: string) => {
        setSelectedMeal(meal);
        setModalVisible(true);
    };

    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth es 0-indexado
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const saveMedicine = async (medData: any) => {
        try {
            console.log("📡 Enviando petición a la API con datos:", JSON.stringify(medData, null, 2));

            const response = await fetch("http://localhost:8000/sporadic", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(medData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error en la API: ${response.status} - ${errorText}`);
            }

            console.log("✅ Medicamento guardado correctamente. en");

            // Recarga los datos para reflejar el cambio, simulando un dayPress usando el estado selectedDate
            loadItemsForDay({
                dateString,
                year,
                month: Number(month),
                day: Number(day),
                timestamp: selectedDate.getTime(),
            });
        } catch (error) {
            console.error("❌ Error al guardar el medicamento:", error);
        }
    };


    // Renderiza la vista vacía con tratamientos y botón para agregar
    const renderEmptyData = () => (
        <ScrollView className="flex-1">
            <Card className="mb-4 p-4 shadow-lg rounded-lg">

                {/* Componente StatsOverview: Estadísticas de los medicamentos */}
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
