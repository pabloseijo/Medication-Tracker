import { Ionicons } from '@expo/vector-icons';
import { View, TextInput, TouchableOpacity, Text, Keyboard } from 'react-native';

interface SearchBarProps {
  query: string;
  setQuery: (text: string) => void;
  onSearch: () => void; //función para ejecutar la búsqueda
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch }) => {
  return (
    <View className="h-12 w-[80%] flex-row items-center rounded-xl bg-gray-200 px-4 py-3">
      <Ionicons name="search" size={20} color="gray" className="mr-2" />
      <TextInput
        className="flex-1 border-0 text-gray-700 outline-none focus:border-0 focus:outline-none"
        placeholder="Buscar medicamentos"
        placeholderTextColor="gray"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => {
          onSearch(); // Ejecuta la búsqueda al presionar "Enter"
          Keyboard.dismiss(); // Oculta el teclado después de buscar
        }}
      />

      {/* Si hay texto, mostrar la "X", si no, mostrar la bandera */}
      {query.length > 0 ? (
        <TouchableOpacity onPress={() => setQuery('')}>
          <Ionicons name="close" size={20} color="gray" />
        </TouchableOpacity>
      ) : (
        <Text className="ml-2 text-lg">🇪🇸</Text> // Bandera de España en emoji
      )}
    </View>
  );
};

export default SearchBar;
