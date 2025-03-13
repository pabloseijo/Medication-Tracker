import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BarCodeSearchProps {
  onPress: () => void;
}

const BarCodeSearch: React.FC<BarCodeSearchProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      className="h-12 w-[20%] flex items-center justify-center rounded-xl bg-gray-200"
      onPress={onPress}
    >
      <Ionicons name="barcode-outline" size={28} color="black" />
    </TouchableOpacity>
  );
};

export default BarCodeSearch;
