import { FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SuggestionsListProps {
  suggestions: string[];
  onSelect: (name: string) => void;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) return null;

  return (
    <FlatList
      data={suggestions}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.suggestionItem} onPress={() => onSelect(item)}>
          <Text style={styles.suggestionText}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default SuggestionsList;

// 🎨 Estilos
const styles = StyleSheet.create({
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
  },
  suggestionText: {
    fontSize: 16,
  },
});
