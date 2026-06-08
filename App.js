// App.js
import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { auth } from './src/shared/config/firebase';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/features/auth/LoginScreen';
import OnboardingScreen from './src/features/onboarding/OnboardingScreen';
import { PrefsProvider } from './src/shared/context/PrefsContext';

// Hold splash screen until app is fully ready
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    let authUnsubscribe;

    const prepare = async () => {
      try {
        // Run onboarding check and auth listener setup in parallel
        const [onboardingValue] = await Promise.all([
          AsyncStorage.getItem('onboarding_done'),
          requestNotificationPermission(),
        ]);

        setOnboardingDone(onboardingValue === 'true');

        // Set up auth listener — resolves once on first emission
        await new Promise((resolve) => {
          authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setCurrentUser(firebaseUser);
            resolve(); // only needed for first call
          });
        });

      } catch (error) {
        console.error('App prepare error:', error);
      } finally {
        setAppReady(true);
      }
    };

    prepare();

    return () => {
      if (authUnsubscribe) authUnsubscribe();
    };
  }, []);

  // Hide splash only after first real frame is painted
  const onLayoutRootView = useCallback(async () => {
    if (appReady) await SplashScreen.hideAsync();
  }, [appReady]);

  if (!appReady) return null;

  const renderContent = () => {
    if (!onboardingDone) {
      return (
        <OnboardingScreen
          onDone={() => setOnboardingDone(true)}
        />
      );
    }
    if (!currentUser) {
      return (
        <LoginScreen
          onLogin={(firebaseUser) => setCurrentUser(firebaseUser)}
        />
      );
    }
    return <AppNavigator />;
  };

  return (
    <SafeAreaProvider>
      <PrefsProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          {renderContent()}
        </View>
      </PrefsProvider>
    </SafeAreaProvider>
  );
}

async function requestNotificationPermission() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    // Don't re-request if already determined
    if (existingStatus === 'granted' || existingStatus === 'denied') return;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
    }
  } catch (error) {
    // Non-fatal — app works fine without notifications
    console.warn('Notification permission error:', error);
  }
}