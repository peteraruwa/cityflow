import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, CalendarDays, ChevronLeft, Clock } from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import { EVENTS, getEventById } from '../events/eventsData';
import { getFollowedEventIds, getNotificationById, NOTIFICATION_ICONS } from './notificationData';

export default function NewsDetailScreen({ navigation, route }) {
  const [followedIds, setFollowedIds] = useState([]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      getFollowedEventIds().then(setFollowedIds);
    });
    return unsub;
  }, [navigation]);

  const item = getNotificationById(route.params?.notificationId, followedIds);
  const event = item.eventId ? getEventById(item.eventId) : null;
  const Icon = NOTIFICATION_ICONS[item.icon] || Bell;

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.75}>
          <ChevronLeft size={18} color={C.tp} strokeWidth={2} />
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>{item.type === 'event' ? 'Event Update' : 'News Detail'}</Text>
          <Text style={s.headerSub}>{item.time}</Text>
        </View>
      </View>

      <LinearGradient colors={[`${item.color}22`, 'rgba(10,2,24,1)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.hero, { borderColor: `${item.color}38` }]}>
        <View style={s.heroGlow} />
        <View style={[s.iconBox, { backgroundColor: `${item.color}18`, borderColor: `${item.color}28` }]}>
          <Icon size={20} color={item.color} strokeWidth={2} />
        </View>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
      </LinearGradient>

      <View style={s.detailCard}>
        <Text style={s.kicker}>Details</Text>
        <Text style={s.detail}>{item.detail}</Text>
      </View>

      {event && (
        <TouchableOpacity
          onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
          activeOpacity={0.85}
          style={s.eventLink}
        >
          <CalendarDays size={14} color={C.gold} strokeWidth={2} />
          <View style={{ flex: 1 }}>
            <Text style={s.eventTitle}>{event.title}</Text>
            <View style={s.eventMeta}>
              <Clock size={10} color={C.ts} strokeWidth={2} />
              <Text style={s.eventMetaText}>{event.date} · {event.time}</Text>
            </View>
          </View>
          <Text style={s.eventAction}>View Details</Text>
        </TouchableOpacity>
      )}

      {item.tab === 'LostFound' && (
        <TouchableOpacity onPress={() => navigation.getParent()?.navigate('LostFound')} activeOpacity={0.85} style={s.eventLink}>
          <Bell size={14} color={C.gold} strokeWidth={2} />
          <Text style={[s.eventTitle, { flex: 1 }]}>Open Lost & Found</Text>
          <Text style={s.eventAction}>View</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { paddingBottom: 28 },
  header: { paddingHorizontal: 18, paddingTop: 48, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: C.tp },
  headerSub: { fontSize: 11, color: C.ts, marginTop: 2 },
  hero: { marginHorizontal: 18, borderRadius: 24, borderWidth: 1, padding: 20, overflow: 'hidden' },
  heroGlow: { position: 'absolute', top: -40, right: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.04)' },
  iconBox: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { fontSize: 21, fontWeight: '800', color: C.tp, lineHeight: 27, marginBottom: 10 },
  body: { fontSize: 13, color: C.ts, lineHeight: 21 },
  detailCard: { margin: 18, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 15 },
  kicker: { fontSize: 10, fontWeight: '800', color: C.tm, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 },
  detail: { fontSize: 12.5, color: C.ts, lineHeight: 21 },
  eventLink: { marginHorizontal: 18, backgroundColor: C.surf, borderWidth: 1, borderColor: C.bHi, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 },
  eventTitle: { fontSize: 13.5, fontWeight: '700', color: C.tp },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  eventMetaText: { fontSize: 10.5, color: C.ts },
  eventAction: { fontSize: 11, color: C.gold, fontWeight: '700' },
});
