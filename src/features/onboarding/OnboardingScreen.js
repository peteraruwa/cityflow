import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Car, Check, Navigation, Zap } from 'lucide-react-native';
import { usePrefs } from '../../shared/context/PrefsContext';
import { C, FONTS } from '../../shared/constants/theme';

const LANGS = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá' },
];

const COPY = {
  en: {
    welcome: 'Welcome to CityFlow',
    chooseLang: 'Choose your language',
    continueBtn: 'Continue',
    skip: 'Skip',
    next: 'Next',
    start: 'Get Started',
    slides: [
      { title: 'Navigate the City', body: 'Live maps, directions and guided tours across Redemption City.' },
      { title: 'Book CityRides', body: 'Shuttles and rides between camp zones in just a few taps.' },
      { title: 'Everything in One Place', body: 'Events, lost & found, emergency help and more — all in CityFlow.' },
    ],
  },
  fr: {
    welcome: 'Bienvenue sur CityFlow',
    chooseLang: 'Choisissez votre langue',
    continueBtn: 'Continuer',
    skip: 'Passer',
    next: 'Suivant',
    start: 'Commencer',
    slides: [
      { title: 'Naviguez dans la ville', body: 'Cartes en direct, itinéraires et visites guidées dans toute la ville.' },
      { title: 'Réservez des trajets', body: 'Navettes et trajets entre les zones du camp en quelques gestes.' },
      { title: 'Tout au même endroit', body: "Événements, objets trouvés, aide d'urgence et plus — tout dans CityFlow." },
    ],
  },
  yo: {
    welcome: 'Káàbọ̀ sí CityFlow',
    chooseLang: 'Yan èdè rẹ',
    continueBtn: 'Tẹ̀síwájú',
    skip: 'Fò kọjá',
    next: 'Tókàn',
    start: 'Bẹ̀rẹ̀',
    slides: [
      { title: 'Rin ìrìn àjò ìlú', body: 'Àwòrán ilẹ̀ alààyè, ìtọ́sọ́nà àti ìrìn àjò jákèjádò Ìlú Ìràpadà.' },
      { title: 'Gba ọkọ̀ CityRide', body: 'Ọkọ̀ àjòkò àti ìrìn-àjò láàrín àgbègbè àgọ́ pẹ̀lú ìtẹ̀ díẹ̀.' },
      { title: 'Ohun gbogbo ní ibì kan', body: 'Ìṣẹ̀lẹ̀, ohun tó sọnù, ìrànlọ́wọ́ pàjáwìrì àti bẹ́ẹ̀ bẹ́ẹ̀ lọ — nínú CityFlow.' },
    ],
  },
};

const VISUALS = [
  { Icon: Navigation, color: '#7128CE' },
  { Icon: Car, color: '#C48D38' },
  { Icon: Zap, color: '#2A7FAB' },
];

