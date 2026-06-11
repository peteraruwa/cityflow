// src/features/auth/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ArrowRight, CheckCircle, Mail } from 'lucide-react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../shared/config/firebase';
import { usePrefs } from '../../shared/context/PrefsContext';

const COPY = {
  en: {
    title: 'Reset your password',
    subtitle: 'Enter your registered email and we will send you a secure reset link.',
    emailAddress: 'Email Address',
    emailPlaceholder: 'you@example.com',
    sendLink: 'Send Reset Link',
    backToLogin: 'Back to sign in',
    successTitle: 'Check your email',
    successBody: 'If this email is registered with CityFlow, Firebase has sent a secure password reset link. Open the link, set a new password, then sign in again.',
    sendAnother: 'Send another link',
  },
  fr: {
    title: 'Reinitialiser le mot de passe',
    subtitle: 'Entrez votre e-mail enregistre et nous vous enverrons un lien securise.',
    emailAddress: 'Adresse e-mail',
    emailPlaceholder: 'vous@exemple.com',
    sendLink: 'Envoyer le lien',
    backToLogin: 'Retour a la connexion',
    successTitle: 'Verifiez votre e-mail',
    successBody: 'Si cet e-mail est enregistre avec CityFlow, Firebase a envoye un lien securise de reinitialisation. Ouvrez le lien, creez un nouveau mot de passe, puis reconnectez-vous.',
    sendAnother: 'Envoyer un autre lien',
  },
  yo: {
    title: 'Tun oro igbaniwole se',
    subtitle: 'Te imeeli ti o forukosile, a o fi linki aabo ranse si o.',
    emailAddress: 'Adiresi imeeli',
    emailPlaceholder: 'iwo@apere.com',
    sendLink: 'Fi linki ranse',
    backToLogin: 'Pada si wole',
    successTitle: 'Sayewo imeeli re',
    successBody: 'Ti imeeli yi ba wa ninu CityFlow, Firebase ti fi linki aabo ranse. Si linki naa, yan oro igbaniwole tuntun, ki o tun wole.',
    sendAnother: 'Fi linki miran ranse',
  },
};

