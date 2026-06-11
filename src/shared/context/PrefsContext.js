// src/shared/context/PrefsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setActiveLanguage } from '../i18n/runtimeTranslator';

const PrefsContext = createContext();

export const PrefsProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [isDark, setIsDark] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [inAppSounds, setInAppSounds] = useState(false);
  const [usageAnalytics, setUsageAnalytics] = useState(true);
  const [personalisedSuggestions, setPersonalisedSuggestions] = useState(false);

  const applyDefaultPrefs = () => {
    setLanguageState('en');
    setActiveLanguage('en');
    setIsDark(true);
    setPushNotifications(true);
    setLocationServices(true);
    setInAppSounds(false);
    setUsageAnalytics(true);
    setPersonalisedSuggestions(false);
  };

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const [
          savedLang,
          savedTheme,
          savedPush,
          savedLocation,
          savedSounds,
          savedAnalytics,
          savedPersonalised,
          savedLanguageSelected,
        ] = await Promise.all([
          AsyncStorage.getItem('app_language'),
          AsyncStorage.getItem('app_theme'),
          AsyncStorage.getItem('pref_push_notifications'),
          AsyncStorage.getItem('pref_location_services'),
          AsyncStorage.getItem('pref_in_app_sounds'),
          AsyncStorage.getItem('pref_usage_analytics'),
          AsyncStorage.getItem('pref_personalised_suggestions'),
          AsyncStorage.getItem('app_language_selected'),
        ]);
        if (savedLang && savedLanguageSelected === 'true') {
          setLanguageState(savedLang);
          setActiveLanguage(savedLang);
        } else {
          setLanguageState('en');
          setActiveLanguage('en');
        }
        if (savedTheme === 'light') setIsDark(false);
        if (savedPush !== null) setPushNotifications(savedPush === 'true');
        if (savedLocation !== null) setLocationServices(savedLocation === 'true');
        if (savedSounds !== null) setInAppSounds(savedSounds === 'true');
        if (savedAnalytics !== null) setUsageAnalytics(savedAnalytics === 'true');
        if (savedPersonalised !== null) setPersonalisedSuggestions(savedPersonalised === 'true');
      } catch (e) {
        console.warn('Failed to load prefs', e);
      }
    };
    loadPrefs();
  }, []);

  const setLanguage = async (code) => {
    setLanguageState(code);
    setActiveLanguage(code);
    await Promise.all([
      AsyncStorage.setItem('app_language', code),
      AsyncStorage.setItem('app_language_selected', 'true'),
    ]);
  };

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('app_theme', next ? 'dark' : 'light');
  };

  const setBooleanPref = async (key, setter, value) => {
    setter(value);
    await AsyncStorage.setItem(key, String(value));
  };

  const toggleBooleanPref = (key, setter, current) => setBooleanPref(key, setter, !current);

  const resetSettings = async () => {
    applyDefaultPrefs();
    await AsyncStorage.multiRemove([
      'app_language',
      'app_language_selected',
      'app_theme',
      'pref_push_notifications',
      'pref_location_services',
      'pref_in_app_sounds',
      'pref_usage_analytics',
      'pref_personalised_suggestions',
      'cityflow_onboarding_complete',
    ]);
  };

  const value = {
    language,
    setLanguage,
    resetSettings,
    isDark,
    toggleTheme,
    pushNotifications,
    setPushNotifications: (value) => setBooleanPref('pref_push_notifications', setPushNotifications, value),
    togglePushNotifications: () => toggleBooleanPref('pref_push_notifications', setPushNotifications, pushNotifications),
    locationServices,
    setLocationServices: (value) => setBooleanPref('pref_location_services', setLocationServices, value),
    toggleLocationServices: () => toggleBooleanPref('pref_location_services', setLocationServices, locationServices),
    inAppSounds,
    setInAppSounds: (value) => setBooleanPref('pref_in_app_sounds', setInAppSounds, value),
    toggleInAppSounds: () => toggleBooleanPref('pref_in_app_sounds', setInAppSounds, inAppSounds),
    usageAnalytics,
    setUsageAnalytics: (value) => setBooleanPref('pref_usage_analytics', setUsageAnalytics, value),
    toggleUsageAnalytics: () => toggleBooleanPref('pref_usage_analytics', setUsageAnalytics, usageAnalytics),
    personalisedSuggestions,
    setPersonalisedSuggestions: (value) => setBooleanPref('pref_personalised_suggestions', setPersonalisedSuggestions, value),
    togglePersonalisedSuggestions: () => toggleBooleanPref('pref_personalised_suggestions', setPersonalisedSuggestions, personalisedSuggestions),
  };

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
};

export const usePrefs = () => {
  const context = useContext(PrefsContext);
  if (!context) throw new Error('usePrefs must be used within PrefsProvider');
  return context;
};
