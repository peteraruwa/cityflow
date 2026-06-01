// src/features/auth/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Lock, Eye, EyeOff, ArrowRight, MapPin } from 'lucide-react-native';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../shared/config/firebase";
import SignUpScreen from "./SignUpScreen";

// Only import GoogleSignin on native platforms
if (Platform.OS !== 'web') {
  var { GoogleSignin, statusCodes } = require('@react-native-google-signin/google-signin');
}

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
      });
    }
  }, []);

  // ✅ FIXED: Complete handleLogin function
  async function handleLogin() {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      console.log("Login success:", userCredential.user.email);
      Alert.alert("Success", "Welcome back!");
      // Call the parent callback to navigate to home screen
      onLogin(userCredential.user);
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      let message = "Login failed. Please check your credentials.";
      if (error.code === 'auth/user-not-found') message = "No account found with this email.";
      else if (error.code === 'auth/wrong-password') message = "Incorrect password.";
      else if (error.code === 'auth/invalid-email') message = "Invalid email format.";
      else if (error.code === 'auth/too-many-requests') message = "Too many failed attempts. Try again later.";
      Alert.alert("Login failed", message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (Platform.OS === 'web') {
      Alert.alert("Not available", "Google Sign-In is only supported on mobile devices (iOS/Android).");
      return;
    }
    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken || userInfo.idToken;
      if (!idToken) throw new Error('No ID token found');
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      Alert.alert("Success", "Signed in with Google!");
      onLogin(userCredential.user);
    } catch (error) {
      console.log("Google login error:", error);
      if (error.code === statusCodes?.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Sign in was cancelled');
      } else if (error.code === statusCodes?.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign in is already running');
      } else if (error.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available');
      } else {
        Alert.alert('Google login failed', error.message || 'Unknown error');
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  if (showSignUp) {
    return (
      <SignUpScreen
        onSignUp={onLogin}
        onBackToLogin={() => setShowSignUp(false)}
      />
    );
  }

  const fldStyle = (f) => ({
    ...s.input,
    borderColor: focused === f ? 'rgba(113,40,206,0.55)' : 'rgba(255,255,255,0.07)',
    backgroundColor: focused === f ? 'rgba(113,40,206,0.08)' : 'rgba(255,255,255,0.05)',
  });

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <MapPin size={22} color="#7128CE" strokeWidth={2} />
          <Text style={s.brand}>CityFlow</Text>
        </View>
        <Text style={s.title}>Welcome back</Text>
        <Text style={s.subtitle}>Sign in to continue</Text>

        <View style={[fldStyle('email'), s.fieldRow]}>
          <Phone size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          <TextInput
            style={s.textInput}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={[fldStyle('pass'), s.fieldRow]}>
          <Lock size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          <TextInput
            style={s.textInput}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={pass}
            onChangeText={setPass}
            onFocus={() => setFocused('pass')}
            onBlur={() => setFocused(null)}
            secureTextEntry={!showPw}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPw(v => !v)}>
            {showPw ? <EyeOff size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
                    : <Eye size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
          <LinearGradient
            colors={loading ? ['rgba(113,40,206,0.4)', 'rgba(113,40,206,0.4)'] : ['#7128CE', '#5A18A8']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.signInBtn}
          >
            {loading ? <ActivityIndicator color="#fff" size="small" />
                     : <><Text style={s.signInTxt}>Sign In</Text><ArrowRight size={15} color="#fff" strokeWidth={2.5} /></>}
          </LinearGradient>
        </TouchableOpacity>

        <View style={s.dividerRow}>
          <View style={s.divLine} />
          <Text style={s.divTxt}>or continue with</Text>
          <View style={s.divLine} />
        </View>

        <View style={s.socialRow}>
          <TouchableOpacity
            style={s.socialBtn}
            activeOpacity={0.7}
            onPress={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? <ActivityIndicator color="#EBE3D6" size="small" />
                           : <Text style={s.socialTxt}>Google</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={s.socialBtn} activeOpacity={0.7} disabled={true}>
            <Text style={[s.socialTxt, { opacity: 0.5 }]}>Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={s.signupRow}>
          <Text style={s.signupTxt}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => setShowSignUp(true)}>
            <Text style={s.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: '#08011A' },
  scroll:     { flexGrow: 1, paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  header:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 40 },
  brand:      { fontSize: 20, fontWeight: '700', color: '#EBE3D6', letterSpacing: 2 },
  title:      { fontSize: 28, fontWeight: '700', color: '#EBE3D6', marginBottom: 6 },
  subtitle:   { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 },
  fieldRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14, borderRadius: 12, paddingHorizontal: 14, height: 52, borderWidth: 1 },
  input:      { borderRadius: 12, borderWidth: 1 },
  textInput:  { flex: 1, color: '#EBE3D6', fontSize: 15 },
  signInBtn:  { borderRadius: 14, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  signInTxt:  { color: '#fff', fontWeight: '700', fontSize: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 24 },
  divLine:    { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  divTxt:     { color: 'rgba(255,255,255,0.3)', fontSize: 13 },
  socialRow:  { flexDirection: 'row', gap: 12 },
  socialBtn:  { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)' },
  socialTxt:  { color: '#EBE3D6', fontWeight: '600', fontSize: 15 },
  signupRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  signupTxt:  { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  signupLink: { color: '#7128CE', fontWeight: '700', fontSize: 14 },
});