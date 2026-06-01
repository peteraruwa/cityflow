// src/features/weather-widget/WeatherWidget.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react-native';
import { C } from '../../shared/constants/theme';

const MOCK_WEATHER = {
  temp: 28,
  condition: 'Partly Cloudy',
  high: 32,
  low: 23,
  humidity: 65,
  wind: 12,
  feelsLike: 29,
};

export default function WeatherWidget() {
  const [weather] = useState(MOCK_WEATHER);
  const [modalVisible, setModalVisible] = useState(false);

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun size={34} color={C.gold} strokeWidth={1.8} />;
      case 'partly cloudy': return <Cloud size={34} color="#B0A8C0" strokeWidth={1.8} />;
      case 'rainy': return <CloudRain size={34} color="#6B9BC0" strokeWidth={1.8} />;
      default: return <Sun size={34} color={C.gold} strokeWidth={1.8} />;
    }
  };

  return (
    <>
      <TouchableOpacity style={s.widget} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
        {getWeatherIcon(weather.condition)}
        <View style={s.info}>
          <Text style={s.temp}>{weather.temp}°C</Text>
          <Text style={s.condition}>{weather.condition}</Text>
        </View>
      </TouchableOpacity>

      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Current Weather</Text>
              <View style={s.modalDivider} />
            </View>
            <View style={s.modalRow}>
              <Sun size={22} color={C.gold} />
              <Text style={s.modalLabel}>Temperature</Text>
              <Text style={s.modalValue}>{weather.temp}°C (feels {weather.feelsLike}°C)</Text>
            </View>
            <View style={s.modalRow}>
              <Droplets size={22} color="#6B9BC0" />
              <Text style={s.modalLabel}>Humidity</Text>
              <Text style={s.modalValue}>{weather.humidity}%</Text>
            </View>
            <View style={s.modalRow}>
              <Wind size={22} color="#8C7DA0" />
              <Text style={s.modalLabel}>Wind</Text>
              <Text style={s.modalValue}>{weather.wind} km/h</Text>
            </View>
            <View style={s.modalFooter}>
              <Text style={s.modalFooterText}>↑ {weather.high}° / ↓ {weather.low}°</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  widget: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  info: { alignItems: 'flex-end' },
  temp: { fontSize: 18, fontWeight: '700', color: '#EBE3D6' },
  condition: { fontSize: 10, color: '#8C7DA0', marginTop: 2, textTransform: 'capitalize' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    backgroundColor: '#0F0A1E',
    borderRadius: 28,
    padding: 22,
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(113,40,206,0.4)',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: { alignItems: 'center', marginBottom: 18 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#EBE3D6' },
  modalDivider: { width: 40, height: 2, backgroundColor: C.gold, marginTop: 8, borderRadius: 1 },
  modalRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  modalLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#B0A8C0', marginLeft: 12 },
  modalValue: { fontSize: 14, color: '#EBE3D6', fontWeight: '600' },
  modalFooter: { marginTop: 14, alignItems: 'center' },
  modalFooterText: { fontSize: 12, color: '#C48D38', fontWeight: '600' },
});