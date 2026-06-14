// src/features/navigation/screens/NavigationScreen.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  MapPin,
  Clock,
  Route,
  X,
  ChevronUp,
  ChevronDown,
  Locate,
  Navigation2,
  Compass,
  Search,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  CAMP_LOCATIONS,
  CAMP_REGION,
  OSRM_BASE_URL,
} from '../data/locations';
import { C } from '../../../shared/constants/theme';
import { usePrefs } from '../../../shared/context/PrefsContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_PEEK = 220;
const MAX_ACCEPTED_ACCURACY_METERS = 100;

const PURPLE   = '#7128CE';
const PURPLE_L = '#9B5CF6';
const GOLD     = '#C48D38';
const BG       = '#08011A';
const SURF     = 'rgba(255,255,255,0.04)';
const SURF_HI  = '#0F0A1E';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT_PRI = '#EBE3D6';
const TEXT_SEC = '#8C7DA0';
const TEXT_MUT = '#504460';
const RED      = '#D44F4F';

// ─── Leaflet HTML ─────────────────────────────────────────────────────────────
const buildMapHTML = () => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #08011A; }
    .leaflet-control-attribution { display: none; }

    .user-pulse {
      width: 22px; height: 22px;
      background: ${PURPLE};
      border: 3px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(113,40,206,0.5);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%   { box-shadow: 0 0 0 0   rgba(113,40,206,0.5); }
      70%  { box-shadow: 0 0 0 12px rgba(113,40,206,0);   }
      100% { box-shadow: 0 0 0 0   rgba(113,40,206,0);   }
    }
    .dest-marker {
      width: 16px; height: 16px;
      background: ${RED};
      border: 3px solid #fff;
      border-radius: 50%;
      box-shadow: 0 2px 10px rgba(212,79,79,0.6);
    }
    .landmark-dot {
      width: 8px; height: 8px;
      background: ${GOLD};
      border: 1.5px solid rgba(255,255,255,0.6);
      border-radius: 50%;
      box-shadow: 0 0 4px rgba(196,141,56,0.4);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: false, attributionControl: false })
      .setView([${CAMP_REGION.latitude}, ${CAMP_REGION.longitude}], 16);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    var userMarker = null, userAccuracyCircle = null, destMarker = null, routeLayer = null;

    var landmarks = ${JSON.stringify(CAMP_LOCATIONS)};
    landmarks.forEach(function(loc) {
      var icon = L.divIcon({
        className: '',
        html: '<div class="landmark-dot"></div>',
        iconSize: [8, 8],
        iconAnchor: [4, 4],
      });
      L.marker([loc.lat, loc.lng], { icon: icon })
        .addTo(map)
        .bindTooltip(loc.shortName, {
          permanent: false,
          direction: 'top',
          offset: [0, -8],
          className: 'leaflet-tooltip-dark',
        });
    });

    document.addEventListener('message', handleMessage);
    window.addEventListener('message', handleMessage);

    function handleMessage(event) {
      try {
        var msg = JSON.parse(event.data);
        if (msg.type === 'UPDATE_LOCATION') updateUserLocation(msg.lat, msg.lng, msg.accuracy);
        if (msg.type === 'DRAW_ROUTE')  drawRoute(msg.coords, msg.destLat, msg.destLng);
        if (msg.type === 'CLEAR_ROUTE') clearRoute();
        if (msg.type === 'CENTER_USER') {
          if (userMarker) map.setView(userMarker.getLatLng(), 17, { animate: true });
        }
      } catch(e) {}
    }

    function updateUserLocation(lat, lng, accuracy) {
      var userIcon = L.divIcon({
        className: '',
        html: '<div class="user-pulse"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      if (userAccuracyCircle) map.removeLayer(userAccuracyCircle);
      if (accuracy) {
        userAccuracyCircle = L.circle([lat, lng], {
          radius: accuracy,
          color: '${PURPLE_L}',
          weight: 1,
          opacity: 0.5,
          fillColor: '${PURPLE_L}',
          fillOpacity: 0.08,
        }).addTo(map);
      }
      if (!userMarker) {
        userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
        map.setView([lat, lng], 17, { animate: true });
      } else {
        userMarker.setLatLng([lat, lng]);
      }
    }

    function drawRoute(coords, destLat, destLng) {
      if (routeLayer) map.removeLayer(routeLayer);
      if (destMarker) map.removeLayer(destMarker);

      var latlngs = coords.map(function(c) { return [c[1], c[0]]; });

      // Shadow layer
      L.polyline(latlngs, {
        color: 'rgba(113,40,206,0.18)',
        weight: 12,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(map);

      routeLayer = L.polyline(latlngs, {
        color: '${PURPLE_L}',
        weight: 5,
        opacity: 0.95,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(map);

      var destIcon = L.divIcon({
        className: '',
        html: '<div class="dest-marker"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      destMarker = L.marker([destLat, destLng], { icon: destIcon, zIndexOffset: 900 }).addTo(map);
      map.fitBounds(routeLayer.getBounds(), { padding: [70, 70] });
    }

    function clearRoute() {
      if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; }
      if (destMarker) { map.removeLayer(destMarker); destMarker = null; }
    }
  </script>
</body>
</html>
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDuration = (seconds) => {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};
const formatDistance = (metres) => {
  if (metres < 1000) return `${Math.round(metres)} m`;
  return `${(metres / 1000).toFixed(1)} km`;
};

const distanceBetween = (a, b) => {
  if (!a || !b) return Infinity;
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const pointFromLocation = (loc) => ({ latitude: loc.lat, longitude: loc.lng });

const getNearestLandmark = (coords) => {
  if (!coords) return null;
  return CAMP_LOCATIONS
    .map((loc) => ({ ...loc, distance: distanceBetween(coords, pointFromLocation(loc)) }))
    .sort((a, b) => a.distance - b.distance)[0] || null;
};

const getValidatedLocationMeta = (coords) => {
  if (!coords) return { valid: false, message: 'Waiting for current location...' };

  const accuracy = Number(coords.accuracy);
  if (Number.isFinite(accuracy) && accuracy > MAX_ACCEPTED_ACCURACY_METERS) {
    return {
      valid: false,
      message: `GPS accuracy is ${formatDistance(accuracy)}. Move to an open area for a fix under ${MAX_ACCEPTED_ACCURACY_METERS} m.`,
    };
  }

  const distanceFromCamp = distanceBetween(coords, {
    latitude: CAMP_REGION.latitude,
    longitude: CAMP_REGION.longitude,
  });

  const nearest = getNearestLandmark(coords);
  return {
    valid: true,
    accuracy: Number.isFinite(accuracy) ? accuracy : null,
    distanceFromCamp,
    nearest,
  };
};

const CATEGORY_COLORS = {
  church: '#7128CE',
  accommodation: '#2A7FAB',
  estate: '#4A8A5A',
  medical: RED,
  education: '#6B9BC0',
  park: '#4A8A5A',
  administration: TEXT_SEC,
  parking: '#6A6880',
  shopping: '#3DAA6E',
  dining: GOLD,
  media: '#9B5CF6',
  bank: '#C48D38',
  pastors_quarters: '#B07020',
};

const CATEGORY_LABELS = {
  church: 'Worship',
  accommodation: 'Stay',
  estate: 'Estate',
  medical: 'Medical',
  education: 'Education',
  park: 'Park',
  administration: 'Admin',
  parking: 'Parking',
  shopping: 'Shopping',
  dining: 'Dining',
  media: 'Media',
  bank: 'Bank',
  pastors_quarters: "Pastors' Quarters",
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function NavigationScreen({ navigation, route }) {
  const { locationServices } = usePrefs();
  const insets = useSafeAreaInsets();
  const webviewRef  = useRef(null);
  const locationSub = useRef(null);
  const sheetAnim   = useRef(new Animated.Value(SHEET_PEEK)).current;
  const initialDestApplied = useRef(false);
  const trustedLocationRef = useRef(null);

  const [userLocation,  setUserLocation]  = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [destination,   setDestination]   = useState(null);
  const [routeInfo,     setRouteInfo]     = useState(null);
  const [loadingRoute,  setLoadingRoute]  = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [mapReady,      setMapReady]      = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationMeta,  setLocationMeta]  = useState(null);
  const [locationWarning, setLocationWarning] = useState('');

  const sendToMap = useCallback((obj) => {
    webviewRef.current?.injectJavaScript(
      `document.dispatchEvent(new MessageEvent('message', { data: '${JSON.stringify(obj).replace(/'/g, "\\'")}' }));true;`
    );
  }, []);

  const applyLocationFix = useCallback((loc) => {
    const coords = loc?.coords || loc;
    const meta = getValidatedLocationMeta(coords);
    setLocationMeta(meta);

    if (!meta.valid) {
      if (trustedLocationRef.current) {
        setLocationWarning(meta.message);
      } else {
        setLocationError(meta.message);
      }
      return false;
    }

    setLocationError(null);
    setLocationWarning('');
    trustedLocationRef.current = coords;
    setUserLocation(coords);
    sendToMap({
      type: 'UPDATE_LOCATION',
      lat: coords.latitude,
      lng: coords.longitude,
      accuracy: coords.accuracy,
    });
    return true;
  }, [sendToMap]);

  // Location
  useEffect(() => {
    (async () => {
      if (!locationServices) {
        locationSub.current?.remove();
        setUserLocation(null);
        trustedLocationRef.current = null;
        setLocationMeta(null);
        setLocationError('Location services are off. Enable them in Settings to use live navigation.');
        return;
      }
      setLocationError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied. Enable it in Settings to use navigation.');
        return;
      }
      if (Platform.OS === 'android') {
        await Location.enableNetworkProviderAsync().catch(() => {});
      }
      setLocationError('Getting a high-accuracy GPS fix...');
      const initial = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
      applyLocationFix(initial);
      locationSub.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 3000, distanceInterval: 5 },
        (loc) => {
          applyLocationFix(loc);
        }
      );
    })();
    return () => locationSub.current?.remove();
  }, [applyLocationFix, locationServices]);

  useEffect(() => {
    if (mapReady && userLocation) {
      sendToMap({
        type: 'UPDATE_LOCATION',
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        accuracy: userLocation.accuracy,
      });
    }
  }, [mapReady, userLocation, sendToMap]);

  const fetchRoute = useCallback(async (dest) => {
    if (!userLocation) return;
    setLoadingRoute(true);
    setRouteInfo(null);
    try {
      const url = `${OSRM_BASE_URL}/${userLocation.longitude},${userLocation.latitude};${dest.lng},${dest.lat}?overview=full&geometries=geojson`;
      const res  = await fetch(url);
      const json = await res.json();
      if (json.code === 'Ok' && json.routes.length > 0) {
        const route = json.routes[0];
        setRouteInfo({ distance: route.distance, duration: route.duration });
        sendToMap({ type: 'DRAW_ROUTE', coords: route.geometry.coordinates, destLat: dest.lat, destLng: dest.lng });
      }
    } catch (e) {
      sendToMap({ type: 'DRAW_ROUTE', coords: [], destLat: dest.lat, destLng: dest.lng });
    } finally {
      setLoadingRoute(false);
    }
  }, [userLocation, sendToMap]);

  const handleSelectDestination = useCallback((loc) => {
    setDestination(loc);
    collapseSheet();
    fetchRoute(loc);
  }, [fetchRoute]);

  useEffect(() => {
    const initialDest = route?.params?.initialDest;
    if (!initialDest || initialDestApplied.current || !userLocation || !mapReady) return;
    const wanted = String(initialDest).toLowerCase();
    const target = CAMP_LOCATIONS.find((loc) =>
      [loc.name, loc.shortName, loc.id].filter(Boolean).some((value) =>
        String(value).toLowerCase() === wanted || String(value).toLowerCase().includes(wanted)
      )
    );
    if (target) {
      initialDestApplied.current = true;
      handleSelectDestination(target);
    }
  }, [route?.params?.initialDest, userLocation, mapReady, handleSelectDestination]);

  const handleClearRoute = useCallback(() => {
    setDestination(null);
    setRouteInfo(null);
    sendToMap({ type: 'CLEAR_ROUTE' });
  }, [sendToMap]);

  const expandSheet = () => {
    setSheetExpanded(true);
    Animated.spring(sheetAnim, { toValue: SCREEN_HEIGHT * 0.58, useNativeDriver: false, damping: 18, stiffness: 160 }).start();
  };
  const collapseSheet = () => {
    setSheetExpanded(false);
    Animated.spring(sheetAnim, { toValue: SHEET_PEEK, useNativeDriver: false, damping: 18, stiffness: 160 }).start();
  };
  const toggleSheet = () => sheetExpanded ? collapseSheet() : expandSheet();

  const accentColor = destination ? (CATEGORY_COLORS[destination.category] || PURPLE) : PURPLE;
  const filteredLocations = CAMP_LOCATIONS.filter((loc) => {
    const queryText = locationQuery.trim().toLowerCase();
    if (!queryText) return true;
    return [loc.name, loc.shortName, loc.description, loc.category, loc.subcategory, loc.phone, loc.address]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(queryText));
  });

  const renderLocation = useCallback(({ item }) => {
    const color   = CATEGORY_COLORS[item.category] || PURPLE;
    const isActive = destination?.id === item.id;
    const catLabel = CATEGORY_LABELS[item.category] || item.category;
    return (
      <TouchableOpacity
        style={[
          s.locItem,
          isActive && { backgroundColor: color + '14', borderColor: color + '55' },
        ]}
        onPress={() => handleSelectDestination(item)}
        activeOpacity={0.75}
      >
        {/* Left icon */}
        <View style={[s.locIcon, { backgroundColor: color + '1C', borderColor: color + '30' }]}>
          <Text style={s.locEmoji}>{item.icon}</Text>
        </View>

        {/* Text */}
        <View style={s.locText}>
          <Text style={[s.locName, isActive && { color }]} numberOfLines={1}>{item.name}</Text>
          <Text style={s.locDesc} numberOfLines={1}>{item.description}</Text>
        </View>

        {/* Category tag */}
        <View style={[s.catTag, { backgroundColor: color + '18', borderColor: color + '30' }]}>
          <Text style={[s.catTagTxt, { color }]} numberOfLines={1}>{catLabel}</Text>
        </View>

        {/* Active indicator */}
        {isActive && <View style={[s.activeBar, { backgroundColor: color }]} />}
      </TouchableOpacity>
    );
  }, [destination, handleSelectDestination]);

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={20} color={TEXT_PRI} strokeWidth={2.2} />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <View style={s.headerTitleRow}>
            <Compass size={13} color={GOLD} strokeWidth={2} />
            <Text style={s.headerTitle}>Navigate</Text>
          </View>
          <Text style={s.headerSub}>Redemption City · Camp Map</Text>
        </View>

        <View style={{ width: 36 }} />
      </View>

      {/* ── Map ── */}
      <View style={s.mapContainer}>
        {locationError ? (
          <View style={s.errorState}>
            <View style={s.errorIconWrap}>
              <MapPin size={28} color={TEXT_MUT} strokeWidth={1.5} />
            </View>
            <Text style={s.errorTitle}>Location Unavailable</Text>
            <Text style={s.errorBody}>{locationError}</Text>
          </View>
        ) : (
          <WebView
            ref={webviewRef}
            source={{ html: buildMapHTML() }}
            style={s.map}
            onLoadEnd={() => setMapReady(true)}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            mixedContentMode="always"
            allowsInlineMediaPlayback
          />
        )}

        {/* Route info pill */}
        {routeInfo && !loadingRoute && (
          <View style={[s.infoPill, { borderColor: accentColor + '55' }]}>
            <LinearGradient
              colors={[SURF_HI, BG]}
              style={s.infoPillGrad}
            >
              <View style={s.pillStat}>
                <Route size={12} color={accentColor} strokeWidth={2.5} />
                <Text style={[s.pillStatVal, { color: accentColor }]}>
                  {formatDistance(routeInfo.distance)}
                </Text>
                <Text style={s.pillStatLabel}>away</Text>
              </View>
              <View style={s.pillDivider} />
              <View style={s.pillStat}>
                <Clock size={12} color={accentColor} strokeWidth={2.5} />
                <Text style={[s.pillStatVal, { color: accentColor }]}>
                  {formatDuration(routeInfo.duration)}
                </Text>
                <Text style={s.pillStatLabel}>walk</Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {userLocation && locationMeta?.valid && (
          <View style={s.currentLocationCard}>
            <View style={s.currentLocationTop}>
              <View style={s.currentLocationIcon}>
                <Navigation2 size={13} color={PURPLE_L} strokeWidth={2.3} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.currentLocationTitle}>Current location locked</Text>
                <Text style={s.currentLocationCoords}>
                  {userLocation.latitude.toFixed(5)}, {userLocation.longitude.toFixed(5)}
                </Text>
              </View>
            </View>
            <View style={s.currentLocationStats}>
              <View style={s.currentLocationStat}>
                <Text style={s.currentLocationLabel}>Accuracy</Text>
                <Text style={s.currentLocationValue}>{locationMeta.accuracy ? formatDistance(locationMeta.accuracy) : 'Trusted'}</Text>
              </View>
              <View style={s.currentLocationStat}>
                <Text style={s.currentLocationLabel}>Nearest landmark</Text>
                <Text style={s.currentLocationValue} numberOfLines={1}>
                  {locationMeta.nearest?.shortName || locationMeta.nearest?.name || 'Unknown'}
                </Text>
              </View>
              <View style={s.currentLocationStat}>
                <Text style={s.currentLocationLabel}>Distance</Text>
                <Text style={s.currentLocationValue}>{formatDistance(locationMeta.nearest?.distance || 0)}</Text>
              </View>
            </View>
          </View>
        )}

        {!!locationWarning && (
          <View style={s.locationWarningCard}>
            <Text style={s.locationWarningText}>{locationWarning}</Text>
          </View>
        )}

        {/* Loading */}
        {loadingRoute && (
          <View style={s.loadingPill}>
            <ActivityIndicator size="small" color={PURPLE_L} />
            <Text style={s.loadingText}>Calculating route…</Text>
          </View>
        )}

        {/* Re-centre */}
        <TouchableOpacity
          style={s.locateBtn}
          onPress={() => sendToMap({ type: 'CENTER_USER' })}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.8}
        >
          <Locate size={17} color={TEXT_PRI} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* ── Bottom Sheet ── */}
      <Animated.View style={[s.sheet, { height: sheetAnim }]}>

        {/* Sheet header */}
        <TouchableOpacity style={s.sheetHeader} onPress={toggleSheet} activeOpacity={0.9}>
          <View style={s.handle} />

          <View style={s.sheetTitleRow}>
            <View style={s.sheetTitleLeft}>
              {destination ? (
                <>
                  <Text style={s.sheetOverline}>Navigating to</Text>
                  <Text style={[s.sheetDestName, { color: accentColor }]} numberOfLines={1}>
                    {destination.shortName}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={s.sheetOverline}>Where to?</Text>
                  <Text style={s.sheetDestName}>Choose a destination</Text>
                </>
              )}
            </View>

            <View style={s.sheetActions}>
              {destination && (
                <TouchableOpacity
                  style={s.iconBtn}
                  onPress={handleClearRoute}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={14} color={TEXT_SEC} strokeWidth={2.5} />
                </TouchableOpacity>
              )}
              <View style={s.iconBtn}>
                {sheetExpanded
                  ? <ChevronDown size={16} color={TEXT_SEC} strokeWidth={2} />
                  : <ChevronUp   size={16} color={TEXT_SEC} strokeWidth={2} />
                }
              </View>
            </View>
          </View>

          {/* Destination category strip */}
          {destination && (
            <View style={[s.categoryStrip, { backgroundColor: accentColor + '14', borderColor: accentColor + '30' }]}>
              <View style={[s.categoryDot, { backgroundColor: accentColor }]} />
              <Text style={[s.categoryStripTxt, { color: accentColor }]}>
                {CATEGORY_LABELS[destination.category] || destination.category}
              </Text>
              <Text style={s.categoryStripDesc} numberOfLines={1}>{destination.description}</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={s.destinationSearchWrap}>
          <View style={s.destinationSearchBar}>
            <Search size={14} color={TEXT_SEC} strokeWidth={2} />
            <TextInput
              value={locationQuery}
              onChangeText={(value) => {
                setLocationQuery(value);
                if (!sheetExpanded) expandSheet();
              }}
              placeholder="Search locations..."
              placeholderTextColor={TEXT_MUT}
              style={s.destinationSearchInput}
              autoCapitalize="none"
            />
            {locationQuery ? (
              <TouchableOpacity onPress={() => setLocationQuery('')} hitSlop={8}>
                <X size={14} color={TEXT_SEC} strokeWidth={2.2} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Location list */}
        <FlatList
          data={filteredLocations}
          renderItem={renderLocation}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.locList}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={() => (
            <View style={s.noLocations}>
              <Text style={s.noLocationsText}>No locations found</Text>
            </View>
          )}
        />
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: SURF,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  headerTitle: {
    fontSize: 15, fontWeight: '800',
    color: TEXT_PRI, letterSpacing: 0.2,
  },
  headerSub: {
    fontSize: 10.5, color: TEXT_MUT,
    fontWeight: '500', marginTop: 2, letterSpacing: 0.2,
  },

  // Map
  mapContainer: { flex: 1, position: 'relative' },
  map: { flex: 1, backgroundColor: BG },

  errorState: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 36, gap: 14,
  },
  errorIconWrap: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: SURF, borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  errorTitle: { fontSize: 15, fontWeight: '700', color: TEXT_PRI },
  errorBody: { fontSize: 13, color: TEXT_SEC, textAlign: 'center', lineHeight: 20 },

  // Route info pill
  infoPill: {
    position: 'absolute', top: 14,
    alignSelf: 'center', left: '50%',
    transform: [{ translateX: -90 }],
    width: 180,
    borderRadius: 16, borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  infoPillGrad: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, gap: 12,
  },
  pillStat: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center',
  },
  pillStatVal: { fontSize: 13, fontWeight: '800' },
  pillStatLabel: { fontSize: 10, color: TEXT_MUT, fontWeight: '500' },
  pillDivider: { width: 1, height: 20, backgroundColor: BORDER },

  // Loading pill
  loadingPill: {
    position: 'absolute', top: 14,
    alignSelf: 'center', left: '50%',
    transform: [{ translateX: -75 }],
    width: 150,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: SURF_HI,
    borderRadius: 16, borderWidth: 1, borderColor: BORDER,
    paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  loadingText: { fontSize: 12, color: TEXT_SEC, fontWeight: '600' },

  currentLocationCard: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(155,92,246,0.35)',
    backgroundColor: 'rgba(15,10,30,0.94)',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  currentLocationTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  currentLocationIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(113,40,206,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(155,92,246,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationTitle: { fontSize: 12.5, fontWeight: '800', color: TEXT_PRI },
  currentLocationCoords: { fontSize: 10.5, color: TEXT_SEC, marginTop: 2 },
  currentLocationStats: { flexDirection: 'row', gap: 8 },
  currentLocationStat: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 8,
    paddingVertical: 7,
    justifyContent: 'center',
  },
  currentLocationLabel: { fontSize: 8.5, color: TEXT_MUT, fontWeight: '800', textTransform: 'uppercase', marginBottom: 3 },
  currentLocationValue: { fontSize: 10.5, color: TEXT_PRI, fontWeight: '800' },
  locationWarningCard: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(196,141,56,0.35)',
    backgroundColor: 'rgba(196,141,56,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  locationWarningText: { fontSize: 11, color: GOLD, fontWeight: '700', lineHeight: 16 },

  // Locate button
  locateBtn: {
    position: 'absolute', bottom: 18, right: 16,
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: SURF_HI,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },

  // Sheet
  sheet: {
    backgroundColor: SURF_HI,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderTopWidth: 1, borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.4, shadowRadius: 20,
    elevation: 20, overflow: 'hidden',
  },
  sheetHeader: {
    paddingTop: 10, paddingHorizontal: 18, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: TEXT_MUT, alignSelf: 'center', marginBottom: 14,
  },
  sheetTitleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 10,
  },
  sheetTitleLeft: { flex: 1 },
  sheetOverline: {
    fontSize: 9.5, fontWeight: '700', color: TEXT_MUT,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 3,
  },
  sheetDestName: {
    fontSize: 17, fontWeight: '800', color: TEXT_PRI, letterSpacing: -0.3,
  },
  sheetActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: SURF, borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },

  // Category strip
  categoryStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  categoryDot: { width: 6, height: 6, borderRadius: 3 },
  categoryStripTxt: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  categoryStripDesc: { fontSize: 11, color: TEXT_SEC, flex: 1 },

  destinationSearchWrap: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 2,
    backgroundColor: SURF_HI,
  },
  destinationSearchBar: {
    minHeight: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
  },
  destinationSearchInput: {
    flex: 1,
    color: TEXT_PRI,
    fontSize: 13,
    paddingVertical: 0,
  },

  // Location list
  locList: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 28 },
  locItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 11, paddingHorizontal: 12,
    borderRadius: 14, borderWidth: 1, borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.025)',
    gap: 11, position: 'relative', overflow: 'hidden',
  },
  locIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  locEmoji: { fontSize: 11, fontWeight: '800', color: TEXT_PRI, letterSpacing: 0.4 },
  locText: { flex: 1 },
  locName: { fontSize: 13, fontWeight: '700', color: TEXT_PRI, letterSpacing: -0.2 },
  locDesc: { fontSize: 11, color: TEXT_SEC, marginTop: 2 },

  catTag: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 8, borderWidth: 1,
    maxWidth: 94,
  },
  catTagTxt: { fontSize: 9.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  noLocations: { paddingVertical: 28, alignItems: 'center' },
  noLocationsText: { fontSize: 12, color: TEXT_SEC, fontWeight: '600' },

  activeBar: {
    position: 'absolute', left: 0, top: 8, bottom: 8,
    width: 3, borderRadius: 2,
  },
});
