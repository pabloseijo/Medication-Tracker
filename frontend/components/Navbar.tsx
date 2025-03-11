import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Icon } from "react-native-elements";

// Importa las pantallas
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";

// Crea el Tab Navigator
const Tab = createBottomTabNavigator();

export default function Navbar() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = "help";

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Buscar") {
              iconName = "magnify";
            } 

            return <Icon name={iconName} type="material-community" color={color} size={size} />;
          },
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
          headerShown: false, // Oculta el header superior si no lo quieres
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Buscar" component={SearchScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
