import { Ionicons } from "@expo/vector-icons";
import { View, TextInput, TouchableOpacity, Text, Keyboard } from "react-native";
import { useEffect } from "react";
import useSpeechRecognition from "hooks/useSpeechRecognitionHook";

interface SearchBarProps {
  query: string;
  setQuery: (text: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch }) => {
  const { text, isListening, startListening, stopListening, hasRecognitionSupport } =
    useSpeechRecognition();

  // Cuando se detecta un nuevo texto por voz, se actualiza el query
  useEffect(() => {
    if (text) {
      setQuery(text);
      Keyboard.dismiss();
    }
  }, [text]);

  return (
    <View className="h-12 w-[100%] flex-row items-center rounded-xl bg-gray-200 px-4 py-3">
      <Ionicons name="search" size={20} color="gray" className="mr-2" onPress={onSearch}/>
      <TextInput
        className="flex-1 border-0 text-gray-700 outline-none focus:border-0 focus:outline-none"
        placeholder="Buscar medicamentos"
        placeholderTextColor="gray"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => {
          onSearch();
          Keyboard.dismiss();
        }}
      />

      {/* Botón de micrófono */}
      {hasRecognitionSupport && (
        <TouchableOpacity onPress={isListening ? stopListening : startListening}>
          <Ionicons name={isListening ? "mic-off" : "mic"} size={20} color="gray" />
        </TouchableOpacity>
      )}

      {/* Botón para limpiar el campo de búsqueda */}
      {query.length > 0 ? (
        <TouchableOpacity onPress={() => setQuery("")}>
          <Ionicons name="close" size={20} color="gray" />
        </TouchableOpacity>
      ) : (
        <Text className="ml-2 text-lg">🇪🇸</Text>
      )}
    </View>
  );
};

export default SearchBar;
