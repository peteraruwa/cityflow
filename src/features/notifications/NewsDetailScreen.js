import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronLeft, Calendar, Bell, ExternalLink, Megaphone } from 'lucide-react-native';
import { db } from '../../shared/config/firebase';
import { C } from '../../shared/constants/theme';

export default function NewsDetailScreen({ route, navigation }) {
  const { newsId } = route.params || {};
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (newsId) {
      loadNewsDetail();
    } else {
      console.error('No newsId provided');
      setLoading(false);
    }
  }, []);

  const loadNewsDetail = async () => {
    try {
      console.log('Loading news with ID:', newsId);
      const docRef = doc(db, 'news', newsId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setNews({ id: docSnap.id, ...docSnap.data() });
        console.log('News loaded:', docSnap.data());
      } else {
        console.log('No such document!');
        setNews(null);
      }
    } catch (error) {
      console.error('Error loading news detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFullDate = (timestamp) => {
    if (!timestamp) return 'Date unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={C.gold} />
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

  if (!news) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnTop}>
          <ChevronLeft size={24} color={C.tp} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.errorText}>News not found</Text>
        <Text style={styles.errorSubText}>The news item may have been removed or doesn't exist.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <LinearGradient colors={[C.bg, C.surf]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={C.tp} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News Detail</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Urgent Badge */}
        {news.urgent && (
          <View style={styles.urgentBadge}>
            <Bell size={14} color={C.red} strokeWidth={2} />
            <Text style={styles.urgentText}>URGENT ANNOUNCEMENT</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title}>{news.title}</Text>

        {/* Meta Info */}
        <View style={styles.metaRow}>
          <View style={styles.categoryBadge}>
            <Megaphone size={10} color={C.gold} strokeWidth={2} />
            <Text style={styles.categoryText}>{news.category || 'Announcement'}</Text>
          </View>
          <View style={styles.dateRow}>
            <Calendar size={12} color={C.ts} strokeWidth={2} />
            <Text style={styles.dateText}>{formatFullDate(news.createdAt)}</Text>
          </View>
        </View>

        {/* Content */}
        <Text style={styles.contentText}>{news.content}</Text>

        {/* Link */}
        {news.link && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(news.link)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[C.purple, '#5A18A8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.linkGradient}
            >
              <ExternalLink size={16} color="#fff" strokeWidth={2} />
              <Text style={styles.linkText}>Read More</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.b,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnTop: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.tp,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: C.bg,
  },
  loadingText: {
    marginTop: 12,
    color: C.ts,
    fontSize: 14,
  },
  errorText: {
    color: C.tp,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubText: {
    color: C.ts,
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(212,79,79,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212,79,79,0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.red,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: C.tp,
    lineHeight: 28,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(196,141,56,0.15)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.gold,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 11,
    color: C.ts,
  },
  contentText: {
    fontSize: 15,
    color: C.tp,
    lineHeight: 24,
    marginBottom: 24,
  },
  linkButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  linkGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});