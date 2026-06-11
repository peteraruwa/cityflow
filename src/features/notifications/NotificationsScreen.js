import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../../shared/constants/theme';
import ScreenHeader from '../../shared/components/ScreenHeader';
import {
  buildFollowedEventNotifications,
  getFollowedEventIds,
  NEWS_ITEMS,
  NOTIFICATION_ICONS,
} from './notificationData';

export default function NotificationsScreen({ navigation }) {
  const [read, setRead] = useState(false);
  const [followedIds, setFollowedIds] = useState([]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      getFollowedEventIds().then(setFollowedIds);
    });
    return unsub;
  }, [navigation]);

  const items = useMemo(() => [...NEWS_ITEMS, ...buildFollowedEventNotifications(followedIds)], [followedIds]);
  const unreadCount = items.filter((item) => item.unread).length;

  return (
    <View style={s.root}>
      <View style={s.headerRow}>
        <View style={{ flex: 1 }}>
          <ScreenHeader title="Notifications" sub={`${unreadCount} unread`} />
        </View>
        <TouchableOpacity onPress={() => setRead(true)} style={s.markBtn} activeOpacity={0.75}>
          <Text style={s.markText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
        {items.map((item) => {
          const unread = item.unread && !read;
          const Icon = NOTIFICATION_ICONS[item.icon] || NOTIFICATION_ICONS.Bell;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate('NewsDetail', { notificationId: item.id })}
              style={[s.card, unread && s.cardUnread]}
              activeOpacity={0.84}
            >
              <View style={[s.icon, { backgroundColor: `${item.color}18`, borderColor: `${item.color}28` }]}>
                <Icon size={16} color={item.color} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.topRow}>
                  <Text style={s.title}>{item.title}</Text>
                  <Text style={s.time}>{item.time}</Text>
                </View>
                <Text style={s.body}>{item.body}</Text>
              </View>
              {unread && <View style={s.unreadDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingRight: 18 },
  markBtn: { paddingTop: 18, paddingHorizontal: 4 },
  markText: { fontSize: 11, color: C.gold, fontWeight: '600' },
  list: { paddingHorizontal: 18, paddingTop: 4, paddingBottom: 20, gap: 10 },
  card: { backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 18, paddingHorizontal: 15, paddingVertical: 14, flexDirection: 'row', gap: 12 },
  cardUnread: { backgroundColor: 'rgba(113,40,206,0.08)', borderColor: 'rgba(113,40,206,0.25)' },
  icon: { width: 36, height: 36, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 4 },
  title: { flex: 1, fontSize: 13, fontWeight: '600', color: C.tp, lineHeight: 17 },
  time: { fontSize: 10, color: C.tm },
  body: { fontSize: 11.5, color: C.ts, lineHeight: 18 },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.gold, marginTop: 4 },
});
