// src/features/picture-day/screens/PictureDetailScreen.js

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HeaderBackButton } from '@react-navigation/elements';
import { GALLERY, getPictureSource } from '../data/gallery';

const { height } = Dimensions.get('window');
const HERO_H = height * 0.50;

export default function PictureDetailScreen({ navigation, route }) {
  const { pictureId, picture: routePicture } = route.params ?? {};
  const picture = routePicture || GALLERY.find(g => g.id === pictureId) || GALLERY[0];

  const imageFade    = useRef(new Animated.Value(0)).current;
  const contentFade  = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(36)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(imageFade,    { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(contentFade,  { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(contentSlide, { toValue: 0, duration: 360, useNativeDriver: true }),
      ]),
    ]).start();
  }, [pictureId]);

  const paragraphs = String(picture.story || picture.caption || '').split('\n\n').filter(Boolean);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* Hero image */}
        <View style={s.heroWrap}>
          <Animated.Image
            source={getPictureSource(picture)}
            style={[s.heroImage, { opacity: imageFade }]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(14,14,14,0.85)']}
            style={StyleSheet.absoluteFill}
          />

          {/* Native back button */}
          <View style={s.backWrap}>
            <HeaderBackButton
              onPress={() => navigation.goBack()}
              tintColor="#fff"
              labelVisible={false}
            />
          </View>

          {/* Category badge */}
          <Animated.View style={[s.catBadge, { backgroundColor: picture.categoryColor, opacity: imageFade }]}>
            <Text style={s.catText}>{picture.category.toUpperCase()}</Text>
          </Animated.View>
        </View>

        {/* Content */}
        <Animated.View style={[s.content, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
          <Text style={s.date}>{picture.date}</Text>
          <Text style={s.title}>{picture.title}</Text>
          <Text style={s.caption}>{picture.caption}</Text>

          {/* Divider */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerLabel}>THE STORY</Text>
            <View style={s.dividerLine} />
          </View>

          {paragraphs.map((para, i) => (
            <Text key={i} style={s.story}>{para}</Text>
          ))}

          <View style={{ height: 60 }} />
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0E0E0E' },

  // ── Hero ─────────────────────────────────────────────────────
  heroWrap:  { height: HERO_H },
  heroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },

  // Native back button sits in the safe zone
  backWrap: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 28,
    left: 4, // HeaderBackButton has its own internal padding
  },

  catBadge: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 36,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  catText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 1.8 },

  // ── Content ──────────────────────────────────────────────────
  content: {
    backgroundColor: '#0E0E0E',
    marginTop: -24,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 28,
  },
  date: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 33,
    marginBottom: 14,
  },
  caption: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 28,
  },

  // ── Divider ──────────────────────────────────────────────────
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine:  { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.14)' },
  dividerLabel: {
    color: 'rgba(255,255,255,0.28)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5,
    marginHorizontal: 12,
  },

  // ── Story ─────────────────────────────────────────────────────
  story: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    lineHeight: 25,
    marginBottom: 20,
    letterSpacing: 0.15,
  },
});
