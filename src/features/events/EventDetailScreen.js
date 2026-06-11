import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Building2, CalendarDays, ChevronLeft, Clock, Youtube } from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import { getEventById } from './eventsData';
import { openGoogleCalendar } from './googleCalendar';
import { scheduleEventReminders } from './useEventReminders';
import { getFollowedEventIds, setEventFollowed } from '../notifications/notificationData';

function weekdayLabel(day) {
  return { SUN: 'Sunday', MON: 'Monday', WED: 'Wednesday', FRI: 'Friday', SAT: 'Saturday' }[day] || day;
}

export default function EventDetailScreen({ route, navigation }) {
  const event = getEventById(route.params?.eventId);
  const [isFollowed, setIsFollowed] = useState(false);
  const [reminderDayBefore, setReminderDayBefore] = useState(false);
  const [reminderDayOf, setReminderDayOf] = useState(false);

  useEffect(() => {
    getFollowedEventIds().then((ids) => {
      const followed = ids.includes(event.id);
      setIsFollowed(followed);
      setReminderDayBefore(followed);
      setReminderDayOf(followed);
    });
  }, [event.id]);

  async function applyFollow(nextFollowed, nextDayBefore = reminderDayBefore, nextDayOf = reminderDayOf) {
    setIsFollowed(nextFollowed);
    setReminderDayBefore(nextFollowed && nextDayBefore);
    setReminderDayOf(nextFollowed && nextDayOf);
    await setEventFollowed(event.id, nextFollowed);
    if (nextFollowed) {
      await scheduleEventReminders(event, {
        reminderDayBefore: nextDayBefore,
        reminderDayOf: nextDayOf,
      });
    }
  }

  async function handleCalendar() {
    try {
      const url = await openGoogleCalendar(event);
      if (!url) Alert.alert('Calendar unavailable', 'Could not open Google Calendar on this device.');
    } catch {
      Alert.alert('Calendar unavailable', 'Could not open Google Calendar on this device.');
    }
  }

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.75}>
          <ChevronLeft size={18} color={C.tp} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Event Details</Text>
      </View>

      <LinearGradient colors={[`${event.color || C.purple}22`, 'rgba(10,2,24,1)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.hero, { borderColor: `${event.color || C.purple}38` }]}>
        <View style={[s.heroGlow, { backgroundColor: `${event.color || C.purple}14` }]} />
        <View style={s.tagRow}>
          <Text style={[s.tag, { color: event.color || C.gold, backgroundColor: `${event.color || C.gold}1E`, borderColor: `${event.color || C.gold}35` }]}>{event.tag || 'EVENT'}</Text>
          {event.live && (
            <View style={s.liveChip}>
              <View style={s.liveDot} />
              <Text style={s.liveText}>LIVE NOW</Text>
            </View>
          )}
        </View>
        <Text style={s.title}>{event.title}</Text>
        <View style={s.metaList}>
          <View style={s.metaRow}>
            <CalendarDays size={12} color={C.gold} strokeWidth={1.8} />
            <Text style={s.metaText}>{weekdayLabel(event.day)} · {event.date}</Text>
          </View>
          <View style={s.metaRow}>
            <Clock size={12} color={C.gold} strokeWidth={1.8} />
            <Text style={s.metaText}>{event.time}</Text>
          </View>
          <View style={s.metaRow}>
            <Building2 size={12} color={C.gold} strokeWidth={1.8} />
            <Text style={s.metaText}>{event.venue || event.location} · Redemption City</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={s.aboutCard}>
        <Text style={s.kicker}>About this event</Text>
        <Text style={s.desc}>{event.description}</Text>
      </View>

      {event.live ? (
        <TouchableOpacity onPress={() => event.yt && Linking.openURL(event.yt)} activeOpacity={0.86}>
          <LinearGradient colors={['#E62117', '#B31217']} style={s.youtubeBtn}>
            <Youtube size={17} color="#fff" strokeWidth={2} />
            <Text style={s.youtubeText}>Watch live on YouTube</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => applyFollow(!isFollowed, true, true)} style={s.reminderBtn} activeOpacity={0.86}>
          <Bell size={14} color={C.gold} strokeWidth={2} />
          <Text style={s.reminderBtnText}>{isFollowed ? 'Following event' : 'Set a reminder'}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleCalendar} style={s.calendarBtn} activeOpacity={0.86}>
        <CalendarDays size={14} color={C.gold} strokeWidth={2} />
        <Text style={s.calendarText}>Add to Google Calendar</Text>
      </TouchableOpacity>

      {isFollowed && (
        <View style={s.settingsCard}>
          <Text style={s.kicker}>Reminder Settings</Text>
          <View style={s.switchRow}>
            <Text style={s.switchText}>Remind me 1 day before</Text>
            <Switch
              value={reminderDayBefore}
              onValueChange={(value) => applyFollow(true, value, reminderDayOf)}
            />
          </View>
          <View style={s.switchRow}>
            <Text style={s.switchText}>Remind me on the day</Text>
            <Switch
              value={reminderDayOf}
              onValueChange={(value) => applyFollow(true, reminderDayBefore, value)}
            />
          </View>
        </View>
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
  hero: { marginHorizontal: 18, borderWidth: 1, borderRadius: 24, paddingHorizontal: 18, paddingVertical: 20, overflow: 'hidden', marginBottom: 13 },
  heroGlow: { position: 'absolute', top: -40, right: -30, width: 150, height: 150, borderRadius: 75 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 13 },
  tag: { fontSize: 9, fontWeight: '700', borderWidth: 1, borderRadius: 7, paddingHorizontal: 9, paddingVertical: 3, letterSpacing: 0.45 },
  liveChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(215,55,55,0.18)', borderWidth: 1, borderColor: 'rgba(225,75,75,0.3)', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3 },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#F06565' },
  liveText: { fontSize: 8.5, fontWeight: '800', color: '#F06565', letterSpacing: 1 },
  title: { fontSize: 20, fontWeight: '700', color: C.tp, lineHeight: 26, marginBottom: 13 },
  metaList: { gap: 7 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  metaText: { fontSize: 12, color: C.ts },
  aboutCard: { marginHorizontal: 18, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 15, marginBottom: 14 },
  kicker: { fontSize: 10, fontWeight: '700', color: C.tm, letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 8 },
  desc: { fontSize: 12.5, color: C.ts, lineHeight: 21 },
  youtubeBtn: { marginHorizontal: 18, paddingVertical: 14, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  youtubeText: { fontSize: 13.5, fontWeight: '700', color: '#fff' },
  reminderBtn: { marginHorizontal: 18, paddingVertical: 13, borderRadius: 15, backgroundColor: C.surf, borderWidth: 1, borderColor: C.bHi, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  reminderBtnText: { fontSize: 13, fontWeight: '600', color: C.tp },
  calendarBtn: { marginHorizontal: 18, marginTop: 12, paddingVertical: 13, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(196,141,56,0.32)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  calendarText: { fontSize: 13, color: C.gold, fontWeight: '700' },
  settingsCard: { marginHorizontal: 18, marginTop: 14, backgroundColor: 'rgba(113,40,206,0.1)', borderWidth: 1, borderColor: 'rgba(113,40,206,0.28)', borderRadius: 18, padding: 15 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 7 },
  switchText: { fontSize: 13, color: C.tp },
});
