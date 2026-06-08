// src/features/find-a-church/FindAChurchSection.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Church, MapPin, Search } from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import SectionHeader from '../../shared/components/SectionHeader';
import { PARISHES } from './data/parishes';

const PREVIEW = PARISHES.slice(0, 4);

export default function FindAChurchSection({ navigation }) {
  return (
    <View style={s.section}>
      <SectionHeader
        title="Find a Church"
        action="View All"
        onAction={() => navigation.navigate('FindAChurch')}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('FindAChurch')}
        activeOpacity={0.85}
        style={{ marginTop: 12 }}
      >
        <LinearGradient
          colors={['rgba(107,53,192,0.22)', 'rgba(10,2,24,1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.card}
        >
          <View style={s.cardHeader}>
            <View style={s.iconWrap}>
              <Church size={17} color="#8B5CF6" strokeWidth={1.8} />
            </View>
            <View style={s.cardHeaderText}>
              <Text style={s.cardTitle}>Parish Directory</Text>
              <Text style={s.cardSub}>{PARISHES.length} parishes · Search by name or zone</Text>
            </View>
            <View style={s.searchPill}>
              <Search size={11} color="rgba(235,227,214,0.5)" strokeWidth={2} />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.chipsScroll}
            pointerEvents="none"
          >
            {PREVIEW.map((parish) => (
              <View
                key={parish.id}
                style={[s.chip, { backgroundColor: `${parish.color}14`, borderColor: `${parish.color}28` }]}
              >
                <View style={[s.chipDot, { backgroundColor: parish.color }]} />
                <Text style={s.chipText} numberOfLines={1}>{parish.name}</Text>
              </View>
            ))}
            <View style={[s.chip, { backgroundColor: C.surfHi, borderColor: C.b }]}>
              <Text style={s.chipMore}>+{PARISHES.length - PREVIEW.length} more</Text>
            </View>
          </ScrollView>

          <View style={s.zoneRow}>
            <MapPin size={10} color="rgba(196,141,56,0.6)" strokeWidth={2} style={{ marginRight: 4 }} />
            <Text style={s.zoneText}>Covering all zones · Redemption City of God</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    paddingHorizontal: 18,  // ← matches HomeScreen s.section; aligns SectionHeader + card
    marginBottom: 8,
  },

  card: {
    // no marginHorizontal — section padding handles it
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(107,53,192,0.25)',
    paddingTop: 16,
    paddingBottom: 14,
    overflow: 'hidden',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 11,
    marginBottom: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(139,92,246,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EBE3D6',
    letterSpacing: 0.2,
  },
  cardSub: {
    fontSize: 11,
    color: 'rgba(235,227,214,0.45)',
    marginTop: 2,
  },
  searchPill: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipsScroll: {
    paddingLeft: 16,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    borderWidth: 1,
    marginRight: 7,
  },
  chipDot: { width: 5, height: 5, borderRadius: 3 },
  chipText: {
    fontSize: 11,
    color: 'rgba(235,227,214,0.75)',
    fontWeight: '500',
    maxWidth: 110,
  },
  chipMore: { fontSize: 10.5, color: 'rgba(235,227,214,0.4)' },

  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  zoneText: {
    fontSize: 10,
    color: 'rgba(196,141,56,0.6)',
    fontWeight: '500',
  },
});