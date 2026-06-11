import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';

const UserContext = createContext(null);

function titleCase(value) {
  const clean = String(value || '').trim();
  if (!clean) return '';
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
}

function firstToken(value) {
  return String(value || '').trim().split(/\s+/).filter(Boolean)[0] || '';
}

function firstNameFromEmail(email) {
  const local = String(email || '').split('@')[0] || '';
  const [first] = local.split(/[._\-+]/).filter(Boolean);
  return titleCase(first || local || 'Guest');
}

function extractFirstName(source) {
  if (!source) return '';
  const direct = source.firstName || source.first_name || source.givenName;
  if (direct) return titleCase(direct);
  const name = source.displayName || source.name || source.fullName;
  if (name) return titleCase(firstToken(name));
  if (source.email) return firstNameFromEmail(source.email);
  return '';
}

async function fetchFirestoreProfile(firebaseUser, fallbackEmail) {
  if (!db) return null;

  if (firebaseUser?.uid) {
    const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid)).catch(() => null);
    if (userSnap?.exists()) return userSnap.data();
  }

  const email = firebaseUser?.email || fallbackEmail;
  if (email) {
    const found = await getDocs(query(collection(db, 'users'), where('email', '==', email), limit(1))).catch(() => null);
    if (found && !found.empty) return found.docs[0].data();
  }

  return null;
}

export function UserProvider({ children }) {
  const [sessionUser, setSessionUserState] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(auth?.currentUser || null);
  const [firestoreProfile, setFirestoreProfile] = useState(null);

  const setSessionUser = useCallback((user) => {
    setSessionUserState(user || null);
  }, []);

  const clearSessionUser = useCallback(() => {
    setSessionUserState(null);
    setFirestoreProfile(null);
  }, []);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (nextUser) => {
      setFirebaseUser(nextUser);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const email = firebaseUser?.email || sessionUser?.email;

    fetchFirestoreProfile(firebaseUser, email).then((profile) => {
      if (!cancelled) setFirestoreProfile(profile);
    });

    return () => {
      cancelled = true;
    };
  }, [firebaseUser, sessionUser]);

  const profile = useMemo(() => {
    const merged = {
      ...sessionUser,
      ...firebaseUser,
      ...firestoreProfile,
      email: firestoreProfile?.email || firebaseUser?.email || sessionUser?.email,
      displayName: firestoreProfile?.displayName || firestoreProfile?.name || firebaseUser?.displayName || sessionUser?.displayName,
    };
    const firstName = extractFirstName(firestoreProfile) || extractFirstName(firebaseUser) || extractFirstName(sessionUser) || 'Guest';
    return { ...merged, firstName };
  }, [firebaseUser, firestoreProfile, sessionUser]);

  return (
    <UserContext.Provider value={{ user: profile, setSessionUser, clearSessionUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserProfile must be used within UserProvider');
  return context;
}
