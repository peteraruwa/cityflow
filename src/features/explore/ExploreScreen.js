import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';
import {
  Search, X, Star, MapPinned, Building2, Home, Leaf,
  Coffee, Car, BookOpen, Navigation2, LocateFixed,
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
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function formatDistance(metres) {
  if (!Number.isFinite(metres)) return 'Nearby';
  if (metres < 1000) return `${Math.max(1, Math.round(metres))}m`;
  return `${(metres / 1000).toFixed(1)}km`;
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
        setLocationMessage('Location services are off. Enable them in Settings to show where you are.');
        return;
      }

      setLocationStatus('checking');
      setLocationMessage('Getting your current location...');

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!mounted) return;

      if (status !== 'granted') {
        setUserLocation(null);
        setLocationStatus('denied');
        setLocationMessage('Location permission is needed to show your current location and nearest landmark.');
        return;
      }

      try {
        const initial = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!mounted) return;
        setUserLocation(initial.coords);
        setLocationStatus('live');
        setLocationMessage('Live tracking is on.');

        locationSub.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 8 },
          (loc) => {
            setUserLocation(loc.coords);
            setLocationStatus('live');
            setLocationMessage('Live tracking is on.');
          }
        );
      } catch (error) {
        if (!mounted) return;
        setUserLocation(null);
        setLocationStatus('error');
        setLocationMessage('Unable to read your current location. Try again when GPS is available.');
      }
    }

    startLocation();
    return () => {
      mounted = false;
      locationSub.current?.remove();
    };
  }, [locationServices]);

  const locationForDistance = userLocation || null;
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
    () => CAMP_LOCATIONS.map((loc, index) => placeFromLocation(loc, index, locationForDistance))
      .sort((a, b) => {
        if (a.distance == null && b.distance == null) return a.name.localeCompare(b.name);
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      }),
    [locationForDistance]
  );

  const categories = useMemo(() => {
    const labels = new Map([['All', 'All']]);
    CAMP_LOCATIONS.forEach((loc) => {
      const meta = CATEGORY_META[loc.category] || CATEGORY_META.All;
      labels.set(loc.category, meta.label);
    });
    return Array.from(labels.entries()).map(([id, label]) => ({ id, label }));
  }, []);

  const filtered = places.filter((place) => {
    const matchCat = category === 'All' || place.category === category;
    const q = query.trim().toLowerCase();
    const matchQ = !q || [place.name, place.description, place.cat, place.subcategory, place.address]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  const goToNavigation = (destination) => {
    navigation.navigate('Home', {
      screen: 'Navigation',
      params: destination ? { initialDest: destination.name } : undefined,
    });
  };

  const currentCoordText = userLocation
    ? `${userLocation.latitude.toFixed(5)}, ${userLocation.longitude.toFixed(5)}`
    : 'Waiting for GPS permission';
  const accuracyText = userLocation?.accuracy ? `Accuracy +/- ${Math.round(userLocation.accuracy)}m` : 'Accuracy pending';
  const nearestText = nearestLandmark
    ? `Near ${nearestLandmark.shortName || nearestLandmark.name} - ${formatDistance(nearestLandmark.distance)} away`
    : 'Nearest landmark unavailable';

  return (
    <View style={s.root}>
      <ScreenHeader title="Explore" sub="Discover Redemption City" />

      <View style={s.locationWrap}>
        <View style={s.locationCard}>
          <View style={s.locationTop}>
            <View style={s.locationIcon}>
              <LocateFixed size={16} color={locationStatus === 'live' ? C.gold : C.ts} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.locationLabel}>Current location</Text>
              <Text style={s.locationCoords}>{currentCoordText}</Text>
            </View>
            <View style={[s.livePill, locationStatus === 'live' && s.livePillOn]}>
              <View style={[s.liveDot, locationStatus === 'live' && s.liveDotOn]} />
              <Text style={[s.liveText, locationStatus === 'live' && s.liveTextOn]}>
                {locationStatus === 'live' ? 'Live' : 'GPS'}
              </Text>
            </View>
          </View>
          <Text style={s.locationNear}>{nearestText}</Text>
          <Text style={s.locationNote}>{locationMessage} {userLocation ? accuracyText : ''}</Text>
          <TouchableOpacity onPress={() => goToNavigation(nearestLandmark)} activeOpacity={0.85} style={s.liveMapBtn}>
            <Navigation2 size={14} color="#fff" strokeWidth={2.2} />
            <Text style={s.liveMapText}>
              {nearestLandmark ? `Follow route to ${nearestLandmark.shortName || nearestLandmark.name}` : 'Open live map'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.searchWrap}>
        <View style={s.searchBar}>
          <Search size={15} color={C.ts} strokeWidth={1.8} />
          <TextInput
            style={s.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search places..."
            placeholderTextColor={C.tm}
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={14} color={C.ts} strokeWidth={2} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll} contentContainerStyle={s.catContent}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[s.catBtn, category === cat.id && s.catBtnActive]}
            onPress={() => setCategory(cat.id)}
            activeOpacity={0.8}
          >
            <Text style={[s.catTxt, category === cat.id && s.catTxtActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.grid}>
        <View style={s.gridRow}>
          {filtered.length === 0 ? (
            <Text style={s.empty}>No places found for "{query}"</Text>
          ) : (
            filtered.map((place) => {
              const Icon = ICON_MAP[place.iconName] || Building2;
              return (
                <TouchableOpacity key={place.id} style={s.placeCard} activeOpacity={0.84} onPress={() => goToNavigation(place)}>
                  <View style={[s.placeImg, { backgroundColor: `${place.color}18` }]}>
                    <Icon size={28} color={place.color} strokeWidth={1.4} />
                    <TouchableOpacity onPress={() => goToNavigation(place)} activeOpacity={0.85} style={s.cardNavBtn}>
                      <Navigation2 size={13} color="#fff" strokeWidth={2.3} />
                    </TouchableOpacity>
                  </View>
                  <View style={s.placeBody}>
                    <Text style={s.placeName} numberOfLines={2}>{place.name}</Text>
                    <View style={s.placeMid}>
                      <Text style={s.placeCat} numberOfLines={1}>{place.cat}</Text>
                      <View style={s.ratingRow}>
                        <Star size={9} color={C.gold} fill={C.gold} strokeWidth={0} />
                        <Text style={s.ratingTxt}> {place.rating}</Text>
                      </View>
                    </View>
                    <Text style={s.placeDesc} numberOfLines={2}>{place.description}</Text>
                    <View style={s.distRow}>
                      <MapPinned size={9} color={C.gold} strokeWidth={2.5} />
                      <Text style={s.distTxt}> {place.dist}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08011A' },
  locationWrap: { paddingHorizontal: 18, paddingTop: 12 },
  locationCard: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(196,141,56,0.18)', borderRadius: 18, padding: 14, gap: 10 },
  locationTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  locationIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(196,141,56,0.12)', borderWidth: 1, borderColor: 'rgba(196,141,56,0.25)', alignItems: 'center', justifyContent: 'center' },
  locationLabel: { fontSize: 10, color: C.tm, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  locationCoords: { fontSize: 13, color: C.tp, fontWeight: '700', marginTop: 2 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, borderWidth: 1, borderColor: C.b, backgroundColor: C.surfHi, paddingHorizontal: 9, paddingVertical: 5 },
  livePillOn: { borderColor: 'rgba(74,138,90,0.35)', backgroundColor: 'rgba(74,138,90,0.12)' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.tm },
  liveDotOn: { backgroundColor: '#4A8A5A' },
  liveText: { fontSize: 9, color: C.ts, fontWeight: '800' },
  liveTextOn: { color: '#7DB89B' },
  locationNear: { fontSize: 13, color: C.gold, fontWeight: '800', lineHeight: 18 },
  locationNote: { fontSize: 11.5, color: C.ts, lineHeight: 17 },
  liveMapBtn: { minHeight: 42, borderRadius: 14, backgroundColor: C.purple, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 14 },
  liveMapText: { flexShrink: 1, fontSize: 12.5, color: '#fff', fontWeight: '800', textAlign: 'center' },

  searchWrap: { paddingHorizontal: 18, paddingTop: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11 },
  searchInput: { flex: 1, fontSize: 13, color: '#EBE3D6', padding: 0 },
  catScroll: { flexGrow: 0 },
  catContent: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 4, gap: 8, alignItems: 'center' },
  catBtn: { flexShrink: 0, minHeight: 34, paddingHorizontal: 15, paddingVertical: 0, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', alignItems: 'center', justifyContent: 'center' },
  catBtnActive: { backgroundColor: '#7128CE', borderColor: 'transparent' },
  catTxt: { fontSize: 12, lineHeight: 16, fontWeight: '600', color: '#8C7DA0', includeFontPadding: false, textAlignVertical: 'center' },
  catTxtActive: { color: '#fff' },
  grid: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 8 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  placeCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' },
  placeImg: { height: 76, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)', position: 'relative' },
  cardNavBtn: { position: 'absolute', top: 9, right: 9, width: 28, height: 28, borderRadius: 10, backgroundColor: 'rgba(113,40,206,0.88)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)' },
  placeBody: { padding: 12, paddingTop: 10 },
  placeName: { fontSize: 12.5, fontWeight: '600', color: '#EBE3D6', marginBottom: 4, lineHeight: 17 },
  placeMid: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 8 },
  placeCat: { flex: 1, fontSize: 10, color: '#8C7DA0' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingTxt: { fontSize: 10, color: '#C48D38', fontWeight: '600' },
  placeDesc: { fontSize: 10.5, color: C.ts, lineHeight: 15, marginBottom: 8 },
  distRow: { flexDirection: 'row', alignItems: 'center' },
  distTxt: { fontSize: 9.5, color: '#C48D38', fontWeight: '600' },
  empty: { fontSize: 13, color: '#8C7DA0', textAlign: 'center', paddingVertical: 40, width: '100%' },
});
