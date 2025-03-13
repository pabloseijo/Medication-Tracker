import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";

interface Patient {
    id: string;
    name: string;
    surname: string;
    age: number;
}

interface PatientsComponentProps {
    isMedic: boolean;
}

export default function PatientsComponent({ isMedic }: PatientsComponentProps) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isMedic) return; // No cargar si no es médico

        const fetchPatients = async () => {
            try {
                const response = await fetch("http://localhost:8000/patients");
                
                if (!response.ok) throw new Error("Error al cargar los pacientes");

                const data = await response.json();
                setPatients(data);
            } catch (error) {
                Alert.alert("Error", "No se pudieron cargar los pacientes");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [isMedic]);

    if (!isMedic) return null; // No renderizar si no es médico

    return (
        <View className="mt-6">
            <Text className="text-lg font-bold text-center mb-2">Lista de Pacientes</Text>

            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : patients.length === 0 ? (
                <Text className="text-center text-gray-500">No tienes pacientes asignados.</Text>
            ) : (
                <FlatList
                    data={patients}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View className="p-3 border-b border-gray-300">
                            <Text className="text-sm font-semibold">{item.name} {item.surname}</Text>
                            <Text className="text-xs text-gray-500">Edad: {item.age}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}