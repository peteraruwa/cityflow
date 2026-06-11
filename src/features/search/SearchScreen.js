import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BookOpen, Building2, CalendarDays, Car, ChevronRight, Coffee, Home, Leaf, MapPinned, Search, X } from 'lucide-react-native';
import ScreenHeader from '../../shared/components/ScreenHeader';
import { C } from '../../shared/constants/theme';
import { EXPLORE_PLACES } from '../../shared/data';
import { EVENTS } from '../events/eventsData';
import { NEWS_ITEMS } from '../notifications/notificationData';

const ICON_MAP = { Building2, Home, Leaf, Coffee, Car, BookOpen };

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [];
    const places = EXPLORE_PLACES.filter((item) =>
      [item.name, item.cat, item.dist].some((value) => String(value).toLowerCase().includes(q))
    ).map((item) => ({ type: 'place', key: `place-${item.name}`, ...item }));
    const events = EVENTS.filter((item) =>
      [item.title, item.description, item.location, item.venue].some((value) => String(value || '').toLowerCase().includes(q))
    ).map((item) => ({ type: 'event', key: `event-${item.id}`, ...item }));
    const news = NEWS_ITEMS.filter((item) =>
      [item.title, item.body, item.detail].some((value) => String(value || '').toLowerCase().includes(q))
    ).map((item) => ({ type: 'news', key: `news-${item.id}`, ...item }));
    return [...places, ...events, ...news];
  }, [q]);

  function openResult(item) {
    if (item.type === 'event') navigation.navigate('EventDetail', { eventId: item.id });
    else if (item.type === 'news') navigation.navigate('NewsDetail', { notificationId: item.id });
    else navigation.navigate('Navigation', { initialDest: item.name });
  }

  return (
    <View style={s.root}>
      <ScreenHeader title="Search" sub="Find places, events & updates" />
      <View style={s.searchWrap}>
        <View style={s.searchBar}>
          <Search size={15} color={C.ts} strokeWidth={1.8} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search places..."
            placeholderTextColor={C.tm}
            style={s.input}
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
              <X size={14} color={C.ts} strokeWidth={2} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.results}>
        {!query ? (
          <View style={s.empty}>
            <Text style={s.emptyTitle}>Start typing to search</Text>
            <Text style={s.emptySub}>Try “restaurant”, “Holy Ghost”, “wallet”, or “Prayer Mountain”.</Text>
          </View>
        ) : results.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyTitle}>No results found for "{query}"</Text>
          </View>
        ) : (
          results.map((item) => {
            const Icon = item.type === 'place'
              ? ICON_MAP[item.iconName] || Building2
              : item.type === 'event'
                ? CalendarDays
                : Search;
            const color = item.color || C.gold;
            return (
              <TouchableOpacity key={item.key} onPress={() => openResult(item)} activeOpacity={0.82} style={s.resultCard}>
                <View style={[s.resultIcon, { backgroundColor: `${color}18`, borderColor: `${color}28` }]}>
                  <Icon size={17} color={color} strokeWidth={1.8} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.resultTitle}>{item.title || item.name}</Text>
                  <Text style={s.resultSub} numberOfLines={2}>
                    {item.type === 'place'
                      ? `${item.cat} · ${item.dist} · ${item.rating}★`
                      : item.type === 'event'
                        ? `${item.date} · ${item.time}`
                        : item.body}
                  </Text>
                </View>
                {item.type === 'place' ? <MapPinned size={13} color={C.gold} strokeWidth={2.2} /> : <ChevronRight size={14} color={C.tm} strokeWidth={2} />}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  searchWrap: { paddingHorizontal: 18, paddingTop: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11 },
  input: { flex: 1, fontSize: 13, color: C.tp, padding: 0 },
  results: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 24, gap: 10 },
  resultCard: { backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 18, paddingHorizontal: 15, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultIcon: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  resultTitle: { fontSize: 13.5, fontWeight: '700', color: C.tp, marginBottom: 3 },
  resultSub: { fontSize: 11.5, color: C.ts, lineHeight: 17 },
  empty: { paddingVertical: 42, alignItems: 'center' },
  emptyTitle: { fontSize: 13, fontWeight: '700', color: C.tp },
  emptySub: { marginTop: 7, maxWidth: 280, textAlign: 'center', fontSize: 11.5, color: C.ts, lineHeight: 18 },
});
