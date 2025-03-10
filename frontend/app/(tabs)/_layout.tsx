import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "black", borderTopColor: "gray" },
        tabBarActiveTintColor: "yellow",
        tabBarInactiveTintColor: "gray",
      }}
    >
      {/* Pestaña de Plan */}
      <Tabs.Screen name="plan" options={{ tabBarLabel: "Plan" }} />

      {/* Otras pestañas (puedes agregarlas después) */}
      <Tabs.Screen name="database" options={{ tabBarLabel: "Base de Datos" }} />
      <Tabs.Screen name="recipes" options={{ tabBarLabel: "Recetas" }} />
      <Tabs.Screen name="teams" options={{ tabBarLabel: "Teams" }} />
      <Tabs.Screen name="progress" options={{ tabBarLabel: "Progreso" }} />
    </Tabs>
  );
}
