// src/features/quote-day/QuoteOfTheDay.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessageCircle } from 'lucide-react-native';
import { allQuotes } from '../../shared/data/quotes';

const STORAGE_KEY = '@daily_quote';

export default function QuoteOfTheDay() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    loadDailyQuote();
  }, []);

  const loadDailyQuote = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const today = new Date().toDateString();

      if (stored) {
        const { quote: savedQuote, date } = JSON.parse(stored);
        if (date === today) {
          setQuote(savedQuote);
          return;
        }
      }
      const randomIndex = Math.floor(Math.random() * allQuotes.length);
      const newQuote = allQuotes[randomIndex];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        quote: newQuote,
        date: today,
      }));
      setQuote(newQuote);
    } catch (error) {
      console.error('Failed to load daily quote', error);
      setQuote(allQuotes[0]);
    }
  };

  if (!quote) return null;

  return (
    <View style={s.wrapper}>
      {/* Title row */}
      <View style={s.titleRow}>
        <MessageCircle size={18} color="#C48D38" strokeWidth={1.8} />
        <Text style={s.titleText}>Quote of the Day</Text>
      </View>

      {/* Quote card with Open Heaven gradient */}
      <TouchableOpacity
        style={s.container}
        onPress={() => Alert.alert(quote.author, quote.text)}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['rgba(196,141,56,0.12)', 'rgba(113,40,206,0.08)']}  // ← Open Heaven gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.gradient}
        >
          <View style={s.quoteIconContainer}>
            <Text style={s.quoteIcon}>“</Text>
          </View>
          <Text style={s.quoteText}>{quote.text}</Text>
          <Text style={s.quoteAuthor}>— {quote.author}</Text>
          <View style={s.shineEffect} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EBE3D6',
    letterSpacing: 0.5,
  },
  container: {},
  gradient: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(196,141,56,0.3)',   // slightly adjusted to match new gradient
    padding: 20,
    paddingTop: 28,
    overflow: 'hidden',
  },
  quoteIconContainer: {
    position: 'absolute',
    top: 8,
    left: 16,
    opacity: 0.25,
  },
  quoteIcon: {
    fontSize: 64,
    fontFamily: 'Georgia',
    color: '#7128CE',
  },
  quoteText: {
    fontSize: 15,
    color: '#EBE3D6',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 14,
    paddingLeft: 8,
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#C48D38',
    textAlign: 'right',
    fontWeight: '600',
  },
  shineEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});