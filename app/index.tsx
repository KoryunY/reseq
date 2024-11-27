import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from '../src/screens/StartScreen';
import CirclesScreen from '../src/screens/CircleScreen';
import WorkInProgress from '../src/screens/WorkInProgress';

export type RootStackParamList = {
  StartScreen: undefined;
  CirclesScreen: undefined;
  WorkInProgress: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="CirclesScreen" component={CirclesScreen} />
        <Stack.Screen name="WorkInProgress" component={WorkInProgress} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
