import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Switch, Button, ScrollView, Alert, ActivityIndicator } from "react-native";

export default function UserScreen() {
    const [user, setUser] = useState({
        name: "",
        surname: "",
        age: "",
        height: "",
        weight: "",
        diabetes: false,
        hypertension: false,
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
                className="border border-gray-300 rounded-md p-2 mb-3"
                placeholder="Tu nombre"
                value={user.name}
                onChangeText={(text) => handleInputChange("name", text)}
            />

            {/* 🔹 Apellido */}
            <Text className="text-sm font-semibold">Apellido</Text>
            <TextInput
                className="border border-gray-300 rounded-md p-2 mb-3"
                placeholder="Tu apellido"
                value={user.surname}
                onChangeText={(text) => handleInputChange("surname", text)}
            />

            {/* 🔹 Edad */}
            <Text className="text-sm font-semibold">Edad</Text>
            <TextInput
                className="border border-gray-300 rounded-md p-2 mb-3"
                placeholder="Edad"
                keyboardType="numeric"
                value={user.age}
                onChangeText={(text) => handleInputChange("age", text)}
            />

            {/* 🔹 Altura */}
            <Text className="text-sm font-semibold">Altura (cm)</Text>
            <TextInput
                className="border border-gray-300 rounded-md p-2 mb-3"
                placeholder="Altura en cm"
                keyboardType="numeric"
                value={user.height}
                onChangeText={(text) => handleInputChange("height", text)}
            />

            {/* 🔹 Peso */}
            <Text className="text-sm font-semibold">Peso (kg)</Text>
            <TextInput
                className="border border-gray-300 rounded-md p-2 mb-3"
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
        </ScrollView>
    );
}
