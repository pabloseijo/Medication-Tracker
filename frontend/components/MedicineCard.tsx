import React from "react";
import { View, StyleSheet } from "react-native";
import { CheckBox, Card, Text } from "@ui-kitten/components";

export default function MedicineCard({ name, taken, onPress }: { name: string, taken: boolean, onPress: () => void }) {
    return (
        <Card style={styles.card}>
            <View style={styles.row}>
                <CheckBox checked={taken} onChange={onPress} />
                <Text style={styles.text}>{name}</Text>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
  card: { marginVertical: 5, padding: 10 },
  row: { flexDirection: "row", alignItems: "center" },
  text: { marginLeft: 10 },
});
