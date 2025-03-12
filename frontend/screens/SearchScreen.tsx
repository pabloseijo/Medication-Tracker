import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import SearchBar from "../components/SearchBar";
import SuggestionsList from "../components/SuggestionsList";
import BarCodeSearch from "components/BarCodeSearch";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [medData, setMedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🟢 Llamada a la API para obtener sugerencias (autocompletado)
  const fetchSuggestions = async (text: string) => {
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/search?q=${text}`); //hacer mockup
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error al obtener sugerencias", error);
    }
  };

  // 🔎 Llamada a la API para obtener información del medicamento
  const fetchMedData = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setMedData(null);
    setSuggestions([]); // Ocultar sugerencias después de buscar

    try {
      const response = await fetch(`http://localhost:8000/med_name?name=${query}`);

      const data = await response.json();
      setMedData(data);
    } catch (error) {
      console.error("Error al buscar el medicamento", error);
    }

    setLoading(false);
  };

  return (
    <View className="flex-1 p-5 bg-gray-100 flex-column space-x-3">

    <View className="flex-row items-center space-x-4 mb-4">
      {/* Barra de búsqueda */}
      <SearchBar 
        className="flex-1"
        query={query} 
        setQuery={(text) => { setQuery(text); fetchSuggestions(text); }} 
        onSearch={fetchMedData} 
      />

      {/* Código de barras */}
      <BarCodeSearch onPress={() => console.log("Escanear código de barras")} />
    </View>

      {/* Lista de sugerencias */}
      <SuggestionsList 
        suggestions={suggestions} 
        onSelect={(name) => setQuery(name)} 
      />

      {/* Indicador de carga */}
      {loading && <ActivityIndicator size="large" color="#007AFF" className="mt-4" />}

      {/* Información del medicamento */}

    {medData && (
      <View className="mt-5 p-4 bg-white rounded-lg shadow-md">
        <Text className="text-lg font-bold"> Nombre: {medData.nombre}</Text>
        <Text className="text-gray-600"> Laboratorio: {medData.labtitular}</Text>
        <Text className="text-gray-600"> Vía de administración: {medData.viasAdministracion[0]?.nombre}</Text>
        <Text className="text-gray-600"> Forma farmacéutica: {medData.formaFarmaceutica?.nombre}</Text>
        <Text className="text-gray-600"> Dosis: {medData.dosis}</Text>
        <Text className="text-gray-600"> Prescripción: {medData.cpresc}</Text>
        </View>
    )}

      {/* Mensaje de error si no se encuentra el medicamento */}
      {!loading && medData === null && query !== "" && (
        <Text className="mt-5 text-lg text-red-500 text-center">
          ⚠️ Medicamento no encontrado
        </Text>
      )}
    </View>
  );
};

export default SearchScreen;
