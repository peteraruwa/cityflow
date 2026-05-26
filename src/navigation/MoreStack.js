import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoreScreen              from '../features/more/MoreScreen';
import EmergencyScreen         from '../features/emergency/EmergencyScreen';
import AIAssistantScreen       from '../features/ai-assistant/AIAssistantScreen';
import BusinessDirectoryScreen from '../features/business/BusinessDirectoryScreen';
import FunFactsScreen          from '../features/fun-facts/FunFactsScreen';
import ContactsScreen          from '../features/contacts/ContactsScreen';
import QuizScreen              from '../features/quiz/QuizScreen';
import CityTourScreen          from '../features/tour/CityTourScreen';
import ProfileScreen           from '../features/profile/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function MoreStack({ onLogout }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle:{ backgroundColor:'#08011A' } }}>
      <Stack.Screen name="MoreMain"          component={MoreScreen} initialParams={{ onLogout }} />
      <Stack.Screen name="Emergency"         component={EmergencyScreen} />
      <Stack.Screen name="AIAssistant"       component={AIAssistantScreen} />
      <Stack.Screen name="BusinessDirectory" component={BusinessDirectoryScreen} />
      <Stack.Screen name="FunFacts"          component={FunFactsScreen} />
      <Stack.Screen name="Contacts"          component={ContactsScreen} />
      <Stack.Screen name="Quiz"              component={QuizScreen} />
      <Stack.Screen name="CityTour"          component={CityTourScreen} />
      <Stack.Screen name="Profile"           component={ProfileScreen} initialParams={{ onLogout }} />
    </Stack.Navigator>
  );
}
