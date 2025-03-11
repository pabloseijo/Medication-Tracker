import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import './global.css';

import HomeScreen from 'screens/HomeScreen';
import SearchScreen from 'screens/SearchScreen';


export default function App() {
  return (
    //<SearchScreen/>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello, world!</Text>
      </View>
  );
}
