// src/features/events/EventCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, MapPin, Bell, Star } from 'lucide-react-native';
import { C } from '../../shared/constants/theme';

export default function EventCard({ event, isFollowed, reminderSettings, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['rgba(113,40,206,0.12)', 'rgba(10,2,24,0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{event.title}</Text>
          {isFollowed && <Star size={16} color={C.gold} fill={C.gold} />}
        </View>
        <View style={styles.details}>
          <Clock size={14} color={C.ts} />
          <Text style={styles.detailText}>{event.time}</Text>
        </View>
        <View style={styles.details}>
          <MapPin size={14} color={C.ts} />
          <Text style={styles.detailText}>{event.location}</Text>
        </View>
        {isFollowed && (
          <View style={styles.badge}>
            <Bell size={12} color={C.gold} />
            <Text style={styles.badgeText}>Following</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(113,40,206,0.3)',
    padding: 16,
    marginBottom: 12,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#EBE3D6', flex: 1 },
  details: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  detailText: { fontSize: 12, color: '#8C7DA0' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  badgeText: { fontSize: 10, color: C.gold, fontWeight: '500' },
});