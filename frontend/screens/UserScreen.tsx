import React, { useState } from "react";
import { View, Text, TextInput, Switch, Button, ScrollView, Alert } from "react-native";

export default function UserScreen() {
  const [user, setUser] = useState({
    name: "",
    surname: "",
    password: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    diabetes: false,
    hypertension: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    Alert.alert("Perfil Guardado", "Los datos del usuario han sido actualizados.");
    console.log("Usuario actualizado:", user);
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

      {/* 🔹 Correo */}
      <Text className="text-sm font-semibold">Correo Electrónico</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-3"
        placeholder="email@example.com"
        keyboardType="email-address"
        value={user.email}
        onChangeText={(text) => handleInputChange("email", text)}
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
