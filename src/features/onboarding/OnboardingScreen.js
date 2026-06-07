// src/features/onboarding/OnboardingScreen.js
import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions,
  Platform, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePrefs } from '../../shared/context/PrefsContext';
import { C } from '../../shared/constants/theme';
import { LANGUAGES } from '../../shared/constants/languages';
import { ONBOARDING_SLIDES } from '../../shared/data/onboardingSlides';

const { width: SCREEN_W } = Dimensions.get('window');

export default function OnboardingScreen({ onDone }) {
  const { setLanguage } = usePrefs();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedLang, setSelectedLang] = useState('en');
  const flatRef = useRef(null);

  const goToSlide = (index) => {
    flatRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex < ONBOARDING_SLIDES.length - 1) {
      goToSlide(activeIndex + 1);
    }
  };

  const handleSkip = () => {
    goToSlide(ONBOARDING_SLIDES.length - 1);
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.multiSet([
        ['onboarding_done', 'true'],
        ['app_language', selectedLang],
      ]);
    } catch (error) {
      console.warn(error);
    }
    setLanguage(selectedLang);
    onDone();
  };

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  };
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 55 };
  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const isLast = activeIndex === ONBOARDING_SLIDES.length - 1;

  const renderSlide = ({ item }) => {
    const { title, description, imageUrl, Icon, iconColor, gradientColors, emoji, id } = item;
    const isLanguageSlide = id === 'language';

    return (
      <View style={[styles.slide, { width: SCREEN_W }]}>
        <Image source={{ uri: imageUrl }} style={styles.slideImage} resizeMode="cover" />
        <LinearGradient colors={['transparent', 'rgba(8,1,26,0.92)']} style={styles.imageOverlay} />

        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.illustrationCircle}
        >
          <Text style={styles.illustrationEmoji}>{emoji}</Text>
          <Icon size={38} color={iconColor} strokeWidth={1.5} style={styles.illustrationIcon} />
        </LinearGradient>

        <Text style={styles.slideTitle}>{title}</Text>
        <Text style={styles.slideDesc}>{description}</Text>

        {isLanguageSlide && (
          <View style={styles.langGrid}>
            {LANGUAGES.map((lang) => {
              const selected = selectedLang === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.langCard, selected && styles.langCardActive]}
                  onPress={() => setSelectedLang(lang.code)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.langFlag}>{lang.flag}</Text>
                  <Text style={[styles.langName, selected && styles.langNameActive]}>
                    {lang.name}
                  </Text>
                  <Text style={[styles.langNative, selected && styles.langNativeActive]}>
                    {lang.native}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <FlatList
        ref={flatRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        getItemLayout={(_, index) => ({ length: SCREEN_W, offset: SCREEN_W * index, index })}
      />

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => goToSlide(i)}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        {isLast ? (
          <TouchableOpacity onPress={handleGetStarted} activeOpacity={0.88}>
            <LinearGradient colors={[C.purple, '#5A18A8']} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.navRow}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} activeOpacity={0.88}>
              <LinearGradient colors={[C.purple, '#5A18A8']} style={styles.nextBtn}>
                <Text style={styles.nextBtnText}>Next</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  slide: { flex: 1, alignItems: 'center', paddingHorizontal: 30, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  slideImage: { position: 'absolute', width: SCREEN_W, height: '100%' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  illustrationCircle: {
    width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center',
    marginBottom: 30, marginTop: 20, backgroundColor: 'rgba(8,1,26,0.7)',
  },
  illustrationEmoji: { fontSize: 56, lineHeight: 72 },
  illustrationIcon: { position: 'absolute', bottom: 14, right: 14, opacity: 0.85 },
  slideTitle: { fontSize: 28, fontWeight: '700', color: C.tp, textAlign: 'center', marginBottom: 12 },
  slideDesc: { fontSize: 15, color: C.ts, textAlign: 'center', lineHeight: 23, maxWidth: 320 },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 28 },
  langCard: {
    width: (SCREEN_W - 60 - 20) / 3, alignItems: 'center', paddingVertical: 14,
    backgroundColor: C.b, borderWidth: 1, borderColor: C.b, borderRadius: 16,
  },
  langCardActive: { backgroundColor: 'rgba(113,40,206,0.18)', borderColor: C.purpleL },
  langFlag: { fontSize: 26, marginBottom: 6 },
  langName: { fontSize: 12, fontWeight: '600', color: C.ts, textAlign: 'center' },
  langNameActive: { color: C.tp },
  langNative: { fontSize: 10, color: C.tm, textAlign: 'center', marginTop: 2 },
  langNativeActive: { color: C.purpleL },
  footer: { paddingHorizontal: 28, paddingBottom: Platform.OS === 'ios' ? 44 : 28, paddingTop: 16 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.tm },
  dotActive: { width: 22, backgroundColor: C.purple },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skipBtn: { paddingVertical: 14, paddingHorizontal: 4 },
  skipText: { fontSize: 15, color: C.ts, fontWeight: '500' },
  nextBtn: { paddingVertical: 14, paddingHorizontal: 36, borderRadius: 14 },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  primaryBtn: { width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});