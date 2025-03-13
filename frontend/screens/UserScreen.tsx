import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Switch, Button, ScrollView, Alert, ActivityIndicator } from "react-native";
import PatientsComponent from "../components/PatientsComponent";

export default function UserScreen() {
    const [user, setUser] = useState({
        name: "",
        surname: "",
        age: "",
        height: "",
        weight: "",
        diabetes: false,
        hypertension: false,
        isMedic: false,
        patients: [], // ← Asegúrate de incluir la lista de pacientes
    });
    const [loading, setLoading] = useState(true)

    // Cargar datos del perfil al montar el componente
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetch("http://localhost:8000/profile");

                if (!response.ok) throw new Error("Error al cargar el perfil");

                const data = await response.json();

                // Convertir números a strings para los inputs
                setUser({
                    ...data,
                    age: data.age?.toString() || "",
                    height: data.height?.toString() || "",
                    weight: data.weight?.toString() || "",
                    isMedic: data.isMedic || false,
                    patients: data.patients || [],
                });

            } catch (error) {
                if (error instanceof Error) {
                    Alert.alert("Error", error.message);
                } else {
                    Alert.alert("Ocurrió un error desconocido");
                }
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);
    const handleInputChange = (field: string, value: string | boolean) => {
        setUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            // Validar campos numéricos
            const age = parseFloat(user.age);
            const height = parseFloat(user.height);
            const weight = parseFloat(user.weight);


            if (isNaN(age) || isNaN(height) || isNaN(weight)) {
                Alert.alert("Error", "Los campos numéricos deben ser válidos");
                return;
            }

            const response = await fetch("http://localhost:8000/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...user,
                    age,
                    height,
                    weight,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al guardar");
            }

            Alert.alert("Éxito", "Perfil actualizado correctamente");
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert("Error", error.message);
            } else {
                Alert.alert("Ocurrió un error desconocido");
            }
        }
    };

    return (
        <ScrollView className="flex-1 p-4 bg-white">
            <Text className="text-xl font-bold text-center mb-4">Perfil de Usuario</Text>

            {/* 🔹 Nombre */}
            <Text className="text-sm font-semibold">Nombre</Text>
            <TextInput
                className="border border-gray-300 rounded-xl p-2 mb-3 bg-gray-200 text-gray-700"
                placeholder="Tu nombre"
                value={user.name}
                onChangeText={(text) => handleInputChange("name", text)}
            />

            {/* 🔹 Apellido */}
            <Text className="text-sm font-semibold">Apellido</Text>
            <TextInput
                className="border border-gray-300 rounded-xl p-2 mb-3 bg-gray-200 text-gray-700"
                placeholder="Tu apellido"
                value={user.surname}
                onChangeText={(text) => handleInputChange("surname", text)}
            />

            {/* 🔹 Edad */}
            <Text className="text-sm font-semibold">Edad</Text>
            <TextInput
                className="border border-gray-300 rounded-xl p-2 mb-3 bg-gray-200 text-gray-700"
                placeholder="Edad"
                keyboardType="numeric"
                value={user.age}
                onChangeText={(text) => handleInputChange("age", text)}
            />

            {/* 🔹 Altura */}
            <Text className="text-sm font-semibold">Altura (cm)</Text>
            <TextInput
                className="border border-gray-300 rounded-xl p-2 mb-3 bg-gray-200 text-gray-700"
                placeholder="Altura en cm"
                keyboardType="numeric"
                value={user.height}
                onChangeText={(text) => handleInputChange("height", text)}
            />

            {/* 🔹 Peso */}
            <Text className="text-sm font-semibold">Peso (kg)</Text>
            <TextInput
                className="border border-gray-300 rounded-xl p-2 mb-3 bg-gray-200 text-gray-700"
                placeholder="Peso en kg"
                keyboardType="numeric"
                value={user.weight}
                onChangeText={(text) => handleInputChange("weight", text)}
            />


            {/* 🔹 Diabetes */}
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm font-semibold">Diabetes</Text>
                <Switch
                    value={user.diabetes}
                    onValueChange={(value) => handleInputChange("diabetes", value)}
                />
            </View>

            {/* 🔹 Hipertensión */}
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm font-semibold">Hipertensión</Text>
                <Switch
                    value={user.hypertension}
                    onValueChange={(value) => handleInputChange("hypertension", value)}
                />
            </View>

            {/* 🔹 Guardar cambios */}
            <Button title="Guardar Cambios" color="blue" onPress={handleSave} />

            {/* 🔹 Renderizar solo si el usuario es médico */}
            {user.isMedic && (
                <>
                    {/* 🔹 Línea Divisoria */}
                    <View className="border-b border-gray-300 my-6" />

                    {/* 🔹 Sección de pacientes */}
                    <Text className="text-xl font-bold text-center my-4">Pacientes</Text>
                    {user.patients.length > 0 ? (
                        user.patients.map((patient, index) => (
                            <View 
                                key={index} 
                                className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200"
                            >
                                <Text className="text-lg font-semibold text-blue-800">
                                    {patient.name} {patient.surname}
                                </Text>

                                <Text className="text-gray-700 mt-1">🆎 <Text className="font-semibold">Edad:</Text> {patient.age} años</Text>
                                <Text className="text-gray-700 mt-1">📏 <Text className="font-semibold">Altura:</Text> {patient.height} cm</Text>
                                <Text className="text-gray-700 mt-1">⚖️ <Text className="font-semibold">Peso:</Text> {patient.weight} kg</Text>

                                <Text className={`mt-2 font-semibold ${patient.diabetes ? "text-red-600" : "text-green-600"}`}>
                                    {patient.diabetes ? "🩸 Diabetes: Sí" : "🩸 Diabetes: No"}
                                </Text>

                                <Text className={`mt-1 font-semibold ${patient.hypertension ? "text-red-600" : "text-green-600"}`}>
                                    {patient.hypertension ? "❤️ Hipertensión: Sí" : "❤️ Hipertensión: No"}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text className="text-gray-500 text-center mt-2">No tienes pacientes asignados.</Text>
                    )}

                    {/* 🔹 Línea Divisoria */}
                    <View className="border-b border-gray-300 mt-12 my-6" />
                </>
            )}


        </ScrollView>
    );
}