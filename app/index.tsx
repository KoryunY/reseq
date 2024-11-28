import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from '../src/screens/StartScreen';
import CirclesScreen from '../src/screens/CircleScreen';
import WorkInProgress from '../src/screens/WorkInProgress';
import Header from '../src/components/Header';

export type RootStackParamList = {
  StartScreen: undefined;
  CirclesScreen: undefined;
  WorkInProgress: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* No Header on StartScreen */}
        <Stack.Screen
          name="StartScreen"
          component={StartScreen}
          options={{ headerShown: false }}
        />

        {/* Header with unlockedIndexes for other screens */}
        <Stack.Screen
          name="CirclesScreen"
          component={CirclesScreen}
          options={{
            header: () => <Header unlockedIndexes={[]} />,
          }}
        />

        <Stack.Screen
          name="WorkInProgress"
          component={WorkInProgress}
          options={{
            header: () => <Header unlockedIndexes={[0]} />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
