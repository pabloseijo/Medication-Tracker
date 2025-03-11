import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import './global.css';

import HomeScreen from 'screens/HomeScreen';
import Calendar from 'screens/Calendar';

export default function App() {
  return (
      // <HomeScreen />
      <Calendar />
  );
}
