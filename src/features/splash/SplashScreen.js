import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Image } from 'react-native';

export default function SplashScreen({ onDone }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandScale = useRef(new Animated.Value(0.88)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;
  const dot1 = useRef(new Animated.Value(0.2)).current;
  const dot2 = useRef(new Animated.Value(0.2)).current;
  const dot3 = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8, delay: 300 }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true, delay: 300 }),
    ]).start();

    Animated.parallel([
      Animated.spring(brandScale, { toValue: 1, useNativeDriver: true, tension: 55, friction: 8, delay: 700 }),
      Animated.timing(brandOpacity, { toValue: 1, duration: 700, useNativeDriver: true, delay: 700 }),
    ]).start();

    const dotLoop = (ref, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(ref, { toValue: 1, duration: 600, useNativeDriver: true, delay }),
          Animated.timing(ref, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        ])
      );
    dotLoop(dot1, 500).start();
    dotLoop(dot2, 700).start();
    dotLoop(dot3, 900).start();

    const t = setTimeout(() => {
      Animated.timing(fadeOut, {
        toValue: 0, duration: 600, useNativeDriver: true, delay: 1800,
      }).start(() => onDone());
    }, 400);

    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View style={[s.wrap, { opacity: fadeOut }]}>

      {/* Corner brackets */}
      <View style={[s.corner, s.cornerTL]} />
      <View style={[s.corner, s.cornerTR]} />
      <View style={[s.corner, s.cornerBL]} />
      <View style={[s.corner, s.cornerBR]} />

      {/* ── TOP: RCOG logo ── */}
      <Animated.View style={[s.logoSection, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={s.logoFrame}>
          <Image
            source={require('../../../assets/rcog_splash.png')}
            style={s.logoImage}
            resizeMode="contain"
          />
        </View>

      </Animated.View>

      {/* Spacer — pushes glow blob toward bottom */}
      <View style={{ flex: 1 }} />

      {/* ── BOTTOM: Glow blob as layout container ── */}
      <View style={s.glowBg}>
        <Animated.View style={[s.brandBlock, { opacity: brandOpacity, transform: [{ scale: brandScale }] }]}>

          <View style={s.ruleShort} />

          <Text style={s.brand}>CityFlow</Text>

          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <View style={s.diamond} />
            <View style={s.dividerLine} />
          </View>

          <Text style={s.tagline}>Redemption City of God</Text>

          <View style={[s.ruleShort, { marginTop: 20, marginBottom: 28 }]} />

          {/* Loading dots */}
          <View style={s.dotsWrap}>
            {[dot1, dot2, dot3].map((d, i) => (
              <Animated.View key={i} style={[s.dot, { opacity: d }]} />
            ))}
          </View>

        </Animated.View>
      </View>

    </Animated.View>
  );
}

const GOLD = '#C48D38';
const GOLD_50 = 'rgba(196,141,56,0.5)';
const GOLD_40 = 'rgba(196,141,56,0.4)';
const GOLD_06 = 'rgba(196,141,56,0.06)';

const s = StyleSheet.create({

  wrap: {
    flex: 1,
    backgroundColor: '#08011A',
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 44,
  },

  /* Corner brackets */
  corner: { position: 'absolute', width: 30, height: 30 },
  cornerTL: { top: 22, left: 22, borderTopWidth: 1.5, borderLeftWidth: 1.5, borderColor: GOLD_50, borderTopLeftRadius: 4 },
  cornerTR: { top: 22, right: 22, borderTopWidth: 1.5, borderRightWidth: 1.5, borderColor: GOLD_50, borderTopRightRadius: 4 },
  cornerBL: { bottom: 22, left: 22, borderBottomWidth: 1.5, borderLeftWidth: 1.5, borderColor: GOLD_50, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 22, right: 22, borderBottomWidth: 1.5, borderRightWidth: 1.5, borderColor: GOLD_50, borderBottomRightRadius: 4 },

  /* RCOG logo */
  logoSection: {
    alignItems: 'center',
  },
  logoFrame: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: GOLD_40,
    backgroundColor: GOLD_06,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 190,
    height: 190,
  },

  /* Glow blob — now a layout container, not absolute */
  glowBg: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(100,35,200,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 44,
  },

  /* CityFlow brand block */
  brandBlock: {
    alignItems: 'center',
  },
  ruleShort: {
    width: 40,
    height: 1,
    backgroundColor: GOLD,
    opacity: 0.5,
    marginBottom: 20,
  },
  brand: {
    fontFamily: 'serif',
    fontSize: 44,
    fontWeight: '400',
    color: '#EBE3D6',
    letterSpacing: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dividerLine: {
    width: 48,
    height: 1,
    backgroundColor: GOLD,
    opacity: 0.5,
  },
  diamond: {
    width: 6,
    height: 6,
    backgroundColor: GOLD,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
  },
  tagline: {
    fontSize: 10,
    color: GOLD,
    letterSpacing: 5,
    fontWeight: '400',
    textTransform: 'uppercase',
    opacity: 0.85,
    textAlign: 'center',
  },

  /* Loading dots */
  dotsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: GOLD,
  },
});