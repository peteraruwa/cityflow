import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

const C = {
  bg: '#08011A',
  gold: '#C48D38',
  tp: '#EBE3D6',
};

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in');
  const dots = useMemo(() => [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)], []);
  const fade = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const heldOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('cityflow-splash-fonts')) {
      const style = document.createElement('style');
      style.id = 'cityflow-splash-fonts';
      style.textContent = "@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&display=swap');";
      document.head.appendChild(style);
    }

    const t1 = setTimeout(() => {
      setPhase('hold');
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 14,
          bounciness: 8,
        }),
        Animated.timing(heldOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    const t2 = setTimeout(() => {
      setPhase('out');
      Animated.timing(fade, {
        toValue: 0,
        duration: 550,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 2100);

    const t3 = setTimeout(() => onDone(), 2700);

    dots.forEach((dot, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, {
            toValue: 1,
            duration: 480,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 720,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [dots, fade, heldOpacity, onDone, scale]);

  const held = phase !== 'in';

  return (
    <View style={styles.stage}>
      <View style={styles.phoneShell}>
        <View style={styles.notchWrap}>
          <View style={styles.notch} />
        </View>
        <Animated.View style={[styles.splash, { opacity: fade }]}>
          <View style={styles.radialGlow}>
            <Svg width="100%" height="100%" viewBox="0 0 390 776" preserveAspectRatio="none">
              <Defs>
                <RadialGradient id="splashGlow" cx="50%" cy="55%" r="60%">
                  <Stop offset="0%" stopColor="rgb(100,35,200)" stopOpacity="0.26" />
                  <Stop offset="70%" stopColor="rgb(100,35,200)" stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Rect x="0" y="0" width="390" height="776" fill="url(#splashGlow)" />
            </Svg>
          </View>
          <Animated.View style={[styles.rule, { marginBottom: 22, opacity: heldOpacity }]}>
            <GoldRule />
          </Animated.View>
          <Animated.View style={[styles.brandBlock, { transform: [{ scale }] }]}>
            <Image
              source={require('../../../assets/rcog_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brand}>CityFlow</Text>
            <View style={styles.brandRule}>
              <BrandGoldRule />
            </View>
            <Animated.Text style={[styles.tagline, { opacity: heldOpacity }]}>Redemption City</Animated.Text>
          </Animated.View>
          <Animated.View style={[styles.rule, { marginTop: 22, opacity: heldOpacity }]}>
            <GoldRule />
          </Animated.View>
          <Animated.View style={[styles.dots, { opacity: heldOpacity }]}>
            {dots.map((dot, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    opacity: dot.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 1],
                    }),
                    transform: [
                      {
                        scale: dot.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1.15],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

function GoldRule() {
  return (
    <Svg width="48" height="1" viewBox="0 0 48 1" preserveAspectRatio="none">
      <Defs>
        <SvgLinearGradient id="ruleGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={C.gold} stopOpacity="0" />
          <Stop offset="50%" stopColor={C.gold} stopOpacity="1" />
          <Stop offset="100%" stopColor={C.gold} stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>
      <Rect x="0" y="0" width="48" height="1" fill="url(#ruleGold)" />
    </Svg>
  );
}

function BrandGoldRule() {
  return (
    <Svg width="100%" height="1" viewBox="0 0 218 1" preserveAspectRatio="none">
      <Defs>
        <SvgLinearGradient id="brandRuleGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={C.gold} stopOpacity="0" />
          <Stop offset="40%" stopColor={C.gold} stopOpacity="1" />
          <Stop offset="100%" stopColor={C.gold} stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>
      <Rect x="0" y="0" width="218" height="1" fill="url(#brandRuleGold)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: '#07010F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  phoneShell: {
    width: 390,
    height: 844,
    maxWidth: '100%',
    backgroundColor: C.bg,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.95,
    shadowRadius: 80,
    shadowOffset: { width: 0, height: 80 },
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  notchWrap: {
    alignItems: 'center',
    paddingTop: 14,
    flexShrink: 0,
  },
  notch: {
    width: 126,
    height: 34,
    backgroundColor: '#000',
    borderRadius: 20,
  },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  radialGlow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  rule: {
    width: 48,
    height: 1,
  },
  brandBlock: {
    alignItems: 'center',
  },
  logo: {
    width: 108,
    height: 108,
    borderRadius: 54,
    marginBottom: 22,
    shadowColor: 'rgb(180,140,220)',
    shadowOpacity: 0.4,
    shadowRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  brand: {
    fontFamily: 'Cinzel, serif',
    fontSize: 38,
    fontWeight: '600',
    color: C.tp,
    letterSpacing: 3.8,
    textShadowColor: 'rgba(180,140,220,0.25)',
    textShadowRadius: 40,
  },
  brandRule: {
    height: 1,
    alignSelf: 'stretch',
    marginTop: 10,
  },
  tagline: {
    fontSize: 11,
    color: C.gold,
    letterSpacing: 3.3,
    fontWeight: '500',
    marginTop: 10,
    textTransform: 'uppercase',
  },
  dots: {
    position: 'absolute',
    bottom: 52,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: C.gold,
  },
});
