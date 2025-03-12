import React from "react";
import { View, Text } from "react-native";
import { CheckBox, Card } from "@ui-kitten/components";

export default function MedicineCard({ name, taken, onPress }: { name: string, taken: boolean, onPress: () => void }) {
    return (
        <Card className=" p-3">
            <View className="flex-row items-center">
                <CheckBox checked={taken} onChange={onPress} />
                <Text className="ml-3 text-gray-800">{name}</Text>
            </View>
        </Card>
    );
}