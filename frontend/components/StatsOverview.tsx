import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text } from "@ui-kitten/components";
import { ProgressBar } from "react-native-paper";
import { Icon } from "react-native-elements";

export default function StatsOverview({ progress = 0.7, medsTaken = 7, medsTotal = 10 }) {
  return (
    <Card style={styles.card}>
      <Text category="h5" style={styles.title}>
        Resumen Diario
      </Text>

      {/* 🔹 Barra de Progreso */}
      <ProgressBar progress={progress} color="green" style={styles.progressBar} />

      {/* 🔹 Información de medicamentos */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="check-circle" color="green" />
          <Text style={styles.statText}>{medsTaken} Tomados</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="cancel" color="red" />
          <Text style={styles.statText}>{medsTotal - medsTaken} Faltantes</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    padding: 15,
    alignItems: "center",
  },
  title: {
    marginBottom: 10,
  },
  progressBar: {
    width: "100%",
    height: 10,
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    marginLeft: 5,
  },
});
