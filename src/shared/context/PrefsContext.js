// src/shared/context/PrefsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PrefsContext = createContext();

export const PrefsProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('app_language');
        if (savedLang) setLanguageState(savedLang);
        const savedTheme = await AsyncStorage.getItem('app_theme');
        if (savedTheme === 'light') setIsDark(false);
      } catch (e) {
        console.warn('Failed to load prefs', e);
      }
    };
    loadPrefs();
  }, []);

  const setLanguage = async (code) => {
    setLanguageState(code);
    await AsyncStorage.setItem('app_language', code);
  };

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('app_theme', next ? 'dark' : 'light');
  };

  const value = {
    language,
    setLanguage,
    isDark,
    toggleTheme,
  };

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
};

export const usePrefs = () => {
  const context = useContext(PrefsContext);
  if (!context) throw new Error('usePrefs must be used within PrefsProvider');
  return context;
};