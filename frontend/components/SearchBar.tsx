import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  query: string;
  setQuery: (text: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch }) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder="Buscar medicamento..."
        value={query}
        onChangeText={setQuery}
      />
      <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
        <Ionicons name="search" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

// 🎨 Estilos
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    elevation: 3,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
  },
});
