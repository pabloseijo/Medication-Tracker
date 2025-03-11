import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

const MyCalendar = () => {
  const [selected, setSelected] = useState("");

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: DateData) => setSelected(day.dateString)}
        markedDates={{
          [selected]: { selected: true, marked: true, selectedColor: "blue" },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default MyCalendar;
