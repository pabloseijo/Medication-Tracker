import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import './global.css';

import HomeScreen from 'screens/HomeScreen';
import Agenda from 'components/Agenda';

export default function App() {
  return (
      // <HomeScreen />
      <Agenda />
  );
}
