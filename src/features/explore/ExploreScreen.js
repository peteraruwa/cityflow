import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';
import {
  Search, X, Star, MapPinned, Building2,
  Home, Leaf, Coffee, Car, BookOpen,
  Navigation2, LocateFixed,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import ScreenHeader from '../../shared/components/ScreenHeader';
import { CAMP_LOCATIONS } from '../navigation/data/locations';
import { usePrefs } from '../../shared/context/PrefsContext';

const CATEGORY_META = {
  All: { label: 'All', iconName: 'Building2', color: '#7128CE' },
  church: { label: 'Worship', iconName: 'Building2', color: '#6B35C0' },
  accommodation: { label: 'Stay', iconName: 'Home', color: '#2A7FAB' },
  dining: { label: 'Dining', iconName: 'Coffee', color: '#C48D38' },
  park: { label: 'Spiritual', iconName: 'Leaf', color: '#4A8A5A' },
  parking: { label: 'Transport', iconName: 'Car', color: '#6A6880' },
  shopping: { label: 'Retail', iconName: 'BookOpen', color: '#9B5E3A' },
  bank: { label: 'Finance', iconName: 'Building2', color: '#C48D38' },
  medical: { label: 'Medical', iconName: 'Building2', color: '#D44F4F' },
  education: { label: 'Education', iconName: 'BookOpen', color: '#6B9BC0' },
  administration: { label: 'Admin', iconName: 'Building2', color: '#8C7DA0' },
  media: { label: 'Media', iconName: 'BookOpen', color: '#9B5CF6' },
  estate: { label: 'Estate', iconName: 'Home', color: '#4A8A5A' },
  pastors_quarters: { label: "Pastors' Quarters", iconName: 'Home', color: '#B07020' },
};

const ICON_MAP = { Building2, Home, Leaf, Coffee, Car, BookOpen };

const FALLBACK_LOCATION = { latitude: 6.4538, longitude: 3.3960, accuracy: null };

function distanceMeters(a, b) {
  const r = 6371000;
  const toRad = (v) => (v * Math.PI) / 180;

  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * r * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function formatDistance(m) {
  if (!Number.isFinite(m)) return 'Nearby';
  if (m < 1000) return `${Math.max(1, Math.round(m))}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

function makeRating(index, category) {
  const base = category === 'church' || category === 'park' ? 4.8 : 4.4;
  return Math.min(4.9, base + ((index % 4) * 0.1)).toFixed(1);
}

function placeFromLocation(location, index, userLocation) {
  const meta = CATEGORY_META[location.category] || CATEGORY_META.All;
  const point = { latitude: location.lat, longitude: location.lng };
  const distance = userLocation ? distanceMeters(userLocation, point) : null;

  return {
    ...location,
    iconName: meta.iconName,
    cat: meta.label,
    color: meta.color,
    rating: makeRating(index, location.category),
    distance,
    dist: distance == null ? 'Enable location' : formatDistance(distance),
  };
}

export default function ExploreScreen({ navigation }) {
  const { locationServices } = usePrefs();
  const locationSub = useRef(null);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('checking');
  const [locationMessage, setLocationMessage] = useState('Getting your current location...');

  useEffect(() => {
    let mounted = true;

    async function startLocation() {
      locationSub.current?.remove();
      locationSub.current = null;

      if (!locationServices) {
        setUserLocation(null);
        setLocationStatus('off');
        setLocationMessage('Location services are off.');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!mounted) return;

      if (status !== 'granted') {
        setLocationStatus('denied');
        setLocationMessage('Location permission required.');
        return;
      }

      const initial = await Location.getCurrentPositionAsync({});
      if (!mounted) return;

      setUserLocation(initial.coords);
      setLocationStatus('live');

      locationSub.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 8 },
        (loc) => setUserLocation(loc.coords)
      );
    }

    startLocation();

    return () => {
      mounted = false;
      locationSub.current?.remove();
    };
  }, [locationServices]);

  const nearestLandmark = useMemo(() => {
    const origin = userLocation || FALLBACK_LOCATION;

    return CAMP_LOCATIONS
      .map((loc) => ({
        ...loc,
        distance: distanceMeters(origin, { latitude: loc.lat, longitude: loc.lng }),
      }))
      .sort((a, b) => a.distance - b.distance)[0];
  }, [userLocation]);

  const places = useMemo(
    () =>
      CAMP_LOCATIONS
        .map((loc, i) => placeFromLocation(loc, i, userLocation))
        .sort((a, b) => (a.distance ?? 999999) - (b.distance ?? 999999)),
    [userLocation]
  );

  const categories = useMemo(() => {
    const map = new Map([['All', 'All']]);
    CAMP_LOCATIONS.forEach((l) => {
      const meta = CATEGORY_META[l.category] || CATEGORY_META.All;
      map.set(l.category, meta.label);
    });

    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, []);

  const filtered = places.filter((p) => {
    const matchCat = category === 'All' || p.category === category;
    const q = query.toLowerCase();

    const matchQ =
      !q ||
      [p.name, p.description, p.cat]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));

    return matchCat && matchQ;
  });

  const goToNavigation = (dest) => {
    navigation.navigate('Home', {
      screen: 'Navigation',
      params: dest ? { initialDest: dest.name } : undefined,
    });
  };

  return (
    <View style={s.root}>
      <ScreenHeader title="Explore" sub="Discover Redemption City" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}   // 👈 pills row becomes sticky
      >

        {/* LOCATION CARD */}
        <View style={s.locationWrap}>
          <View style={s.locationCard}>
            <View style={s.locationTop}>
              <LocateFixed size={16} color={C.gold} />
              <View style={{ flex: 1 }}>
                <Text style={s.locationLabel}>Current location</Text>
                <Text style={s.locationCoords}>
                  {userLocation
                    ? `${userLocation.latitude.toFixed(5)}, ${userLocation.longitude.toFixed(5)}`
                    : 'Waiting for GPS'}
                </Text>
              </View>
              <View style={s.livePill}>
                <Text style={s.liveText}>
                  {locationStatus === 'live' ? 'Live' : 'GPS'}
                </Text>
              </View>
            </View>

            <Text style={s.locationNote}>{locationMessage}</Text>
          </View>
        </View>

        {/* SEARCH */}
        <View style={s.searchWrap}>
          <View style={s.searchBar}>
            <Search size={15} color={C.ts} />
            <TextInput
              style={s.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search places..."
              placeholderTextColor={C.tm}
            />
            {query ? (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X size={14} color={C.ts} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* 🔥 STICKY PILLS HEADER */}
        <View style={s.catSticky}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.catContent}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[s.catBtn, category === cat.id && s.catBtnActive]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={[s.catTxt, category === cat.id && s.catTxtActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* GRID */}
        <View style={s.grid}>
          <View style={s.gridRow}>
            {filtered.map((p) => {
              const Icon = ICON_MAP[p.iconName] || Building2;

              return (
                <TouchableOpacity
                  key={p.id}
                  style={s.placeCard}
                  onPress={() => goToNavigation(p)}
                >
                  <View style={[s.placeImg, { backgroundColor: `${p.color}18` }]}>
                    <Icon size={26} color={p.color} />
                  </View>

                  <View style={s.placeBody}>
                    <Text style={s.placeName}>{p.name}</Text>
                    <Text style={s.placeDesc}>{p.description}</Text>
                    <Text style={s.distTxt}>{p.dist}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08011A' },

  locationWrap: { padding: 18 },
  locationCard: { padding: 14, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.04)' },
  locationTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  locationLabel: { fontSize: 11, color: '#aaa' },
  locationCoords: { fontSize: 13, color: '#fff' },
  locationNote: { marginTop: 8, fontSize: 11, color: '#aaa' },

  livePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#2A7FAB',
  },
  liveText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  searchWrap: { paddingHorizontal: 18, paddingBottom: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  searchInput: { flex: 1, color: '#fff', marginLeft: 10 },

  catSticky: {
    backgroundColor: '#08011A',
    paddingVertical: 10,
  },
  catContent: {
    paddingHorizontal: 18,
    gap: 8,
  },

  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  catBtnActive: { backgroundColor: '#7128CE' },
  catTxt: { color: '#aaa', fontSize: 12 },
  catTxtActive: { color: '#fff' },

  grid: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 40 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  placeCard: {
    width: '47%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  placeImg: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeBody: { padding: 10 },
  placeName: { color: '#fff', fontSize: 12, fontWeight: '600' },
  placeDesc: { color: '#aaa', fontSize: 10, marginTop: 4 },
  distTxt: { color: '#C48D38', fontSize: 10, marginTop: 6 },
});