export default function ForgotPasswordScreen({ initialEmail = '', onBackToLogin }) {
  const { language } = usePrefs();
  const copy = COPY[language] || COPY.en;
  const [email, setEmail] = useState(initialEmail);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSendReset() {
    const cleanEmail = email.trim().toLowerCase();
    setMessage('');

    if (!cleanEmail) {
      setMessage('Please enter your email address so we can send the reset link.');
      return;
    }

    setLoading(true);
    try {
      auth.languageCode = language || 'en';
      await sendPasswordResetEmail(auth, cleanEmail);
      setSent(true);
    } catch (error) {
      console.warn('Firebase password reset failed:', error?.code || error?.message);
      setMessage(getResetErrorMessage(error));
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
        <TouchableOpacity onPress={onBackToLogin} activeOpacity={0.75} style={s.backBtn}>
          <ArrowLeft size={16} color={C.gold} strokeWidth={2.3} />
          <Text style={s.backText}>{copy.backToLogin}</Text>
        </TouchableOpacity>

        <View style={s.brandRow}>
          <View style={s.brandLogoFrame}>
            <Image source={require('../../../assets/rcog_logo.png')} style={s.brandLogo} resizeMode="contain" />
          </View>
          <Text style={s.brandText}>CityFlow</Text>
        </View>

        <View style={s.titleBlock}>
          <Text style={s.title}>{sent ? copy.successTitle : copy.title}</Text>
          <Text style={s.subtitle}>{sent ? copy.successBody : copy.subtitle}</Text>
        </View>

        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          <View style={s.dividerDiamond} />
          <View style={s.dividerLine} />
        </View>

        {sent ? (
          <View style={s.successCard}>
            <CheckCircle size={28} color={C.green} strokeWidth={1.8} />
            <Text style={s.successText}>{email.trim().toLowerCase()}</Text>
          </View>
        ) : (
          <>
            <FieldLabel label={copy.emailAddress} />
            <View style={[s.fieldRow, focused && s.fieldFocused]}>
              <Mail size={15} color={focused ? C.gold : C.iconMuted} strokeWidth={2} />
              <TextInput
                style={s.textInput}
                placeholder={copy.emailPlaceholder}
                placeholderTextColor={C.placeholder}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>
          </>
        )}

        {message ? (
          <View style={s.messageBox}>
            <Text style={s.messageText}>{message}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={sent ? () => setSent(false) : handleSendReset}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={loading ? [C.btnDisabled, C.btnDisabled] : ['#7128CE', '#5A18A8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.btn}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={s.btnText}>{sent ? copy.sendAnother : copy.sendLink}</Text>
                <ArrowRight size={15} color="#fff" strokeWidth={2.5} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FieldLabel({ label }) {
  return <Text style={s.fieldLabel}>{label}</Text>;
}

function getResetErrorMessage(error) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'That email address does not look quite right. Please check it and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact CityFlow support.';
    case 'auth/too-many-requests':
      return 'Too many reset attempts. Please wait a moment, then try again.';
    case 'auth/network-request-failed':
      return 'Network connection problem. Please check your internet and try again.';
    default:
      return 'We could not send the reset email right now. Please try again in a moment.';
  }
}

const C = {
  bg: '#08011A',
  gold: '#C48D38',
  goldFaint: 'rgba(196,141,56,0.2)',
  purpleFaint: 'rgba(113,40,206,0.08)',
  purpleBorder: 'rgba(113,40,206,0.45)',
  text: '#EBE3D6',
  textMuted: 'rgba(235,227,214,0.45)',
  placeholder: 'rgba(235,227,214,0.28)',
  iconMuted: 'rgba(235,227,214,0.35)',
  fieldBg: 'rgba(255,255,255,0.04)',
  fieldBorder: 'rgba(255,255,255,0.08)',
  btnDisabled: 'rgba(113,40,206,0.35)',
  green: '#4A8A5A',
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 26, paddingTop: 52, paddingBottom: 48 },
  backBtn: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, marginBottom: 20 },
  backText: { color: C.gold, fontSize: 12.5, fontWeight: '700' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 },
  brandLogoFrame: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  brandLogo: { width: 50, height: 50 },
  brandText: { fontSize: 18, fontWeight: '700', color: C.text, letterSpacing: 3 },
  titleBlock: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '700', color: C.text, marginBottom: 5 },
  subtitle: { fontSize: 13, color: C.textMuted, lineHeight: 20 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.goldFaint },
  dividerDiamond: { width: 5, height: 5, backgroundColor: C.gold, opacity: 0.5, transform: [{ rotate: '45deg' }] },
  fieldLabel: { fontSize: 11, color: C.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.fieldBg, borderWidth: 1, borderColor: C.fieldBorder, borderRadius: 12, paddingHorizontal: 14, height: 50, marginBottom: 16 },
  fieldFocused: { borderColor: C.purpleBorder, backgroundColor: C.purpleFaint },
  textInput: { flex: 1, color: C.text, fontSize: 14 },
  successCard: { backgroundColor: 'rgba(74,138,90,0.1)', borderWidth: 1, borderColor: 'rgba(74,138,90,0.3)', borderRadius: 14, padding: 16, alignItems: 'center', gap: 10, marginBottom: 18 },
  successText: { color: C.text, fontSize: 13, fontWeight: '700' },
  messageBox: { backgroundColor: 'rgba(220,53,69,0.08)', borderWidth: 1, borderColor: 'rgba(220,53,69,0.35)', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 11, marginBottom: 16 },
  messageText: { color: '#F2A8A8', fontSize: 12, lineHeight: 18, fontWeight: '600' },
  btn: { borderRadius: 12, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },
});
