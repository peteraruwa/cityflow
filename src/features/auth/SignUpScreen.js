// src/features/auth/SignUpScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, MapPin } from 'lucide-react-native';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../shared/config/firebase";

export default function SignUpScreen({ onSignUp, onBackToLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!firstName || !lastName || !email || !pass || !confirmPass) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (pass !== confirmPass) {
      Alert.alert("Passwords don't match", "Please make sure your passwords match.");
      return;
    }
    if (pass.length < 6) {
      Alert.alert("Password too short", "Password should be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const fullName = `${firstName} ${lastName}`.trim();
      await updateProfile(userCredential.user, { displayName: fullName });
      Alert.alert("Account created", "Welcome to CityFlow!");
      onSignUp(userCredential.user);
    } catch (error) {
      console.error("SignUp error:", error);
      let message = "Sign up failed. Please try again.";
      if (error.code === 'auth/email-already-in-use') message = "This email is already registered. Please sign in instead.";
      else if (error.code === 'auth/invalid-email') message = "Please enter a valid email address.";
      else if (error.code === 'auth/weak-password') message = "Password is too weak. Use a stronger password.";
      Alert.alert("Sign up failed", message);
    } finally {
      setLoading(false);
    }
  }

  const fldStyle = (f) => ({
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
        <Text style={s.title}>Create account</Text>
        <Text style={s.subtitle}>Sign up to get started</Text>

        <View style={[fldStyle('firstName'), s.fieldRow]}>
          <User size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          <TextInput
            style={s.textInput}
            placeholder="First Name"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={firstName}
            onChangeText={setFirstName}
            onFocus={() => setFocused('firstName')}
            onBlur={() => setFocused(null)}
            autoCapitalize="words"
          />
        </View>

        <View style={[fldStyle('lastName'), s.fieldRow]}>
          <User size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          <TextInput
            style={s.textInput}
            placeholder="Last Name"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={lastName}
            onChangeText={setLastName}
            onFocus={() => setFocused('lastName')}
            onBlur={() => setFocused(null)}
            autoCapitalize="words"
          />
        </View>

        <View style={[fldStyle('email'), s.fieldRow]}>
          <Mail size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
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

        <View style={[fldStyle('confirm'), s.fieldRow]}>
          <Lock size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          <TextInput
            style={s.textInput}
            placeholder="Confirm Password"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={confirmPass}
            onChangeText={setConfirmPass}
            onFocus={() => setFocused('confirm')}
            onBlur={() => setFocused(null)}
            secureTextEntry={!showConfirmPw}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowConfirmPw(v => !v)}>
            {showConfirmPw ? <EyeOff size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
                           : <Eye size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSignUp} disabled={loading} activeOpacity={0.85}>
          <LinearGradient
            colors={loading ? ['rgba(113,40,206,0.4)', 'rgba(113,40,206,0.4)'] : ['#7128CE', '#5A18A8']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.signUpBtn}
          >
            {loading ? <ActivityIndicator color="#fff" size="small" />
                     : <><Text style={s.signUpTxt}>Sign Up</Text><ArrowRight size={15} color="#fff" strokeWidth={2.5} /></>}
          </LinearGradient>
        </TouchableOpacity>

        <View style={s.loginRow}>
          <Text style={s.loginTxt}>Already have an account? </Text>
          <TouchableOpacity onPress={onBackToLogin}>
            <Text style={s.loginLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08011A' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 40 },
  brand: { fontSize: 20, fontWeight: '700', color: '#EBE3D6', letterSpacing: 2 },
  title: { fontSize: 28, fontWeight: '700', color: '#EBE3D6', marginBottom: 6 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14, borderRadius: 12, paddingHorizontal: 14, height: 52, borderWidth: 1 },
  textInput: { flex: 1, color: '#EBE3D6', fontSize: 15 },
  signUpBtn: { borderRadius: 14, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  signUpTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  loginTxt: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  loginLink: { color: '#7128CE', fontWeight: '700', fontSize: 14 },
});