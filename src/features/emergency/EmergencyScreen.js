import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import {
  Ambulance,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Flame,
  PhoneCall,
  Shield,
  Siren,
  TrafficCone,
  TriangleAlert,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import PulsingDot from '../../shared/components/PulsingDot';
import { auth, db } from '../../shared/config/firebase';
import { useUserProfile } from '../../shared/context/UserContext';

const SERVICES = [
  { id: 'general', label: 'General SOS', sub: 'Fastest national emergency dispatch', color: '#F06565', bg: 'rgba(212,79,79,0.12)', Icon: Siren, number: '112', priority: 'critical' },
  { id: 'ambulance', label: 'Ambulance', sub: 'Medical emergency or injury', color: '#D44F4F', bg: 'rgba(212,79,79,0.12)', Icon: Ambulance, number: '199', priority: 'critical' },
  { id: 'police', label: 'Police', sub: 'Crime, threat, or security issue', color: '#2A7FAB', bg: 'rgba(42,127,171,0.12)', Icon: Shield, number: '112', priority: 'high' },
  { id: 'fire', label: 'Fire Service', sub: 'Fire, smoke, trapped person, rescue', color: '#E07A1A', bg: 'rgba(224,122,26,0.12)', Icon: Flame, number: '190', priority: 'critical' },
  { id: 'road', label: 'Road Safety', sub: 'Accident, traffic obstruction, crash', color: '#C48D38', bg: 'rgba(196,141,56,0.12)', Icon: TrafficCone, number: '122', priority: 'high' },
];

export default function EmergencyScreen({ navigation }) {
  const { user } = useUserProfile();
  const [activeId, setActiveId] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [statusById, setStatusById] = useState({});

  async function handleSOS(svc) {
    if (pendingId) return;

    setActiveId(svc.id);
    setPendingId(svc.id);
    setStatusById((current) => ({
      ...current,
      [svc.id]: { state: 'sending', text: 'Sending alert...' },
    }));

    let alertRef = null;
    let locationSnapshot = null;
    let locationStatus = 'unavailable';
    let locationError = null;

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      locationStatus = permission.status;

      if (permission.status === 'granted') {
        const lastKnown = await Location.getLastKnownPositionAsync({
          maxAge: 300000,
          requiredAccuracy: 250,
        });
        const bestLocation = lastKnown || await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        locationSnapshot = formatLocation(bestLocation);
      } else {
        locationError = 'Location permission denied';
      }
    } catch (error) {
      locationError = error?.message || 'Location lookup failed';
    }

    const payload = buildEmergencyPayload({
      svc,
      user,
      locationSnapshot,
      locationStatus,
      locationError,
    });

    try {
      alertRef = await addDoc(collection(db, 'emergencyAlerts'), payload);
      setStatusById((current) => ({
        ...current,
        [svc.id]: {
          state: locationSnapshot ? 'sent' : 'partial',
          text: locationSnapshot ? 'Location sent' : 'Alert sent, location unavailable',
        },
      }));
    } catch (error) {
      setStatusById((current) => ({
        ...current,
        [svc.id]: { state: 'failed', text: 'Firebase send failed' },
      }));
      Alert.alert(
        'Emergency alert not sent',
        'CityFlow could not send this alert to Firebase. The call button will still open now.',
      );
    }

    const callResult = await callEmergencyNumber(svc.number);
    if (alertRef) {
      await updateDoc(alertRef, {
        call: callResult,
        updatedAt: serverTimestamp(),
      }).catch(() => {});
    }

    if (!callResult.opened) {
      Alert.alert('Could not open dialer', `Please dial ${svc.number} directly.`);
    }

    setPendingId(null);
  }

  return (
    <View style={s.root}>
      <View style={s.header}>
        {navigation && (
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={16} color="#EBE3D6" strokeWidth={2} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={s.title}>Emergency / SOS</Text>
          <Text style={s.sub}>One-tap alert, location share, and call</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={s.alertBanner}>
          <PulsingDot size={8} color="#F06565" />
          <Text style={s.alertTxt}>Tap a service to send your emergency details to CityFlow dispatch and open the phone dialer.</Text>
        </View>

        <View style={s.mobilizeCard}>
          <View style={s.mobilizeIcon}>
            <TriangleAlert size={18} color="#F06565" strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.mobilizeTitle}>Mobilization packet</Text>
            <Text style={s.mobilizeBody}>
              CityFlow logs the service requested, caller profile, timestamp, phone number, platform, GPS coordinates, accuracy, and map link when available.
            </Text>
          </View>
        </View>

        <View style={s.grid}>
          {SERVICES.map((svc) => {
            const active = activeId === svc.id;
            const pending = pendingId === svc.id;
            const status = statusById[svc.id];

            return (
              <TouchableOpacity
                key={svc.id}
                style={[s.sosCard, { borderColor: active ? svc.color : C.b, backgroundColor: active ? svc.bg : C.surf }]}
                onPress={() => handleSOS(svc)}
                activeOpacity={0.8}
                disabled={Boolean(pendingId)}
              >
                <View style={[s.sosIcon, { backgroundColor: `${svc.color}${active ? '22' : '18'}`, borderColor: `${svc.color}35` }]}>
                  <svc.Icon size={24} color={svc.color} strokeWidth={1.8} />
                </View>
                <Text style={s.sosLabel}>{svc.label}</Text>
                <Text style={s.sosSub}>{svc.sub}</Text>
                <Text style={[s.sosNum, { color: active ? svc.color : C.gold }]}>{svc.number}</Text>
                {pending && (
                  <View style={s.locSentRow}>
                    <Clock3 size={9} color={svc.color} strokeWidth={2.5} />
                    <Text style={[s.locSentTxt, { color: svc.color }]}> Sending...</Text>
                  </View>
                )}
                {!pending && status && (
                  <View style={s.locSentRow}>
                    {status.state === 'failed'
                      ? <TriangleAlert size={9} color={svc.color} strokeWidth={2.5} />
                      : <CheckCircle2 size={9} color={svc.color} strokeWidth={2.5} />}
                    <Text style={[s.locSentTxt, { color: svc.color }]}> {status.text}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={s.generalCard}>
          <Text style={s.generalTitle}>General Emergency Line</Text>
          <Text style={s.generalNum}>112</Text>
          <Text style={s.generalBody}>Available 24/7. Dispatches nearest available emergency unit. Works even without airtime.</Text>
          <TouchableOpacity
            style={s.generalCall}
            onPress={() => handleSOS(SERVICES[0])}
            activeOpacity={0.82}
            disabled={Boolean(pendingId)}
          >
            <PhoneCall size={14} color="#fff" strokeWidth={2.4} />
            <Text style={s.generalCallText}>{pendingId === 'general' ? 'Sending alert...' : 'Send SOS and Call 112'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function formatLocation(location) {
  if (!location?.coords) return null;
  const { latitude, longitude, accuracy, altitude, heading, speed } = location.coords;
  return {
    latitude,
    longitude,
    accuracy,
    altitude,
    heading,
    speed,
    capturedAt: location.timestamp ? new Date(location.timestamp).toISOString() : new Date().toISOString(),
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
  };
}

function buildEmergencyPayload({ svc, user, locationSnapshot, locationStatus, locationError }) {
  const firebaseUser = auth?.currentUser;
  const displayName = user?.displayName || user?.name || firebaseUser?.displayName || '';
  const email = user?.email || firebaseUser?.email || '';
  const phoneNumber = user?.phoneNumber || user?.phone || user?.mobile || '';

  return {
    type: 'emergency_sos',
    status: 'new',
    priority: svc.priority,
    service: {
      id: svc.id,
      label: svc.label,
      number: svc.number,
      description: svc.sub,
    },
    requester: {
      userId: firebaseUser?.uid || user?.uid || email || 'anonymous',
      displayName,
      email,
      phoneNumber,
    },
    location: locationSnapshot,
    locationStatus,
    locationError,
    platform: Platform.OS,
    source: 'EmergencyScreen',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

function normalizeDialNumber(number) {
  return String(number || '').split('/')[0].replace(/[^\d+]/g, '');
}

async function callEmergencyNumber(number) {
  const dialNumber = normalizeDialNumber(number);
  const url = `tel:${dialNumber}`;
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) return { opened: false, dialNumber, error: 'Dialer unavailable' };
    await Linking.openURL(url);
    return { opened: true, dialNumber, openedAt: new Date().toISOString() };
  } catch (error) {
    return { opened: false, dialNumber, error: error?.message || 'Dialer failed' };
  }
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08011A' },
  header: { paddingHorizontal: 18, paddingTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 0 },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#EBE3D6' },
  sub: { fontSize: 11, color: '#8C7DA0' },
  scroll: { padding: 18, paddingTop: 14 },
  alertBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(212,79,79,0.1)', borderWidth: 1, borderColor: 'rgba(212,79,79,0.28)', borderRadius: 16, padding: 12, paddingHorizontal: 16, marginBottom: 16 },
  alertTxt: { fontSize: 12, color: '#F06565', fontWeight: '500', lineHeight: 18, flex: 1 },
  mobilizeCard: { flexDirection: 'row', gap: 12, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 18, padding: 14, marginBottom: 16 },
  mobilizeIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(212,79,79,0.16)', borderWidth: 1, borderColor: 'rgba(212,79,79,0.28)', alignItems: 'center', justifyContent: 'center' },
  mobilizeTitle: { fontSize: 13, fontWeight: '800', color: C.tp, marginBottom: 4 },
  mobilizeBody: { fontSize: 11, color: C.ts, lineHeight: 17 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 18 },
  sosCard: { width: '47%', borderRadius: 22, borderWidth: 2, padding: 18, paddingVertical: 20, alignItems: 'center' },
  sosIcon: { width: 52, height: 52, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  sosLabel: { fontSize: 14, fontWeight: '700', color: '#EBE3D6', marginBottom: 3, textAlign: 'center' },
  sosSub: { fontSize: 10.5, color: '#8C7DA0', marginBottom: 8, textAlign: 'center', lineHeight: 15 },
  sosNum: { fontSize: 13, fontWeight: '700' },
  locSentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locSentTxt: { fontSize: 10, fontWeight: '600' },
  generalCard: { backgroundColor: 'rgba(212,79,79,0.07)', borderWidth: 1, borderColor: 'rgba(212,79,79,0.2)', borderRadius: 18, padding: 14, paddingHorizontal: 16 },
  generalTitle: { fontSize: 12, fontWeight: '700', color: '#F06565', marginBottom: 6 },
  generalNum: { fontSize: 22, fontWeight: '800', color: '#EBE3D6', marginBottom: 4 },
  generalBody: { fontSize: 11, color: '#8C7DA0', lineHeight: 17 },
  generalCall: { marginTop: 12, height: 44, borderRadius: 14, backgroundColor: '#D44F4F', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  generalCallText: { fontSize: 12.5, fontWeight: '800', color: '#fff' },
});
