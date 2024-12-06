import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from '../src/screens/StartScreen';
import CirclesScreen from '../src/screens/CircleScreen';
import WorkInProgress from '../src/screens/WorkInProgress';
import Header from '../src/components/Header';
import GameScreen from '../src/screens/GameScreen';
import HoldingHandsScreen from '../src/screens/HoldingHandsScreen';
import PickRightScreen from '../src/screens/PickRightScreen';
import PhotoConstructor from '../src/screens/PhotoConstructor';
import BossFightScreen from '../src/screens/BossFightScreen';

export type RootStackParamList = {
  StartScreen: undefined;
  CirclesScreen: undefined;
  WorkInProgress: undefined;
  GameScreen: undefined;
  HoldingHandsScreen: undefined;
  PickRightScreen: undefined;
  PhotoConstructor: undefined;
  BossFightScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* No Header on StartScreen */}
        {/* <Stack.Screen
          name="StartScreen"
          component={StartScreen}
          options={{ headerShown: false }}
        /> */}

        {/* Header with unlockedIndexes for other screens */}
        {/* <Stack.Screen
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
        <Stack.Screen
          name="GameScreen"
          component={GameScreen}
          options={{
            header: () => <Header unlockedIndexes={[0]} />,
          }}
        />*/}
        {/* <Stack.Screen
          name="HoldingHandsScreen"
          component={HoldingHandsScreen}
          options={{
            header: () => <Header unlockedIndexes={[0, 1]} />,
          }}
        /> */}
        {/* <Stack.Screen
          name="PickRightScreen"
          component={PickRightScreen}
          options={{
            header: () => <Header unlockedIndexes={[0, 1, 2]} />,
          }}
        /> */}
        {/* <Stack.Screen
          name="PhotoConstructor"
          component={PhotoConstructor}
          options={{
            header: () => <Header unlockedIndexes={[0, 1, 2, 3]} />,
          }}
        /> */}
        <Stack.Screen
          name="BossFightScreen"
          component={BossFightScreen}
          options={{
            header: () => <Header unlockedIndexes={[0, 1, 2, 3]} />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
