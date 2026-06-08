// src/features/picture-day/PictureOfTheDay.js

import React, { useRef, useEffect } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getPictureOfTheDay } from './data/gallery';

export default function PictureOfTheDay({ navigation }) {
  const { picture, index } = getPictureOfTheDay();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 550, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, delay: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => navigation.navigate('PictureGallery', { highlightIndex: index })}
        style={s.card}
      >
        <Image source={picture.file} style={s.image} resizeMode="cover" />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.78)']}
          style={s.gradient}
        />

        <View style={[s.catBadge, { backgroundColor: picture.categoryColor }]}>
          <Text style={s.catText}>{picture.category.toUpperCase()}</Text>
        </View>

        <View style={s.textBlock}>
          <Text style={s.title} numberOfLines={2}>{picture.title}</Text>
          <Text style={s.date}>{picture.date}</Text>
          <Text style={s.caption} numberOfLines={2}>{picture.caption}</Text>
        </View>

        <View style={s.pill}>
          <Text style={s.pillText}>Read the story →</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  // No marginHorizontal — HomeScreen's s.section already has paddingHorizontal: 18
  card: {
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  catBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  catText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  textBlock: {
    position: 'absolute',
    bottom: 44,
    left: 16,
    right: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 3,
  },
  date: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  caption: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    lineHeight: 18,
  },
  pill: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  pillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});