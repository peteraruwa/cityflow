// src/features/auth/SignUpScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../shared/config/firebase';

export default function SignUpScreen({ onSignUp, onBackToLogin }) {
  const [firstName, setFirstName]         = useState('');
  const [lastName, setLastName]           = useState('');
  const [email, setEmail]                 = useState('');
  const [pass, setPass]                   = useState('');
  const [confirmPass, setConfirmPass]     = useState('');
  const [showPw, setShowPw]               = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [focused, setFocused]             = useState(null);
  const [loading, setLoading]             = useState(false);

  async function handleSignUp() {
    const cleanEmail = email.trim().toLowerCase();

    if (!firstName.trim() || !lastName.trim() || !cleanEmail || !pass || !confirmPass) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (pass !== confirmPass) {
      Alert.alert("Passwords don't match", 'Please make sure both passwords are identical.');
      return;
    }
    if (pass.length < 6) {
      Alert.alert('Password too short', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      await updateProfile(user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });
      onSignUp(user); // onAuthStateChanged in App.js handles navigation
    } catch (error) {
      const messages = {
        'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
        'auth/invalid-email':        'Please enter a valid email address.',
        'auth/weak-password':        'Password is too weak. Use at least 8 characters with numbers.',
      };
      Alert.alert('Sign up failed', messages[error.code] ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <Text style={s.title}>Create account</Text>
          <Text style={s.subtitle}>Join CityFlow and explore Redemption City</Text>
        </View>

        {/* Gold divider */}
        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          <View style={s.dividerDiamond} />
          <View style={s.dividerLine} />
        </View>

        {/* First + Last name side by side */}
        <View style={s.nameRow}>
          <View style={{ flex: 1 }}>
            <FieldLabel label="First Name" />
            <View style={[s.fieldRow, focused === 'firstName' && s.fieldFocused]}>
              <User size={14} color={focused === 'firstName' ? C.gold : C.iconMuted} strokeWidth={2} />
              <TextInput
                style={s.textInput}
                placeholder="First"
                placeholderTextColor={C.placeholder}
                value={firstName}
                onChangeText={setFirstName}
                onFocus={() => setFocused('firstName')}
                onBlur={() => setFocused(null)}
                autoCapitalize="words"
                autoComplete="given-name"
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel label="Last Name" />
            <View style={[s.fieldRow, focused === 'lastName' && s.fieldFocused]}>
              <User size={14} color={focused === 'lastName' ? C.gold : C.iconMuted} strokeWidth={2} />
              <TextInput
                style={s.textInput}
                placeholder="Last"
                placeholderTextColor={C.placeholder}
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => setFocused('lastName')}
                onBlur={() => setFocused(null)}
                autoCapitalize="words"
                autoComplete="family-name"
              />
            </View>
          </View>
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
            placeholder="Min. 6 characters"
            placeholderTextColor={C.placeholder}
            value={pass}
            onChangeText={setPass}
            onFocus={() => setFocused('pass')}
            onBlur={() => setFocused(null)}
            secureTextEntry={!showPw}
            autoCapitalize="none"
            autoComplete="new-password"
          />
          <TouchableOpacity onPress={() => setShowPw(v => !v)} hitSlop={8}>
            {showPw
              ? <EyeOff size={15} color={C.iconMuted} strokeWidth={2} />
              : <Eye    size={15} color={C.iconMuted} strokeWidth={2} />}
          </TouchableOpacity>
        </View>

        {/* Confirm password */}
        <FieldLabel label="Confirm Password" />
        <View style={[s.fieldRow, focused === 'confirm' && s.fieldFocused, confirmPass && pass !== confirmPass && s.fieldError]}>
          <Lock size={15} color={focused === 'confirm' ? C.gold : C.iconMuted} strokeWidth={2} />
          <TextInput
            style={s.textInput}
            placeholder="Re-enter your password"
            placeholderTextColor={C.placeholder}
            value={confirmPass}
            onChangeText={setConfirmPass}
            onFocus={() => setFocused('confirm')}
            onBlur={() => setFocused(null)}
            secureTextEntry={!showConfirmPw}
            autoCapitalize="none"
            autoComplete="new-password"
          />
          <TouchableOpacity onPress={() => setShowConfirmPw(v => !v)} hitSlop={8}>
            {showConfirmPw
              ? <EyeOff size={15} color={C.iconMuted} strokeWidth={2} />
              : <Eye    size={15} color={C.iconMuted} strokeWidth={2} />}
          </TouchableOpacity>
        </View>

        {/* Inline mismatch hint */}
        {confirmPass.length > 0 && pass !== confirmPass && (
          <Text style={s.errorHint}>Passwords do not match</Text>
        )}

        {/* Create account button */}
        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          activeOpacity={0.85}
          style={{ marginTop: 8 }}
        >
          <LinearGradient
            colors={loading ? [C.btnDisabled, C.btnDisabled] : ['#7128CE', '#5A18A8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.btn}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <>
                  <Text style={s.btnText}>Create Account</Text>
                  <ArrowRight size={15} color="#fff" strokeWidth={2.5} />
                </>}
          </LinearGradient>
        </TouchableOpacity>

        {/* Sign in link */}
        <View style={s.switchRow}>
          <Text style={s.switchText}>Already have an account? </Text>
          <TouchableOpacity onPress={onBackToLogin} hitSlop={8}>
            <Text style={s.switchLink}>Sign in</Text>
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
  errorBorder: 'rgba(220,53,69,0.5)',
  errorBg:     'rgba(220,53,69,0.06)',
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
  brandRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 36 },
  brandDiamond:{ width: 7, height: 7, backgroundColor: C.gold, transform: [{ rotate: '45deg' }] },
  brandText:   { fontSize: 18, fontWeight: '700', color: C.text, letterSpacing: 3 },

  /* Title */
  titleBlock: { marginBottom: 22 },
  title:      { fontSize: 26, fontWeight: '700', color: C.text, marginBottom: 5 },
  subtitle:   { fontSize: 13, color: C.textMuted, lineHeight: 19 },

  /* Gold divider */
  dividerRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 26 },
  dividerLine:    { flex: 1, height: 1, backgroundColor: C.goldFaint },
  dividerDiamond: { width: 5, height: 5, backgroundColor: C.gold, opacity: 0.5, transform: [{ rotate: '45deg' }] },

  /* Name row */
  nameRow: { flexDirection: 'row', gap: 12, marginBottom: 0 },

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
  fieldError: {
    borderColor: C.errorBorder,
    backgroundColor: C.errorBg,
  },
  textInput: {
    flex: 1,
    color: C.text,
    fontSize: 14,
  },

  /* Error hint */
  errorHint: {
    fontSize: 11,
    color: '#DC3545',
    marginTop: -10,
    marginBottom: 14,
    marginLeft: 2,
  },

  /* Button */
  btn:     { borderRadius: 12, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },

  /* Switch */
  switchRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  switchText: { fontSize: 13, color: C.textMuted },
  switchLink: { fontSize: 13, color: C.gold, fontWeight: '700' },
});