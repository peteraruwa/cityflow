import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreenNative from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './src/features/splash/SplashScreen';
import OnboardingScreen from './src/features/onboarding/OnboardingScreen';
import LoginScreen from './src/features/auth/LoginScreen';
import MainTabs from './src/navigation/MainTabs';
import { PrefsProvider } from './src/shared/context/PrefsContext';
import { usePrefs } from './src/shared/context/PrefsContext';
import { UserProvider, useUserProfile } from './src/shared/context/UserContext';
import { installGlobalTextTranslator } from './src/shared/i18n/runtimeTranslator';
import ScreenWrapper from './src/shared/components/ScreenWrapper';
import { C } from './src/shared/constants/theme';

SplashScreenNative.preventAutoHideAsync();
SplashScreenNative.setOptions({ duration: 700, fade: true });
installGlobalTextTranslator();

const ONBOARDING_COMPLETE_KEY = 'cityflow_onboarding_complete';

function AppContent() {
  const [screen, setScreen] = useState('splash');
  const { setSessionUser, clearSessionUser } = useUserProfile();
  const { colorScheme } = usePrefs();

  const onLayoutRootView = useCallback(async () => {
    await SplashScreenNative.hideAsync();
  }, []);

  const handleLogin = useCallback((user) => {
    setSessionUser(user);
    setScreen('app');
  }, [setSessionUser]);

  const handleLogout = useCallback(() => {
    clearSessionUser();
    setScreen('login');
  }, [clearSessionUser]);

  const handleSplashDone = useCallback(async () => {
    const onboardingComplete = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
    setScreen(onboardingComplete === 'true' ? 'login' : 'onboarding');
  }, []);

  const handleOnboardingDone = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    setScreen('login');
  }, []);

  const handleResetToOnboarding = useCallback(() => {
    clearSessionUser();
    setScreen('onboarding');
  }, [clearSessionUser]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }} onLayout={onLayoutRootView}>
      <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} backgroundColor={C.bg} />
      {screen === 'splash' && (
        <ScreenWrapper>
          <SplashScreen onDone={handleSplashDone} />
        </ScreenWrapper>
      )}
      {screen === 'onboarding' && (
        <ScreenWrapper>
          <OnboardingScreen onDone={handleOnboardingDone} />
        </ScreenWrapper>
      )}
      {screen === 'login' && (
        <ScreenWrapper>
          <LoginScreen onLogin={handleLogin} />
        </ScreenWrapper>
      )}
      {screen === 'app' && (
        <ScreenWrapper>
          <NavigationContainer key={colorScheme}>
            <MainTabs onLogout={handleLogout} onResetApp={handleResetToOnboarding} />
          </NavigationContainer>
        </ScreenWrapper>
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PrefsProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </PrefsProvider>
    </SafeAreaProvider>
  );
}
