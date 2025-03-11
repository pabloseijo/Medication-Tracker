import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import SearchBar from "../components/SearchBar";
import SuggestionsList from "../components/SuggestionsList";

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
      const response = await fetch(`http://localhost:8000/search?q=${text}`);
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
      const response = await fetch(`http://localhost:8000/meds?name=${query}`);
      const data = await response.json();
      setMedData(data);
    } catch (error) {
      console.error("Error al buscar el medicamento", error);
    }

    setLoading(false);
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      {/* Barra de búsqueda */}
      <SearchBar 
        query={query} 
        setQuery={(text) => { setQuery(text); fetchSuggestions(text); }} 
        onSearch={fetchMedData} 
      />

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
          <Text className="text-lg font-bold">📌 Nombre: {medData.name}</Text>
          <Text className="text-gray-600">📝 Descripción: {medData.description}</Text>
          <Text className="text-gray-600">🏷️ Categoría: {medData.category}</Text>
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
