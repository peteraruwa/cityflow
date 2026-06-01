import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../features/splash/SplashScreen';
import LoginScreen  from '../features/auth/LoginScreen';
import MainTabs     from './MainTabs';

export default function AppNavigator() {
  const [screen, setScreen] = useState('splash');

  if (screen === 'splash') {
    return <SplashScreen onDone={() => setScreen('login')} />;
  }

  return (
    <NavigationContainer>
      {screen === 'login'
        ? <LoginScreen onLogin={() => setScreen('app')} />
        : <MainTabs onLogout={() => setScreen('login')} />
      }
    </NavigationContainer>
  );
}