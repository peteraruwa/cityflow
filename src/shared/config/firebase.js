import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from '@env';

console.log('🔧 Firebase config loaded from .env');
console.log('Platform:', Platform.OS);

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

console.log('📦 Firebase config object (partial):', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

const app = initializeApp(firebaseConfig);
console.log('✅ Firebase app initialised');

// Auth setup — AsyncStorage persistence only on native, not web
let auth;
if (Platform.OS === 'web') {
  console.log('🌐 Using web auth (no persistence)');
  const { getAuth } = require('firebase/auth');
  auth = getAuth(app);
  console.log('✅ Web auth initialised');
} else {
  console.log('📱 Using native auth with AsyncStorage persistence');
  try {
    const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    console.log('🔑 AsyncStorage module loaded');
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    console.log('✅ Native auth initialised with persistence');
  } catch (err) {
    console.error('❌ Failed to initialise native auth:', err);
    // fallback to getAuth (without persistence) to avoid crash
    const { getAuth } = require('firebase/auth');
    auth = getAuth(app);
    console.log('⚠️ Fallback to getAuth (no persistence)');
  }
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
console.log('🗄️ Firestore instance exported');
