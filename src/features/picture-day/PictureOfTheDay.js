// src/features/picture-day/PictureOfTheDay.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@daily_picture';
const DEFAULT_PICTURE = {
  url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&h=400&fit=crop',
  title: 'Redemption City Worship Center',
  photographer: 'CityFlow Media',
};

export default function PictureOfTheDay({ onPressGallery }) {
  const [picture, setPicture] = useState(DEFAULT_PICTURE);

  useEffect(() => {
    loadDailyPicture();
  }, []);

  const loadDailyPicture = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const today = new Date().toDateString();
      if (stored) {
        const { picture: savedPic, date } = JSON.parse(stored);
        if (date === today) {
          setPicture(savedPic);
          return;
        }
      }
      // For production, replace with API fetch
      const newPicture = DEFAULT_PICTURE;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ picture: newPicture, date: today }));
      setPicture(newPicture);
    } catch (error) {
      console.error('Picture loading error', error);
    }
  };

  return (
    <View style={s.container}>
      <TouchableOpacity style={s.card} onPress={onPressGallery} activeOpacity={0.92}>
        <Image source={{ uri: picture.url }} style={s.image} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={s.overlay}>
          <Text style={s.title}>{picture.title}</Text>
          <Text style={s.photographer}>📷 {picture.photographer}</Text>
        </LinearGradient>
        <View style={s.glowBorder} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginTop: 8, marginBottom: 12 },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 190,
    textShadow: '0px 1px 2px rgba(0,0,0,0.5)',
    elevation: 6,
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18 },
  title: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  photographer: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  glowBorder: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(113,40,206,0.3)' },
});