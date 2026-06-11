import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Megaphone, AlertCircle, Navigation, Bell, ChevronRight, ExternalLink } from 'lucide-react-native';
import { db } from '../../../shared/config/firebase';
import { C } from '../../../shared/constants/theme';
import SectionHeader from '../../../shared/components/SectionHeader';

export default function NewsFeed({ tr, onLostFoundPress, onNewsPress }) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(6));
            const snapshot = await getDocs(q);
            const newsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNews(newsList);
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.section}>
                <SectionHeader tr={tr} title="News & Announcements" action={null} />
                <ActivityIndicator size="small" color={C.gold} style={{ marginTop: 12 }} />
            </View>
        );
    }

    if (news.length === 0) return null;

    // Map news items to display format
    // In NewsFeed.js, when mapping news items:
    const displayItems = news.map(item => ({
        id: item.id,  // ← Make sure id is included
        Icon: item.urgent ? AlertCircle : Megaphone,
        color: item.urgent ? '#D44F4F' : C.purple,
        title: item.title,
        body: item.content,
        time: formatTime(item.createdAt),
        isUrgent: item.urgent,
        link: item.link,
        onPress: () => {
            if (item.link) {
                Linking.openURL(item.link);
            } else if (onNewsPress) {
                onNewsPress(item);  // ← Pass the full item with id
            }
        },
    }));

    // Add Lost & Found as a special item if onLostFoundPress exists
    const allItems = onLostFoundPress
        ? [...displayItems, {
            Icon: Bell,
            color: C.gold,
            title: "Lost & Found",
            body: "Check recently lost or found items in the camp",
            time: "Always",
            onPress: onLostFoundPress,
        }]
        : displayItems;

    return (
        <View style={styles.section}>
            <SectionHeader tr={tr} title="News & Announcements" action={null} />
            <View style={styles.newsList}>
                {allItems.slice(0, 4).map((item, idx) => (
                    <TouchableOpacity key={idx} onPress={item.onPress} style={styles.newsCard} activeOpacity={0.85}>
                        <View style={[styles.newsIcon, { backgroundColor: `${item.color}18`, borderColor: `${item.color}28` }]}>
                            <item.Icon size={15} color={item.color} strokeWidth={2} />
                        </View>
                        <View style={styles.newsContent}>
                            <View style={styles.newsTop}>
                                <Text style={[styles.newsTitle, item.isUrgent && styles.urgentTitle]} numberOfLines={1}>
                                    {tr(item.title)}
                                </Text>
                                <Text style={styles.newsTime}>{item.time}</Text>
                            </View>
                            <Text style={styles.newsBody} numberOfLines={2}>{tr(item.body)}</Text>
                        </View>
                        <View style={styles.chevronContainer}>
                            {item.link
                                ? <ExternalLink size={16} color={C.gold} strokeWidth={2} />
                                : <ChevronRight size={16} color={C.gold} strokeWidth={2} />
                            }
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

function formatTime(timestamp) {
    if (!timestamp) return 'Recently';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

const styles = StyleSheet.create({
    section: { paddingHorizontal: 18, marginBottom: 22 },
    newsList: { gap: 10, marginTop: 14 },
    newsCard: {
        backgroundColor: C.surf,
        borderWidth: 1,
        borderColor: C.b,
        borderRadius: 18,
        padding: 14,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    newsIcon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    newsContent: {
        flex: 1,
        gap: 4,
    },
    newsTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    newsTitle: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        color: C.tp,
        marginRight: 8
    },
    urgentTitle: { color: '#D44F4F' },
    newsTime: {
        fontSize: 10,
        color: C.tm,
        flexShrink: 0,
    },
    newsBody: {
        fontSize: 11.5,
        color: C.ts,
        lineHeight: 18
    },
    chevronContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
});