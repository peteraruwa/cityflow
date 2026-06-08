// src/features/weather-widget/WeatherWidget.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  ActivityIndicator, Animated,
} from 'react-native';
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, Eye, Gauge, X } from 'lucide-react-native';
import { C } from '../../shared/constants/theme';

// ─── Config ──────────────────────────────────────────────────────────────────
const OW_API_KEY = 'bd16a11805e3296acaccbc3c9c1cad8e';
const OW_BASE    = 'https://api.openweathermap.org/data/2.5/weather';

// Redemption City of God, Mowe, Ogun State, Nigeria (postal code: 110115)
const DEFAULT_LAT = 6.4531;
const DEFAULT_LON = 3.3958;

// ─── Fallback data ────────────────────────────────────────────────────────────
const FALLBACK_WEATHER = {
  temp: 28,
  feelsLike: 30,
  condition: 'Partly Cloudy',
  conditionMain: 'Clouds',
  humidity: 72,
  wind: 14,
  windDeg: 210,
  visibility: 10,       // km
  pressure: 1011,
  uvi: 6.2,
  high: null,
  low: null,
  isFallback: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseOwResponse(json) {
  // 2.5/weather returns a flat object (units=metric so temps already in °C)
  if (!json?.main) return null;
  const cond = json.weather?.[0];
  return {
    temp:          Math.round(json.main.temp),
    feelsLike:     Math.round(json.main.feels_like),
    condition:     cond?.description ?? 'Clear',
    conditionMain: cond?.main ?? 'Clear',
    humidity:      json.main.humidity,
    wind:          Math.round((json.wind?.speed ?? 0) * 3.6),  // m/s → km/h
    windDeg:       json.wind?.deg ?? null,
    visibility:    json.visibility ? (json.visibility / 1000).toFixed(1) : '--',
    pressure:      json.main.pressure,
    uvi:           '--',   // not available in 2.5/weather
    high:          Math.round(json.main.temp_max),
    low:           Math.round(json.main.temp_min),
    isFallback:    false,
  };
}

function windDirection(deg) {
  if (deg == null) return '--';
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8];
}

// ─── Icon mapping ─────────────────────────────────────────────────────────────
function WeatherIcon({ main, size = 34, style }) {
  const props = { size, strokeWidth: 1.8, style };
  switch ((main ?? '').toLowerCase()) {
    case 'clear':        return <Sun        {...props} color={C.gold}    />;
    case 'rain':
    case 'drizzle':      return <CloudRain  {...props} color="#6B9BC0"   />;
    case 'thunderstorm': return <CloudRain  {...props} color="#7B6BC0"   />;
    case 'snow':         return <Cloud      {...props} color="#B0D0E8"   />;
    case 'clouds':       return <Cloud      {...props} color="#B0A8C0"   />;
    default:             return <Sun        {...props} color={C.gold}    />;
  }
}

