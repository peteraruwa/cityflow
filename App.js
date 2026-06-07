// App.js
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './src/shared/config/firebase';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/features/auth/LoginScreen';
import OnboardingScreen from './src/features/onboarding/OnboardingScreen';
import { PrefsProvider } from './src/shared/context/PrefsContext';
import * as Notifications from 'expo-notifications';
import 'punycode';

console.log('🚀 App.js loaded');

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // Check onboarding status
  useEffect(() => {
    console.log('🔍 Checking onboarding status...');
    const checkOnboarding = async () => {
      try {
        const done = await AsyncStorage.getItem('onboarding_done');
        setOnboardingDone(done === 'true');
        console.log('📌 Onboarding done:', done === 'true');
      } catch (error) {
        console.error('Failed to read onboarding status', error);
      } finally {
        setCheckingOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    console.log('👤 Setting up auth listener...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Auth state changed, user:', user?.email || 'null');
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Request notification permissions
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('⚠️ Notification permissions not granted');
      } else {
        console.log('✅ Notification permissions granted');
      }
    };
    requestPermissions();
  }, []);

  if (checkingOnboarding || loading) {
    console.log('⏳ Waiting for onboarding/auth...');
    return null; // or a splash screen component
  }

  // First-time user → show onboarding
  if (!onboardingDone) {
    console.log('🆕 First-time user, showing onboarding');
    return (
      <SafeAreaProvider>
        <PrefsProvider>
          <OnboardingScreen onDone={() => {
            console.log('✅ Onboarding completed');
            setOnboardingDone(true);
          }} />
        </PrefsProvider>
      </SafeAreaProvider>
    );
  }

  // Already onboarded → normal auth flow
  if (!user) {
    console.log('🔐 No user, showing LoginScreen');
    return (
      <SafeAreaProvider>
        <PrefsProvider>
          <LoginScreen onLogin={(user) => {
            console.log('✅ User logged in:', user?.email);
            setUser(user);
          }} />
        </PrefsProvider>
      </SafeAreaProvider>
    );
  }

  console.log('🏠 User logged in, showing main app');
  return (
    <SafeAreaProvider>
      <PrefsProvider>
        <AppNavigator />
      </PrefsProvider>
    </SafeAreaProvider>
  );
}