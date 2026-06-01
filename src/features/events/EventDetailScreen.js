// src/features/events/EventDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../shared/config/firebase';
import { Calendar, Clock, MapPin, Bell, Calendar as GoogleCal } from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import { scheduleEventReminders } from './useEventReminders';

export default function EventDetailScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [reminderDayBefore, setReminderDayBefore] = useState(false);
  const [reminderDayOf, setReminderDayOf] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    try {
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists()) setEvent({ id: eventDoc.id, ...eventDoc.data() });
      
      const userId = auth.currentUser?.uid;
      if (userId) {
        // Correct subcollection path: users/{userId}/followedEvents/{eventId}
        const userEventRef = doc(db, 'users', userId, 'followedEvents', eventId);
        const userEventDoc = await getDoc(userEventRef);
        if (userEventDoc.exists()) {
          setIsFollowed(true);
          const data = userEventDoc.data();
          setReminderDayBefore(data.reminderDayBefore || false);
          setReminderDayOf(data.reminderDayOf || false);
        }
      }
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Alert.alert('Please login first');
    
    const userEventRef = doc(db, 'users', userId, 'followedEvents', eventId);
    if (isFollowed) {
      // Unfollow
      await deleteDoc(userEventRef);
      setIsFollowed(false);
      setReminderDayBefore(false);
      setReminderDayOf(false);
      Alert.alert('Unfollowed', 'You will no longer receive reminders');
    } else {
      // Follow with default reminders
      await setDoc(userEventRef, {
        eventId,
        reminderDayBefore: true,
        reminderDayOf: true,
        followedAt: new Date(),
      });
      setIsFollowed(true);
      setReminderDayBefore(true);
      setReminderDayOf(true);
      if (event) await scheduleEventReminders(event, { reminderDayBefore: true, reminderDayOf: true });
      Alert.alert('Following', 'You will receive reminders for this event');
    }
  };

  const updateReminders = async (dayBefore, dayOf) => {
    const userId = auth.currentUser?.uid;
    if (!userId || !isFollowed) return;
    const userEventRef = doc(db, 'users', userId, 'followedEvents', eventId);
    await updateDoc(userEventRef, {
      reminderDayBefore: dayBefore,
      reminderDayOf: dayOf,
    });
    setReminderDayBefore(dayBefore);
    setReminderDayOf(dayOf);
    await scheduleEventReminders(event, { reminderDayBefore: dayBefore, reminderDayOf: dayOf });
  };

  const addToGoogleCalendar = () => {
    Alert.alert('Coming Soon', 'Google Calendar integration will be available in the next update.');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }
  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <ChevronLeft size={24} color="#EBE3D6" />
      </TouchableOpacity>

      {/* Hero gradient */}
      <LinearGradient colors={['rgba(90,18,165,0.6)', '#08011A']} style={styles.hero}>
        <Text style={styles.title}>{event.title}</Text>
      </LinearGradient>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Calendar size={18} color={C.gold} />
          <Text style={styles.infoText}>{event.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={18} color={C.gold} />
          <Text style={styles.infoText}>{event.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <MapPin size={18} color={C.gold} />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.descTitle}>Description</Text>
        <Text style={styles.descText}>{event.description}</Text>
      </View>

      <TouchableOpacity style={styles.followBtn} onPress={handleFollow}>
        <LinearGradient colors={[isFollowed ? '#5A18A8' : '#7128CE', '#5A18A8']} style={styles.gradientBtn}>
          <Bell size={16} color="#fff" />
          <Text style={styles.btnText}>{isFollowed ? 'Unfollow Event' : 'Follow Event'}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {isFollowed && (
        <View style={styles.reminderCard}>
          <Text style={styles.reminderTitle}>Reminder Settings</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Remind me 1 day before</Text>
            <Switch
              value={reminderDayBefore}
              onValueChange={val => updateReminders(val, reminderDayOf)}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Remind me on the day</Text>
            <Switch
              value={reminderDayOf}
              onValueChange={val => updateReminders(reminderDayBefore, val)}
            />
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.calBtn} onPress={addToGoogleCalendar}>
        <GoogleCal size={16} color={C.gold} />
        <Text style={styles.calBtnText}>Add to Google Calendar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08011A' },
  content: { paddingBottom: 40 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  hero: { padding: 24, paddingTop: 60, marginTop: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#EBE3D6' },
  infoCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, margin: 16, padding: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  infoText: { fontSize: 14, color: '#EBE3D6', flex: 1 },
  descriptionCard: { margin: 16, padding: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16 },
  descTitle: { fontSize: 16, fontWeight: '600', color: '#EBE3D6', marginBottom: 8 },
  descText: { fontSize: 14, color: '#8C7DA0', lineHeight: 20 },
  followBtn: { marginHorizontal: 16, marginTop: 8 },
  gradientBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 30 },
  btnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  reminderCard: { margin: 16, padding: 16, backgroundColor: 'rgba(113,40,206,0.1)', borderRadius: 16 },
  reminderTitle: { fontSize: 14, fontWeight: '600', color: '#EBE3D6', marginBottom: 12 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  switchLabel: { fontSize: 14, color: '#EBE3D6' },
  calBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 8, paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(196,141,56,0.5)', borderRadius: 30 },
  calBtnText: { fontSize: 14, color: C.gold, fontWeight: '500' },
});