import React, { useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, Image } from "react-native";
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
      const response = await fetch(`http://localhost:8000/med_name?name=${query}`);
      const data = await response.json();
      setMedData(data);
    } catch (error) {
      console.error("Error al buscar el medicamento", error);
    }

    setLoading(false);
  };

  return (
    <View className="flex-1 p-6 bg-gray-50 space-y-6">
      <View className="w-full">
        {/* Barra de búsqueda */}
        <SearchBar 
          className="w-full bg-white p-3 rounded-lg shadow-md border-gray-300"
          query={query} 
          setQuery={(text) => { setQuery(text); fetchSuggestions(text); }} 
          onSearch={fetchMedData} 
        />
      </View>


      {/* Lista de sugerencias */}
      {suggestions.length > 0 && (
        <View className="mb-4">
          <SuggestionsList 
          className="bg-white p-3 rounded-lg shadow-md border border-gray-200"
          suggestions={suggestions} 
          onSelect={(name) => setQuery(name)} />
        </View>
      )}

      {/* Indicador de carga */}
      {loading && <ActivityIndicator size="large" color="#007AFF" className="mt-4" />}

      {/* 🛠️ Se agregó <ScrollView> para evitar errores */}
      <ScrollView className="mt-4">
        {medData && medData.map((medicamento, index) => (
          <View 
            key={index} 
            className="mt-5 p-6 bg-white rounded-lg shadow-lg border border-gray-300 flex-row items-center"
          >
            {/* Contenido de texto */}
            <View className="flex-1">
              <Text className="text-xl font-bold text-blue-900">💊 {medicamento.nombre}</Text>
              <Text className="text-gray-600 mt-2">🏭 <Text className="font-semibold">Laboratorio:</Text> {medicamento.labtitular}</Text>
              <Text className="text-gray-600 mt-1">📝 <Text className="font-semibold">Vía de administración:</Text> {medicamento.viasAdministracion[0]?.nombre}</Text>
              <Text className="text-gray-600 mt-1">🏷️ <Text className="font-semibold">Forma farmacéutica:</Text> {medicamento.formaFarmaceutica?.nombre}</Text>
              <Text className="text-gray-600 mt-1">🔹 <Text className="font-semibold">Dosis:</Text> {medicamento.dosis}</Text>
              <Text className="text-gray-600 mt-1">📜 <Text className="font-semibold">Prescripción:</Text> {medicamento.cpresc}</Text>
            </View>

            {/* Imagen del medicamento */}
            {medicamento.fotos?.[0]?.url && (
              <Image 
                source={{ uri: medicamento.fotos[0].url }} 
                className="w-20 h-20 ml-4 rounded-lg border border-gray-300"
                resizeMode="contain"
              />
            )}
          </View>
        ))}

        {/* Mensaje de error si no se encuentra el medicamento */}
        {!loading && medData === null && query !== "" && (
          <Text className="mt-5 text-lg text-red-600 text-center font-semibold">
            ⚠️ Medicamento no encontrado
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;
