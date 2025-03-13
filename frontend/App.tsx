import { SafeAreaView } from "react-native";
import { ApplicationProvider, IconRegistry, Layout, Text } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import Navbar from "./components/Navbar";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";

import './global.css'

export default function App() {
  return (
    <>
      {/* Carga los iconos de UI Kitten */}
      <IconRegistry icons={EvaIconsPack} />

      {/* Proveedor de UI Kitten envolviendo la app */}
      <ApplicationProvider {...eva} theme={eva.light}>
        <SafeAreaView style={{ flex: 1 }}>
          <Layout style={{ flex: 1 }}>
            <Navbar />
          </Layout>
        </SafeAreaView>
      </ApplicationProvider>
    </>
  );
}
