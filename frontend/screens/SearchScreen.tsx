import useState from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <SearchBar query={query} setQuery={(text) => { setQuery(text); fetchSuggestions(text); }} onSearch={fetchMedData} />

      {/* Lista de sugerencias */}
      <SuggestionsList suggestions={suggestions} onSelect={(name) => setQuery(name)} />

      {/* Indicador de carga */}
      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      {/* Información del medicamento */}
      {medData && (
        <View style={styles.resultContainer}>
          <Text style={styles.title}>📌 Nombre: {medData.name}</Text>
          <Text>📝 Descripción: {medData.description}</Text>
          <Text>🏷️ Categoría: {medData.category}</Text>
        </View>
      )}

      {/* Mensaje de error si no se encuentra el medicamento */}
      {!loading && medData === null && query !== "" && (
        <Text style={styles.errorText}>⚠️ Medicamento no encontrado</Text>
      )}
    </View>
  );
};

export default SearchScreen;

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
