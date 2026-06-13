import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Home, Car, Compass, Package, Zap } from 'lucide-react-native';
import HomeStack            from './HomeStack';
import MoreStack            from './MoreStack';
import CityRideScreen       from '../features/cityride/CityRideScreen';
import ExploreScreen        from '../features/explore/ExploreScreen';
import LostAndFoundScreen   from '../features/lost-found/LostAndFoundScreen';
import { C, FONTS } from '../shared/constants/theme';
import { usePrefs } from '../shared/context/PrefsContext';

const Tab = createBottomTabNavigator();

export default function MainTabs({ onLogout, onResetApp }) {
  const { colorScheme, language } = usePrefs();
  return (
    <Tab.Navigator
      key={`${colorScheme}-${language}`}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'light' ? 'rgba(247,244,239,0.97)' : C.bg,
          borderTopColor: C.b,
          borderTopWidth: 1,
          paddingBottom: 28,
          paddingTop: 10,
          height: 80,
        },
        tabBarActiveTintColor:   C.purpleL,
        tabBarInactiveTintColor: C.ts,
        tabBarLabelStyle: { fontSize:9, fontWeight:'600' },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarIcon: ({ color, focused }) => <Home size={20} color={color} strokeWidth={focused?2.2:1.6}/>, tabBarLabel:'Home' }}
      />
      <Tab.Screen
        name="CityRide"
        component={CityRideScreen}
        options={{ tabBarIcon: ({ color, focused }) => <Car size={20} color={color} strokeWidth={focused?2.2:1.6}/>, tabBarLabel:'CityRide' }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ tabBarIcon: ({ color, focused }) => <Compass size={20} color={color} strokeWidth={focused?2.2:1.6}/>, tabBarLabel:'Explore' }}
      />
      <Tab.Screen
        name="LostFound"
        component={LostAndFoundScreen}
        options={{ tabBarIcon: ({ color, focused }) => <Package size={20} color={color} strokeWidth={focused?2.2:1.6}/>, tabBarLabel:'Lost & Found' }}
      />
      <Tab.Screen
        name="More"
        children={() => <MoreStack onLogout={onLogout} onResetApp={onResetApp} />}
        options={{ tabBarIcon: ({ color, focused }) => <Zap size={20} color={color} strokeWidth={focused?2.2:1.6}/>, tabBarLabel:'More' }}
      />
    </Tab.Navigator>
  );
}
