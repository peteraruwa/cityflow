import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/shared/config/firebase';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/features/auth/LoginScreen';
import * as Notifications from 'expo-notifications'; // ✅ added import

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ✅ Request notification permissions when app starts
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
        // Optionally show an alert, but don't block the app
      }
    };
    requestPermissions();
  }, []);

  if (loading) {
    return null; // You can add a splash screen component here
  }

  if (!user) {
    return (
      <SafeAreaProvider>
        <LoginScreen onLogin={setUser} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}