// src/features/picture-day/screens/PictureGalleryScreen.js

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  Animated,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HeaderBackButton } from '@react-navigation/elements';
import { GALLERY, getPictureOfTheDay, getPictureSource } from '../data/gallery';

const { width } = Dimensions.get('window');
const SIDE_PAD = 14;
const COL_GAP  = 10;

const CATEGORIES = ['All', ...new Set(GALLERY.map(g => g.category))];

export default function PictureGalleryScreen({ navigation, route }) {
  const { highlightIndex, overridePicture } = route.params ?? {};

  const { picture: todayPic, index: todayIdx } =
    overridePicture
      ? { picture: overridePicture, index: -1 }
      : highlightIndex !== undefined
      ? { picture: GALLERY[highlightIndex], index: highlightIndex }
      : getPictureOfTheDay();

  const [activeCategory, setActiveCategory] = useState('All');

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  const filteredRest = GALLERY.filter((item, idx) => {
    if (idx === todayIdx) return false;
    return activeCategory === 'All' || item.category === activeCategory;
  });

  const goToDetail = useCallback((item) => {
    navigation.navigate('PictureDetail', item.imageUrl ? { picture: item } : { pictureId: item.id });
  }, [navigation]);

  const renderItem = ({ item, index: i }) => (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => goToDetail(item)}
      style={[
        s.gridItem,
        { height: i % 3 === 0 ? 175 : 138 },
        i % 2 === 0 ? { marginRight: COL_GAP / 2 } : { marginLeft: COL_GAP / 2 },
      ]}
    >
      <Image source={getPictureSource(item)} style={s.gridImage} resizeMode="cover" />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.72)']} style={s.gridGradient} />
      <View style={[s.gridDot, { backgroundColor: item.categoryColor }]} />
      <Text style={s.gridTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      {/* Hero */}
      <TouchableOpacity activeOpacity={0.88} onPress={() => goToDetail(todayPic)} style={s.hero}>
        <Image source={getPictureSource(todayPic)} style={s.heroImage} resizeMode="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.78)']} style={s.heroGradient} />

        <View style={s.todayBadge}>
          <Text style={s.todayBadgeText}>✦  TODAY'S PICTURE</Text>
        </View>

        <View style={[s.heroCatBadge, { backgroundColor: todayPic.categoryColor }]}>
          <Text style={s.heroCatText}>{todayPic.category.toUpperCase()}</Text>
        </View>

        <View style={s.heroTextBlock}>
          <Text style={s.heroTitle}>{todayPic.title}</Text>
          <Text style={s.heroDate}>{todayPic.date}</Text>
          <Text style={s.heroCaption} numberOfLines={2}>{todayPic.caption}</Text>
        </View>
      </TouchableOpacity>

      {/* Category chips */}
      <View style={s.chipRow}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[s.chip, activeCategory === cat && s.chipActive]}
          >
            <Text style={[s.chipText, activeCategory === cat && s.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.gridLabel}>ALL PHOTOGRAPHS</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E0E" />

      {/* Top bar with native back button */}
      <View style={s.topBar}>
        <HeaderBackButton
          onPress={() => navigation.goBack()}
          tintColor="#fff"
          labelVisible={false}
        />
        <Text style={s.screenTitle}>Gallery</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={filteredRest}
        keyExtractor={item => item.id}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        renderItem={renderItem}
        contentContainerStyle={s.listContent}
        columnWrapperStyle={s.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0E0E0E' },

  // ── Top bar ─────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  screenTitle: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.4 },

  // ── Hero ─────────────────────────────────────────────────────
  hero: {
    height: 310,
    marginHorizontal: SIDE_PAD,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  heroImage:    { ...StyleSheet.absoluteFillObject },
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 },

  todayBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#E8A020',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  todayBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },

  heroCatBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  heroCatText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 1.6 },

  heroTextBlock: { position: 'absolute', bottom: 18, left: 16, right: 16 },
  heroTitle:   { color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 28, marginBottom: 4 },
  heroDate:    { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },
  heroCaption: { color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 18 },

  // ── Category chips ───────────────────────────────────────────
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIDE_PAD,
    paddingTop: 20,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive:     { backgroundColor: '#E8A020', borderColor: '#E8A020' },
  chipText:       { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff' },

  // ── Grid ─────────────────────────────────────────────────────
  gridLabel: {
    color: 'rgba(255,255,255,0.28)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginHorizontal: SIDE_PAD,
    marginTop: 18,
    marginBottom: 10,
  },
  listContent:   { paddingHorizontal: SIDE_PAD, paddingBottom: 40 },
  columnWrapper: { marginBottom: COL_GAP },
  gridItem: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  gridImage:    { ...StyleSheet.absoluteFillObject },
  gridGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  gridDot: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  gridTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
  },
});
