import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, ScrollView, Image } from "react-native";
import SearchBar from "../components/SearchBar";
import SuggestionsList from "../components/SuggestionsList";
import MedicineForm from "../components/MedicineForm";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [medData, setMedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const fetchMedData = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query; // Usa el argumento si está disponible, sino usa `query`
    
    if (!searchTerm.trim()) return;

    setLoading(true);
    setMedData(null);
    setSuggestions([]); // Ocultar sugerencias después de buscar
    setSearched(false); // Resetear el estado antes de buscar

    try {
      const response = await fetch(`http://localhost:8000/med_name?name=${searchTerm}`);
      const data = await response.json();
      setMedData(data);
    } catch (error) {
      console.error("Error al buscar el medicamento", error);
    }

    setLoading(false);
    setSearched(true); // Marcar que la búsqueda ya se realizó
  };

  const handleSave = (data) => {
    console.log("✅ Medicamento guardado:", data);
    setIsModalOpen(false); // Cerrar el modal después de guardar
    setSearched(true); // Marcar que la búsqueda ya se realizó
  };

  return (
    <View className="flex-1 p-6 bg-gray-50 space-y-6">
      <View className="w-full">
        {/* Barra de búsqueda */}
        <SearchBar 
          className="w-full bg-white p-3 rounded-lg shadow-md border-gray-300"
          query={query} 
          setQuery={(text) => { 
            setQuery(text); 
            setSearched(false);
            fetchSuggestions(text); 
          }} 
          onSearch={fetchMedData} 
        />
      </View>

      {/* Lista de sugerencias */}
      {suggestions.length > 0 && (
        <View className="mb-4">
          <SuggestionsList 
          className="bg-white p-3 rounded-lg shadow-md border border-gray-200"
          suggestions={suggestions} 
          onSelect={(name) => {setQuery(name); fetchMedData(name)}} />
        </View>
      )}

      {/* Indicador de carga */}
      {loading && <ActivityIndicator size="large" color="#007AFF" className="mt-4" />}

      {/* 🛠️ Se agregó <ScrollView> para evitar errores */}
      <ScrollView className="mt-4">
        {medData && medData.map((medicamento, index) => (
          <View 
            key={index} 
            className="mt-5 p-6 bg-white rounded-lg shadow-lg border border-gray-300 items-center"
          >
            <Text className="text-xl font-bold text-blue-900">💊 {medicamento.nombre}</Text>
            <View className="flex-row">
              {/* Contenido de texto */}
              <View className="flex-1">
                <Text className="text-gray-600 mt-2">🏭 <Text className="font-semibold">Laboratorio:</Text> {medicamento.labtitular}</Text>
                <Text className="text-gray-600 mt-1">📝 <Text className="font-semibold">Vía de administración:</Text> {medicamento.viasAdministracion[0]?.nombre}</Text>
                <Text className="text-gray-600 mt-1">🏷️ <Text className="font-semibold">Forma farmacéutica:</Text> {medicamento.formaFarmaceutica?.nombre}</Text>
                <Text className="text-gray-600 mt-1">🔹 <Text className="font-semibold">Dosis:</Text> {medicamento.dosis}</Text>
                <Text className="text-gray-600 mt-1">📜 <Text className="font-semibold">Prescripción:</Text> {medicamento.cpresc}</Text>
                <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-800 text-white font-bold mt-4 py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Añadir al formulario
                </button>
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
          </View>
        ))}

        {/* 🔹 Modal de `MedicineForm` */}
        {isModalOpen && ( 
          <MedicineForm 
            isVisible={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSave}
            selectedMeal={"desayuno"}
            selectedDate={new Date()} // Pasa la fecha actual
          />
        )}

        {/* Mensaje de error si no se encuentra el medicamento */}
        {!loading && searched && (medData === null || medData.length === 0 ) && query !== "" && (
          <Text className="mt-5 text-lg text-red-600 text-center font-semibold">
            ⚠️ Medicamento no encontrado
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;