export default function OnboardingScreen({ onDone }) {
  const { language, setLanguage } = usePrefs();
  const hasPickedLanguage = useRef(false);
  const [lang, setLang] = useState('en');
  const [step, setStep] = useState(0);
  const t = COPY[lang] || COPY.en;

  useEffect(() => {
    if (!hasPickedLanguage.current && language !== 'en') {
      setLanguage('en');
    }
  }, [language]);

  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('cityflow-onboarding-fonts')) {
      const style = document.createElement('style');
      style.id = 'cityflow-onboarding-fonts';
      style.textContent = "@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Sora:wght@400;500;600;700;800&display=swap');";
      document.head.appendChild(style);
    }
  }, []);

  const pickLang = (code) => {
    hasPickedLanguage.current = true;
    setLang(code);
    setLanguage(code);
  };

  return (
    <View style={styles.root}>
      {step === 0 ? (
        <View style={styles.page}>
          <View style={styles.center}>
            <View style={styles.logoWrap}>
              <Image source={require('../../../assets/rcog_logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.welcome}>{t.welcome}</Text>
            <Text style={styles.sub}>{t.chooseLang}</Text>
            <View style={styles.langList}>
              {LANGS.map((item) => {
                const active = item.code === lang;
                return (
                  <TouchableOpacity
                    key={item.code}
                    style={[styles.langCard, active && styles.langActive]}
                    onPress={() => pickLang(item.code)}
                    activeOpacity={0.82}
                  >
                    <View style={[styles.langCode, active && styles.langCodeActive]}>
                      <Text style={[styles.langCodeText, active && styles.langCodeTextActive]}>{item.code.toUpperCase()}</Text>
                    </View>
                    <View style={styles.langCopy}>
                      <Text style={styles.langNative}>{item.native}</Text>
                      <Text style={styles.langName}>{item.name}</Text>
                    </View>
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active && <Check size={11} color="#fff" strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.footer}>
            <GradientButton label={t.continueBtn} onPress={() => setStep(1)} />
          </View>
        </View>
      ) : (
        <View style={styles.page}>
          <TouchableOpacity style={styles.skip} onPress={onDone} activeOpacity={0.7}>
            <Text style={styles.skipText}>{t.skip}</Text>
          </TouchableOpacity>
          <View style={styles.slide}>
            <View
              style={[styles.visual, visualStyle(VISUALS[step - 1].color)]}
            >
              {React.createElement(VISUALS[step - 1].Icon, {
                size: 46,
                color: VISUALS[step - 1].color,
                strokeWidth: 1.5,
              })}
            </View>
            <Text style={styles.slideTitle}>{t.slides[step - 1].title}</Text>
            <Text style={styles.slideBody}>{t.slides[step - 1].body}</Text>
          </View>
          <View style={styles.footer}>
            <View style={styles.dots}>
              {[1, 2, 3].map((i) => (
                <TouchableOpacity key={i} onPress={() => setStep(i)} style={[styles.dot, i === step && styles.dotActive]} />
              ))}
            </View>
            <GradientButton label={step < 3 ? t.next : t.start} onPress={() => (step < 3 ? setStep(step + 1) : onDone())} />
          </View>
        </View>
      )}
    </View>
  );
}

function GradientButton({ label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.86}>
      <LinearGradient colors={[C.purple, '#5A18A8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
        <Text style={styles.buttonText}>{label}</Text>
        <ArrowRight size={15} color="#fff" strokeWidth={2.5} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

function visualStyle(color) {
  return {
    backgroundColor: `${color}16`,
    borderColor: `${color}30`,
    shadowColor: color,
  };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, overflow: 'hidden', fontFamily: FONTS.regular },
  page: {
    flex: 1,
    paddingHorizontal: 26,
    position: 'relative',
  },
  footer: { paddingBottom: 34 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  logo: {
    width: 84,
    height: 84,
  },
  welcome: { fontFamily: FONTS.cinzel, fontSize: 24, fontWeight: '600', color: C.tp, letterSpacing: 1.44, textAlign: 'center', marginBottom: 6 },
  sub: { fontSize: 12.5, color: C.ts, marginBottom: 26 },
  langList: { width: '100%', gap: 11 },
  langCard: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, backgroundColor: C.surf, borderWidth: 1.5, borderColor: C.b },
  langActive: { backgroundColor: 'rgba(113,40,206,0.14)', borderColor: 'rgba(148,88,224,0.6)' },
  langCode: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surfHi, borderWidth: 1, borderColor: C.b },
  langCodeActive: { backgroundColor: 'rgba(148,88,224,0.22)', borderColor: 'rgba(148,88,224,0.45)' },
  langCodeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.88, color: C.ts },
  langCodeTextActive: { color: C.purpleL },
  langCopy: { flex: 1 },
  langNative: { fontSize: 14, fontWeight: '700', color: C.tp },
  langName: { fontSize: 10.5, color: C.ts, marginTop: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: C.tm, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: C.purpleL, backgroundColor: C.purpleL },
  skip: { alignSelf: 'flex-end', paddingTop: 16, paddingHorizontal: 2, paddingVertical: 4 },
  skipText: { fontSize: 12.5, color: C.ts, fontWeight: '500' },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  visual: {
    width: 110,
    height: 110,
    borderRadius: 34,
    borderWidth: 1,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 20 },
    elevation: 8,
  },
  slideTitle: { fontSize: 23, fontWeight: '700', color: C.tp, lineHeight: 29, marginBottom: 12, textAlign: 'center' },
  slideBody: { fontSize: 13, color: C.ts, lineHeight: 22, maxWidth: 280, textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 20 },
  dot: { width: 6, height: 6, borderRadius: 4, backgroundColor: C.tm },
  dotActive: { width: 22, backgroundColor: C.gold },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: 'rgb(100,30,190)',
    shadowOpacity: 0.35,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  buttonText: { fontFamily: FONTS.semiBold, fontSize: 14, fontWeight: '600', color: '#fff' },
});
