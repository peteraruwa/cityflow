// src/features/find-a-church/FindAChurchScreen.js
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, Linking, StatusBar, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Phone, MapPin, X, ChevronLeft, Church, UserRound, Mail, Clock } from 'lucide-react-native';
import { PARISHES } from './data/parishes';
import { C } from '../../shared/constants/theme';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name) {
  return name
    .split(' ')
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0])
    .join('');
}

function hexAlpha(hex, alpha) {
  // hex → rgba string for dynamic colors
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Parish Card ──────────────────────────────────────────────────────────────
function ParishCard({ item, onPress }) {
  const bg   = hexAlpha(item.color, 0.10);
  const bord = hexAlpha(item.color, 0.22);

  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.78} style={s.card}>
      <LinearGradient
        colors={[hexAlpha(item.color, 0.14), 'rgba(10,2,24,0.98)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[s.cardInner, { borderColor: bord }]}
      >
        {/* Avatar */}
        <View style={[s.avatar, { backgroundColor: bg, borderColor: bord }]}>
          <Text style={[s.avatarText, { color: item.color }]}>{initials(item.name)}</Text>
        </View>

        {/* Info */}
        <View style={s.cardInfo}>
          <Text style={s.cardName} numberOfLines={1}>{item.name}</Text>
          <Text style={s.cardPastor} numberOfLines={1}>{item.pastor}</Text>
          <View style={s.cardZoneRow}>
            <MapPin size={9} color={item.color} strokeWidth={2} style={{ marginRight: 3 }} />
            <Text style={[s.cardZone, { color: item.color }]}>{item.zone}</Text>
          </View>
        </View>

        {/* Phone chip */}
        <TouchableOpacity
          style={[s.callChip, { backgroundColor: bg, borderColor: bord }]}
          onPress={() => Linking.openURL(`tel:${item.phone.replace(/\s/g, '')}`)}
          activeOpacity={0.7}
        >
          <Phone size={13} color={item.color} strokeWidth={2} />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function ParishDetail({ parish, onClose }) {
  if (!parish) return null;
  const bg   = hexAlpha(parish.color, 0.12);
  const bord = hexAlpha(parish.color, 0.28);

  return (
    <View style={s.detailOverlay}>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      <View style={s.detailSheet}>
        <LinearGradient
          colors={['#160A2D', '#0A0218']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1.4 }}
          style={s.detailGradient}
        >
          {/* Close */}
          <TouchableOpacity onPress={onClose} style={s.detailClose}>
            <X size={16} color="rgba(235,227,214,0.6)" strokeWidth={2} />
          </TouchableOpacity>

          {/* Avatar large */}
          <View style={[s.detailAvatar, { backgroundColor: bg, borderColor: bord }]}>
            <Text style={[s.detailAvatarText, { color: parish.color }]}>{initials(parish.name)}</Text>
          </View>

          {/* Name */}
          <Text style={s.detailName}>{parish.name}</Text>

          {/* Divider */}
          <View style={[s.detailDivider, { backgroundColor: parish.color }]} />

          {/* Rows */}
          <DetailRow icon={<Church size={15} color={parish.color} strokeWidth={1.8} />} label="Pastor" value={parish.pastor} color={parish.color} />
          <DetailRow icon={<UserRound size={15} color={parish.color} strokeWidth={1.8} />} label="Assistant Pastor" value={parish.assistant} color={parish.color} />
          <DetailRow icon={<MapPin size={15} color={parish.color} strokeWidth={1.8} />} label="Location" value={`${parish.address}, Redemption City`} color={parish.color} />
          <DetailRow icon={<Phone size={15} color={parish.color} strokeWidth={1.8} />} label="Phone" value={parish.phone} color={parish.color} />
          <DetailRow icon={<Mail size={15} color={parish.color} strokeWidth={1.8} />} label="Email" value={parish.email} color={parish.color} />
          <DetailRow icon={<Clock size={15} color={parish.color} strokeWidth={1.8} />} label="Service Times" value={parish.serviceTimes} color={parish.color} />

          {/* Call CTA */}
          <TouchableOpacity
            style={[s.ctaBtn, { backgroundColor: hexAlpha(parish.color, 0.15), borderColor: hexAlpha(parish.color, 0.4) }]}
            onPress={() => Linking.openURL(`tel:${parish.phone.replace(/\s/g, '')}`)}
            activeOpacity={0.75}
          >
            <Phone size={15} color={parish.color} strokeWidth={2} style={{ marginRight: 8 }} />
            <Text style={[s.ctaText, { color: parish.color }]}>Call Parish</Text>
          </TouchableOpacity>

        </LinearGradient>
      </View>
    </View>
  );
}

function DetailRow({ icon, label, value, color }) {
  return (
    <View style={s.detailRow}>
      <View style={s.detailRowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={s.detailRowLabel}>{label}</Text>
        <Text style={s.detailRowValue}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function FindAChurchScreen({ navigation }) {
  const [query,    setQuery]    = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = query.trim().length === 0
    ? PARISHES
    : PARISHES.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.pastor.toLowerCase().includes(query.toLowerCase()) ||
        p.assistant.toLowerCase().includes(query.toLowerCase()) ||
        p.zone.toLowerCase().includes(query.toLowerCase()) ||
        p.email.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );

  const renderItem = useCallback(({ item }) => (
    <ParishCard item={item} onPress={setSelected} />
  ), []);

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={s.backBtn} activeOpacity={0.7}>
          <ChevronLeft size={22} color="#EBE3D6" strokeWidth={1.8} />
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>Find a Church</Text>
          <Text style={s.headerSub}>{PARISHES.length} churches - Redemption City</Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={s.searchWrap}>
        <Search size={15} color="rgba(235,227,214,0.35)" strokeWidth={2} style={{ marginRight: 9 }} />
        <TextInput
          style={s.searchInput}
          placeholder="Search by name, pastor or zone..."
          placeholderTextColor="rgba(235,227,214,0.3)"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={14} color="rgba(235,227,214,0.4)" strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results count */}
      {query.length > 0 && (
        <Text style={s.resultCount}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{query}"
        </Text>
      )}

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Church size={32} color="rgba(196,141,56,0.3)" strokeWidth={1.4} />
            <Text style={s.emptyText}>No parishes match your search</Text>
          </View>
        }
      />

      {/* Detail bottom sheet */}
      {selected && <ParishDetail parish={selected} onClose={() => setSelected(null)} />}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const GOLD = '#C48D38';

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#08011A',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EBE3D6',
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 11,
    color: 'rgba(235,227,214,0.4)',
    marginTop: 2,
  },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#EBE3D6',
    padding: 0,
  },
  resultCount: {
    fontSize: 11,
    color: 'rgba(235,227,214,0.35)',
    marginHorizontal: 20,
    marginBottom: 8,
  },

  // List
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 10,
  },

  // Card
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderRadius: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EBE3D6',
    letterSpacing: 0.2,
  },
  cardPastor: {
    fontSize: 11,
    color: 'rgba(235,227,214,0.5)',
  },
  cardZoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  cardZone: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  callChip: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Empty
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 13,
    color: 'rgba(235,227,214,0.3)',
  },

  // Detail sheet
  detailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  detailSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#0A0218',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#24133F',
  },
  detailGradient: {
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 44,
    alignItems: 'center',
  },
  detailClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailAvatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  detailAvatarText: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
  },
  detailName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EBE3D6',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  detailDivider: {
    width: 32,
    height: 2,
    borderRadius: 1,
    opacity: 0.6,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  detailRowIcon: {
    marginTop: 2,
    width: 20,
    alignItems: 'center',
  },
  detailRowLabel: {
    fontSize: 10,
    color: 'rgba(235,227,214,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  detailRowValue: {
    fontSize: 13,
    color: '#EBE3D6',
    fontWeight: '500',
    lineHeight: 18,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 50,
    borderWidth: 1,
    width: '100%',
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