// ─── Stat row ─────────────────────────────────────────────────────────────────
function StatRow({ icon, label, value, last }) {
  return (
    <View style={[s.statRow, last && s.statRowLast]}>
      <View style={s.statIcon}>{icon}</View>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statValue}>{value}</Text>
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function WeatherWidget({ lat = DEFAULT_LAT, lon = DEFAULT_LON }) {
  const [weather,      setWeather]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${OW_BASE}?lat=${lat}&lon=${lon}&units=metric&appid=${OW_API_KEY}`;
      const res  = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const parsed = parseOwResponse(json);
      setWeather(parsed ?? FALLBACK_WEATHER);
    } catch (err) {
      console.warn('[WeatherWidget] fetch failed, using fallback:', err.message);
      setWeather(FALLBACK_WEATHER);
    } finally {
      setLoading(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  }, [lat, lon]);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  // ── Pill (always visible) ──────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[s.widget, s.widgetLoading]}>
        <ActivityIndicator size="small" color={C.gold} />
        <Text style={s.loadingText}>Weather…</Text>
      </View>
    );
  }

  if (!weather) return null;

  const condLabel = weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1);

  return (
    <>
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={s.widget}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.75}
        >
          <WeatherIcon main={weather.conditionMain} size={28} />
          <View style={s.pillInfo}>
            <Text style={s.pillTemp}>{weather.temp}°C</Text>
            <Text style={s.pillCond} numberOfLines={1}>{condLabel}</Text>
          </View>
          {weather.isFallback && <View style={s.offlineDot} />}
        </TouchableOpacity>
      </Animated.View>

      {/* ── Detail modal ─────────────────────────────────────────────────── */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={s.card}>

            {/* Header */}
            <View style={s.cardHeader}>
              <WeatherIcon main={weather.conditionMain} size={44} />
              <View style={s.cardHeaderText}>
                <Text style={s.cardTemp}>{weather.temp}°</Text>
                <Text style={s.cardCond}>{condLabel}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={s.closeBtn}>
                <X size={18} color="rgba(235,227,214,0.5)" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Feels-like strip */}
            <View style={s.feelsStrip}>
              <Text style={s.feelsText}>Feels like {weather.feelsLike}°C</Text>
              {weather.isFallback && (
                <Text style={s.offlineTag}>⚠ offline data</Text>
              )}
            </View>

            <View style={s.divider} />

            {/* Stats */}
            <StatRow
              icon={<Droplets size={17} color="#6B9BC0" strokeWidth={1.8} />}
              label="Humidity"
              value={`${weather.humidity}%`}
            />
            <StatRow
              icon={<Wind size={17} color="#8C7DA0" strokeWidth={1.8} />}
              label="Wind"
              value={`${weather.wind} km/h ${windDirection(weather.windDeg)}`}
            />
            <StatRow
              icon={<Gauge size={17} color="#C48D38" strokeWidth={1.8} />}
              label="Pressure"
              value={`${weather.pressure} hPa`}
            />
            <StatRow
              icon={<Eye size={17} color="#7DB89B" strokeWidth={1.8} />}
              label="Visibility"
              value={`${weather.visibility} km`}
            />
            <StatRow
              icon={<Sun size={17} color={C.gold} strokeWidth={1.8} />}
              label="UV Index"
              value={weather.uvi}
              last
            />

            {(weather.high !== null && weather.low !== null) && (
              <Text style={s.highLow}>↑ {weather.high}°  ↓ {weather.low}°</Text>
            )}

            {/* Footer: refresh */}
            <TouchableOpacity
              onPress={() => { setModalVisible(false); fetchWeather(); }}
              style={s.refreshBtn}
            >
              <Text style={s.refreshText}>↻  Refresh</Text>
            </TouchableOpacity>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Pill
  widget: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 22,
    paddingVertical: 7,
    paddingHorizontal: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  widgetLoading: { gap: 8, paddingHorizontal: 14 },
  loadingText: { fontSize: 12, color: 'rgba(235,227,214,0.5)' },
  pillInfo: { alignItems: 'flex-end' },
  pillTemp: { fontSize: 16, fontWeight: '700', color: '#EBE3D6', letterSpacing: 0.3 },
  pillCond: { fontSize: 10, color: '#8C7DA0', marginTop: 1, textTransform: 'capitalize', maxWidth: 80 },
  offlineDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#C48D38',
    position: 'absolute', top: 7, right: 7,
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#0D0819',
    borderRadius: 28,
    padding: 22,
    width: '82%',
    borderWidth: 1,
    borderColor: 'rgba(113,40,206,0.35)',
    shadowColor: '#7128CE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },

  // Card header
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  cardHeaderText: { flex: 1 },
  cardTemp: { fontSize: 42, fontWeight: '700', color: '#EBE3D6', lineHeight: 46 },
  cardCond: { fontSize: 13, color: '#8C7DA0', textTransform: 'capitalize', marginTop: 2 },
  closeBtn: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  // Feels-like strip
  feelsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  feelsText: { fontSize: 13, color: 'rgba(235,227,214,0.55)', fontWeight: '500' },
  offlineTag: { fontSize: 10, color: '#C48D38', fontWeight: '600' },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginBottom: 6,
  },

  // Stat rows
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.055)',
    gap: 10,
  },
  statRowLast: { borderBottomWidth: 0 },
  statIcon: { width: 24, alignItems: 'center' },
  statLabel: { flex: 1, fontSize: 13, color: '#B0A8C0', fontWeight: '500' },
  statValue: { fontSize: 13, color: '#EBE3D6', fontWeight: '600' },

  // Refresh
  refreshBtn: {
    marginTop: 16,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(196,141,56,0.4)',
    backgroundColor: 'rgba(196,141,56,0.08)',
  },
  refreshText: { fontSize: 12, color: C.gold, fontWeight: '600', letterSpacing: 0.4 },
  highLow: { textAlign: 'center', fontSize: 12, color: 'rgba(196,141,56,0.7)', fontWeight: '600', marginTop: 10 },
});