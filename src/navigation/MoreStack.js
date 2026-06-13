import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoreScreen, {
  AboutCityFlowScreen,
  AboutRCCGScreen,
  AboutRedemptionCityScreen,
  MoreSettingsScreen,
  PrivacyScreen,
} from '../features/more/MoreScreen';
import EmergencyScreen         from '../features/emergency/EmergencyScreen';
import AIAssistantScreen       from '../features/ai-assistant/AIAssistantScreen';
import BusinessDirectoryScreen from '../features/business/screens/BusinessDirectoryScreen';
import FunFactsScreen          from '../features/fun-facts/FunFactsScreen';
import ContactsScreen          from '../features/contacts/ContactsScreen';
import QuizScreen              from '../features/quiz/QuizScreen';
import CityTourScreen          from '../features/tour/CityTourScreen';
import ProfileScreen           from '../features/profile/ProfileScreen';
import NotificationsScreen     from '../features/notifications/NotificationsScreen';
import NewsDetailScreen        from '../features/notifications/NewsDetailScreen';
import EventDetailScreen       from '../features/events/EventDetailScreen';
import AdminDashboardScreen    from '../features/admin/AdminDashboardScreen';
import { C } from '../shared/constants/theme';
import { usePrefs } from '../shared/context/PrefsContext';

const Stack = createNativeStackNavigator();

export default function MoreStack({ onLogout, onResetApp }) {
  const { colorScheme } = usePrefs();
  return (
    <Stack.Navigator key={colorScheme} screenOptions={{ headerShown: false, contentStyle:{ backgroundColor:C.bg } }}>
      <Stack.Screen name="MoreMain"          component={MoreScreen} initialParams={{ onLogout }} />
      <Stack.Screen name="Emergency"         component={EmergencyScreen} />
      <Stack.Screen name="AIAssistant"       component={AIAssistantScreen} />
      <Stack.Screen name="BusinessDirectory" component={BusinessDirectoryScreen} />
      <Stack.Screen name="FunFacts"          component={FunFactsScreen} />
      <Stack.Screen name="Contacts"          component={ContactsScreen} />
      <Stack.Screen name="Quiz"              component={QuizScreen} />
      <Stack.Screen name="CityTour"          component={CityTourScreen} />
      <Stack.Screen name="Profile"           component={ProfileScreen} initialParams={{ onLogout }} />
      <Stack.Screen name="MoreSettings">
        {(props) => <MoreSettingsScreen {...props} onResetApp={onResetApp} />}
      </Stack.Screen>
      <Stack.Screen name="Notifications"     component={NotificationsScreen} />
      <Stack.Screen name="NewsDetail"        component={NewsDetailScreen} />
      <Stack.Screen name="EventDetail"       component={EventDetailScreen} />
      <Stack.Screen name="AdminDashboard"    component={AdminDashboardScreen} />
      <Stack.Screen name="Privacy"           component={PrivacyScreen} />
      <Stack.Screen name="AboutCityFlow"      component={AboutCityFlowScreen} />
      <Stack.Screen name="AboutRCCG"          component={AboutRCCGScreen} />
      <Stack.Screen name="AboutRedemptionCity" component={AboutRedemptionCityScreen} />
    </Stack.Navigator>
  );
}
