// src/features/auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import SignUpScreen from './SignUpScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import { usePrefs } from '../../shared/context/PrefsContext';
import { auth } from '../../shared/config/firebase';

const LOGIN_COPY = {
  en: {
    welcomeBack: 'Welcome back',
    subtitle: 'Sign in to your account to continue',
    emailAddress: 'Email Address',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    forgotPassword: 'Forgot password?',
    signIn: 'Sign In',
    or: 'OR',
    noAccount: "Don't have an account? ",
    signUp: 'Sign up',
  },
  fr: {
    welcomeBack: 'Bon retour',
    subtitle: 'Connectez-vous à votre compte pour continuer',
    emailAddress: 'Adresse e-mail',
    emailPlaceholder: 'vous@exemple.com',
    password: 'Mot de passe',
    passwordPlaceholder: 'Entrez votre mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    signIn: 'Se connecter',
    or: 'OU',
    noAccount: "Vous n'avez pas de compte ? ",
    signUp: "S'inscrire",
  },
  yo: {
    welcomeBack: 'Kaabo pada',
    subtitle: 'Wole si akanti re lati tesiwaju',
    emailAddress: 'Adiresi imeeli',
    emailPlaceholder: 'iwọ@apere.com',
    password: 'Oro igbaniwole',
    passwordPlaceholder: 'Te oro igbaniwole re',
    forgotPassword: 'Se o gbagbe oro igbaniwole?',
    signIn: 'Wole',
    or: 'TABI',
    noAccount: 'Se o ko ni akanti? ',
    signUp: 'Forukosile',
  },
};

export default function LoginScreen({ onLogin }) {
  const { language } = usePrefs();
  const [email, setEmail]       = useState('');
  const [pass, setPass]         = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [focused, setFocused]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const copy = LOGIN_COPY[language] || LOGIN_COPY.en;

  async function handleLogin() {
    const loginEmail = email.trim().toLowerCase();
    setMessage('');

    if (!loginEmail || !pass) {
      setMessage('Please enter your email address and password to sign in.');
      return;
    }

    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, loginEmail, pass);
      onLogin({
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: credential.user.displayName,
      });
    } catch (error) {
      console.warn('Firebase login failed:', error?.code || error?.message);
      setMessage(getLoginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  if (showSignUp) {
    return <SignUpScreen onSignUp={onLogin} onBackToLogin={() => setShowSignUp(false)} />;
  }

  if (showForgotPassword) {
    return (
      <ForgotPasswordScreen
        initialEmail={email}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    );
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
          <View style={s.brandLogoFrame}>
            <Image source={require('../../../assets/rcog_logo.png')} style={s.brandLogo} resizeMode="contain" />
          </View>
          <Text style={s.brandText}>CityFlow</Text>
        </View>

        {/* Title block */}
        <View style={s.titleBlock}>
          <Text style={s.title}>{copy.welcomeBack}</Text>
          <Text style={s.subtitle}>{copy.subtitle}</Text>
        </View>

        {/* Gold divider */}
        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          <View style={s.dividerDiamond} />
          <View style={s.dividerLine} />
        </View>

        {/* Email */}
        <FieldLabel label={copy.emailAddress} />
        <View style={[s.fieldRow, focused === 'email' && s.fieldFocused]}>
          <Mail size={15} color={focused === 'email' ? C.gold : C.iconMuted} strokeWidth={2} />
          <TextInput
            style={s.textInput}
            placeholder={copy.emailPlaceholder}
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
        <FieldLabel label={copy.password} />
        <View style={[s.fieldRow, focused === 'pass' && s.fieldFocused]}>
          <Lock size={15} color={focused === 'pass' ? C.gold : C.iconMuted} strokeWidth={2} />
          <TextInput
            style={s.textInput}
            placeholder={copy.passwordPlaceholder}
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
        <TouchableOpacity style={s.forgotRow} hitSlop={8} onPress={() => setShowForgotPassword(true)}>
          <Text style={s.forgotText}>{copy.forgotPassword}</Text>
        </TouchableOpacity>

        {message ? (
          <View style={s.messageBox}>
            <Text style={s.messageText}>{message}</Text>
          </View>
        ) : null}

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
                  <Text style={s.btnText}>{copy.signIn}</Text>
                  <ArrowRight size={15} color="#fff" strokeWidth={2.5} />
                </>}
          </LinearGradient>
        </TouchableOpacity>

        {/* OR separator */}
        <View style={s.orRow}>
          <View style={s.orLine} />
          <Text style={s.orText}>{copy.or}</Text>
          <View style={s.orLine} />
        </View>

        {/* Sign up link */}
        <View style={s.switchRow}>
          <Text style={s.switchText}>{copy.noAccount}</Text>
          <TouchableOpacity onPress={() => setShowSignUp(true)} hitSlop={8}>
            <Text style={s.switchLink}>{copy.signUp}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FieldLabel({ label }) {
  return <Text style={s.fieldLabel}>{label}</Text>;
}

function getLoginErrorMessage(error) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'That email address does not look quite right. Please check it and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact CityFlow support.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'We could not sign you in with those details. Please check your email and password.';
    case 'auth/too-many-requests':
      return 'Too many sign-in attempts. Please wait a moment, then try again.';
    case 'auth/network-request-failed':
      return 'Network connection problem. Please check your internet and try again.';
    default:
      return 'Sign in could not be completed. Please check your details and try again.';
  }
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
  brandRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 },
  brandLogoFrame: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  brandLogo:      { width: 50, height: 50 },
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

  messageBox: {
    backgroundColor: 'rgba(220,53,69,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(220,53,69,0.35)',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 16,
  },
  messageText: {
    color: '#F2A8A8',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },

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
