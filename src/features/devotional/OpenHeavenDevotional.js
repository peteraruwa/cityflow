// src/features/devotional/OpenHeavenDevotional.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen } from 'lucide-react-native';
import { C } from '../../shared/constants/theme';

// You can move this data to a separate file if desired
const TODAYS_OPEN_HEAVEN = {
  date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  title: "The Power of Persistent Prayer",
  scripture: "Luke 18:1-8",
  link: "https://openheaven.com/daily-devotional/today",
};

export default function OpenHeavenDevotional() {
  return (
    <TouchableOpacity
      style={s.container}
      onPress={() => Linking.openURL(TODAYS_OPEN_HEAVEN.link)}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={['rgba(113,40,206,0.18)', 'rgba(90,18,165,0.08)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.gradient}
      >
        <View style={s.header}>
          <BookOpen size={20} color={C.gold} strokeWidth={1.8} />
          <Text style={s.date}>{TODAYS_OPEN_HEAVEN.date}</Text>
        </View>
        <Text style={s.title}>{TODAYS_OPEN_HEAVEN.title}</Text>
        <Text style={s.scripture}>{TODAYS_OPEN_HEAVEN.scripture}</Text>
        <View style={s.link}>
          <Text style={s.linkText}>Read full devotional →</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  gradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(113,40,206,0.4)',   // ← Matching purple border
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  date: {
    fontSize: 10,
    color: '#8C7DA0',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EBE3D6',
    marginBottom: 8,
    lineHeight: 22,
  },
  scripture: {
    fontSize: 12,
    color: '#C48D38',
    marginBottom: 12,
    fontWeight: '500',
  },
  link: {
    marginTop: 4,
  },
  linkText: {
    fontSize: 11,
    color: '#7128CE',
    fontWeight: '600',
  },
});