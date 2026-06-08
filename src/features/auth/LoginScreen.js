// src/features/auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../shared/config/firebase';
import SignUpScreen from './SignUpScreen';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [pass, setPass]         = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [focused, setFocused]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  async function handleLogin() {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass  = pass.trim();

    if (!cleanEmail || !cleanPass) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      onLogin(user); // onAuthStateChanged in App.js handles navigation
    } catch (error) {
      const messages = {
        'auth/user-not-found':    'No account found with this email.',
        'auth/wrong-password':    'Incorrect password. Please try again.',
        'auth/invalid-email':     'Please enter a valid email address.',
        'auth/invalid-credential':'Invalid email or password.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      };
      Alert.alert('Sign in failed', messages[error.code] ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (showSignUp) {
    return <SignUpScreen onSignUp={onLogin} onBackToLogin={() => setShowSignUp(false)} />;
  }

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand header */}
        <View style={s.brandRow}>
          <View style={s.brandDiamond} />
          <Text style={s.brandText}>CityFlow</Text>
        </View>

        {/* Title block */}
        <View style={s.titleBlock}>
          <Text style={s.title}>Welcome back</Text>
          <Text style={s.subtitle}>Sign in to your account to continue</Text>
        </View>

        {/* Gold divider */}
        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          <View style={s.dividerDiamond} />
          <View style={s.dividerLine} />
        </View>

        {/* Email */}
        <FieldLabel label="Email Address" />
        <View style={[s.fieldRow, focused === 'email' && s.fieldFocused]}>
          <Mail size={15} color={focused === 'email' ? C.gold : C.iconMuted} strokeWidth={2} />
          <TextInput
            style={s.textInput}
            placeholder="you@example.com"
            placeholderTextColor={C.placeholder}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>

        {/* Password */}
        <FieldLabel label="Password" />
        <View style={[s.fieldRow, focused === 'pass' && s.fieldFocused]}>
          <Lock size={15} color={focused === 'pass' ? C.gold : C.iconMuted} strokeWidth={2} />
          <TextInput
            style={s.textInput}
            placeholder="Enter your password"
            placeholderTextColor={C.placeholder}
            value={pass}
            onChangeText={setPass}
            onFocus={() => setFocused('pass')}
            onBlur={() => setFocused(null)}
            secureTextEntry={!showPw}
            autoCapitalize="none"
            autoComplete="password"
          />
          <TouchableOpacity onPress={() => setShowPw(v => !v)} hitSlop={8}>
            {showPw
              ? <EyeOff size={15} color={C.iconMuted} strokeWidth={2} />
              : <Eye    size={15} color={C.iconMuted} strokeWidth={2} />}
          </TouchableOpacity>
        </View>

        {/* Forgot password */}
        <TouchableOpacity style={s.forgotRow} hitSlop={8}>
          <Text style={s.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Sign in button */}
        <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
          <LinearGradient
            colors={loading ? [C.btnDisabled, C.btnDisabled] : ['#7128CE', '#5A18A8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.btn}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <>
                  <Text style={s.btnText}>Sign In</Text>
                  <ArrowRight size={15} color="#fff" strokeWidth={2.5} />
                </>}
          </LinearGradient>
        </TouchableOpacity>

        {/* OR separator */}
        <View style={s.orRow}>
          <View style={s.orLine} />
          <Text style={s.orText}>OR</Text>
          <View style={s.orLine} />
        </View>

        {/* Sign up link */}
        <View style={s.switchRow}>
          <Text style={s.switchText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => setShowSignUp(true)} hitSlop={8}>
            <Text style={s.switchLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FieldLabel({ label }) {
  return <Text style={s.fieldLabel}>{label}</Text>;
}

/* ── Design tokens ─────────────────────────── */
const C = {
  bg:          '#08011A',
  gold:        '#C48D38',
  goldFaint:   'rgba(196,141,56,0.2)',
  purple:      '#7128CE',
  purpleFaint: 'rgba(113,40,206,0.08)',
  purpleBorder:'rgba(113,40,206,0.45)',
  text:        '#EBE3D6',
  textMuted:   'rgba(235,227,214,0.4)',
  placeholder: 'rgba(235,227,214,0.28)',
  iconMuted:   'rgba(235,227,214,0.35)',
  fieldBg:     'rgba(255,255,255,0.04)',
  fieldBorder: 'rgba(255,255,255,0.08)',
  btnDisabled: 'rgba(113,40,206,0.35)',
};

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 26, paddingTop: 72, paddingBottom: 48 },

  /* Brand */
  brandRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 40 },
  brandDiamond:{ width: 7, height: 7, backgroundColor: C.gold, transform: [{ rotate: '45deg' }] },
  brandText:   { fontSize: 18, fontWeight: '700', color: C.text, letterSpacing: 3 },

  /* Title */
  titleBlock: { marginBottom: 24 },
  title:      { fontSize: 26, fontWeight: '700', color: C.text, marginBottom: 5 },
  subtitle:   { fontSize: 13, color: C.textMuted, lineHeight: 19 },

  /* Gold divider */
  dividerRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 28 },
  dividerLine:    { flex: 1, height: 1, backgroundColor: C.goldFaint },
  dividerDiamond: { width: 5, height: 5, backgroundColor: C.gold, opacity: 0.5, transform: [{ rotate: '45deg' }] },

  /* Field label */
  fieldLabel: {
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 7,
  },

  /* Input row */
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.fieldBg,
    borderWidth: 1,
    borderColor: C.fieldBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 16,
  },
  fieldFocused: {
    borderColor: C.purpleBorder,
    backgroundColor: C.purpleFaint,
  },
  textInput: {
    flex: 1,
    color: C.text,
    fontSize: 14,
  },

  /* Forgot */
  forgotRow:  { alignSelf: 'flex-end', marginTop: -8, marginBottom: 24 },
  forgotText: { fontSize: 12, color: C.gold, opacity: 0.85 },

  /* Button */
  btn:     { borderRadius: 12, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },

  /* OR */
  orRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 },
  orLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  orText: { fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: 1.5 },

  /* Switch */
  switchRow:  { flexDirection: 'row', justifyContent: 'center' },
  switchText: { fontSize: 13, color: C.textMuted },
  switchLink: { fontSize: 13, color: C.gold, fontWeight: '700' },
});