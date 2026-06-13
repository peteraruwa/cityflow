// src/features/auth/SignUpScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Modal, Platform, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, updateProfile } from 'firebase/auth';
import { collection, doc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from '../../shared/config/firebase';

export default function SignUpScreen({ onSignUp, onBackToLogin }) {
  const [firstName, setFirstName]         = useState('');
  const [lastName, setLastName]           = useState('');
  const [email, setEmail]                 = useState('');
  const [dob, setDob]                     = useState('');
  const [pass, setPass]                   = useState('');
  const [confirmPass, setConfirmPass]     = useState('');
  const [showPw, setShowPw]               = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [dobPickerOpen, setDobPickerOpen] = useState(false);
  const [dobPickerMonth, setDobPickerMonth] = useState(() => new Date(1994, new Date().getMonth(), 1));
  const [focused, setFocused]             = useState(null);
  const [loading, setLoading]             = useState(false);
  const [message, setMessage]             = useState('');

  async function handleSignUp() {
    setMessage('');
    const cleanFirstName = firstName.trim() || 'CityFlow';
    const cleanLastName = lastName.trim() || 'Guest';
    const cleanEmail = email.trim().toLowerCase();
    const cleanDob = dob.trim();
    const displayName = `${cleanFirstName} ${cleanLastName}`;

    if (!cleanEmail) {
      setMessage('Please enter an email address to create your account.');
      return;
    }
    if (!isValidDob(cleanDob)) {
      setMessage('Please enter your date of birth in YYYY-MM-DD format.');
      return;
    }
    if (!pass || pass.length < 6) {
      setMessage('Please choose a password with at least 6 characters.');
      return;
    }
    if (pass !== confirmPass) {
      setMessage('Please make sure both password fields match.');
      return;
    }

    setLoading(true);
    try {
      const [methods, existingUsers] = await Promise.all([
        fetchSignInMethodsForEmail(auth, cleanEmail),
        getDocs(query(collection(db, 'users'), where('email', '==', cleanEmail), limit(1))),
      ]);

      if (methods.length > 0 || !existingUsers.empty) {
        setMessage('This email is already used. Please sign in or use a different email address.');
        return;
      }

      const credential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      await updateProfile(credential.user, { displayName });
      await setDoc(doc(db, 'users', credential.user.uid), {
        uid: credential.user.uid,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        displayName,
        email: cleanEmail,
        dob: cleanDob,
        dateOfBirth: cleanDob,
        createdAt: new Date().toISOString(),
      });
      onSignUp({
        uid: credential.user.uid,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        displayName,
        email: cleanEmail,
        dob: cleanDob,
        dateOfBirth: cleanDob,
      });
    } catch (error) {
      console.warn('Firebase sign-up failed:', error?.code || error?.message);
      setMessage(getSignUpErrorMessage(error));
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

        {/* Date of birth */}
        <FieldLabel label="Date of Birth" />
        <View style={[s.fieldRow, focused === 'dob' && s.fieldFocused]}>
          <TouchableOpacity onPress={() => openDobPicker(dob, setDobPickerMonth, setDobPickerOpen)} hitSlop={8}>
            <CalendarDays size={15} color={focused === 'dob' ? C.gold : C.iconMuted} strokeWidth={2} />
          </TouchableOpacity>
          <TextInput
            style={s.textInput}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={C.placeholder}
            value={dob}
            onChangeText={setDob}
            onFocus={() => setFocused('dob')}
            onBlur={() => setFocused(null)}
            keyboardType="numbers-and-punctuation"
            autoComplete="birthdate-full"
          />
          <TouchableOpacity onPress={() => openDobPicker(dob, setDobPickerMonth, setDobPickerOpen)} hitSlop={8}>
            <Text style={s.datePickText}>Pick</Text>
          </TouchableOpacity>
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

        {message ? (
          <View style={s.messageBox}>
            <Text style={s.messageText}>{message}</Text>
          </View>
        ) : null}

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

      <DobPickerModal
        visible={dobPickerOpen}
        month={dobPickerMonth}
        onChangeMonth={setDobPickerMonth}
        onClose={() => setDobPickerOpen(false)}
        onSelect={(value) => {
          setDob(value);
          setDobPickerOpen(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

function FieldLabel({ label }) {
  return <Text style={s.fieldLabel}>{label}</Text>;
}

function isValidDob(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const today = new Date();
  return (
    date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
    && date.getTime() <= Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
}

function openDobPicker(value, setMonth, setOpen) {
  const parsed = parseDob(value);
  const fallback = new Date(1994, new Date().getMonth(), 1);
  setMonth(parsed ? new Date(parsed.getFullYear(), parsed.getMonth(), 1) : fallback);
  setOpen(true);
}

function parseDob(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || '').trim());
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function formatYmd(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function monthTitle(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getCalendarDays(month) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function DobPickerModal({ visible, month, onChangeMonth, onClose, onSelect }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = getCalendarDays(month);

  function moveMonth(delta) {
    onChangeMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  }

  function moveYear(delta) {
    onChangeMonth(new Date(month.getFullYear() + delta, month.getMonth(), 1));
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.modalBackdrop} onPress={onClose}>
        <Pressable style={s.calendarSheet}>
          <View style={s.calendarTop}>
            <View>
              <Text style={s.calendarTitle}>Select date of birth</Text>
              <Text style={s.calendarSub}>Choose a past date</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.calendarClose} hitSlop={8}>
              <X size={16} color={C.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={s.calendarNav}>
            <TouchableOpacity onPress={() => moveYear(-1)} style={s.calendarNavBtn}>
              <Text style={s.calendarNavText}>-Y</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => moveMonth(-1)} style={s.calendarNavBtn}>
              <ChevronLeft size={15} color={C.gold} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={s.calendarMonth}>{monthTitle(month)}</Text>
            <TouchableOpacity onPress={() => moveMonth(1)} style={s.calendarNavBtn}>
              <ChevronRight size={15} color={C.gold} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => moveYear(1)} style={s.calendarNavBtn}>
              <Text style={s.calendarNavText}>+Y</Text>
            </TouchableOpacity>
          </View>

          <View style={s.weekRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={`${day}-${index}`} style={s.weekText}>{day}</Text>
            ))}
          </View>
          <View style={s.dayGrid}>
            {days.map((date) => {
              const inMonth = date.getMonth() === month.getMonth();
              const disabled = date.getTime() > today.getTime();
              return (
                <TouchableOpacity
                  key={formatYmd(date)}
                  disabled={disabled}
                  onPress={() => onSelect(formatYmd(date))}
                  style={[s.dayCell, !inMonth && s.dayCellMuted, disabled && s.dayCellDisabled]}
                  activeOpacity={0.75}
                >
                  <Text style={[s.dayText, !inMonth && s.dayTextMuted, disabled && s.dayTextDisabled]}>{date.getDate()}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function getSignUpErrorMessage(error) {
  switch (error?.code) {
    case 'auth/email-already-in-use':
      return 'This email is already used. Please sign in or use a different email address.';
    case 'auth/invalid-email':
      return 'That email address does not look quite right. Please check it and try again.';
    case 'auth/weak-password':
      return 'Please choose a stronger password with at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network connection problem. Please check your internet and try again.';
    case 'permission-denied':
      return 'We could not confirm that email right now. Please try again in a moment.';
    default:
      return 'We could not create your account right now. Please check your details and try again.';
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
  datePickText: { color: C.gold, fontSize: 12, fontWeight: '800' },

  /* Error hint */
  errorHint: {
    fontSize: 11,
    color: '#DC3545',
    marginTop: -10,
    marginBottom: 14,
    marginLeft: 2,
  },

  messageBox: {
    backgroundColor: 'rgba(220,53,69,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(220,53,69,0.35)',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 14,
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

  /* Switch */
  switchRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  switchText: { fontSize: 13, color: C.textMuted },
  switchLink: { fontSize: 13, color: C.gold, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(2,0,8,0.7)', justifyContent: 'flex-end' },
  calendarSheet: { backgroundColor: '#100720', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderBottomWidth: 0, borderColor: 'rgba(255,255,255,0.1)', padding: 18, paddingBottom: 28 },
  calendarTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  calendarTitle: { color: C.text, fontSize: 17, fontWeight: '800' },
  calendarSub: { color: C.textMuted, fontSize: 11.5, marginTop: 3 },
  calendarClose: { width: 34, height: 34, borderRadius: 12, backgroundColor: C.fieldBg, borderWidth: 1, borderColor: C.fieldBorder, alignItems: 'center', justifyContent: 'center' },
  calendarNav: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 13 },
  calendarNavBtn: { width: 34, height: 34, borderRadius: 11, backgroundColor: 'rgba(196,141,56,0.1)', borderWidth: 1, borderColor: 'rgba(196,141,56,0.24)', alignItems: 'center', justifyContent: 'center' },
  calendarNavText: { color: C.gold, fontSize: 10.5, fontWeight: '900' },
  calendarMonth: { flex: 1, textAlign: 'center', color: C.text, fontSize: 14, fontWeight: '800' },
  weekRow: { flexDirection: 'row', marginBottom: 7 },
  weekText: { flex: 1, textAlign: 'center', color: C.textMuted, fontSize: 10, fontWeight: '800' },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: `${100 / 7}%`, aspectRatio: 1.12, alignItems: 'center', justifyContent: 'center', borderRadius: 11 },
  dayCellMuted: { opacity: 0.42 },
  dayCellDisabled: { opacity: 0.2 },
  dayText: { color: C.text, fontSize: 13, fontWeight: '700' },
  dayTextMuted: { color: C.textMuted },
  dayTextDisabled: { color: C.textMuted },
});
