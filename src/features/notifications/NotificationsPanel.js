import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { auth, db } from '../../shared/config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function NotificationsPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      // Get followed events
      const followedRef = collection(db, 'users', userId, 'followedEvents');
      const followedSnap = await getDocs(followedRef);
      const followedEvents = followedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // For demo, we'll just show a list of followed events
      // In production, you would also fetch event details and filter upcoming ones
      const eventIds = followedEvents.map(ev => ev.id);
      if (eventIds.length === 0) {
        setNotifications([]);
      } else {
        // Query events collection to get titles
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, where('__name__', 'in', eventIds));
        const eventsSnap = await getDocs(q);
        const eventDetails = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const notifs = eventDetails.map(event => ({
          id: event.id,
          title: 'Event Reminder',
          message: `You are following: ${event.title}`,
          time: new Date().toLocaleDateString(),
        }));
        setNotifications(notifs);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={18} color="#EBE3D6" />
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        {loading ? (
          <Text style={styles.empty}>Loading...</Text>
        ) : notifications.length === 0 ? (
          <Text style={styles.empty}>No notifications yet</Text>
        ) : (
          notifications.map(notif => (
            <View key={notif.id} style={styles.item}>
              <Text style={styles.itemTitle}>{notif.title}</Text>
              <Text style={styles.itemMessage}>{notif.message}</Text>
              <Text style={styles.itemTime}>{notif.time}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '600', color: '#EBE3D6' },
  closeBtn: { padding: 4 },
  list: { flex: 1 },
  empty: { color: '#8C7DA0', textAlign: 'center', marginTop: 40 },
  item: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 12, marginBottom: 10 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: '#EBE3D6', marginBottom: 4 },
  itemMessage: { fontSize: 12, color: '#8C7DA0', marginBottom: 2 },
  itemTime: { fontSize: 10, color: '#504460' },
});